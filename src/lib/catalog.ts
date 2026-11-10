import catalog from '../data/catalog.json';
import { t, type Lang } from '../i18n/ui';

// The ORIGINAL catalog: series read from YouTube by scripts/sync-youtube.mjs.
export interface Episode {
  id: string;
  title: string;
  publishedAt: string;
  duration: string;
  seconds: number;
  vertical: boolean;
  thumb: string;
}
export interface Series {
  id: string;
  slug: string;
  kind: 'playlist' | 'group' | 'video';
  channel: 'studio' | 'music';
  title: string;
  description: string;
  cover: string; // a YouTube thumbnail URL, or a path under /public
  coverWidth?: number;
  featured?: boolean;
  publishedAt: string;
  updatedAt: string;
  episodes: Episode[];
}

export const SERIES: Series[] = catalog.series as Series[];

// The channels' names, handles and counts, as the sync last read them (absent until it has run).
export interface ChannelStats { title?: string; handle?: string; subscribers?: number; videos?: number }
export const CHANNEL_STATS: Partial<Record<'studio' | 'music', ChannelStats>> = (catalog as { channels?: Partial<Record<'studio' | 'music', ChannelStats>> }).channels ?? {};
// 12.3만 / 12.3K / 12.3万, the way each audience reads a count.
export const formatCount = (n: number, lang: Lang) => {
  if (lang === 'en') return n >= 1e6 ? `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1).replace(/\.0$/, '')}K` : String(n);
  const unit = lang === 'ko' ? '만' : '万';
  return n >= 1e4 ? `${(n / 1e4).toFixed(1).replace(/\.0$/, '')}${unit}` : n.toLocaleString('en-US');
};
export const featuredSeries = (): Series | undefined => SERIES.find((s) => s.featured) ?? SERIES[0];
export const seriesBySlug = (slug: string) => SERIES.find((s) => s.slug === slug);

// A series is Shorts when most of its videos are; the home shows the two apart.
export const isShorts = (s: Series) => s.episodes.filter((e) => e.vertical).length * 2 > s.episodes.length;
export const shortsSeries = () => SERIES.filter(isShorts);
export const regularSeries = () => SERIES.filter((s) => !isShorts(s));
export const formatLabel = (s: Series, lang: Lang) => (isShorts(s) ? t(lang, 'orig.shorts') : t(lang, 'orig.regular'));

export const episodeUrl = (e: Episode) => (e.vertical ? `https://www.youtube.com/shorts/${e.id}` : `https://www.youtube.com/watch?v=${e.id}`);
// A playlist opens as a playlist on YouTube; anything else opens its first video.
export const seriesUrl = (s: Series) => (s.kind === 'playlist' ? `https://www.youtube.com/playlist?list=${s.id}` : episodeUrl(s.episodes[0]));

export const seriesPath = (s: Series, lang: Lang, base: string) => `${base}${lang === 'en' ? '' : `/${lang}`}/series/${s.slug}/`;

// "영상 4" / "4 videos" / "動画4本"
export const videoCount = (n: number, lang: Lang) => (lang === 'ko' ? `영상 ${n}` : lang === 'ja' ? `動画${n}本` : `${n} ${n === 1 ? 'video' : 'videos'}`);

// A series with a video from the last two weeks (at build time); the page
// drops the badge itself after that, so a site that is not rebuilt stays right.
const NEW_FOR = 14 * 864e5;
export const isNew = (s: Series) => Date.now() - Date.parse(s.updatedAt) < NEW_FOR;
export const newUntil = (s: Series) => new Date(Date.parse(s.updatedAt) + NEW_FOR).toISOString();

// PT2M57S, for schema.org
export const isoDuration = (seconds: number) => `PT${Math.floor(seconds / 60)}M${seconds % 60}S`;
