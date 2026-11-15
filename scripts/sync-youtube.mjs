// Reads the studio's YouTube channel and writes src/data/catalog.json — the
// series the Episodes section and the series pages are built from. Videos are
// filed by their titles (scripts/catalog-rules.mjs). Nothing is downloaded:
// the site links to YouTube and shows YouTube's thumbnails.
//
//   node scripts/sync-youtube.mjs                      from the channel's public feeds
//   YOUTUBE_API_KEY=... node scripts/sync-youtube.mjs   from the YouTube Data API
//
// The feeds carry the latest 15 long-form videos and the latest 15 Shorts, so
// a run without a key adds to the catalog that is already there. A key reads
// the whole channel, with exact durations and the channels' counts.
//
// Runs daily from .github/workflows/youtube-catalog.yml, which commits the
// file when it changed and triggers a deploy.
import { readFileSync, writeFileSync } from 'node:fs';
import { blurb, buildSeries, cleanTitle, clock, episodeOf, isSkipped, parseTitle, slugify } from './catalog-rules.mjs';

const KEY = process.env.YOUTUBE_API_KEY;
const CONFIG = JSON.parse(readFileSync('src/data/catalog.config.json', 'utf8'));
const OUT = 'src/data/catalog.json';
const BEFORE = JSON.parse(readFileSync(OUT, 'utf8'));
const API = 'https://www.googleapis.com/youtube/v3/';
const excluded = new Set(CONFIG.exclude ?? []);
const SKIP = { skipTitles: CONFIG.skip?.titles ?? [], skipClips: CONFIG.skip?.clips ?? false };

// A request that is tried again when the server stumbles.
async function get(url, init, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(url, init);
      if (r.status < 500 || i === tries) return r;
    } catch (e) {
      if (i === tries) throw e;
    }
    await new Promise((ok) => setTimeout(ok, 1500 * i));
  }
}
const stamp = (s) => new Date(s).toISOString().replace('.000Z', 'Z');
const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));
// YouTube answers 200 for a Short under /shorts/ and redirects everything else to /watch.
async function isShort(id) {
  try {
    const r = await get(`https://www.youtube.com/shorts/${id}`, { method: 'HEAD', redirect: 'manual' });
    return r.status === 200;
  } catch {
    return false;
  }
}

// ── With a key: the YouTube Data API ───────────────────────────────────────

// One call, following nextPageToken to the end.
async function yt(method, params) {
  const items = [];
  let pageToken;
  do {
    const u = new URL(API + method);
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    if (pageToken) u.searchParams.set('pageToken', pageToken);
    u.searchParams.set('key', KEY);
    const r = await get(u);
    if (!r.ok) throw new Error(`${method} ${r.status}: ${(await r.text()).slice(0, 300)}`);
    const j = await r.json();
    items.push(...(j.items ?? []));
    pageToken = j.nextPageToken;
  } while (pageToken);
  return items;
}

// PT2M57S → 177
const isoSeconds = (iso) => {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso ?? '') ?? [];
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
};

// A channel is named in the config by its id (UC…, permanent) or by its handle.
async function channel(ref) {
  const by = /^UC[\w-]{22}$/.test(ref) ? { id: ref } : { forHandle: ref.replace(/^@/, '') };
  const [c] = await yt('channels', { part: 'snippet,contentDetails,statistics', ...by });
  if (!c) throw new Error(`channel not found: ${ref}`);
  const st = c.statistics ?? {};
  return {
    id: c.id,
    uploads: c.contentDetails.relatedPlaylists.uploads,
    stats: {
      title: c.snippet.title,
      ...(c.snippet.customUrl ? { handle: c.snippet.customUrl } : {}),
      ...(st.hiddenSubscriberCount ? {} : { subscribers: Number(st.subscriberCount ?? 0) }),
      videos: Number(st.videoCount ?? 0),
    },
  };
}

async function playlistVideoIds(playlistId) {
  const items = await yt('playlistItems', { part: 'snippet,contentDetails', playlistId, maxResults: 50 });
  return items
    .filter((i) => i.snippet.title !== 'Private video' && i.snippet.title !== 'Deleted video')
    .map((i) => i.contentDetails.videoId);
}

// Public, finished videos by id, in the shape the rules take.
async function videoDetails(ids) {
  const out = new Map();
  for (const part of chunk([...new Set(ids)], 50)) {
    for (const v of await yt('videos', { part: 'snippet,contentDetails,status', id: part.join(','), maxResults: 50 })) {
      if (v.status?.privacyStatus !== 'public' || v.snippet?.liveBroadcastContent !== 'none') continue;
      const th = v.snippet.thumbnails ?? {};
      out.set(v.id, {
        id: v.id,
        raw: v.snippet.title,
        description: v.snippet.description,
        publishedAt: stamp(v.snippet.publishedAt),
        seconds: isoSeconds(v.contentDetails.duration),
        vertical: await isShort(v.id),
        thumb: th.maxres?.url ?? th.standard?.url ?? th.high?.url ?? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
      });
    }
  }
  return out;
}

