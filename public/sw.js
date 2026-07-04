// ============================================================================
// SERVICE WORKER DESATIVADO / AUTO-DESREGISTRADOR
// ============================================================================
// Este service worker manual foi APOSENTADO. O PWA agora usa o service worker
// gerado automaticamente pelo vite-plugin-pwa (ver vite.config.js).
//
// Mantemos este arquivo apenas para que os celulares/navegadores que ja
// instalaram a versao antiga do app (que registrava /sw.js) recebam este
// codigo, que se auto-remove e limpa os caches antigos. Isso conserta o
// icone/atalho que havia parado de funcionar.
// ============================================================================

self.addEventListener('install', () => {
  // Ativa imediatamente sem esperar.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      // Apaga todos os caches antigos criados por este SW.
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    } catch (e) {}

    // Desregistra este proprio service worker.
    try {
      await self.registration.unregister();
    } catch (e) {}

    // Recarrega as abas abertas para que passem a usar o novo SW.
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    } catch (e) {}
  })());
});
