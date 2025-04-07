
import { useState, useEffect } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';
import PasswordVault from '@/pages/PasswordVault';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  // For demonstration purposes, allow auto-login
  const handleDemoLogin = () => {
    setIsAuthenticated(true);
  };
  
  // In a real app, you would check Supabase session here
  useEffect(() => {
    // This would be replaced by Supabase auth check
    const checkAuth = async () => {
      const fakeAuthCheck = false; // This would be a real auth check with Supabase
      setIsAuthenticated(fakeAuthCheck);
    };
    
    checkAuth();
  }, []);

  if (isAuthenticated) {
    return <PasswordVault onLogout={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen relative">
      <AuthScreen />
      
      {/* Demo login button for development */}
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
          onClick={handleDemoLogin}
          className="bg-brand-700 text-white py-2 px-4 rounded-md shadow-lg"
        >
          Demo Login (No Supabase)
        </button>
      </div>
    </div>
  );
};

export default Index;
