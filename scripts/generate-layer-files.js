import { copyFile, mkdir, readdir, readFile, readlink, rm, stat, symlink, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";

const LAYER_TYPE_MAP = [
  ["always.json", "always"],
  ["runtime.json", "runtime"],
  ["package-manager.json", "package-manager"],
  ["framework.json", "framework"],
  ["service.json", "service"],
  ["database.json", "database"],
];

const defaultBaseDir = () => resolve(import.meta.dirname, "..");

/**
 * Recursively copies a directory, excluding .gitkeep files.
 * @param {string} src
 * @param {string} dest
 * @returns {Promise<void>}
 */
const copyDir = async (src, dest) => {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.name !== ".gitkeep")
      .map(async (entry) => {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);
        if (entry.isSymbolicLink()) {
          const target = await readlink(srcPath);
          await symlink(target, destPath);
        } else if (entry.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await copyFile(srcPath, destPath);
        }
      }),
  );
};

/**
 * @param {unknown} obj
 * @returns {unknown}
 */
const orderObjectKeys = (obj) => {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return obj;
  }
  // eslint-disable-next-line typescript/no-unsafe-assignment
  const ordered = Object.create(null);
  Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .forEach((key) => {
      // eslint-disable-next-line typescript/no-unsafe-member-access
      ordered[key] = orderObjectKeys(obj[key]);
    });
  return ordered;
};

/**
 * @param {string} [projectRoot]
 * @returns {Promise<void>}
 */
const generateLayerFiles = async (baseDir = defaultBaseDir()) => {
  const distDir = join(baseDir, "dist");
  await rm(distDir, { force: true, recursive: true });

  const filesBase = join(baseDir, "files");
  const layersDir = join(baseDir, "templates", "layers");
  const outputDir = join(baseDir, "dist", "layers");
  await mkdir(outputDir, { recursive: true });

  const layerResults = await Promise.all(
    LAYER_TYPE_MAP.map(async ([jsonFile, typeName]) => {
      const jsonPath = join(layersDir, jsonFile);
      const typeDir = join(filesBase, typeName);
      const rawText = await readFile(jsonPath, "utf-8");

      /** @type {Record<string, Record<string, unknown>>} */
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      const json = JSON.parse(rawText);
      const jsonKeys = new Set(Object.keys(json));

      /** @type {string[]} */
      let subdirs = [];
      try {
        const entries = await readdir(typeDir, { withFileTypes: true });
        subdirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
      } catch {
        // Type directory does not exist; missing-folder check will fire for each JSON key
      }

      const subdirSet = new Set(subdirs);
      /** @type {string[]} */
      const errors = [];

      await Promise.all(
        subdirs.map(async (subdir) => {
          const gitkeepPath = join(typeDir, subdir, ".gitkeep");
          let hasGitkeep = false;
          try {
            await stat(gitkeepPath);
            hasGitkeep = true;
          } catch {
            // .gitkeep not found
          }

          const hasJson = jsonKeys.has(subdir);

          if (!hasGitkeep && !hasJson) {
            errors.push(
              `${filesBase}/${typeName}/${subdir}/ has no .gitkeep and no entry in ${jsonFile}. Add the JSON entry or remove the folder`,
            );
          } else if (!hasGitkeep) {
            errors.push(
              `${filesBase}/${typeName}/${subdir}/ is missing a .gitkeep. Please add one`,
            );
          } else if (!hasJson) {
            errors.push(
              `${filesBase}/${typeName}/${subdir}/ has no entry in ${jsonFile}`,
            );
          }
        }),
      );

      for (const key of jsonKeys) {
        if (!subdirSet.has(key)) {
          errors.push(
            `${jsonFile} entry "${key}" has no folder at ${filesBase}/${typeName}/${key}/`,
          );
        }
      }

      return { errors, json, jsonFile, jsonPath, typeDir, typeName };
    }),
  );

  const allErrors = layerResults.flatMap((r) => r.errors);
  if (allErrors.length > 0) {
    throw new Error(allErrors.join("\n"));
  }

  const outputFilesDir = join(baseDir, "dist", "files");

  await Promise.all(
    layerResults.map(async ({ json, jsonFile, typeDir, typeName }) => {
      await writeFile(
        join(outputDir, jsonFile),
        `${JSON.stringify(orderObjectKeys(json), null, 2)}\n`,
        "utf-8",
      );
      await Promise.all(
        Object.keys(json).map(async (key) => {
          const srcDir = join(typeDir, key);
          const destDir = join(outputFilesDir, typeName, key);
          await copyDir(srcDir, destDir);
        }),
      );
    }),
  );

  await copyFile(
    join(baseDir, "templates", "labels.json"),
    join(baseDir, "dist", "labels.json"),
  );
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    await generateLayerFiles();
  } catch (err) {
    console.error("Error generating layer files:", err);
    process.exit(1);
  }
}

export { generateLayerFiles };
