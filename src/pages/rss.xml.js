import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.id.includes('/') && !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return rss({
    title: 'SHINYA / 深夜 — Blog',
    description: 'Notes on jazz, city pop and lofi for the hours after midnight.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${base}/blog/${post.id}/`,
    })),
  });
}
