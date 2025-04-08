
import { useState, useEffect } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Define interfaces for ServiceWorker sync functionality, which TypeScript doesn't fully recognize
interface SyncManager {
  register(tag: string): Promise<void>;
}

interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

const Index = () => {
  const { user, isLoading } = useAuth();
  
  // Add PWA installation prompt
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default browser install prompt
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e);
      // Show install button
      setShowInstallButton(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAppInstall = async () => {
    if (!installPrompt) return;
    
    // Show the installation prompt
    (installPrompt as any).prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await (installPrompt as any).userChoice;
    
    // Hide install button after prompt
    setShowInstallButton(false);
    setInstallPrompt(null);
    
    // Track the outcome (accepted/dismissed)
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      toast('App installed successfully!');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  // Function to test service worker functionality
  const testServiceWorkerFeatures = () => {
    // Test background sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((registration: ExtendedServiceWorkerRegistration) => {
        if (registration.sync) {
          registration.sync.register('sync-passwords')
            .then(() => {
              console.log('Sync registration successful');
              toast('Background sync test triggered');
            })
            .catch(error => {
              console.error('Sync registration failed:', error);
              toast('Background sync test failed', { 
                className: 'bg-destructive text-destructive-foreground' 
              });
            });
        } else {
          console.log('Sync API not available in this browser');
          toast('Background sync API not available', {
            className: 'bg-destructive text-destructive-foreground'
          });
        }
      });
    } else {
      toast('Background sync not supported in this browser', {
        className: 'bg-destructive text-destructive-foreground'
      });
    }
  };
  
  // If user is authenticated, redirect to vault
  if (user) {
    return <Navigate to="/vault" replace />;
  }
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AuthScreen />
      
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        {showInstallButton && (
          <button 
            onClick={handleAppInstall}
            className="bg-brand-600 text-white py-2 px-4 rounded-md flex items-center shadow-lg"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add to Home Screen
          </button>
        )}
        
        <button 
          onClick={testServiceWorkerFeatures}
          className="bg-blue-600 text-white py-2 px-4 rounded-md flex items-center shadow-lg"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
          Test PWA Features
        </button>
      </div>
    </div>
  );
};

export default Index;
