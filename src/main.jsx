import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nova versão disponível
                if (confirm('🆕 Nova versão disponível! Atualizar agora?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('Falha ao registrar Service Worker:', error);
      });
  });
}

// Handle offline/online status
window.addEventListener('online', () => {
  document.body.classList.remove('offline');
  document.body.classList.add('online');
});

window.addEventListener('offline', () => {
  document.body.classList.remove('online');
  document.body.classList.add('offline');
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)