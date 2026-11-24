import { ref, watch } from 'vue'

const STORAGE_KEY = 'pokemon-favorites'

// Staat buiten de functie, zodat alle componenten dezelfde favorieten delen.
const favorites = ref(loadFavorites())

// Bij elke wijziging de favorieten opslaan, zodat ze bewaard blijven na herladen.
watch(favorites, (value) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}, { deep: true })

// Favorieten uit localStorage lezen; bij ongeldige data beginnen we met een lege lijst.
function loadFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(stored) ? stored.map(Number) : []
  } catch {
    return []
  }
}

export function useFavorites() {
  function isFavorite(id) {
    return favorites.value.includes(id)
  }

  // Voegt de Pokémon toe als hij nog geen favoriet is, anders wordt hij verwijderd.
  function toggleFavorite(id) {
    if (isFavorite(id)) {
      favorites.value = favorites.value.filter((favoriteId) => favoriteId !== id)
    } else {
      favorites.value.push(id)
    }
  }

  return { favorites, isFavorite, toggleFavorite }
}
