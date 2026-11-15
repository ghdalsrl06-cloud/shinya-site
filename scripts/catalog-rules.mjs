// How a YouTube title becomes a place in the catalog. The sync reads titles
// with these rules, so a video is filed by the way it is named on YouTube:
//
//   EP.05 | Name                     episode 5 of Name
//   Hook | Name 3화                  episode 3 of Name, shown as Hook
//   Hook | AI드라마 「Name」 1화      the same; 「」 marks the name
//   「Name」 Subtitle | Label         a single work called Name
//   anything else                    a single work under its whole title
//
// Hashtags and 【brackets】 are for YouTube search and are dropped first.

export const cleanTitle = (s) =>
  s.replace(/#[^\s#]+/g, '').replace(/【[^】]*】/g, '').replace(/\s*[|·]\s*$/, '').replace(/\s{2,}/g, ' ').trim();

const quoted = (s) => /「([^」]+)」/.exec(s)?.[1].trim();

// → { name, no, title }: the work's name (null when the title names none), the
// episode number (null for a single work) and the title to show for the video.
export function parseTitle(raw) {
  const title = cleanTitle(raw);
  const ep = /^EP\.?\s*(\d+)\s*[|·—-]\s*(.+)$/i.exec(title);
  if (ep) return { name: quoted(ep[2]) ?? ep[2].trim(), no: Number(ep[1]), title };
  const cut = title.lastIndexOf('|');
  if (cut > 0) {
    const tail = /^(.+?)\s*(?:제\s*)?(\d+)\s*(?:화|話|회)$/.exec(title.slice(cut + 1).trim());
    if (tail) return { name: quoted(tail[1]) ?? tail[1].trim(), no: Number(tail[2]), title: title.slice(0, cut).trim() };
  }
  return { name: quoted(title) ?? null, no: null, title };
}

// A title carrying one of the configured words (music videos, trailers) stays off the site.
export const isSkipped = (raw, words = []) => {
  const t = raw.toLowerCase();
  return words.some((w) => t.includes(w.toLowerCase()));
};

// The first paragraph of a description, up to about two lines, ending on a sentence.
export const blurb = (s) => {
  const p = (s ?? '').split(/\n\s*\n/).map((x) => x.trim()).find((x) => x && !x.startsWith('#') && !x.startsWith('@')) ?? '';
  const text = p.replace(/\s+/g, ' ');
  if (text.length <= 240) return text;
  const head = text.slice(0, 240);
  const end = [...head.matchAll(/[.!?。…](?=\s|$)/g)].at(-1)?.index ?? -1;
  return end > 80 ? head.slice(0, end + 1) : `${head.trimEnd()}…`;
};

export const slugify = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'series';

// 177 → 2:57
export const clock = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
};

// One video as the catalog keeps it.
export const episodeOf = (v, no, title) => ({
  id: v.id,
  ...(no != null ? { no } : {}),
  title,
  publishedAt: v.publishedAt,
  ...(v.seconds ? { duration: clock(v.seconds), seconds: v.seconds } : {}),
  vertical: v.vertical,
  thumb: v.thumb,
});

// Videos → series. `videos` are { id, raw, description, publishedAt, seconds?,
// vertical, thumb, channel, keep? } in any order; `keep` marks a video the
// config lists by id, which is never dropped as a clip.
export function buildSeries(videos, { skipTitles = [], skipClips = false } = {}) {
  const groups = new Map();
  for (const v of videos) {
    if (isSkipped(v.raw, skipTitles)) continue;
    const p = parseTitle(v.raw);
    // A Short with no episode number is a clip cut from an episode, not an episode.
    if (p.no == null && v.vertical && skipClips && !v.keep) continue;
    const key = p.no != null ? `series:${p.name}` : v.id;
    if (!groups.has(key)) groups.set(key, { key, name: p.name, single: p.no == null, channel: v.channel, eps: [] });
    groups.get(key).eps.push({ v, no: p.no, title: p.title });
  }
  return [...groups.values()].map((g) => {
    const eps = g.eps.sort((a, b) => (a.no ?? 1) - (b.no ?? 1) || a.v.publishedAt.localeCompare(b.v.publishedAt));
    const dates = eps.map((e) => e.v.publishedAt).sort();
    return {
      id: g.key,
      kind: g.single ? 'video' : 'group',
      channel: g.channel,
      title: g.name ?? eps[0].title,
      description: blurb(eps[0].v.description),
      // Whether the description was read from episode 1; a later episode's is a stand-in.
      fromFirst: g.single || eps[0].no === 1,
      cover: eps.at(-1).v.thumb,
      publishedAt: dates[0],
      updatedAt: dates.at(-1),
      episodes: eps.map(({ v, no, title }) => episodeOf(v, no, title)),
    };
  });
}
