# private/

Material kept in the repository but deliberately **not published**. Nothing
here is served: Astro only ships `public/` and the built `src/` routes.

## webtoon/

Episode art for the SHINYA webtoon, unpublished while the episodes are
being reworked. Covers (`epNN-cover.jpg`), panels (`epNN/NN.jpg`), and the
series cover.

To bring the section back:

1. `git mv private/webtoon public/images/webtoon`
2. Rename `src/pages/{,ko/,ja/}_webtoon` back to `webtoon` — Astro skips
   route folders whose name starts with an underscore.
3. Restore the webtoon entry in the `links` array in `src/layouts/Base.astro`.

The episode markdown in `src/content/webtoon/` and the `webtoon` collection
in `src/content.config.ts` were left untouched, so steps 1-3 are all it takes.
