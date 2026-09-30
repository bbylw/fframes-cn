// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  // Served from a GitHub Pages custom domain, so the site lives at the root.
  site: 'https://fframes.ndjp.net',
  trailingSlash: 'ignore',
  integrations: [react(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
