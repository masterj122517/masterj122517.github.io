import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    date: z.date(),
    slug: z.string().optional(),
    image: z.string().optional(),
    category: z.string().default('Notes'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
  }),
});

export const collections = { blog, pages };

