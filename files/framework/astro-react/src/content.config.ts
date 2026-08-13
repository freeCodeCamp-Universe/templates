import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/curriculum/english/lessons' }),
  schema: z.object({
    title: z.string(),
    id: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = {
  lessons,
};
