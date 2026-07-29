import { existsSync, readdirSync, readFileSync } from "node:fs";
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
      test(`${framework}: ${name} should just specify the major version, or 0.minor e.g. ^42 or ^0.4`, () => {
        const major = /^\^\d+$/;
        const zeroMinor = /^\^0\.\d+$/;
        expect(version).toMatch(new RegExp(major.source + "|" + zeroMinor.source));
      });
    }
  }
});

const lockfiles = [
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lock",
];

describe("framework directories should not contain lockfiles", () => {
  for (const framework of frameworks) {
    for (const lockfile of lockfiles) {
      test(`${framework} should not contain ${lockfile}`, () => {
        const lockfilePath = join(frameworkDir, framework, lockfile);
        expect(existsSync(lockfilePath)).toBe(false);
      });
    }
  }
});
