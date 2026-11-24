<script setup>
// Melding onderin die vraagt of je de app wilt installeren.
import { useInstallPrompt } from '../composables/useInstallPrompt'

const { canInstall, install, dismiss } = useInstallPrompt()
</script>

<template>
  <Transition name="slide-up">
    <div v-if="canInstall" class="snackbar" role="status">
      <span>Wil je deze app op je apparaat installeren?</span>
      <button class="snackbar__action" type="button" @click="install">Installeren</button>
      <button class="icon-button material-icons" type="button" aria-label="Sluiten" @click="dismiss">close</button>
    </div>
  </Transition>
</template>

<style scoped>
.snackbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 8px;
  width: max-content;
  max-width: calc(100vw - 32px);
  padding: 6px 6px 6px 16px;
  border-radius: 8px;
  background: #333;
  color: rgba(255, 255, 255, 0.87);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transform: translateX(-50%);
}

.snackbar__action {
  padding: 8px 12px;
  border: 0;
  border-radius: 4px;
  background: none;
  color: #bb86fc;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
