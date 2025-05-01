import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './styles/global.css'; // Import global styles
import './styles/components.css';
import './styles/pages.css';
import './styles/_variables.css';

// Register Service Worker (provided by Vite PWA plugin or CRA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js') // Adjust path if needed
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);