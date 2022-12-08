import ColorThief from "../modules/color-thief.js";

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

const rgbToHex = (rgb, brightness = 0) => '#' + rgb.map((x) => {
  let newColor = Number.parseInt(x * (brightness / 100 + 1))
  if (newColor > 255) newColor = 255
  else if (newColor < 0) newColor = 0
  const hex = newColor.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

async function convertPokeapiToModel(api) {
  const pokemon = new Pokemon()
  const img = new Image()
  const colorThief = new ColorThief()
  const stats = api.stats.map((statSlot) => statSlot.base_stat)
  const [hp, atk, de, sa, sd, speed] = stats
  
  pokemon.number = api.id
  pokemon.name = api.name
  pokemon.height = api.height
  pokemon.weight = api.weight
  pokemon.hp = hp
  pokemon.attack = atk
  pokemon.defense = de
  pokemon.sa = sa
  pokemon.sd = sd
  pokemon.speed = speed
  pokemon.artwork = api.sprites.other['official-artwork'].front_default

  const imgLoad = new Promise (resolve => {
    img.crossOrigin = 'Anonymous'
    img.src = pokemon.artwork
    img.onload = () => {
      if (img.complete)
        colorThief.getColor(img).then(resolve)
    }
  })

  pokemon.color = await imgLoad.then(colorRGB => rgbToHex(colorRGB))
  pokemon.types = api.types.map((typeSlot) => typeSlot.type.name)
  pokemon.type = pokemon.types[0]

  return pokemon
}

// Cria um método para fazer uma requisição ao atributo url da API
poke.getPokemonsDetails = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeapiToModel)
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

export default poke
