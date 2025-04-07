
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { register } from './registerServiceWorker'

// Register service worker for PWA capabilities
register();

createRoot(document.getElementById("root")!).render(<App />);
