// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { remarkExtractTasks } from './src/plugins/remark-extract-tasks';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],
  markdown: {
    remarkPlugins: [remarkExtractTasks],
  },
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },
});
