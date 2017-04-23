importScripts('/public/sw-toolbox/sw-toolbox.js');
importScripts('/public/rangedResponseHelper.js');
var CACHE_VERSION = 2;
var CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};




toolbox.precache([
    '/'
]);

toolbox.options.networkTimeoutSeconds = 30;

toolbox.router.get('/', toolbox.networkFirst);

toolbox.router.get('/public/(.*)', toolbox.cacheFirst, {
    cache: {
        name: 'bacache',
        maxEntries: 50,
        maxAgeSeconds: 60000
    }
});


toolbox.router.get('/api/(.*)', toolbox.cacheFirst, {
    cache: {
        name: 'baApicache',
        maxEntries: 50,
        maxAgeSeconds: 60000
    }
});


toolbox.router.get('/(.*)', toolbox.cacheFirst, {
    origin: /file.myfontastic.com/,
    cache: {
        name: 'icons',
        maxEntries: 10,
        maxAgeSeconds: 60000
    }
});




self.addEventListener("install", function(e) {
    e.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", function(e) {
    e.waitUntil(self.clients.claim());
});




self.onfetch = evt => {
  const FETCH_TIMEOUT = 10000;
  const request = evt.request;

  evt.respondWith(
    RangedResponse.canHandle(request).then(canHandleRequest => {
      if (canHandleRequest) {
        return RangedResponse.create(request);
      }

      // Not a range request that can be handled, so try a normal cache lookup
      // followed by falling back to fetching.
      return caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }

          return Promise.race([
            fetch(evt.request),
            new Promise(resolve => {
              setTimeout(resolve, FETCH_TIMEOUT);
            })
          ]).then(response => {
            if (response) {
              return response;
            }

            return caches.match('/404/');
          });
        });
    })
  );
};

