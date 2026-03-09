
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';

// Register the service worker for PWA capabilities
const updateSW = registerSW({
  onNeedRefresh() {
    // We could add a toast notification here later, for now auto-refresh
  },
  onOfflineReady() {
    console.log('App is ready to work offline');
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
