import type { CollectionEntry } from 'astro:content';

// Which cover to show for a release right now:
// - before releaseDate → posterPre (text-free art), when provided
// - from release day  → poster (the final titled thumbnail)
// The daily scheduled rebuild makes the swap happen automatically.
export function coverOf(release: CollectionEntry<'music'>): string | undefined {
  const { poster, posterPre, releaseDate } = release.data;
  const released = !releaseDate || new Date(releaseDate).valueOf() <= Date.now();
  return released ? poster : (posterPre ?? poster);
}
