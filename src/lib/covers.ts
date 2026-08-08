import type { CollectionEntry } from 'astro:content';

// A release counts as out once its release moment has passed — releaseAt when
// set (exact timestamp), otherwise midnight UTC of releaseDate. With no date at
// all, the manual status field decides. The scheduled rebuilds re-evaluate this,
// so badges, covers, and video embeds all flip automatically.
export function isReleased(release: CollectionEntry<'music'>): boolean {
  const { status, releaseDate, releaseAt } = release.data;
  const at = releaseAt ?? releaseDate;
  if (at) return new Date(at).valueOf() <= Date.now();
  return status !== 'coming-soon';
}

// Which cover to show right now: text-free posterPre before release (when
// provided), the final titled poster from the release moment on.
export function coverOf(release: CollectionEntry<'music'>): string | undefined {
  const { poster, posterPre } = release.data;
  return isReleased(release) ? poster : (posterPre ?? poster);
}
