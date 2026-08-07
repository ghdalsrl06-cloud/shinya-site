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
    titleJa: z.string().optional(),
    status: z.enum(['released', 'coming-soon']),
    youtubeId: z.string().optional(),
    releaseDate: z.string().optional(),
    description: z.string(),
  }),
});

export const collections = { blog, music };
