import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const music = defineCollection({
  loader: file('./src/content/music/releases.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    titleKo: z.string().optional(),
    titleEn: z.string().optional(),
    titleJa: z.string().optional(),
    kind: z.enum(['single', 'playlist']).default('single'),
    album: z.number().default(1),
    track: z.number().optional(),
    status: z.enum(['released', 'coming-soon']),
    youtubeId: z.string().optional(),
    poster: z.string().optional(),
    posterPre: z.string().optional(), // text-free art shown until releaseDate
    releaseDate: z.string().optional(),
    releaseAt: z.string().optional(), // exact release moment (ISO, with offset) when it isn't midnight UTC of releaseDate
    description: z.string(),
    descriptionKo: z.string().optional(),
    descriptionJa: z.string().optional(),
    lyrics: z.array(z.string()).optional(),
    lyricsKo: z.array(z.string()).optional(),
    lyricsEn: z.array(z.string()).optional(),
  }),
});

// Webtoon episodes. Panel art carries Korean dialogue, so the same images serve
// every locale and only the surrounding copy is translated.
const webtoon = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/webtoon' }),
  schema: z.object({
    episode: z.number(),
    title: z.string(),
    titleKo: z.string().optional(),
    titleJa: z.string().optional(),
    description: z.string(),
    descriptionKo: z.string().optional(),
    descriptionJa: z.string().optional(),
    date: z.coerce.date(),
    cover: z.string(),
    // Panel image paths under /public, top to bottom.
    panels: z.array(z.string()).min(1),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, music, webtoon };
