// DistroKid HyperFollow smart links, one per album. Before releaseAt the page
// is a pre-save; after, the same URL keeps working as an all-stores link, so
// nothing here needs removing on release day — the daily rebuild flips labels.
export interface HyperFollow {
  n: number;
  title: string;
  url: string;
  releaseAt: string; // release moment, matching the releaseAt in releases.json
  dateLabel: string; // short display date, e.g. "8/14"
}

export const HYPERFOLLOW: HyperFollow[] = [
  { n: 1, title: 'SHINYA 深夜', url: 'https://distrokid.com/hyperfollow/shinya1/shinya-', releaseAt: '2026-08-13T23:59:00+09:00', dateLabel: '8/13' },
  { n: 2, title: '始発まで', url: 'https://distrokid.com/hyperfollow/shinya1/sEMe3DtLGgo', releaseAt: '2026-08-14T23:59:00+09:00', dateLabel: '8/14' },
  { n: 3, title: '怖いままで', url: 'https://distrokid.com/hyperfollow/shinya1/TaY2O1ea3h9', releaseAt: '2026-08-21T23:59:00+09:00', dateLabel: '8/21' },
  { n: 4, title: 'おやすみのあとで', url: 'https://distrokid.com/hyperfollow/shinya1/iJ8VRBa3JwR', releaseAt: '2026-08-28T23:59:00+09:00', dateLabel: '8/28' },
  { n: 5, title: '誰かの部屋で', url: 'https://distrokid.com/hyperfollow/shinya1/3JSWBY9bdvA', releaseAt: '2026-09-04T23:59:00+09:00', dateLabel: '9/4' },
  { n: 6, title: 'Paper Luck', url: 'https://distrokid.com/hyperfollow/shinya1/paper-luck', releaseAt: '2026-09-11T23:59:00+09:00', dateLabel: '9/11' },
  { n: 7, title: 'Second Wind', url: 'https://distrokid.com/hyperfollow/shinya1/second-wind', releaseAt: '2026-09-18T23:59:00+09:00', dateLabel: '9/18' },
  { n: 8, title: 'Blue Hour', url: 'https://distrokid.com/hyperfollow/shinya1/blue-hour', releaseAt: '2026-09-25T23:59:00+09:00', dateLabel: '9/25' },
  { n: 9, title: 'Empty Room', url: 'https://distrokid.com/hyperfollow/shinya1/empty-room', releaseAt: '2026-10-02T23:59:00+09:00', dateLabel: '10/2' },
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
