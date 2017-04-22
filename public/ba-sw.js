importScripts('/public/sw-toolbox/sw-toolbox.js');
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


toolbox.router.get('/download/(.*)', toolbox.cacheFirst, {
    cache: {
        name: 'baMp3cache',
        maxEntries: 50,
        maxAgeSeconds: 60000
    }
});

self.addEventListener("install", function(e) {
    e.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", function(e) {
    e.waitUntil(self.clients.claim());
});



// self.addEventListener('fetch', function(event) {
//   console.log('Handling fetch event for', event.request.url);

//   if (event.request.headers.get('range')) {

//     var pos =
//     Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
//     console.log('Range request for', event.request.url,
//       ', starting position:', pos);
//     event.respondWith(
//       caches.open(CURRENT_CACHES.prefetch)
//       .then(function(cache) {
//         return cache.match(event.request.url);
//       }).then(function(res) {
//         if (!res) {
//           return fetch(event.request)
//           .then(res => {
//             return res.arrayBuffer();
//           });
//         }
//         return res.arrayBuffer();
//       }).then(function(ab) {
//         return new Response(
//           ab.slice(pos),
//           {
//             status: 206,
//             statusText: 'Partial Content',
//             headers: [
//               // ['Content-Type', 'video/webm'],
//               ['Content-Range', 'bytes ' + pos + '-' +
//                 (ab.byteLength - 1) + '/' + ab.byteLength]]
//           });
//       }));
//   } else {
//   }
// });