import { t, type Lang } from '../i18n/ui';

export interface EpisodeMeta {
  episode: number;
  part?: number;
  finale?: boolean;
}

// "1부 1화" / "第1部 第1話" / "Part 1, Ep. 1". The episode that closes a part
// is named rather than numbered — "1부 마지막화" — which is why `finale` is a
// field on the episode instead of "whichever episode is highest": once part 2
// starts, episode 11 must not inherit the label.
export function epLabel(lang: Lang, e: EpisodeMeta): string {
  const key = e.finale ? 'webtoon.labelFinale' : 'webtoon.label';
  return t(lang, key).replace('{p}', String(e.part ?? 1)).replace('{e}', String(e.episode));
}
