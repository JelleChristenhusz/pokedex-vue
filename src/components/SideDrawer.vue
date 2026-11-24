<script setup>
// Zijmenu met navigatie. Klik op de donkere achtergrond of een link sluit het menu.
defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="backdrop" @click="emit('close')"></div>
  </Transition>

  <aside class="drawer" :class="{ 'drawer--open': open }">
    <img src="/logo.png" alt="Pokédex logo" class="drawer__logo">
    <h2>Pokédex</h2>

    <nav class="drawer__nav">
      <RouterLink to="/" @click="emit('close')">
        <span class="material-icons">catching_pokemon</span>
        Pokémon
      </RouterLink>
      <RouterLink to="/favorieten" @click="emit('close')">
        <span class="material-icons">favorite</span>
        Favorieten
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: rgba(15, 23, 42, 0.45);
}

.drawer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 21;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(320px, 85vw);
  height: 100vh;
  padding: 20px;
  background: white;
  box-shadow: 12px 0 30px rgba(15, 23, 42, 0.18);
  transform: translateX(-105%);
  transition: transform 0.25s ease;
}

.drawer--open {
  transform: translateX(0);
}

.drawer__logo {
  width: 100%;
  max-width: 220px;
}

.drawer h2 {
  margin: 0;
}

.drawer__nav {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.drawer__nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8fafc;
  color: #0f172a;
  text-decoration: none;
}

.drawer__nav a.router-link-exact-active {
  background: #ede7f6;
  color: #6200ee;
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
