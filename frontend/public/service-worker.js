// This is a basic example. Use Workbox or a similar library
// for a robust production service worker.
// See Vite PWA plugin documentation: https://github.com/antfu/vite-plugin-pwa

// Example using Workbox (needs configuration in vite.config.js or build process)
// import { precacheAndRoute } from 'workbox-precaching';
// precacheAndRoute(self.__WB_MANIFEST);

// Example of simple caching (manual and NOT recommended for production)
/*
const CACHE_NAME = 'quiz-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Add other critical assets here if not using precacheAndRoute
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request);
      })
  );
});
*/

// In a Vite project with vite-plugin-pwa, this file would be processed.
// Refer to the plugin documentation for customization.