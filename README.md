# SHINYA Studio (shinya-music.com)

Astro static site, deployed to GitHub Pages on every push to `main`.

## Pages

- `/` — one page: the hero, **01 About** (who makes this), **02 Episodes** (the catalog: a banner
  for the newest series, then every series in two groups, Shorts and long-form, read from
  YouTube), **03 Channels** (the two YouTube channels) and **04 Collab**.
- `/series/<slug>/` — one series: description and every episode, playable in place.

Each exists in `en` (root), `ko/` and `ja/`.

## The YouTube catalog

`src/data/catalog.json` is what the Episodes section and the series pages are built from. It
is written by `scripts/sync-youtube.mjs` from the channel named in
`src/data/catalog.config.json`. Videos are filed by the way they are titled on YouTube
(`scripts/catalog-rules.mjs`):

| Title on YouTube | On the site |
| --- | --- |
| `EP.05 \| Name` | episode 5 of the series Name |
| `Hook \| Name 3화` | episode 3 of Name, shown as Hook |
| `Hook \| AI드라마 「Name」 1화` | the same; `「」` marks the name |
| `「Name」 Subtitle \| Label` | a single work called Name |
| anything else | a single work under its whole title |

Hashtags and `【brackets】` are dropped. So a new episode needs nothing but its usual title: it
is on the site after the next sync.

- a series whose videos are mostly Shorts goes under **Shorts**, the rest under **long-form**;
- `skip.titles` keeps videos whose title carries one of the words off the site (music videos,
  trailers); `skip.clips` leaves out Shorts with no episode number (clips cut from an episode);
- `exclude` hides a video by id; a source's `videos: [ids]` shows videos whatever the rules say;
- `overrides`, keyed by series id (`series:Name`, or the video id of a single work), can set
  `title`, `description`, `slug`, `cover`/`coverWidth` (a file under `public/`) and
  `featured: true`. Without one, the description is the first paragraph of episode 1's
  description on YouTube and the newest series comes first.

Nothing is downloaded: the site links to YouTube and shows YouTube's thumbnails.

The sync runs daily from `.github/workflows/youtube-catalog.yml`. When the catalog changed it
is committed to `main` and a deploy is started. It works in two ways:

- **without a key** it reads the channel's public feeds (the latest 15 long-form videos and
  the latest 15 Shorts) and adds them to the catalog that is already there. Video lengths and
  the channels' subscriber counts are not in the feeds, so they stay as they were;
- **with the repository secret `YOUTUBE_API_KEY`** (a YouTube Data API v3 key) it reads the
  whole channel, with exact lengths and counts. A source can then also take
  `playlists: true` to make every public playlist a series in its own order.

To run it by hand:

```sh
npm run sync                      # feeds
YOUTUBE_API_KEY=... npm run sync  # API
npm test                          # the title rules
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
