import poke from './pokeapi.js'

// const pokemonList = document.getElementById('pokemon-list')
// const pokemonCards = document.getElementById('pokemon-card')
const btnShowMore = document.getElementById('show-more')
const containerBtn = document.getElementById('show-pokemon')
const limit = 16
let offset = 0
const maxCard = 1154

function showPokemonHTML(pokemon) {
  return `
    <li class="card-effect" style="background-color: ${pokemon.color}">
    <!-- <li class="${pokemon.type} card-effect"> -->
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

function loadPokemons(offset, limit) {
  poke.getPokemons(offset, limit).then((pokemons = []) => {
    const newHTML = pokemons.map(showPokemonHTML).join('')
    const newList = document.createElement('ol')

    newList.id = 'pokemon-list'
    newList.innerHTML = `
                          <ol id="pokemon-card">
                            ${newHTML}
                          </ol>
                        `
    document.body.appendChild(newList)
    containerBtn.insertAdjacentElement('beforebegin', newList)
  })
}


loadPokemons(offset, limit)

btnShowMore.addEventListener('click', () => {
  offset += limit
  const qtdCard = offset + limit

  if (qtdCard >= maxCard) {
    const newLimit = maxCard - offset
    loadPokemons(offset, newLimit)
    containerBtn.parentElement.removeChild(containerBtn)
  } else {
    loadPokemons(offset, limit)
  }
})