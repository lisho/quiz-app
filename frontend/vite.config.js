import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      outDir: 'dist', // Output directory for build (default is dist)
      manifest: {
        name: 'Test Prep Quiz App',
        short_name: 'QuizApp',
        description: 'Prepare for your exam with this quiz app',
        theme_color: '#007bff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      // Optional: Configure caching strategies
      workbox: {
        // Cache static assets
        globPatterns: ['**/*.{js,css,html,png,svg,jpg,jpeg,gif,webp,woff,woff2}'],
        // Cache API requests (example: cache-first)
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50, // Max number of API responses to cache
                maxAgeSeconds: 60 * 60 * 24 * 7, // Cache for 7 days
              },
               cacheableResponse: {
                 statuses: [0, 200], // Cache successful responses and opaque responses
               },
            },
          },
        ],
      },
      devOptions: {
        enabled: false // Set to true to test SW in development mode
      }
    })
  ],
  server: {
      // Configure frontend dev server to proxy API requests if needed
      // Or rely on CORS from backend (as implemented)
  },
  build: {
    outDir: 'dist', // Ensure this matches the path in backend/src/server.js for production
  }
})