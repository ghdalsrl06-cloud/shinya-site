# SHINYA Studio — shinya-music.com

Astro static site, deployed to GitHub Pages on every push to `main`.

## Pages

- `/` — one page: the hero, **01 About** (who SHINYA is), **02 ORIGINAL** (the catalog: a banner
  for the featured series, then every series in two groups, Shorts and long-form, read from
  YouTube — until the first series is up, the banner points at the channel), **03 Channels**
  (the two YouTube channels with their counts) and **04 Collab**.
- `/series/<slug>/` — one series: description and every episode, playable in place.

Each exists in `en` (root), `ko/` and `ja/`.

## The YouTube catalog

`src/data/catalog.json` is what the ORIGINAL pages are built from. It is written by
`scripts/sync-youtube.mjs` from the channel named in `src/data/catalog.config.json`:

- every public **playlist** of the channel becomes a series, in playlist order — make a
  playlist on YouTube and it is on the site after the next sync;
- every channel under `channels` has its subscriber and video counts read, for the home;
- a series whose videos are mostly Shorts goes under **Shorts**, the rest under **long-form**;
- `overrides` (keyed by playlist id) can set `slug`, `cover`/`coverWidth` (a file under
  `public/`) and `featured: true`;
- `exclude` hides a playlist or video by id;
- a source can also take `uploads: true` (uploads in no playlist; titles like `EP.01 | Name`
  group under Name) or `videos: [ids]`.

Nothing is downloaded: the site links to YouTube and shows YouTube's thumbnails.

The sync runs daily from `.github/workflows/youtube-catalog.yml` and needs the
repository secret **`YOUTUBE_API_KEY`** (a YouTube Data API v3 key). When the catalog
changed it is committed to `main` and a deploy is started. To run it by hand:

```sh
YOUTUBE_API_KEY=... npm run sync
```

Or trigger the workflow from the Actions tab.

## Development

```sh
npm install
npm run dev
npm run build
```

WebP variants of everything under `public/images` are generated at build time into
`public/images/opt/` (ignored by git).
