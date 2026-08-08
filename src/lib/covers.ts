import type { CollectionEntry } from 'astro:content';

// Which cover to show for a release right now:
// - before release (future releaseDate, or coming-soon with no date yet) → posterPre (text-free art), when provided
// - from release day → poster (the final titled thumbnail)
// The daily scheduled rebuild makes the swap happen automatically.
export function coverOf(release: CollectionEntry<'music'>): string | undefined {
  const { poster, posterPre, releaseDate, status } = release.data;
  const released = releaseDate
    ? new Date(releaseDate).valueOf() <= Date.now()
    : status !== 'coming-soon';
  return released ? poster : (posterPre ?? poster);
}
