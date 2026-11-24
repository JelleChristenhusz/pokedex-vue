<script setup>
import PokemonBrowser from '../components/PokemonBrowser.vue'
import { usePokemonList } from '../composables/usePokemonList'

const { pokemon, isLoading, errorMessage } = usePokemonList()
</script>

<template>
  <PokemonBrowser
    title="Pokédex"
    :pokemon="pokemon"
    :is-loading="isLoading"
    :error-message="errorMessage"
  />
</template>
