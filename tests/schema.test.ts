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
import alwaysInputJson from "../templates/layers/always.json" with { type: "json" };
import databaseInputJson from "../templates/layers/database.json" with { type: "json" };
import frameworkInputJson from "../templates/layers/framework.json" with { type: "json" };
import packageManagersInputJson from "../templates/layers/package-manager.json" with { type: "json" };
import runtimeInputJson from "../templates/layers/runtime.json" with { type: "json" };
import serviceInputJson from "../templates/layers/service.json" with { type: "json" };
import labelsJson from "../templates/labels.json" with { type: "json" };

describe("layer schemas", () => {
  it("always.json matches the schema", () => {
    const parsed = AlwaysSchema.safeParse(alwaysInputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("database.json matches the schema", () => {
    const parsed = DatabaseSchema.safeParse(databaseInputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("framework.json matches the schema", () => {
    const parsed = FrameworkSchema.safeParse(frameworkInputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("package-manager.json matches the schema", () => {
    const parsed = PackageManagerSchema.safeParse(packageManagersInputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("runtime.json matches the schema", () => {
    const parsed = RuntimeSchema.safeParse(runtimeInputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("service.json matches the schema", () => {
    const parsed = ServiceSchema.safeParse(serviceInputJson);
    expect(parsed.error).toBeUndefined();
  });
});

describe("labels", () => {
  it("should match the schema", () => {
    const parsed = LabelsSchema.safeParse(labelsJson);
    expect(parsed.error).toBeUndefined();
  });
});
