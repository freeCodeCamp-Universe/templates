import { z } from 'astro/zod';

const LessonRefSchema = z.object({
  id: z.string(),
});

const ModuleSchema = z.object({
  title: z.string(),
  lessons: z.array(LessonRefSchema).min(1),
});

const SectionSchema = z.object({
  title: z.string(),
  modules: z.array(ModuleSchema).min(1),
});

export const ManifestSchema = z.object({
  title: z.string(),
  sections: z.array(SectionSchema).min(1),
});

export type Manifest = z.infer<typeof ManifestSchema>;
