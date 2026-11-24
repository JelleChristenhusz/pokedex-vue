// Service worker: zorgt dat de app (deels) offline werkt.
const CACHE_NAME = 'pokedex-v3'

// Bestanden die bij installatie meteen worden opgeslagen.
const APP_SHELL = ['/', '/index.html', '/manifest.json', '/offline.html', '/logo.png', '/icon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

// Oude caches van een vorige versie opruimen.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
    ))
  )
  self.clients.claim()
})

// Bepaalt per request waar het antwoord vandaan komt:
// API-data en pagina's eerst van internet, plaatjes en scripts eerst uit de cache.
self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  if (new URL(request.url).hostname === 'pokeapi.co') {
    event.respondWith(networkFirst(request))
  } else if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, '/'))
  } else {
    event.respondWith(cacheFirst(request))
  }
})

// Eerst online proberen; lukt dat niet, dan de opgeslagen versie.
async function networkFirst(request, fallbackUrl) {
  try {
    const response = await fetch(request)
    await saveInCache(request, response)
    return response
  } catch {
    const cached = await caches.match(request)

    if (cached) {
      return cached
    }

    if (fallbackUrl) {
      return await caches.match(fallbackUrl) ?? caches.match('/offline.html')
    }

    return new Response('Offline', { status: 503 })
  }
}

// Eerst de opgeslagen versie; alleen naar het netwerk als die er niet is.
async function cacheFirst(request) {
  const cached = await caches.match(request)

  if (cached) {
    return cached
  }

  const response = await fetch(request)
  await saveInCache(request, response)
  return response
}

async function saveInCache(request, response) {
  if (response.ok || response.type === 'opaque') {
    const cache = await caches.open(CACHE_NAME)
    await cache.put(request, response.clone())
  }
}
