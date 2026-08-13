// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { remarkExtractTasks } from './src/plugins/remark-extract-tasks';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],
  markdown: {
    processor: unified({ remarkPlugins: [remarkExtractTasks] }),
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Lato',
      cssVariable: '--font-lato',
      weights: [400, 700],
    },
    {
      provider: fontProviders.google(),
      name: 'Inconsolata',
      cssVariable: '--font-inconsolata',
      weights: [400, 700],
    },
  ],
  prefetch: {
    // 'viewport' is quite an aggressive strategy.  'hover' could suffice, but we need to experiment.
    defaultStrategy: 'viewport',
    prefetchAll: true,
  },
});
