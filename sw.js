const CACHE_NAME = 'islamic-library-cache-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// ഇൻസ്റ്റാൾ ചെയ്യുമ്പോൾ ഫയലുകൾ കാഷെ ചെയ്യുന്നു
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
    .then(() => self.skipWaiting())
  );
});

// പഴയ കാഷെ ഫയലുകൾ നീക്കം ചെയ്യുന്നു
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// നെറ്റ്‌വർക്ക് ഇല്ലെങ്കിലും കാഷെയിൽ നിന്ന് ആപ്പ് ലോഡ് ചെയ്യുന്നു
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
