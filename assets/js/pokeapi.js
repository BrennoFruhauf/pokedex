const poke = {}

class Pokemon {
  name;
  habitat;
  namePokemonChain = [];
  evolutionChain = [];
  urlPokemonChain = [];
  variation = [];
  variationId = [];
  shape;
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

// Convert JSON to my object model
function convertPokeapiToModel(api) {
  const pokemon = new Pokemon()

  pokemon.number = api.id
  pokemon.name = api.name.replace('-', ' ')
  pokemon.artwork = api.sprites.other['official-artwork'].front_default
  pokemon.types = api.types.map((typeSlot) => typeSlot.type.name)
  pokemon.type = pokemon.types[0]

  return pokemon
}

// Get sub-url API, convert to JSON and use convertPokeapiToModel
poke.getPokemonsDetails = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeapiToModel)
}

// Get url API, get list JSON of pokemons and convert to my object model
poke.getPokemons = (offset = 0, limit = 16) => {
  const api = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

  return fetch(api)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(poke.getPokemonsDetails))
    .then((detailRequest) => Promise.all(detailRequest))
    .then((pokemonsDetails) => pokemonsDetails)
}

// Get all necessary about one pokemon
poke.getPokemon = async (idPokemon) => {
  const pokemon = new Pokemon()
  const pokemonLink = `https://pokeapi.co/api/v2/pokemon/${idPokemon}/`
  
  await fetch(pokemonLink)
  .then(response => response.json())
  .then(async pokemonInfo => {
    const stats = pokemonInfo.stats.map((statSlot) => statSlot.base_stat)
    const [hp, atk, de, sa, sd, speed] = stats

    pokemon.name = pokemonInfo.name.replace(/[-]/g, ' ')
    pokemon.number = pokemonInfo.id
    pokemon.height = pokemonInfo.height / 10
    pokemon.weight = pokemonInfo.weight / 10
    pokemon.hp = hp
    pokemon.attack = atk
    pokemon.defense = de
    pokemon.sa = sa
    pokemon.sd = sd
    pokemon.speed = speed
    pokemon.artwork = pokemonInfo.sprites.other['official-artwork'].front_default
    pokemon.types = pokemonInfo.types.map((typeSlot) => typeSlot.type.name)
    pokemon.type = pokemon.types[0]

    await fetch(pokemonInfo.species.url)
    .then(secondResponse => secondResponse.json())
    .then(async secondPokemonInfo => {
      let indiceNumber
      secondPokemonInfo.habitat ? pokemon.habitat = secondPokemonInfo.habitat.name.replace(/[-]/g, ' ') : pokemon.habitat = 'Unknown'
      pokemon.shape = secondPokemonInfo.shape.name
      pokemon.variation = secondPokemonInfo.varieties.map((variant, indice) => {
        if (pokemon.name != variant.pokemon.name.replace(/[-]/g, ' '))
          return variant.pokemon.name.replace(/[-]/g, ' ')
        else
          indiceNumber = indice
      })
      pokemon.variationId = secondPokemonInfo.varieties.map((variant, indice) => {
        if (indice != indiceNumber)
          return variant.pokemon.url.slice(0, variant.pokemon.url.length - 1).substr(34)
      })
      pokemon.variation.splice(indiceNumber, 1)
      pokemon.variationId.splice(indiceNumber, 1)
      
      if (secondPokemonInfo.evolution_chain != null) {
        await fetch(secondPokemonInfo.evolution_chain.url)
        .then(thirdResponse => thirdResponse.json())
        .then(thirdPokemonInfo => {
          let firstName = '', firstUrl = '', secondName = '', secondUrl = '', thirdName = '', thirdUrl = '', x = 0
          
          if (thirdPokemonInfo.chain.species)
          firstName = thirdPokemonInfo.chain.species.name, firstUrl = thirdPokemonInfo.chain.species.url
          
          if (thirdPokemonInfo.chain.evolves_to != '') {
            secondName = thirdPokemonInfo.chain.evolves_to['0'].species.name, secondUrl = thirdPokemonInfo.chain.evolves_to['0'].species.url
            
            if (thirdPokemonInfo.chain.evolves_to['0'].evolves_to != '')
            thirdName = thirdPokemonInfo.chain.evolves_to['0'].evolves_to['0'].species.name, thirdUrl = thirdPokemonInfo.chain.evolves_to['0'].evolves_to['0'].species.url
          }
          
          const arrayUrl = [firstUrl, secondUrl, thirdUrl], arrayName = [firstName, secondName, thirdName]
          for (let i = 0; i < 3; i++)
            if (arrayUrl[i] != '') {
              pokemon.namePokemonChain[x] = arrayName[i]
              pokemon.evolutionChain[x] = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${arrayUrl[i].slice(0, arrayUrl[i].length - 1).substr(42)}.png`
              pokemon.urlPokemonChain[x] = arrayUrl[i].slice(0, arrayUrl[i].length - 1).substr(42)
              x++
            }
        })
      }
    })
  })

  return pokemon
}