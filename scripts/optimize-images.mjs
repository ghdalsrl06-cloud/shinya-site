// Generates responsive WebP variants for every image under public/images
// into public/images/opt/<path>-w<width>.webp. Runs automatically at the
// start of `astro build` (see astro.config.mjs) and skips up-to-date files.
// Width rule (must match ArtImg.astro): [480, 960, 1440, 2560] below the
// original width, plus the original width itself.
import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

const SRC = 'public/images';
const OUT = 'public/images/opt';
const STEPS = [480, 960, 1440, 2560];

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return p.startsWith(OUT) ? [] : walk(p);
    return /\.(jpe?g|png)$/i.test(e.name) && e.name !== 'og.png' ? [p] : [];
  });

export async function optimizeImages() {
  let made = 0;
  for (const file of walk(SRC)) {
    const meta = await sharp(file).metadata();
    const widths = [...STEPS.filter((w) => w < meta.width), meta.width];
    const rel = relative(SRC, file).replace(/\.(jpe?g|png)$/i, '');
    for (const w of widths) {
      const out = join(OUT, `${rel}-w${w}.webp`);
      if (existsSync(out) && statSync(out).mtimeMs >= statSync(file).mtimeMs) continue;
      mkdirSync(dirname(out), { recursive: true });
      await sharp(file).resize({ width: w }).webp({ quality: 78 }).toFile(out);
      made++;
    }
  }
  if (made) console.log(`[optimize-images] generated ${made} WebP variants`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeImages();
}
