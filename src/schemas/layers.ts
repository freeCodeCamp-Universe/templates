import { z } from "zod";

const filesField = z.record(z.string(), z.string());

const AlwaysShape = z.strictObject({});

const AlwaysInputSchema = z.record(z.literal("always"), AlwaysShape);

const AlwaysOutputSchema = z.record(
  z.literal("always"),
  AlwaysShape.extend({ files: filesField }),
);
type Always = z.infer<typeof AlwaysOutputSchema>;

const DatabaseOptionSchema = z.literal(["postgresql", "redis"]);
type DatabaseOption = z.infer<typeof DatabaseOptionSchema>;

const DatabaseShape = z.strictObject({});

const DatabaseInputSchema = z.record(DatabaseOptionSchema, DatabaseShape);

const DatabaseOutputSchema = z.record(
  DatabaseOptionSchema,
  DatabaseShape.extend({ files: filesField }),
);
type Database = z.infer<typeof DatabaseOutputSchema>;

const RUNTIME_OPTIONS = { NODE: "node", STATIC_WEB: "static_web" } as const;
const RuntimeOptionSchema = z.literal(Object.values(RUNTIME_OPTIONS));
type RuntimeOption = z.infer<typeof RuntimeOptionSchema>;

const RuntimeShape = z.strictObject({
  baseImage: z.string(),
  databases: z.array(z.string()),
  frameworks: z.array(z.string()),
  packageManagers: z.array(z.string()),
  services: z.array(z.string()),
});

const RuntimeInputSchema = z.record(RuntimeOptionSchema, RuntimeShape);

const RuntimeOutputSchema = z.record(
  RuntimeOptionSchema,
  RuntimeShape.extend({ files: filesField }),
);
type Runtime = z.infer<typeof RuntimeOutputSchema>;

const PackageManagerOptionSchema = z.literal(["bun", "pnpm"]);
type PackageManagerOption = z.infer<typeof PackageManagerOptionSchema>;

const PackageManagerShape = z.strictObject({
  devCmd: z.array(z.string()),
  lockfile: z.string(),
  manifests: z.array(z.string()),
  pmInstall: z.string(),
  pmVersion: z.string(),
  preinstall: z.string().optional(),
});

const PackageManagerInputSchema = z.record(
  PackageManagerOptionSchema,
  PackageManagerShape,
);

const PackageManagerOutputSchema = z.record(
  PackageManagerOptionSchema,
  PackageManagerShape.extend({ files: filesField }),
);
type PackageManager = z.infer<typeof PackageManagerOutputSchema>;

const ServiceOptionSchema = z.literal(["analytics", "auth", "email"]);
type ServiceOption = z.infer<typeof ServiceOptionSchema>;

const ServiceShape = z.strictObject({});

const ServiceInputSchema = z.record(ServiceOptionSchema, ServiceShape);

const ServiceOutputSchema = z.record(
  ServiceOptionSchema,
  ServiceShape.extend({ files: filesField }),
);
type Service = z.infer<typeof ServiceOutputSchema>;

const FrameworkOptionSchema = z.literal([
  "express",
  "html-css-js",
  "react-vite",
  "tanstack-shadcn",
  "typescript",
]);
type FrameworkOption = z.infer<typeof FrameworkOptionSchema>;

const FrameworkShape = z.strictObject({
  devCopySource: z.string(),
  port: z.number(),
  watchSync: z.array(z.strictObject({ path: z.string(), target: z.string() })),
});

const FrameworkInputSchema = z.record(FrameworkOptionSchema, FrameworkShape);

const FrameworkOutputSchema = z.record(
  FrameworkOptionSchema,
  FrameworkShape.extend({ files: filesField }),
);
type Framework = z.infer<typeof FrameworkOutputSchema>;

type FrameworkLayerData = Framework[FrameworkOption];
type PackageManagerLayerData = PackageManager[PackageManagerOption];
type RuntimeLayerData = Pick<Runtime[RuntimeOption], "baseImage" | "files">;

export {
  AlwaysInputSchema,
  AlwaysOutputSchema,
  DatabaseInputSchema,
  DatabaseOutputSchema,
  FrameworkInputSchema,
  FrameworkOutputSchema,
  RuntimeInputSchema,
  RuntimeOutputSchema,
  PackageManagerInputSchema,
  PackageManagerOutputSchema,
  ServiceInputSchema,
  ServiceOutputSchema,
  RUNTIME_OPTIONS,
};
export type {
  Always,
  Database,
  DatabaseOption,
  Framework,
  FrameworkLayerData,
  FrameworkOption,
  PackageManager,
  PackageManagerLayerData,
  PackageManagerOption,
  Runtime,
  RuntimeLayerData,
  RuntimeOption,
  Service,
  ServiceOption,
};
