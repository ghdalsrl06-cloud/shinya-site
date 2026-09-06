import type { Lang } from '../i18n/ui';

// One date style across the site — 2026.09.06 — and one clock: everything is
// read in KST, the zone the release and serialisation schedules are written in.
const kst = (d: Date | string) => new Date(new Date(d).valueOf() + 9 * 3600e3);
const two = (n: number) => String(n).padStart(2, '0');

export const ymd = (d: Date | string) => {
  const k = kst(d);
  return `${k.getUTCFullYear()}.${two(k.getUTCMonth() + 1)}.${two(k.getUTCDate())}`;
};

const DAYS: Record<Lang, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ko: ['일', '월', '화', '수', '목', '금', '토'],
  ja: ['日', '月', '火', '水', '木', '金', '土'],
};

/** A moment on the calendar, short: "9/7 (월) 09:00". */
export const whenKst = (d: Date | string, lang: Lang) => {
  const k = kst(d);
  return `${k.getUTCMonth() + 1}/${k.getUTCDate()} (${DAYS[lang][k.getUTCDay()]}) ${two(k.getUTCHours())}:${two(k.getUTCMinutes())}`;
};
