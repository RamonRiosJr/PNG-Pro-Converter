
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
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

// Initialize PostHog for exact millisecond telemetry
posthog.init(import.meta.env.VITE_POSTHOG_KEY || 'phc_placeholder_key_waiting_for_setup', {
  api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
  autocapture: true,
  capture_pageview: false // we will manually capture page views if we migrate to a true router
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </React.StrictMode>
);
