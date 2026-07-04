import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Auto-update the service worker in the background and take over
      // as soon as the person next opens/reloads the app — no manual
      // "new version available" prompt to wire up.
      registerType: 'autoUpdate',

      // Keep the existing favicon.svg working; just add it to the
      // precache list alongside the generated icons.
      includeAssets: ['favicon.svg', 'icons.svg'],

      manifest: {
        name: 'SOP AI — SOP Manager',
        short_name: 'SOP AI',
        description: 'Manage SOPs, organize process knowledge, and ask AI questions from your knowledge base.',
        theme_color: '#059669',      // emerald-600, matches the brand accent
        background_color: '#f1f5f9', // slate-100, matches the app shell background
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/dashboard',
        scope: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        // Don't cache API calls — the app should always hit the live
        // backend for SOP data; caching would show stale content or
        // break auth. Only the built app shell (JS/CSS/HTML/icons) is
        // precached so the app *opens* instantly offline; data calls
        // still need a network connection.
        navigateFallbackDenylist: [/^\/api\//],
      },

      devOptions: {
        // Lets you test the service worker during `npm run dev` too,
        // not just in a production build.
        enabled: true,
      },
    }),
  ],
})
