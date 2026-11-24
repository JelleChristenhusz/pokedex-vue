# Pokédex (Vue 3 PWA)

Een Pokédex-webapp gemaakt met **Vue 3** en **Vite**, met data uit de [PokeAPI](https://pokeapi.co/).

## Functies
- Overzicht van alle Pokémon met paginering
- Zoeken op naam via de zoekknop in de balk bovenaan
- Detailscherm met type, abilities (inclusief hidden abilities), base stats en een bewegend plaatje
- Favorieten opslaan met een hartje; ze blijven bewaard in `localStorage`
- Aparte pagina met je favorieten, bereikbaar via het zijmenu
- Escape sluit het menu, het zoekveld en het detailscherm
- Installeerbaar als app (PWA) en werkt deels offline via een service worker

## Gebruikte technieken
- Vue 3 (Composition API, `<script setup>`, composables)
- Vue Router
- Fetch API met async/await
- Service worker met network-first (API) en cache-first (afbeeldingen en scripts)
- Web app manifest en een eigen installatiemelding

## Projectstructuur
```
src/
  api/pokemon.js                  Ophalen van data uit de PokeAPI
  composables/
    usePokemonList.js             Lijst laden met laad- en foutstatus
    useFavorites.js               Favorieten bijhouden en opslaan
    useInstallPrompt.js           Installatievraag van de PWA
  components/
    PokemonBrowser.vue            Zoeken, kaarten, paginering en detailscherm
    PokemonCard.vue               Eén Pokémon-kaart
    PokemonDetailSheet.vue        Detailscherm dat van rechts inschuift
    TopBar.vue                    Balk bovenaan met menu en zoeken
    SideDrawer.vue                Zijmenu met navigatie
    InstallSnackbar.vue           Melding om de app te installeren
  views/
    PokedexView.vue               Pagina met alle Pokémon
    FavoritesView.vue             Pagina met favorieten
public/
  sw.js                           Service worker (offline)
  offline.html                    Pagina als je offline bent
  manifest.json                   PWA-instellingen
```

## Starten
```bash
npm install
npm run dev
```

De service worker staat alleen aan in de gebouwde versie:
```bash
npm run build
npm run preview
```
