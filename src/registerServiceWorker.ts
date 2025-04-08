
// Service Worker registration logic

// Define interfaces for ServiceWorker sync functionality
interface SyncManager {
  register(tag: string): Promise<void>;
}

interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

export function register() {
  if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported in this browser');
    
    window.addEventListener('load', () => {
      console.log('Window loaded, registering Service Worker...');
      const swUrl = '/service-worker.js';

      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          console.log('ServiceWorker registration successful with scope:', registration.scope);
          
          registration.onupdatefound = () => {
            console.log('Service Worker update found');
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              console.log('No installing worker available');
              return;
            }
            installingWorker.onstatechange = () => {
              console.log('Service Worker state changed to:', installingWorker.state);
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // At this point, the updated precached content has been fetched,
                  console.log('New content is available and will be used when all tabs for this page are closed.');
                  
                  // Show update notification
                  if (window.confirm('New version available! Reload to update?')) {
                    console.log('User confirmed reload, refreshing page');
                    window.location.reload();
                  } else {
                    console.log('User declined reload');
                  }
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
          
          // Check for permission and subscribe to push notifications if granted
          if ('PushManager' in window) {
            console.log('Push Manager is supported in this browser');
            subscribeToPushNotifications(registration);
          } else {
            console.log('Push Manager is not supported in this browser');
          }
          
          // Test a background sync if supported
          if ('SyncManager' in window) {
            console.log('Sync Manager is supported in this browser');
            testBackgroundSync(registration as ExtendedServiceWorkerRegistration);
          } else {
            console.log('Sync Manager is not supported in this browser');
          }
        })
        .catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });
  } else {
    console.log('Service Worker is not supported in this browser');
  }
}

// Function to subscribe to push notifications
async function subscribeToPushNotifications(registration: ServiceWorkerRegistration) {
  try {
    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('Notification permission status:', permission);
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // This would typically use your backend to generate VAPID keys
      // For demo purposes, we're just showing the logic structure
      /* 
      console.log('Attempting to subscribe to push notifications...');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: <Your VAPID public key>
      });
      console.log('Push notification subscription successful:', subscription);
      
      // Send the subscription to your server
      console.log('Sending subscription to server...');
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
      console.log('Subscription sent to server successfully');
      */
      
      console.log('Ready to receive push notifications');
      
      // For testing, we can trigger a fake notification
      setTimeout(() => {
        console.log('Showing test notification...');
        new Notification('Test Notification', {
          body: 'This is a test notification from Pocket Password Pal',
          icon: '/icons/icon-192x192.png'
        });
      }, 5000);
    } else {
      console.log('Permission for notifications denied');
    }
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
  }
}

// Function to test background sync
async function testBackgroundSync(registration: ExtendedServiceWorkerRegistration) {
  try {
    if (registration.sync) {
      console.log('Testing background sync registration...');
      await registration.sync.register('sync-passwords');
      console.log('Background sync registered successfully');
    } else {
      console.log('Sync API not supported by this browser');
    }
  } catch (error) {
    console.error('Error registering background sync:', error);
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    console.log('Unregistering Service Worker...');
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
        console.log('Service Worker unregistered successfully');
      })
      .catch(error => {
        console.error('Error unregistering Service Worker:', error);
      });
  }
}
