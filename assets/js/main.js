import poke from './pokeapi.js'

function showPokemonHTML(pokemon) {
  return `
    <!-- <li class="${pokemon.type}"> -->
    <li style="background-color: ${pokemon.color}">
      <div>
        <p class="pokemon-number">#${(pokemon.number).toLocaleString('pt-BR', {minimumIntegerDigits: 3, useGrouping: false})}</p>
        <p class="pokemon-name">${pokemon.name}</p>
      </div>
      <div class="about">
        <div>
          ${pokemon.types.map((type) => `<span>${type}</span>`).join('')}
        </div>
        <img src="${pokemon.artwork}" alt="${pokemon.name}">
      </div>
    </li>
  `
}

const pokemonList = document.getElementById('pokemon-list')

poke.getPokemons().then((pokemons = []) => {
  pokemonList.innerHTML += pokemons.map(showPokemonHTML).join('')
})