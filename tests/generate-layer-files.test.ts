import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { generateLayerFiles } from "../scripts/generate-layer-files.js";
import {
  AlwaysSchema,
  DatabaseSchema,
  FrameworkSchema,
  PackageManagerSchema,
  RuntimeSchema,
  ServiceSchema,
} from "../src/schemas/layers.js";

const INPUT_LAYERS_SUBDIR = join("templates", "layers");
const OUTPUT_LAYERS_SUBDIR = join("dist", "layers");
const OUTPUT_FILES_SUBDIR = join("dist", "files");

interface FolderOpts {
  extraFiles?: Record<string, string>;
  withGitkeep?: boolean;
}

const makeFolder = async (
  root: string,
  type: string,
  key: string,
  opts: FolderOpts = {},
): Promise<void> => {
  const { extraFiles = {}, withGitkeep = true } = opts;
  const keyDir = join(root, "files", type, key);
  await mkdir(keyDir, { recursive: true });
  if (withGitkeep) {
    await writeFile(join(keyDir, ".gitkeep"), "");
  }
  await Promise.all(
    Object.entries(extraFiles).map(async ([name, content]) => {
      const filePath = join(keyDir, name);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, content);
    }),
  );
};

const makeBaseProject = async (root: string): Promise<void> => {
  const layersDir = join(root, INPUT_LAYERS_SUBDIR);
  await mkdir(layersDir, { recursive: true });

  const types: [string, string, object][] = [
    ["always.json", "always", { always: {} }],
    ["runtime.json", "runtime", {}],
    ["package-manager.json", "package-manager", {}],
    ["framework.json", "framework", {}],
    ["service.json", "service", {}],
    ["database.json", "database", {}],
  ];

  await Promise.all(
    types.map(async ([filename, typeName, json]) => {
      await writeFile(join(layersDir, filename), JSON.stringify(json, null, 2));
      await mkdir(join(root, "files", typeName), { recursive: true });
    }),
  );

  await writeFile(join(root, "templates", "labels.json"), "{}");
  await makeFolder(root, "always", "always");
};

const readOutputRaw = (root: string, filename: string): Promise<string> =>
  readFile(join(root, OUTPUT_LAYERS_SUBDIR, filename), "utf-8");

const readOutputJson = async (root: string, filename: string): Promise<unknown> =>
  JSON.parse(await readOutputRaw(root, filename));


