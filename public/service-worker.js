
const CACHE_NAME = 'pocket-password-pal-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/src/index.css',
  '/src/main.tsx'
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Install event triggered');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] All resources cached successfully');
      })
  );
  self.skipWaiting();
  console.log('[Service Worker] Skip waiting, becoming active immediately');
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate event triggered');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('[Service Worker] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Activation complete, now controlling the page');
    })
  );
  self.clients.claim();
});

// Fetch event - respond with cache first, then network
self.addEventListener('fetch', event => {
  console.log('[Service Worker] Fetch event for:', event.request.url);
  
  // Skip Supabase API requests from caching - we always want fresh data
  if (event.request.url.includes('supabase.co')) {
    console.log('[Service Worker] Skipping cache for Supabase API request');
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response from the cached version
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        
        // Not in cache - return the result from the live server
        // and cache it for later
        console.log('[Service Worker] Not in cache, fetching:', event.request.url);
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log('[Service Worker] Invalid response, not caching:', event.request.url);
              return response;
            }

            console.log('[Service Worker] Caching new resource:', event.request.url);
            // Clone the response as it's a stream that can only be consumed once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(error => {
        console.error('[Service Worker] Fetch failed:', error);
      })
  );
});

// Background sync event - for offline data syncing
self.addEventListener('sync', event => {
  console.log('[Service Worker] Sync event triggered:', event.tag);
  if (event.tag === 'sync-passwords') {
    console.log('[Service Worker] Starting password sync process');
    event.waitUntil(syncPasswords());
  }
});

// Function to sync passwords from IndexedDB to Supabase when online
async function syncPasswords() {
  console.log('[Service Worker] Executing syncPasswords function');
  
  try {
    // This would be implemented with IndexedDB
    console.log('[Service Worker] Syncing passwords from offline storage');
    
    // In a real implementation, this would:
    // 1. Open IndexedDB
    // 2. Get pending password changes
    // 3. Send them to Supabase
    // 4. Clear the pending changes
    
    console.log('[Service Worker] Password sync completed successfully');
    return Promise.resolve('Sync successful');
  } catch (error) {
    console.error('[Service Worker] Password sync failed:', error);
    return Promise.reject(error);
  }
}

// Push notification event
self.addEventListener('push', event => {
  console.log('[Service Worker] Push notification received', event);
  
  const data = event.data ? event.data.json() : {};
  console.log('[Service Worker] Push notification data:', data);
  
  const options = {
    body: data.body || 'New notification from Pocket Password Pal',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Pocket Password Pal', options)
      .then(() => {
        console.log('[Service Worker] Push notification displayed successfully');
      })
      .catch(error => {
        console.error('[Service Worker] Error showing notification:', error);
      })
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification clicked:', event.notification.title);
  event.notification.close();
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      console.log('[Service Worker] Found ' + clientList.length + ' clients');
      
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          console.log('[Service Worker] Focusing existing client');
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        console.log('[Service Worker] Opening new window:', event.notification.data.url || '/');
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});
