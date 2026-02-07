// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://masterj122517.github.io',
  base: '/new_blog',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});