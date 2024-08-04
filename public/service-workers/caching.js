const cacheName = "v1.0";

// Install event
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
  
    e.waitUntil(
      fetch('/file-list.json')
        .then(response => response.json())
        .then(files => {
          return caches.open(cacheName).then((cache) => {
            console.log('Service Worker: Caching Files');
            return cache.addAll(files);
          });
        })
        .then(() => {
          self.registration.unregister()
          .then(function() {
            return self.clients.matchAll();
          })
          .then(function(clients) {
            clients.forEach(client => client.navigate(client.url))
          });
        })
        .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');
    // Remove old caches
    e.waitUntil(
        caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cache) => {
              if (cache !== cacheName) {
                  console.log('Service Worker: Clearing Old Cache');
                  return caches.delete(cache);
              }
            })
          );
        })
    );
    // Take control of all clients
    return self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (e) => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
        .then((response) => {
            // Make a clone of the response
            const resClone = response.clone();
            // Open cache
            caches.open(cacheName).then((cache) => {
            // Add the response to cache
            cache.put(e.request, resClone);
            });
            return response;
        }).catch(() => caches.match(e.request).then((response) => response))
    );
});