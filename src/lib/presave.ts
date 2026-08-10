// DistroKid HyperFollow smart links, one per album. Before releaseAt the page
// is a pre-save; after, the same URL keeps working as an all-stores link, so
// nothing here needs removing on release day — the daily rebuild flips labels.
export interface HyperFollow {
  n: number;
  title: string;
  url: string;
  releaseAt: string; // DSP release moment (local-midnight rollout starts here)
  dateLabel: string; // short display date, e.g. "8/14"
}

export const HYPERFOLLOW: HyperFollow[] = [
  { n: 1, title: 'SHINYA 深夜', url: 'https://distrokid.com/hyperfollow/shinya1/shinya-', releaseAt: '2026-08-13T00:00:00+09:00', dateLabel: '8/13' },
  { n: 2, title: '始発まで', url: 'https://distrokid.com/hyperfollow/shinya1/sEMe3DtLGgo', releaseAt: '2026-08-14T00:00:00+09:00', dateLabel: '8/14' },
  { n: 3, title: '怖いままで', url: 'https://distrokid.com/hyperfollow/shinya1/TaY2O1ea3h9', releaseAt: '2026-08-21T00:00:00+09:00', dateLabel: '8/21' },
];

export const isOut = (e: HyperFollow): boolean => Date.now() >= new Date(e.releaseAt).valueOf();

// Hero CTA target: the next upcoming pre-save, or the newest released album's
// stream link once everything is out.
export function heroFollow(): { url: string; upcoming: boolean } {
  const next = HYPERFOLLOW.find((e) => !isOut(e));
  return next
    ? { url: next.url, upcoming: true }
    : { url: HYPERFOLLOW[HYPERFOLLOW.length - 1].url, upcoming: false };
}
