import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mbabar90.github.io',
  integrations: [sitemap()],
});
