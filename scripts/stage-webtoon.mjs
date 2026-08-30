// Copies the art of published webtoon episodes from private/ into public/.
//
// The full run lives in private/webtoon, which Astro never serves. If every
// episode's art sat in public/ ahead of the serialization schedule, the whole
// story would be readable by URL before release — the panel paths are trivially
// guessable once the first episode is out. So each build stages only the
// episodes whose publication date has arrived, matching the same date gate the
// pages use. public/images/webtoon is generated, and gitignored.
import { readdirSync, readFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'private/webtoon';
const OUT = 'public/images/webtoon';
const OPT = 'public/images/opt/webtoon';
const CONTENT = 'src/content/webtoon';

export function stageWebtoon(now = Date.now()) {
  if (!existsSync(SRC)) return { staged: [], held: [] };

  // Rebuilt from scratch so an episode never lingers in public/ after being
  // pulled, and so no stale WebP variant of held-back art stays reachable.
  rmSync(OUT, { recursive: true, force: true });
  rmSync(OPT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  // The series cover is promotional art, not episode content: it always ships.
  const series = join(SRC, 'series-cover.jpg');
  if (existsSync(series)) cpSync(series, join(OUT, 'series-cover.jpg'));

  const staged = [];
  const held = [];
  for (const file of readdirSync(CONTENT).filter((n) => n.endsWith('.md')).sort()) {
    const text = readFileSync(join(CONTENT, file), 'utf8');
    const date = text.match(/^date:\s*(.+?)\s*$/m);
    if (!date) continue;
    const slug = file.replace(/\.md$/, '');
    const draft = /^draft:\s*true\s*$/m.test(text);
    if (draft || new Date(date[1]).valueOf() > now) { held.push(slug); continue; }

    const dir = join(SRC, slug);
    if (existsSync(dir)) cpSync(dir, join(OUT, slug), { recursive: true });
    const cover = join(SRC, `${slug}-cover.jpg`);
    if (existsSync(cover)) cpSync(cover, join(OUT, `${slug}-cover.jpg`));
    staged.push(slug);
  }

  console.log(
    `[stage-webtoon] published ${staged.length} (${staged.join(', ') || 'none'})` +
    `, holding ${held.length} (${held.join(', ') || 'none'})`,
  );
  return { staged, held };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  stageWebtoon();
}
