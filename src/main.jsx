import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// O registro do Service Worker agora e feito automaticamente pelo
// vite-plugin-pwa (configurado em vite.config.js com registerType 'autoUpdate').
// NAO registramos /sw.js manualmente aqui para evitar dois service workers em conflito.
//
// O bloco abaixo executa uma LIMPEZA UNICA: remove qualquer Service Worker antigo
// (o /sw.js manual que existia antes) e apaga caches antigos, para que os
// dispositivos que ja instalaram a versao antiga do PWA sejam corrigidos.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      const swUrl = registration.active && registration.active.scriptURL ? registration.active.scriptURL : '';
      // Remove apenas o service worker manual antigo (/sw.js).
      // O SW gerado pelo vite-plugin-pwa tem outro nome e sera mantido.
      if (swUrl.indexOf('/sw.js') !== -1) {
        registration.unregister();
      }
    });
  }).catch(() => {});
}

// Indicador de status online/offline
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
