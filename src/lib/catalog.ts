import catalog from '../data/catalog.json';
import type { Lang } from '../i18n/ui';
import { CHANNELS } from './studio';

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
export const featuredSeries = (): Series => SERIES.find((s) => s.featured) ?? SERIES[0];
export const seriesBySlug = (slug: string) => SERIES.find((s) => s.slug === slug);

export const CHANNEL_LABEL: Record<Series['channel'], string> = { studio: 'shinya studio', music: 'shinya music' };
export const channelUrl = (s: Series) => CHANNELS[s.channel].url;

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
