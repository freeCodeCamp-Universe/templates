import { z } from "zod";

const AlwaysShape = z.strictObject({});

const AlwaysSchema = z.record(z.literal("always"), AlwaysShape);

const DatabaseOptionSchema = z.literal(["postgresql", "redis"]);
type DatabaseOption = z.infer<typeof DatabaseOptionSchema>;

const DatabaseShape = z.strictObject({});

const DatabaseSchema = z.record(DatabaseOptionSchema, DatabaseShape);

const RUNTIME_OPTIONS = { NODE: "node", STATIC_WEB: "static_web" } as const;
const RuntimeOptionSchema = z.literal(Object.values(RUNTIME_OPTIONS));
type RuntimeOption = z.infer<typeof RuntimeOptionSchema>;

const RuntimeShape = z.strictObject({
  baseImage: z.string(),
  databases: z.array(z.string()),
  frameworks: z.array(z.string()),
  packageManagers: z.array(z.string()),
  recommended: z.boolean(),
  services: z.array(z.string()),
});

const RuntimeSchema = z.record(RuntimeOptionSchema, RuntimeShape);

const PackageManagerOptionSchema = z.literal(["bun", "pnpm"]);
type PackageManagerOption = z.infer<typeof PackageManagerOptionSchema>;

const PackageManagerShape = z.strictObject({
  devCmd: z.array(z.string()),
  lockfile: z.string(),
  manifests: z.array(z.string()),
  pmInstall: z.string(),
  pmVersion: z.string(),
  preinstall: z.string().optional(),
  recommended: z.boolean(),
});

const PackageManagerSchema = z.record(
  PackageManagerOptionSchema,
  PackageManagerShape,
);

const ServiceOptionSchema = z.literal(["analytics", "auth", "email"]);
type ServiceOption = z.infer<typeof ServiceOptionSchema>;

const ServiceShape = z.strictObject({});

const ServiceSchema = z.record(ServiceOptionSchema, ServiceShape);

const FrameworkOptionSchema = z.string();

const FrameworkShape = z.strictObject({
  devContainer: z
    .strictObject({
      customizations: z.strictObject({
        vscode: z.strictObject({
          extensions: z.array(z.string()),
        }),
      }),
    })
    .optional(),
  devCopySource: z.string(),
  port: z.number(),
  recommended: z.boolean(),
  skills: z.array(z.strictObject({ repo: z.string(), skill: z.string() })),
  watchSync: z.array(z.strictObject({ path: z.string(), target: z.string() })),
});

const FrameworkSchema = z.record(FrameworkOptionSchema, FrameworkShape);

export {
  AlwaysSchema,
  DatabaseSchema,
  FrameworkSchema,
  RuntimeSchema,
  PackageManagerSchema,
  ServiceSchema,
  RUNTIME_OPTIONS,
};
export type {
  DatabaseOption,
  PackageManagerOption,
  RuntimeOption,
  ServiceOption,
};
