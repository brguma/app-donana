const CACHE_NAME = 'donana-app-v2.0.0';
const OFFLINE_URL = '/';

// Arquivos que sempre serão cacheados
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Estratégias de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install Event - Cachear arquivos estáticos
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache aberto:', CACHE_NAME);
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Arquivos estáticos cacheados');
        return self.skipWaiting();
      })
  );
});

// Activate Event - Limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activate');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker ativado');
        return self.clients.claim();
      })
  );
});

// Fetch Event - Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') return;
  
  // Ignorar requisições para Firebase/APIs externas
  if (event.request.url.includes('firebaseapp.com') || 
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('gstatic.com')) {
    return;
  }

  event.respondWith(
    handleRequest(event.request)
  );
});

// Função principal para lidar com requisições
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Para navegação (HTML)
    if (request.mode === 'navigate') {
      return await handleNavigationRequest(request);
    }
    
    // Para recursos estáticos (CSS, JS, imagens)
    if (isStaticResource(url.pathname)) {
      return await handleStaticResource(request);
    }
    
    // Para outras requisições, tentar rede primeiro
    return await handleNetworkFirst(request);
    
  } catch (error) {
    console.log('❌ Erro no fetch:', error);
    return await getOfflineFallback(request);
  }
}

// Lidar com navegação (páginas HTML)
async function handleNavigationRequest(request) {
  try {
    // Tentar rede primeiro
    const networkResponse = await fetch(request);
    
    // Cachear resposta se for bem-sucedida
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // Se falhar, buscar no cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para página offline
    return await caches.match(OFFLINE_URL);
  }
}

// Lidar com recursos estáticos
async function handleStaticResource(request) {
  // Cache First Strategy - buscar no cache primeiro
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Se não estiver no cache, buscar na rede
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // Se falhar completamente, retornar erro
    throw error;
  }
}

// Network First Strategy
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Verificar se é um recurso estático
function isStaticResource(pathname) {
  return /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/.test(pathname);
}

// Fallback offline
async function getOfflineFallback(request) {
  if (request.mode === 'navigate') {
    return await caches.match(OFFLINE_URL);
  }
  
  return new Response('Offline', { 
    status: 408,
    statusText: 'Offline' 
  });
}

// Background Sync (para quando voltar online)
self.addEventListener('sync', (event) => {
  console.log('🔄 Background Sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('🔄 Executando sincronização em background');
  // Aqui você pode implementar lógica para sincronizar dados offline
}

// Push Notifications (opcional)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nova notificação do App Donana',
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      data: data.data || {},
      actions: [
        {
          action: 'open',
          title: 'Abrir App'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'App Donana', options)
    );
  }
});

// Lidar com cliques em notificações
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('✅ Service Worker carregado - Donana App v2.0.0');