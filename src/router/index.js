import { createRouter, createWebHistory } from 'vue-router'
import PokedexView from '../views/PokedexView.vue'
import FavoritesView from '../views/FavoritesView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: PokedexView },
    { path: '/favorieten', component: FavoritesView },
  ],
})
