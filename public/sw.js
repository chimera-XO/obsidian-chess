self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (event) => {
  // Always hit the network directly for API, Supabase, and live app assets
  event.respondWith(fetch(event.request));
});