async function fromApi() {
  const channels = {};
  const stats = {};
  for (const [key, ref] of Object.entries(CONFIG.channels)) {
    channels[key] = await channel(ref);
    stats[key] = channels[key].stats;
  }
  const playlists = [];
  const wanted = []; // { id, channel, keep }
  for (const src of CONFIG.sources) {
    const ch = channels[src.channel];
    if (!ch) throw new Error(`source names a channel that is not configured: ${src.channel}`);
    const inPlaylists = new Set();
    if (src.playlists) {
      for (const p of await yt('playlists', { part: 'snippet,contentDetails', channelId: ch.id, maxResults: 50 })) {
        if (excluded.has(p.id)) continue;
        const ids = (await playlistVideoIds(p.id)).filter((id) => !excluded.has(id));
        ids.forEach((id) => inPlaylists.add(id));
        playlists.push({ id: p.id, channel: src.channel, snippet: p.snippet, ids });
      }
    }
    if (src.uploads) {
      for (const id of await playlistVideoIds(ch.uploads)) if (!excluded.has(id) && !inPlaylists.has(id)) wanted.push({ id, channel: src.channel });
    }
    for (const id of src.videos ?? []) if (!excluded.has(id)) wanted.push({ id, channel: src.channel, keep: true });
  }
  const details = await videoDetails([...playlists.flatMap((p) => p.ids), ...wanted.map((w) => w.id)]);

  // A playlist is a series as it is arranged on YouTube.
  const series = [];
  for (const p of playlists) {
    const eps = p.ids
      .map((id) => details.get(id))
      .filter((v) => v && !isSkipped(v.raw, SKIP.skipTitles))
      .map((v) => {
        const t = parseTitle(v.raw);
        return episodeOf(v, t.no, t.title);
      });
    if (!eps.length) continue;
    const dates = eps.map((e) => e.publishedAt).sort();
    series.push({
      id: p.id,
      kind: 'playlist',
      channel: p.channel,
      title: cleanTitle(p.snippet.title),
      description: blurb(p.snippet.description),
      cover: eps[0].thumb,
      publishedAt: dates[0],
      updatedAt: dates.at(-1),
      episodes: eps,
    });
  }
  // Everything else is filed by its title.
  series.push(...buildSeries(wanted.filter((w) => details.has(w.id)).map((w) => ({ ...details.get(w.id), channel: w.channel, keep: w.keep })), SKIP));
  return { stats, series };
}

// ── Without a key: the channel's public feeds ──────────────────────────────

