# SHINYA Studio — shinya-music.com

Astro static site, deployed to GitHub Pages on every push to `main`.

## Pages

- `/` **ORIGINAL** — the catalog: a banner for the featured series and a grid of every series, read from YouTube.
- `/series/<slug>/` — one series: description and every episode, playable in place.
- `/portfolio/` — the studio's pitch for commissions (services, process, the character).
- `/about/` — a short profile.

Each exists in `en` (root), `ko/` and `ja/`.

## The YouTube catalog

`src/data/catalog.json` is what the ORIGINAL pages are built from. It is written by
`scripts/sync-youtube.mjs` from the channels named in `src/data/catalog.config.json`:

- every public **playlist** of a channel becomes a series, in playlist order;
- **uploads in no playlist** become single-video series — except videos titled
  `EP.01 | Name`, which are grouped under `Name`;
- `videos` in the config adds standalone videos from a channel;
- `overrides` (keyed by playlist or video id) can set `slug`, `cover`/`coverWidth`
  (a file under `public/`) and `featured: true`;
- `exclude` hides a playlist or video by id.

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
