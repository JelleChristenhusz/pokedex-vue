<script setup>
import { computed } from 'vue'
import PokemonBrowser from '../components/PokemonBrowser.vue'
import { usePokemonList } from '../composables/usePokemonList'
import { useFavorites } from '../composables/useFavorites'

const { pokemon, isLoading, errorMessage } = usePokemonList()
const { isFavorite } = useFavorites()

// Alleen de Pokémon die als favoriet zijn opgeslagen.
const favoritePokemon = computed(() => pokemon.value.filter((p) => isFavorite(p.id)))
</script>

<template>
  <PokemonBrowser
    title="Favorieten"
    :pokemon="favoritePokemon"
    :is-loading="isLoading"
    :error-message="errorMessage"
    loading-text="Favorieten laden..."
    empty-text="Nog geen favorieten toegevoegd."
    search-placeholder="Zoek in favorieten..."
  />
</template>