const unxml = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, '&');
const tag = (s, name) => {
  const m = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`).exec(s);
  return m ? unxml(m[1]).trim() : '';
};
// → { author, entries } or null when YouTube has no such feed.
async function feed(query) {
  const r = await get(`https://www.youtube.com/feeds/videos.xml?${query}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`feed ${query}: ${r.status}`);
  const text = await r.text();
  const entries = [...text.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, e]) => ({ id: tag(e, 'yt:videoId'), raw: tag(e, 'title'), description: tag(e, 'media:description'), publishedAt: tag(e, 'published') }))
    .filter((e) => e.id && e.publishedAt)
    .map((e) => ({ ...e, publishedAt: stamp(e.publishedAt) }));
  return { author: tag(text.split('<entry>')[0], 'name'), entries };
}
// The largest thumbnail YouTube has for a video.
async function thumbOf(id) {
  for (const size of ['maxresdefault', 'sddefault']) {
    const url = `https://i.ytimg.com/vi/${id}/${size}.jpg`;
    try {
      if ((await get(url, { method: 'HEAD' })).ok) return url;
    } catch {}
  }
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
// 200 for a public video, 404 once it is deleted, 403 once it is private.
async function oembedStatus(id) {
  try {
    return (await get(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`)).status;
  } catch {
    return 0;
  }
}

async function fromFeeds() {
  const stats = structuredClone(BEFORE.channels ?? {});
  const videos = [];
  for (const src of CONFIG.sources) {
    const id = CONFIG.channels[src.channel];
    if (!/^UC[\w-]{22}$/.test(id ?? '')) throw new Error(`without YOUTUBE_API_KEY a channel has to be named by its id (UC…): ${src.channel}`);
    if (src.playlists) console.warn(`playlists of "${src.channel}" need YOUTUBE_API_KEY; left out of this run`);
    const listed = new Set(src.videos ?? []);
    if (!src.uploads && !listed.size) continue;
    // YouTube keeps a channel's long-form videos and its Shorts as two playlists.
    const long = await feed(`playlist_id=UULF${id.slice(2)}`);
    const short = await feed(`playlist_id=UUSH${id.slice(2)}`);
    let entries;
    let author = long?.author || short?.author;
    if (long || short) {
      entries = [...(long?.entries ?? []).map((e) => ({ ...e, vertical: false })), ...(short?.entries ?? []).map((e) => ({ ...e, vertical: true }))];
    } else {
      const all = await feed(`channel_id=${id}`);
      if (!all) throw new Error(`YouTube has no feed for channel ${id}`);
      author = all.author;
      entries = [];
      for (const e of all.entries) entries.push({ ...e, vertical: await isShort(e.id) });
    }
    if (author) stats[src.channel] = { ...stats[src.channel], title: author };
    for (const e of entries) {
      if (excluded.has(e.id) || (!src.uploads && !listed.has(e.id))) continue;
      videos.push({ ...e, channel: src.channel, keep: listed.has(e.id) });
    }
  }

  const fresh = buildSeries(videos, SKIP);
  const inFeeds = new Set(videos.map((v) => v.id));
  const placed = new Map(fresh.flatMap((s) => s.episodes.map((e) => [e.id, s.id])));
  for (const s of fresh) for (const e of s.episodes) e.thumb = await thumbOf(e.id);

  // What the catalog already holds stays, unless the feeds now file it elsewhere or it is gone from YouTube.
  const reachable = fresh.length && (await oembedStatus(fresh[0].episodes[0].id)) === 200;
  const series = new Map();
  for (const old of BEFORE.series ?? []) {
    if (old.kind === 'playlist') continue;
    const episodes = [];
    for (const e of old.episodes) {
      if (excluded.has(e.id)) continue;
      if (inFeeds.has(e.id)) {
        if (placed.get(e.id) === old.id) episodes.push(e);
        continue;
      }
      if (reachable && [403, 404].includes(await oembedStatus(e.id))) continue;
      episodes.push(e);
    }
    if (episodes.length) series.set(old.id, { id: old.id, kind: old.kind, channel: old.channel, title: old.title, description: old.description, episodes });
  }
  for (const s of fresh) {
    const old = series.get(s.id);
    const eps = new Map((old?.episodes ?? []).map((e) => [e.id, e]));
    for (const e of s.episodes) eps.set(e.id, { ...eps.get(e.id), ...e });
    series.set(s.id, { ...s, description: (s.fromFirst && s.description) || old?.description || s.description, episodes: [...eps.values()] });
  }
  return {
    stats,
    series: [...series.values()].map((s) => {
      const episodes = s.episodes.sort((a, b) => (a.no ?? 1) - (b.no ?? 1) || a.publishedAt.localeCompare(b.publishedAt));
      const dates = episodes.map((e) => e.publishedAt).sort();
      return { ...s, episodes, cover: episodes.at(-1).thumb, publishedAt: dates[0], updatedAt: dates.at(-1) };
    }),
  };
}

// ── Either way ─────────────────────────────────────────────────────────────

const main = async () => {
  const { stats, series } = await (KEY ? fromApi() : fromFeeds());
  if (!series.length && BEFORE.series?.length) throw new Error('found no series although the catalog has some; nothing written');

  // Overrides, slugs, order: newest activity first, a featured one on top.
  const overrides = CONFIG.overrides ?? {};
  const slugs = new Set();
  for (const s of series) {
    Object.assign(s, overrides[s.id] ?? {});
    let slug = s.slug ?? slugify(s.title);
    for (let n = 2; slugs.has(slug); n++) slug = `${slugify(s.title)}-${n}`;
    slugs.add(slug);
    s.slug = slug;
  }
  series.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.updatedAt.localeCompare(a.updatedAt));

  const ordered = series.map(({ id, slug, kind, channel: ch, title, description, cover, coverWidth, featured, publishedAt, updatedAt, episodes }) => ({
    id, slug, kind, channel: ch, title, description, cover,
    ...(coverWidth ? { coverWidth } : {}),
    ...(featured ? { featured: true } : {}),
    publishedAt, updatedAt,
    episodes: episodes.map((e) => ({
      id: e.id,
      ...(e.no != null ? { no: e.no } : {}),
      title: e.title,
      publishedAt: e.publishedAt,
      ...(e.seconds ? { duration: clock(e.seconds), seconds: e.seconds } : {}),
      vertical: e.vertical,
      thumb: e.thumb,
    })),
  }));
  writeFileSync(OUT, JSON.stringify({ channels: stats, series: ordered }, null, 2) + '\n');
  console.log(`${OUT} (${KEY ? 'API' : 'feeds'}): ${ordered.length} series, ${ordered.reduce((n, s) => n + s.episodes.length, 0)} videos`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
