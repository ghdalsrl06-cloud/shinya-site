// Reads the studio's YouTube channel and writes src/data/catalog.json — the
// series the ORIGINAL pages are built from. Every public playlist is a series,
// in playlist order. A source in catalog.config.json can also take uploads in
// no playlist (episodes titled "EP.01 | Name" grouped under Name) or listed
// videos. Nothing is downloaded: the site links to YouTube and shows
// YouTube's thumbnails.
//
//   YOUTUBE_API_KEY=... node scripts/sync-youtube.mjs
//
// Runs daily from .github/workflows/youtube-catalog.yml, which commits the
// file when it changed and triggers a deploy.
import { readFileSync, writeFileSync } from 'node:fs';

const KEY = process.env.YOUTUBE_API_KEY;
if (!KEY) {
  console.error('YOUTUBE_API_KEY is not set');
  process.exit(1);
}
const CONFIG = JSON.parse(readFileSync('src/data/catalog.config.json', 'utf8'));
const OUT = 'src/data/catalog.json';
const API = 'https://www.googleapis.com/youtube/v3/';

// One call, following nextPageToken to the end.
async function yt(method, params) {
  const items = [];
  let pageToken;
  do {
    const u = new URL(API + method);
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    if (pageToken) u.searchParams.set('pageToken', pageToken);
    u.searchParams.set('key', KEY);
    const r = await fetch(u);
    if (!r.ok) throw new Error(`${method} ${r.status}: ${(await r.text()).slice(0, 300)}`);
    const j = await r.json();
    items.push(...(j.items ?? []));
    pageToken = j.nextPageToken;
  } while (pageToken);
  return items;
}

const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

