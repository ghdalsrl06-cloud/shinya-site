import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.id.includes('/') && !post.data.draft && post.data.date.valueOf() <= Date.now())
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return rss({
    title: 'SHINYA / 深夜 — Blog',
    description: 'Notes from SHINYA — dark electronic J-pop for the hours after midnight.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${base}/blog/${post.id}/`,
    })),
  });
}
