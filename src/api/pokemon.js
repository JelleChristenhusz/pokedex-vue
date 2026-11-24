// Alle communicatie met de PokeAPI staat in dit bestand.
const API_URL = 'https://pokeapi.co/api/v2'
const SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'
const POKEMON_COUNT = 1025

// De lijst wordt maar één keer opgehaald en daarna in het geheugen bewaard.
let pokemonList = null

// Haalt alle Pokémon op (alleen id, naam en plaatje).
export async function getPokemonList() {
  if (pokemonList) {
    return pokemonList
  }

  const data = await fetchJson(`${API_URL}/pokemon?limit=${POKEMON_COUNT}`, 'Fout bij ophalen van de Pokémon.')

  // De API geeft geen id terug, maar de lijst staat op volgorde: plek 0 is Pokémon #1.
  pokemonList = data.results.map((pokemon, index) => ({
    id: index + 1,
    name: pokemon.name,
    image: `${SPRITE_URL}/${index + 1}.png`,
  }))

  return pokemonList
}

// Haalt de details van één Pokémon op en zet ze om naar een simpel object voor de app.
export async function getPokemonDetails(id) {
  const data = await fetchJson(`${API_URL}/pokemon/${id}`, 'Pokémon niet gevonden.')

  // Stats omzetten van een lijst naar een object, bijvoorbeeld { hp: 39, attack: 52 }.
  const stats = Object.fromEntries(data.stats.map((s) => [s.stat.name, s.base_stat]))

  // Bewegend plaatje gebruiken als dat er is, anders het gewone plaatje.
  const animatedImage = data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default

  return {
    id: data.id,
    name: data.name,
    image: animatedImage ?? data.sprites.front_default,
    type: data.types[0].type.name,
    abilities: data.abilities.map((a) => ({ name: a.ability.name, isHidden: a.is_hidden })),
    stats: [
      { label: 'HP', value: stats.hp },
      { label: 'Attack', value: stats.attack },
      { label: 'Defense', value: stats.defense },
      { label: 'Sp. Atk', value: stats['special-attack'] },
      { label: 'Sp. Def', value: stats['special-defense'] },
      { label: 'Speed', value: stats.speed },
    ],
  }
}

// Hulpfunctie: doet de request en geeft een duidelijke foutmelding als het misgaat.
async function fetchJson(url, errorMessage) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(errorMessage)
  }

  return response.json()
}
