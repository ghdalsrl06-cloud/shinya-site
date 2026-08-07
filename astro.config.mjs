// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { optimizeImages } from './scripts/optimize-images.mjs';

export default defineConfig({
  site: 'https://ghdalsrl06-cloud.github.io',
  base: '/shinya-site',
  integrations: [
    sitemap(),
    {
      name: 'optimize-images',
      hooks: {
        'astro:build:start': async () => {
          await optimizeImages();
        },
      },
    },
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko', 'ja'],
    routing: { prefixDefaultLocale: false },
  },
});
