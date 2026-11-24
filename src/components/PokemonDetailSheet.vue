<script setup>
// Detailscherm dat van rechts inschuift zodra er een Pokémon gekozen is.
import { ref, watch } from 'vue'
import { getPokemonDetails } from '../api/pokemon'
import { useFavorites } from '../composables/useFavorites'

const props = defineProps({
  pokemonId: { type: Number, default: null },
})

const emit = defineEmits(['close'])

const { isFavorite, toggleFavorite } = useFavorites()

const pokemon = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

// Kleur van het type-label per Pokémon-type.
const typeColors = {
  normal: '#a8a878',
  fire: '#f08030',
  water: '#6890f0',
  grass: '#78c850',
  electric: '#f8d030',
  ice: '#98d8d8',
  fighting: '#c03028',
  poison: '#a040a0',
  ground: '#e0c068',
  flying: '#a890f0',
  psychic: '#f85888',
  bug: '#a8b820',
  rock: '#b8a038',
  ghost: '#705898',
  dragon: '#7038f8',
  dark: '#705848',
  steel: '#b8b8d0',
  fairy: '#ee99ac',
}

// Elke keer dat er een andere Pokémon gekozen wordt, de details ophalen.
watch(() => props.pokemonId, async (id) => {
  if (id === null) {
    return
  }

  pokemon.value = null
  errorMessage.value = ''
  isLoading.value = true

  try {
    const details = await getPokemonDetails(id)

    // Alleen tonen als de gebruiker intussen niet al een andere Pokémon heeft gekozen.
    if (props.pokemonId === id) {
      pokemon.value = details
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="sheet" :class="{ 'sheet--open': pokemonId !== null }">
    <header class="sheet__bar">
      <button class="icon-button material-icons" type="button" aria-label="Sluiten" @click="emit('close')">close</button>
      <h2 class="sheet__title">{{ pokemon ? `#${pokemon.id} ${pokemon.name}` : 'Pokémon detail' }}</h2>
      <span class="sheet__spacer"></span>
    </header>

    <main class="sheet__content">
      <p v-if="isLoading" class="state">Detail laden...</p>
      <p v-else-if="errorMessage" class="state state--error">{{ errorMessage }}</p>

      <div v-else-if="pokemon" class="detail">
        <div class="detail__sprite">
          <img :src="pokemon.image" :alt="pokemon.name">
        </div>

        <div class="detail__info">
          <section>
            <h3>Type</h3>
            <span class="type-badge" :style="{ background: typeColors[pokemon.type] ?? '#64748b' }">
              {{ pokemon.type }}
            </span>
          </section>

          <section>
            <h3>Abilities</h3>
            <ul class="abilities">
              <li v-for="ability in pokemon.abilities" :key="ability.name">
                <span>{{ ability.name }}</span>
                <small v-if="ability.isHidden">(Hidden)</small>
              </li>
            </ul>
          </section>

          <section>
            <h3>Base Stats</h3>
            <div class="stats">
              <div v-for="stat in pokemon.stats" :key="stat.label" class="stat">
                <strong>{{ stat.value }}</strong>
                <span>{{ stat.label }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <footer class="sheet__bar sheet__bar--footer">
      <button
        v-if="pokemon"
        class="icon-button material-icons"
        :class="{ 'is-favorite': isFavorite(pokemon.id) }"
        type="button"
        :aria-label="isFavorite(pokemon.id) ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'"
        @click="toggleFavorite(pokemon.id)"
      >
        {{ isFavorite(pokemon.id) ? 'favorite' : 'favorite_border' }}
      </button>
    </footer>
  </section>
</template>

<style scoped>
.sheet {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  box-shadow: -20px 0 40px rgba(15, 23, 42, 0.14);
  transform: translateX(100%);
  transition: transform 0.25s ease;
}

.sheet--open {
  transform: translateX(0);
}

.sheet__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 56px;
  padding: 0 8px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
}

.sheet__bar--footer {
  justify-content: center;
}

.sheet__title {
  flex: 1;
  margin: 0;
  font-size: 1rem;
  text-align: center;
  text-transform: uppercase;
}

.sheet__spacer {
  width: 48px;
}

.is-favorite {
  color: #fca5a5;
}

.sheet__content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.state {
  padding: 20px;
  color: #475569;
}

.state--error {
  color: #b91c1c;
}

.detail {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.detail__sprite {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.detail__sprite img {
  width: 100%;
  max-width: 240px;
  image-rendering: pixelated;
}

.detail__info {
  display: grid;
  gap: 18px;
}

h3 {
  margin: 0 0 10px;
  color: #0f172a;
}

.type-badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  color: white;
  font-weight: 700;
  text-transform: capitalize;
}

.abilities {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.abilities li {
  display: flex;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
  text-transform: capitalize;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.stat {
  display: grid;
  gap: 4px;
  padding: 14px;
  border-radius: 14px;
  background: white;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
  text-align: center;
}

.stat strong {
  font-size: 1.2rem;
}

.stat span {
  color: #64748b;
  font-size: 0.8rem;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .detail {
    grid-template-columns: 1fr;
  }

  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
