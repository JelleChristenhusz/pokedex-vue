<script setup>
// Eén kaart in het overzicht: plaatje, nummer, naam en een hartje voor favorieten.
defineProps({
  pokemon: { type: Object, required: true },
  favorite: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'toggle-favorite'])
</script>

<template>
  <li class="card">
    <button
      class="card__favorite"
      :class="{ 'card__favorite--active': favorite }"
      type="button"
      :aria-label="favorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'"
      @click="emit('toggle-favorite', pokemon.id)"
    >
      <span class="material-icons">{{ favorite ? 'favorite' : 'favorite_border' }}</span>
    </button>

    <button class="card__body" type="button" @click="emit('select', pokemon.id)">
      <img class="card__image" :src="pokemon.image" :alt="pokemon.name" loading="lazy">
      <span class="card__number">#{{ pokemon.id }}</span>
      <span class="card__name">{{ pokemon.name }}</span>
    </button>
  </li>
</template>

<style scoped>
.card {
  position: relative;
  min-width: 0;
}

.card__body {
  display: grid;
  gap: 8px;
  width: 100%;
  min-height: 190px;
  padding: 16px;
  border: 0;
  border-radius: 18px;
  background: white;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.card__body:hover {
  transform: translateY(-3px);
}

.card__image {
  justify-self: center;
  width: 100%;
  max-width: 140px;
  height: 140px;
  object-fit: contain;
}

.card__number {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 700;
}

.card__name {
  color: #0f172a;
  font-weight: 800;
  text-transform: capitalize;
}

.card__favorite {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #ef4444;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
  cursor: pointer;
}

.card__favorite--active {
  background: #fee2e2;
  color: #dc2626;
}

.card__favorite .material-icons {
  font-size: 20px;
}

@media (max-width: 420px) {
  .card__body {
    min-height: 168px;
    padding: 14px 12px;
  }

  .card__image {
    max-width: 110px;
    height: 110px;
  }
}
</style>
