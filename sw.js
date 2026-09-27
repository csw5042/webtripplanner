const CACHE_NAME = 'trip-planner-v4';
const APP_SHELL = [
  './', './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/icon.svg',
  './assets/tokyo/itinerary-final.png', './assets/tokyo/restaurants-map.png',
  './assets/tokyo/convenience-guide.png', './assets/tokyo/supermarket-guide.png',
  './assets/tokyo/tokyo-food-notes.txt'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (new URL(event.request.url).origin === location.origin) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => caches.match('./index.html'))));
});
