import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, test } from "vitest";

const frameworkDir = join(import.meta.dirname, "files", "framework");

const frameworks = readdirSync(frameworkDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const getDeps = (framework: string) => {
    const pkgPath = join(frameworkDir, framework, "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

    return{
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
}

describe("framework package.json validity", () => {
  for (const framework of frameworks) {
    it(`${framework}'s package.json should be valid JSON'`, () => {

    const pkgPath = join(frameworkDir, framework, "package.json");
    expect(JSON.parse(readFileSync(pkgPath, "utf-8"))).toMatchObject({})
    })
  }
})

describe("framework package.json dependency versions", () => {

      test(`each dependency should just specify the major version, or 0.minor e.g. ^42 or ^0.4`, () => {

  for (const framework of frameworks) {
    for (const [name, version] of Object.entries(getDeps(framework))) {
        const major = /^\^\d+$/;
        const zeroMinor = /^\^0\.\d+$/;
        expect(version, `package '${name}' in framework '${framework}' is invalid`).toMatch(new RegExp(major.source + "|" + zeroMinor.source));

}}})})

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
