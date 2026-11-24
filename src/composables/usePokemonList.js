import { onMounted, ref } from 'vue'
import { getPokemonList } from '../api/pokemon'

// Laadt de Pokémon-lijst en houdt bij of het laden bezig is of mislukt.
// Wordt door beide pagina's gebruikt, zodat die code niet dubbel staat.
export function usePokemonList() {
  const pokemon = ref([])
  const isLoading = ref(true)
  const errorMessage = ref('')

  onMounted(async () => {
    try {
      pokemon.value = await getPokemonList()
    } catch (error) {
      errorMessage.value = error.message
    } finally {
      isLoading.value = false
    }
  })

  return { pokemon, isLoading, errorMessage }
}
