import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Service worker alleen in de gebouwde versie, zodat caching het ontwikkelen niet in de weg zit.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

createApp(App).use(router).mount('#app')
