self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('waves-cache').then(cache => {
      return cache.addAll(['/']);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
