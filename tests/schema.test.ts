import { describe, expect, it } from "vitest";
import {
  AlwaysSchema,
  DatabaseSchema,
  FrameworkSchema,
  PackageManagerSchema,
  RuntimeSchema,
  ServiceSchema,
} from "../src/schemas/layers.js";
import { LabelsSchema } from "../src/schemas/labels.js";
import alwaysJson from "../templates/layers/always.json" with { type: "json" };
import databaseJson from "../templates/layers/database.json" with { type: "json" };
import frameworkJson from "../templates/layers/framework.json" with { type: "json" };
import packageManagersJson from "../templates/layers/package-manager.json" with { type: "json" };
import runtimeJson from "../templates/layers/runtime.json" with { type: "json" };
import serviceJson from "../templates/layers/service.json" with { type: "json" };
import labelsJson from '../templates/labels.json' with { type: "json" };

describe("always layer", () => {
  it("always.json matches the schema", () => {
    const parsed = AlwaysSchema.safeParse(alwaysJson);
    expect(parsed.error).toBeUndefined();
  });
});

describe("database layer", () => {
  it("should match the schema", () => {
    const parsed = DatabaseSchema.safeParse(databaseJson);
    expect(parsed.error).toBeUndefined();
  });
});

describe("framework layer", () => {
  it("should match the schema", () => {
    const parsed = FrameworkSchema.safeParse(frameworkJson);
    expect(parsed.error).toBeUndefined();
  });
});

describe("package manager layer", () => {
  it("should match the schema", () => {
    const parsed = PackageManagerSchema.safeParse(packageManagersJson);
    expect(parsed.error).toBeUndefined();
  });
});

describe("runtime layer", () => {
  it("should match the schema", () => {
    const parsed = RuntimeSchema.safeParse(runtimeJson);
    expect(parsed.error).toBeUndefined();
  });
});

describe("service layer", () => {
  it("should match the schema", () => {
    const parsed = ServiceSchema.safeParse(serviceJson);
    expect(parsed.error).toBeUndefined();
  });
});

describe("labels", () => {
  it("should match the schema", () => {
    const parsed = LabelsSchema.safeParse(labelsJson);
    expect(parsed.error).toBeUndefined();
  });
});
