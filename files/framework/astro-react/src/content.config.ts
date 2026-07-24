import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const curriculum = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/curriculum' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  curriculum,
};
