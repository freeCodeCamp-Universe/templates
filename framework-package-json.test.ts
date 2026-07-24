import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const frameworkDir = join(import.meta.dirname, "files", "framework");

const frameworks = readdirSync(frameworkDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

describe("framework package.json dependency versions", () => {
  for (const framework of frameworks) {
    const pkgPath = join(frameworkDir, framework, "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

    const allDeps: Record<string, string> = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    for (const [name, version] of Object.entries(allDeps)) {
      test(`${framework}: ${name} should just specify the major version e.g. ^42.`, () => {
        expect(version).toMatch(/^\^\d+$/);
      });
    }
  }
});
