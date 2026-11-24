<script setup>
// Balk bovenaan met menuknop, titel en zoekknop. Stuurt events naar de ouder-component.
defineProps({
  title: { type: String, required: true },
})

const emit = defineEmits(['open-drawer', 'reset', 'toggle-search'])
</script>

<template>
  <header class="top-bar">
    <button class="icon-button material-icons" type="button" aria-label="Menu openen" @click="emit('open-drawer')">
      menu
    </button>

    <h1 class="top-bar__title" @click="emit('reset')">{{ title }}</h1>

    <button class="icon-button material-icons" type="button" aria-label="Zoeken" @click="emit('toggle-search')">
      search
    </button>
  </header>
</template>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 64px;
  padding: 0 8px;
  background: #6200ee;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.top-bar__title {
  flex: 1;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
}
</style>
