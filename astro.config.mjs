import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [tailwind(), mdx()],
  site: 'https://ailex.consulting',
  output: 'static',
  build: {
    inlineStylesheets: 'auto'
  }
});