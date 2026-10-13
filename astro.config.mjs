// @ts-check
import { defineConfig } from 'astro/config';

// Origen canónico único. Política: www + barra final en todas las páginas.
export const SITE = 'https://www.galletasdenata.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
});
