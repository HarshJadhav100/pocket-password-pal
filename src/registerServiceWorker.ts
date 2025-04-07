
// Service Worker registration logic

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';

      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          console.log('ServiceWorker registration successful with scope:', registration.scope);
          
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // At this point, the updated precached content has been fetched,
                  console.log('New content is available and will be used when all tabs for this page are closed.');
                  
                  // Show update notification
                  if (window.confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
          
          // Check for permission and subscribe to push notifications if granted
          if ('PushManager' in window) {
            subscribeToPushNotifications(registration);
          }
        })
        .catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}

// Function to subscribe to push notifications
async function subscribeToPushNotifications(registration: ServiceWorkerRegistration) {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // This would typically use your backend to generate VAPID keys
      // For demo purposes, we're just showing the logic structure
      /* 
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: <Your VAPID public key>
      });
      
      // Send the subscription to your server
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
      */
      
      console.log('Ready to receive push notifications');
    } else {
      console.log('Permission for notifications denied');
    }
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
