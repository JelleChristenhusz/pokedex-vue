import { computed, ref } from 'vue'

// De browser stuurt dit event als de app geïnstalleerd kan worden (PWA).
// We bewaren het, zodat we later zelf de installatievraag kunnen tonen.
const installEvent = ref(null)

window.addEventListener('beforeinstallprompt', (event) => {
  // Standaardmelding van de browser tegenhouden; we tonen onze eigen snackbar.
  event.preventDefault()
  installEvent.value = event
})

window.addEventListener('appinstalled', () => {
  installEvent.value = null
})

export function useInstallPrompt() {
  const canInstall = computed(() => installEvent.value !== null)

  // Opent het installatievenster van de browser.
  async function install() {
    installEvent.value.prompt()
    await installEvent.value.userChoice
    installEvent.value = null
  }

  function dismiss() {
    installEvent.value = null
  }

  return { canInstall, install, dismiss }
}
