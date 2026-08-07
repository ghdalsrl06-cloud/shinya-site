// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ghdalsrl06-cloud.github.io',
  base: '/shinya-site',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    routing: { prefixDefaultLocale: false },
  },
});
