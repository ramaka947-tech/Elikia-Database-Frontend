import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // PWA : l'application peut s'installer sur téléphone et ordinateur
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'logo.png', 'logo-mark.png'],
      manifest: {
        name: 'Elikia Database',
        short_name: 'Elikia',
        description: 'La base de référence des entreprises du Sénégal',
        lang: 'fr',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#131b2b',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // On ne met jamais en cache les réponses de l'API : les données restent toujours à jour
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
});
