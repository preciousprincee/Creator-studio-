import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Don't try to inject manifest into HTML — handle it manually
      injectRegister: 'auto',
      // Skip glob precaching entirely to avoid the dist-not-found error
      strategies: 'generateSW',
      workbox: {
        // Only cache what's actually in the built output
        globPatterns: ['**/*.{js,css,html}'],
        globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
        // Runtime cache for fonts and API calls
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      manifest: {
        name: 'Aria — Content Strategist',
        short_name: 'Aria',
        description: 'Your personal AI content strategist for TikTok & Reels',
        theme_color: '#e07a5f',
        background_color: '#fdfaf5',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