// PT2M57S → 177
const isoSeconds = (iso) => {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso ?? '') ?? [];
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
};
const clock = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
};
// Hashtags and 【brackets】 belong to YouTube search, not to a title on the site.
const cleanTitle = (s) =>
  s.replace(/#[^\s#]+/g, '').replace(/【[^】]*】/g, '').replace(/\s*[|·]\s*$/, '').replace(/\s{2,}/g, ' ').trim();
// First paragraph of a description, trimmed to a line or two.
const blurb = (s) => {
  const p = (s ?? '').split(/\n\s*\n/).map((x) => x.trim()).find((x) => x && !x.startsWith('#') && !x.startsWith('@')) ?? '';
  return p.replace(/\s+/g, ' ').slice(0, 240);
};
const slugify = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'series';
const thumbOf = (sn) => sn.thumbnails?.maxres?.url ?? sn.thumbnails?.standard?.url ?? sn.thumbnails?.high?.url ?? `https://i.ytimg.com/vi/${sn.resourceId?.videoId ?? ''}/hqdefault.jpg`;
// YouTube answers 200 for a Short under /shorts/ and redirects everything else to /watch.
async function isShort(id) {
  try {
    const r = await fetch(`https://www.youtube.com/shorts/${id}`, { method: 'HEAD', redirect: 'manual' });
    return r.status === 200;
  } catch {
    return false;
  }
}

async function channel(handle) {
  const [c] = await yt('channels', { part: 'snippet,contentDetails,statistics', forHandle: handle.replace(/^@/, '') });
  if (!c) throw new Error(`channel not found: ${handle}`);
  const st = c.statistics ?? {};
  return {
    id: c.id,
    title: c.snippet.title,
    uploads: c.contentDetails.relatedPlaylists.uploads,
    stats: {
      title: c.snippet.title,
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

async function videos(ids) {
  const out = new Map();
  for (const part of chunk([...new Set(ids)], 50)) {
    for (const v of await yt('videos', { part: 'snippet,contentDetails,status', id: part.join(','), maxResults: 50 })) {
      if (v.status?.privacyStatus !== 'public' || v.snippet?.liveBroadcastContent !== 'none') continue;
      out.set(v.id, v);
    }
  }
  return out;
}

const episode = (v, vertical) => ({
  id: v.id,
  title: cleanTitle(v.snippet.title),
  publishedAt: v.snippet.publishedAt,
  duration: clock(isoSeconds(v.contentDetails.duration)),
  seconds: isoSeconds(v.contentDetails.duration),
  vertical,
  thumb: thumbOf(v.snippet),
});

const main = async () => {
  const excluded = new Set(CONFIG.exclude ?? []);
  const overrides = CONFIG.overrides ?? {};
  const series = [];
  const videoPool = []; // [channelKey, videoId] for everything we still need details of
  const playlists = []; // { key, channelKey, snippet, ids }
  const standalone = []; // { channelKey, ids, fromUploads }

  // Every channel's counts, for the home; each channel is read once.
  const channels = {};
  const stats = {};
  for (const [key, handle] of Object.entries(CONFIG.channels)) {
    channels[key] = await channel(handle);
    stats[key] = channels[key].stats;
  }

  for (const src of CONFIG.sources) {
    const ch = channels[src.channel];
    if (!ch) throw new Error(`source names a channel that is not configured: ${src.channel}`);
    const inPlaylists = new Set();
    if (src.playlists) {
      for (const p of await yt('playlists', { part: 'snippet,contentDetails', channelId: ch.id, maxResults: 50 })) {
        if (excluded.has(p.id)) continue;
        const ids = (await playlistVideoIds(p.id)).filter((id) => !excluded.has(id));
        ids.forEach((id) => inPlaylists.add(id));
        playlists.push({ key: p.id, channelKey: src.channel, snippet: p.snippet, ids });
        videoPool.push(...ids);
      }
    }
    if (src.uploads) {
      const ids = (await playlistVideoIds(ch.uploads)).filter((id) => !excluded.has(id) && !inPlaylists.has(id));
      standalone.push({ channelKey: src.channel, ids, fromUploads: true });
      videoPool.push(...ids);
    }
    if (src.videos?.length) {
      const ids = src.videos.filter((id) => !excluded.has(id));
      standalone.push({ channelKey: src.channel, ids, fromUploads: false });
      videoPool.push(...ids);
    }
  }

  const details = await videos(videoPool);
  const shorts = new Map();
  for (const id of details.keys()) shorts.set(id, await isShort(id));
  const ep = (id) => episode(details.get(id), shorts.get(id));

  // Playlists, as they are on YouTube.
  for (const p of playlists) {
    const eps = p.ids.filter((id) => details.has(id)).map(ep);
    if (!eps.length) continue;
    series.push({
      id: p.key,
      kind: 'playlist',
      channel: p.channelKey,
      title: cleanTitle(p.snippet.title),
      description: blurb(p.snippet.description),
      cover: eps[0].thumb,
      publishedAt: eps.map((e) => e.publishedAt).sort()[0],
      updatedAt: eps.map((e) => e.publishedAt).sort().at(-1),
      episodes: eps,
    });
  }

  // Uploads in no playlist: "EP.01 | Name" episodes group under Name, the rest stand alone.
  const groups = new Map();
  for (const s of standalone) {
    for (const id of s.ids) {
      if (!details.has(id)) continue;
      const e = ep(id);
      const m = /^EP\.?\s*(\d+)\s*[|·—-]\s*(.+)$/i.exec(e.title);
      const name = m ? m[2].trim() : null;
      const key = name ? `series:${name}` : id;
      if (!groups.has(key)) groups.set(key, { key, name, channelKey: s.channelKey, eps: [] });
      groups.get(key).eps.push({ ...e, no: m ? Number(m[1]) : 1 });
    }
  }
  for (const g of groups.values()) {
    const eps = g.eps.sort((a, b) => a.no - b.no || a.publishedAt.localeCompare(b.publishedAt)).map(({ no, ...e }) => e);
    const first = details.get(eps[0].id);
    series.push({
      id: g.key,
      kind: g.name ? 'group' : 'video',
      channel: g.channelKey,
      title: g.name ?? eps[0].title,
      description: blurb(first.snippet.description),
      cover: eps.at(-1).thumb,
      publishedAt: eps[0].publishedAt,
      updatedAt: eps.at(-1).publishedAt,
      episodes: eps,
    });
  }

  // Overrides, slugs, order: newest activity first, a featured one on top.
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
    publishedAt, updatedAt, episodes,
  }));
  writeFileSync(OUT, JSON.stringify({ channels: stats, series: ordered }, null, 2) + '\n');
  console.log(`${OUT}: ${ordered.length} series, ${ordered.reduce((n, s) => n + s.episodes.length, 0)} videos, ${Object.keys(stats).length} channels`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
