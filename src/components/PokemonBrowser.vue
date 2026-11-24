<script setup>
// Het hoofdscherm met zoeken, kaarten, paginering en het detailscherm.
// Wordt gebruikt door zowel de Pokédex- als de Favorietenpagina.
import { computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { useFavorites } from '../composables/useFavorites'
import TopBar from './TopBar.vue'
import SideDrawer from './SideDrawer.vue'
import PokemonCard from './PokemonCard.vue'
import PokemonDetailSheet from './PokemonDetailSheet.vue'

const props = defineProps({
  title: { type: String, required: true },
  pokemon: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  loadingText: { type: String, default: 'Pokémon laden...' },
  emptyText: { type: String, default: 'Geen Pokémon gevonden.' },
  searchPlaceholder: { type: String, default: 'Zoek een Pokémon...' },
})

const PAGE_SIZE = 20

const { isFavorite, toggleFavorite } = useFavorites()

const drawerOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const selectedId = ref(null)
const searchInput = ref(null)

// Computed properties rekenen automatisch opnieuw als de zoekterm of pagina verandert.
const filteredPokemon = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return props.pokemon.filter((p) => p.name.includes(query))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPokemon.value.length / PAGE_SIZE)))

// Alleen de Pokémon van de huidige pagina, bijvoorbeeld 21 t/m 40 op pagina 2.
const visiblePokemon = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredPokemon.value.slice(start, start + PAGE_SIZE)
})

const emptyMessage = computed(() => searchQuery.value ? 'Geen Pokémon gevonden.' : props.emptyText)

// De pagina erachter niet laten scrollen zolang het detailscherm of menu open is.
watchEffect(() => {
  document.body.style.overflow = selectedId.value !== null || drawerOpen.value ? 'hidden' : ''
})

// Bij een nieuwe zoekterm terug naar pagina 1.
watch(searchQuery, () => {
  currentPage.value = 1
})

// Als er pagina's verdwijnen (bijv. favoriet verwijderd), niet op een lege pagina blijven staan.
watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

async function toggleSearch() {
  searchOpen.value = !searchOpen.value

  if (!searchOpen.value) {
    searchQuery.value = ''
    return
  }

  // Wachten tot het zoekveld op de pagina staat, en dan de cursor erin zetten.
  await nextTick()
  searchInput.value.focus()
}

// Klik op de titel: alles terug naar het begin.
function resetView() {
  searchOpen.value = false
  searchQuery.value = ''
  currentPage.value = 1
  selectedId.value = null
}

function goToPage(page) {
  currentPage.value = page
  window.scrollTo(0, 0)
}

// Met Escape sluit je het menu, het zoekveld en het detailscherm.
function closeAll(event) {
  if (event.key === 'Escape') {
    drawerOpen.value = false
    searchOpen.value = false
    selectedId.value = null
  }
}

onMounted(() => {
  window.addEventListener('keydown', closeAll)
})

// Listener weer opruimen als de pagina verlaten wordt.
onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', closeAll)
})
</script>

<template>
  <TopBar :title="title" @open-drawer="drawerOpen = true" @reset="resetView" @toggle-search="toggleSearch" />
  <SideDrawer :open="drawerOpen" @close="drawerOpen = false" />

  <main class="content">
    <input
      v-if="searchOpen"
      ref="searchInput"
      v-model="searchQuery"
      class="search"
      type="search"
      :placeholder="searchPlaceholder"
    >

    <p v-if="errorMessage" class="message message--error">{{ errorMessage }}</p>
    <p v-else-if="isLoading" class="message">{{ loadingText }}</p>
    <p v-else-if="filteredPokemon.length === 0" class="message">{{ emptyMessage }}</p>

    <template v-else>
      <ul class="grid">
        <PokemonCard
          v-for="p in visiblePokemon"
          :key="p.id"
          :pokemon="p"
          :favorite="isFavorite(p.id)"
          @select="selectedId = $event"
          @toggle-favorite="toggleFavorite"
        />
      </ul>

      <div class="pagination">
        <button class="button" type="button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          Vorige
        </button>
        <span class="pagination__info">Pagina {{ currentPage }} van {{ totalPages }}</span>
        <button class="button" type="button" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
          Volgende
        </button>
      </div>
    </template>
  </main>

  <PokemonDetailSheet :pokemon-id="selectedId" @close="selectedId = null" />
</template>

<style scoped>
.content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 88px 20px 32px;
}

.search {
  width: 100%;
  margin-bottom: 20px;
  padding: 14px 16px;
  border: 1px solid #dbe3f0;
  border-radius: 14px;
  background: white;
  font-size: 1rem;
}

.message {
  padding: 20px;
  color: #475569;
}

.message--error {
  border-radius: 10px;
  background: #fee2e2;
  color: #991b1b;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
}

.pagination__info {
  color: #475569;
  font-weight: 600;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (min-width: 1024px) {
  .content {
    padding: 96px 40px 40px;
  }
}
</style>
