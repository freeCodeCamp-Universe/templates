import { describe, expect, it } from "vitest";
import {
  AlwaysInputSchema,
  AlwaysOutputSchema,
  DatabaseInputSchema,
  DatabaseOutputSchema,
  FrameworkInputSchema,
  FrameworkOutputSchema,
  PackageManagerInputSchema,
  PackageManagerOutputSchema,
  RuntimeInputSchema,
  RuntimeOutputSchema,
  ServiceInputSchema,
  ServiceOutputSchema,
} from "../src/schemas/layers.js";
import { LabelsSchema } from "../src/schemas/labels.js";
import alwaysOutputJson from "../dist/layers/always.json" with { type: "json" };
import databaseOutputJson from "../dist/layers/database.json" with { type: "json" };
import frameworkOutputJson from "../dist/layers/framework.json" with { type: "json" };
import packageManagersOutputJson from "../dist/layers/package-manager.json" with { type: "json" };
import runtimeOutputJson from "../dist/layers/runtime.json" with { type: "json" };
import serviceOutputJson from "../dist/layers/service.json" with { type: "json" };
import labelsJson from '../dist/labels.json' with { type: "json" };
import alwaysInputJson from "../templates/layers/always.json" with { type: "json" };
import databaseInputJson from "../templates/layers/database.json" with { type: "json" };
import frameworkInputJson from "../templates/layers/framework.json" with { type: "json" };
import packageManagersInputJson from "../templates/layers/package-manager.json" with { type: "json" };
import runtimeInputJson from "../templates/layers/runtime.json" with { type: "json" };
import serviceInputJson from "../templates/layers/service.json" with { type: "json" };

describe("output schemas", () => {
  it("always.json matches the output schema", () => {
    const parsed = AlwaysOutputSchema.safeParse(alwaysOutputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("database.json matches the output schema", () => {
    const parsed = DatabaseOutputSchema.safeParse(databaseOutputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("framework.json matches the output schema", () => {
    const parsed = FrameworkOutputSchema.safeParse(frameworkOutputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("package-manager.json matches the output schema", () => {
    const parsed = PackageManagerOutputSchema.safeParse(packageManagersOutputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("runtime.json matches the output schema", () => {
    const parsed = RuntimeOutputSchema.safeParse(runtimeOutputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("service.json matches the output schema", () => {
    const parsed = ServiceOutputSchema.safeParse(serviceOutputJson);
    expect(parsed.error).toBeUndefined();
  });
});

describe("input schemas", () => {
  it("always.json matches the input schema", () => {
    const parsed = AlwaysInputSchema.safeParse(alwaysInputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("database.json matches the input schema", () => {
    const parsed = DatabaseInputSchema.safeParse(databaseInputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("framework.json matches the input schema", () => {
    const parsed = FrameworkInputSchema.safeParse(frameworkInputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("package-manager.json matches the input schema", () => {
    const parsed = PackageManagerInputSchema.safeParse(packageManagersInputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("runtime.json matches the input schema", () => {
    const parsed = RuntimeInputSchema.safeParse(runtimeInputJson);
    expect(parsed.error).toBeUndefined();
  });

  it("service.json matches the input schema", () => {
    const parsed = ServiceInputSchema.safeParse(serviceInputJson);
    expect(parsed.error).toBeUndefined();
  });
});

describe("labels", () => {
  it("should match the schema", () => {
    const parsed = LabelsSchema.safeParse(labelsJson);
    expect(parsed.error).toBeUndefined();
  });
});
