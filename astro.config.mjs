// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import yaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
  site: 'https://sms-api-compare.pages.dev',
  output: 'static',
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss(), yaml()],
  },
});
