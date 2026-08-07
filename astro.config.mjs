// @ts-check
import { defineConfig } from 'astro/config';

// site/base는 GitHub Pages 배포 시 확정 (site: https://<계정>.github.io, base: /<repo명>)
export default defineConfig({
  site: 'https://example.github.io',
});
