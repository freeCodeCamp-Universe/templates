// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';
import { seoConfig } from './src/seo.config.ts';

// https://astro.build/config
export default defineConfig({
  site: seoConfig.siteUrl,
  integrations: [react()],
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
    defaultStrategy: "viewport",
    prefetchAll: true
  }
});
