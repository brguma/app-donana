import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado com sucesso:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nova versão disponível
              if (confirm('🆕 Nova versão disponível! Atualizar agora?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.log('❌ Falha ao registrar Service Worker:', error);
      });
  });
}

// Handle offline/online status
window.addEventListener('online', () => {
  console.log('🌐 Aplicação está ONLINE');
  document.body.classList.remove('offline');
  document.body.classList.add('online');
});

window.addEventListener('offline', () => {
  console.log('📱 Aplicação está OFFLINE');
  document.body.classList.remove('online');
  document.body.classList.add('offline');
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)