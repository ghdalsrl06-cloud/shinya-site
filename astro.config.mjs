// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { optimizeImages } from './scripts/optimize-images.mjs';
import { stageWebtoon } from './scripts/stage-webtoon.mjs';

export default defineConfig({
  site: 'https://shinya-music.com',
  integrations: [
    sitemap({ filter: (page) => !page.includes('/5am/') }),
    {
      // Runs on dev and build alike, and before the optimizer, so only
      // released episodes reach public/ and get WebP variants generated.
      name: 'stage-webtoon',
      hooks: {
        'astro:config:setup': () => {
          stageWebtoon();
        },
      },
    },
    {
      name: 'optimize-images',
      hooks: {
        'astro:build:start': async () => {
          await optimizeImages();
        },
      },
    },
    {
      name: 'pagefind',
      hooks: {
        'astro:build:done': ({ dir }) => {
          execFileSync('npx', ['pagefind', '--site', fileURLToPath(dir)], { stdio: 'inherit' });
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