describe(generateLayerFiles, () => {
  let root: string;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "universe-codegen-"));
    await makeBaseProject(root);
  });

  afterEach(async () => {
    await rm(root, { force: true, recursive: true });
  });

  it("throws when a JSON entry has no corresponding folder", async () => {
    await writeFile(
      join(root, INPUT_LAYERS_SUBDIR, "runtime.json"),
      JSON.stringify({ node: {} }, null, 2),
    );

    await expect(generateLayerFiles(root)).rejects.toThrow(
      `runtime.json entry "node" has no folder at ${root}/files/runtime/node/`,
    );
  });

  it("throws when a folder has no corresponding JSON entry", async () => {
    await makeFolder(root, "runtime", "node");

    await expect(generateLayerFiles(root)).rejects.toThrow(
      "files/runtime/node/ has no entry in runtime.json",
    );
  });

  it("throws when a folder with a JSON entry has no .gitkeep", async () => {
    await writeFile(
      join(root, INPUT_LAYERS_SUBDIR, "runtime.json"),
      JSON.stringify({ node: {} }, null, 2),
    );
    await makeFolder(root, "runtime", "node", { withGitkeep: false });

    await expect(generateLayerFiles(root)).rejects.toThrow(
      "files/runtime/node/ is missing a .gitkeep. Please add one",
    );
  });

  it("throws when a folder with no JSON entry has no .gitkeep", async () => {
    await makeFolder(root, "runtime", "node", { withGitkeep: false });

    await expect(generateLayerFiles(root)).rejects.toThrow(
      "files/runtime/node/ has no .gitkeep and no entry in runtime.json. Add the JSON entry or remove the folder",
    );
  });

  it("does not write any output when validation fails", async () => {
    await writeFile(
      join(root, INPUT_LAYERS_SUBDIR, "runtime.json"),
      JSON.stringify({ missing: {}, node: {} }, null, 2),
    );
    await makeFolder(root, "runtime", "node");

    await expect(generateLayerFiles(root)).rejects.toThrow(
      `runtime.json entry "missing" has no folder at ${root}/files/runtime/missing/`,
    );

    await expect(
      readOutputRaw(root, "runtime.json"),
    ).rejects.toThrow();
  });

  it("generates JSON files with consistent key ordering", async () => {
    await writeFile(
      join(root, INPUT_LAYERS_SUBDIR, "runtime.json"),

      /** This deliberately has keys in a different order than the expected
      output */
      // oxlint-disable-next-line sort-keys
      JSON.stringify({ node: {}, extra: {}, a: {} }, null, 2),
    );
    await makeFolder(root, "runtime", "node");
    await makeFolder(root, "runtime", "extra");
    await makeFolder(root, "runtime", "a");

    await generateLayerFiles(root);

    const result = await readOutputRaw(root, "runtime.json");
    expect(result).toBe(`{
  "a": {},
  "extra": {},
  "node": {}
}
`);
  });

  it("recursively orders the JSON keys", async () => {
    await writeFile(
      join(root, INPUT_LAYERS_SUBDIR, "runtime.json"),

      /** This deliberately has keys in a different order than the expected
      output */
      // oxlint-disable-next-line sort-keys
      JSON.stringify({ node: { b: "second", a: "first" } }, null, 2),
    );
    await makeFolder(root, "runtime", "node");

    await generateLayerFiles(root);

    const result = await readOutputRaw(root, "runtime.json");
    expect(result).toBe(`{
  "node": {
    "a": "first",
    "b": "second"
  }
}
`);
  });

  it("handles json arrays without modification", async () => {
    await writeFile(
      join(root, INPUT_LAYERS_SUBDIR, "runtime.json"),
      JSON.stringify({ node: { watchSync: [{ path: "src", target: "/app/src" }] } }, null, 2),
    );
    await makeFolder(root, "runtime", "node");

    await generateLayerFiles(root);

    const result = await readOutputJson(root, "runtime.json");
    expect(result).toMatchObject({
      node: {
        watchSync: [{ path: "src", target: "/app/src" }],
      },
    });
  });

  it("copies files into dist/files/{type}/{key}/", async () => {
    await writeFile(
      join(root, INPUT_LAYERS_SUBDIR, "framework.json"),
      JSON.stringify({ express: {} }, null, 2),
    );
    await makeFolder(root, "framework", "express", {
      extraFiles: { "src/index.ts": "export {};\n", "package.json": "{}\n" },
    });

    await generateLayerFiles(root);

    const copied = await readFile(
      join(root, OUTPUT_FILES_SUBDIR, "framework", "express", "src", "index.ts"),
      "utf-8",
    );
    expect(copied).toBe("export {};\n");

    const pkg = await readFile(
      join(root, OUTPUT_FILES_SUBDIR, "framework", "express", "package.json"),
      "utf-8",
    );
    expect(pkg).toBe("{}\n");
  });

  it("does not copy .gitkeep files into dist/files/", async () => {
    await writeFile(
      join(root, INPUT_LAYERS_SUBDIR, "runtime.json"),
      JSON.stringify({ node: {} }, null, 2),
    );
    await makeFolder(root, "runtime", "node", { extraFiles: { "example.txt": "hello" } });

    await generateLayerFiles(root);

    const destDir = join(root, OUTPUT_FILES_SUBDIR, "runtime", "node");
    const entries = await readdir(destDir);
    expect(entries).not.toContain(".gitkeep");
    expect(entries).toContain("example.txt");
  });

  it("does not include a files key in layer JSONs", async () => {
    await writeFile(
      join(root, INPUT_LAYERS_SUBDIR, "runtime.json"),
      JSON.stringify({ node: {} }, null, 2),
    );
    await makeFolder(root, "runtime", "node", { extraFiles: { "a.txt": "content" } });

    await generateLayerFiles(root);

    const result = await readOutputJson(root, "runtime.json");
    expect(result).toStrictEqual({ node: {} });
  });
});

describe("schema validation", () => {
  const projectRoot = resolve(import.meta.dirname, "..");

  const readJson = async (...segments: string[]): Promise<unknown> =>
    JSON.parse(await readFile(join(projectRoot, ...segments), "utf-8"));

  beforeAll(async () => {
    await generateLayerFiles(projectRoot);
  });

  describe("layer schemas", () => {
    it("always.json matches the schema", async () => {
      const parsed = AlwaysSchema.safeParse(await readJson(OUTPUT_LAYERS_SUBDIR, "always.json"));
      expect(parsed.error).toBeUndefined();
    });

    it("database.json matches the schema", async () => {
      const parsed = DatabaseSchema.safeParse(await readJson(OUTPUT_LAYERS_SUBDIR, "database.json"));
      expect(parsed.error).toBeUndefined();
    });

    it("framework.json matches the schema", async () => {
      const parsed = FrameworkSchema.safeParse(await readJson(OUTPUT_LAYERS_SUBDIR, "framework.json"));
      expect(parsed.error).toBeUndefined();
    });

    it("package-manager.json matches the schema", async () => {
      const parsed = PackageManagerSchema.safeParse(await readJson(OUTPUT_LAYERS_SUBDIR, "package-manager.json"));
      expect(parsed.error).toBeUndefined();
    });

    it("runtime.json matches the schema", async () => {
      const parsed = RuntimeSchema.safeParse(await readJson(OUTPUT_LAYERS_SUBDIR, "runtime.json"));
      expect(parsed.error).toBeUndefined();
    });

    it("service.json matches the schema", async () => {
      const parsed = ServiceSchema.safeParse(await readJson(OUTPUT_LAYERS_SUBDIR, "service.json"));
      expect(parsed.error).toBeUndefined();
    });
  });
});
