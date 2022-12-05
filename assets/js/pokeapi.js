import ColorThief from "./color-thief.js";

const poke = {}

class Pokemon {
  name;
  color;
  type;
  types = [];
  hp;
  attack;
  defense;
  sa;
  sd;
  speed;
  number;
  artwork;
  height;
  weight;
}

const rgbToHex = (r, g, b) => '#' + [r, g, b].map((x) => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

  function convertPokeapiToModel(api) {
  const pokemon = new Pokemon()
  const img = new Image()
  const colorThief = new ColorThief()
  pokemon.number = api.id
  pokemon.name = api.name
  pokemon.artwork = api.sprites.other['official-artwork'].front_default
  img.crossOrigin = 'Anonymous'
  img.src = pokemon.artwork
  img.onload = () => {
    //if (img.complete) {
      const rgbColor = colorThief.getColor(img)
      return pokemon.color = rgbColor
    // } else {
    //   img.addEventListener('load', () => {
    //     const rgbColor = colorThief.getColor(img)
    //     return pokemon.color =  rgbColor
    //   })
  } //}

  pokemon.types = api.types.map((typeSlot) => typeSlot.type.name)
  pokemon.type = pokemon.types[0]
  pokemon.height = api.height
  pokemon.weight = api.weight

  const stats = api.stats.map((statSlot) => statSlot.base_stat)
  const [hp, atk, de, sa, sd, speed] = stats

  pokemon.hp = hp
  pokemon.attack = atk
  pokemon.defense = de
  pokemon.sa = sa
  pokemon.sd = sd
  pokemon.speed = speed

  return pokemon
}

// Cria um método para fazer uma requisição ao atributo url da API
poke.getPokemonsDetails = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeapiToModel)
    .then((callback) => console.log(callback))
}

// Cria um método para obter os dados da API
poke.getPokemons = (offset = 0, limit = 16) => {
  // Declaração da API Pokeapi
  const api = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

  return fetch(api)
    // Converte os dados da resposta para um arquivo json
    .then((response) => response.json())
    // Acessa o atributo results do arquivo json
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(poke.getPokemonsDetails))
    .then((detailRequest) => Promise.all(detailRequest))
    .then((pokemonsDetails) => pokemonsDetails)
}

// -----------------------------------------------------------------------

// FORMA ASYNC DE REALIZAR O MESMO CÓDIGO

// poke.getPokemonsDetails = async (pokemon) => {
//   const response = await fetch(pokemon.url)
//   return convertPokeapiToModel(response.json())
// }

// poke.getPokemons = async (offset = 20, limit = 20) => {
//   const api = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
//   const response = await fetch(api)
//   const jsonBody = await response.json()
//   const pokemons = jsonBody.results
//   const detailRequest = pokemons.map(poke.getPokemonsDetails)
//   const pokemonsDetails = await Promise.all(detailRequest)
//   return pokemonsDetails
// }

export default poke
