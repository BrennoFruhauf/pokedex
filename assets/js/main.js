const pokemonCards = document.getElementById('pokemon-card')
const btnShowMore = document.getElementById('show-more')
const pokemonDetail = document.getElementById('pokemon-details')
const containerBtn = document.getElementById('show-pokemon')
const divMaster = document.getElementById('master')
const limit = 30
let offset = 0
const maxCard = 905

// Create pokemon list item
function showPokemonHTML(pokemon) {
  return `
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
  `
}

// Create all elements of pokemon details container and events necessary
function showPokemonDetails(pokemon) {

  // Show stats bar of pokemon
  pokemonDetail.addEventListener('animationstart', event => {
    const element = event.target
    
    if (element.nodeName == 'DIV' && element.className == 'bar hp')
      element.style.setProperty('--hpNumber', `${pokemon.hp / 270 * 100}%`)

    if (element.nodeName == 'DIV' && element.className == 'bar atk')
      element.style.setProperty('--atkNumber', `${pokemon.attack / 270 * 100}%`)

    if (element.nodeName == 'DIV' && element.className == 'bar de')
      element.style.setProperty('--deNumber', `${pokemon.defense / 270 * 100}%`)

    if (element.nodeName == 'DIV' && element.className == 'bar sp-atk')
      element.style.setProperty('--saNumber', `${pokemon.sa / 270 * 100}%`)

    if (element.nodeName == 'DIV' && element.className == 'bar sp-de')
      element.style.setProperty('--sdNumber', `${pokemon.sd / 270 * 100}%`)

    if (element.nodeName == 'DIV' && element.className == 'bar speed')
      element.style.setProperty('--spdNumber', `${pokemon.speed / 270 * 100}%`)

    if (element.nodeName == 'DIV' && element.className == 'bar total')
      element.style.setProperty('--totalNumber', `${(pokemon.hp + pokemon.defense + pokemon.sa + pokemon.sd + pokemon.speed) / 1410 * 100}%`)
  })

  // Show menu select of pokemon variation
  function showVariation() {
    if (pokemon.variation.length >= 1)
      return `
        <div id="variation">
          <label for="selected">Variations: </label>
          <div id="select-menu">
            <span id='selected' class='selected'>${pokemon.name}</span>
            <div id='drop-down' style="display: none;">
              <div class='listDropDown'>
                ${pokemon.variation.map((variation, indice) => 
                  `<div class="item" value="${pokemon.variationId[indice]}">${variation}</div>`).join('')}
              </div>
            </div>
          </div>
        </div>`

    else
      return ''
  }

  // Show weight of pokemon
  function showWeight(){
    if (pokemon.weight < 1000)
      return `${pokemon.weight} kg`

    else
      return 'Unknow'
  }

  // Show evolution chain of pokemon
  function showChain() {
    if (pokemon.evolutionChain.length > 1)
      return `
        <div id="evolution-chain">
          <span>Evolution Chain</span>
          <div>
            ${pokemon.evolutionChain.map((poke, indice) => 
              `<img class="chain" value="${pokemon.urlPokemonChain[indice]}" src="${poke}" alt="${pokemon.namePokemonChain[indice]}">`).join('')}
          </div>
        </div>
      `
    else
      return ''
  }

  // Return of function showPokemonDetails
  return `
    <div>
      <div id="body-details" class="${pokemon.type}">
        <div style="margin: 0 2rem">
          <span id="back" class="material-symbols-rounded back">keyboard_backspace</span>
          <div class="info">
            <span class="pokemon-name">${pokemon.name}</span>
            <span class="pokemon-number">#${(pokemon.number).toLocaleString('pt-BR', {minimumIntegerDigits: 3, useGrouping: false})}</span>
          </div>
          <div class="type">
            ${pokemon.types.map((type) => `<span>${type}</span>`).join('')}
          </div>
        </div>
        <div class="pokemon-img">
          <img src="${pokemon.artwork}" alt="${pokemon.name}">
        </div>
        <div class="content-pokemon">
          <div>
            ${showVariation()}
            <div id="about">
              <div>
                <span>Height</span>
                <span>${pokemon.height} m</span>
              </div>

              <div>
                <span>Weight</span>
                <span>${showWeight()}</span>
              </div>

              <div>
                <span>Habitat</span>
                <span class="text">${pokemon.habitat}</span>
              </div>

              <div>
                <span>Shape</span>
                <span class="text">${pokemon.shape}</span>
              </div>
            </div>

            <div id="stats">
              <div id="hp" class="stat">
                <div>
                  <span class="name-stat">HP</span>
                  <div class="bar hp"></div>
                </div>
                <span class="number-stat">${pokemon.hp}</span>
              </div>

              <div id="atk" class="stat">
                <div>
                  <span class="name-stat">Attack</span>
                  <div class="bar atk"></div>
                </div>
                <span class="number-stat">${pokemon.attack}</span>
              </div>

              <div id="de" class="stat">
                <div>
                  <span class="name-stat">Defense</span>
                  <div class="bar de"></div>
                </div>
                <span class="number-stat">${pokemon.defense}</span>
              </div>

              <div id="sp-atk" class="stat">
                <div>
                  <span class="name-stat">Sp. Attack</span>
                  <div class="bar sp-atk"></div>
                </div>
                <span class="number-stat">${pokemon.sa}</span>
              </div>

              <div id="sp-de" class="stat">
                <div>
                  <span class="name-stat">Sp. Defense</span>
                  <div class="bar sp-de"></div>
                </div>
                <span class="number-stat">${pokemon.sd}</span>
              </div>

              <div id="speed" class="stat">
                <div>
                  <span class="name-stat">Speed</span>
                  <div class="bar speed"></div>
                </div>
                <span class="number-stat">${pokemon.speed}</span>
              </div>

              <div id="total" class="stat">
                <div>
                  <span class="name-stat">Total</span>
                  <div class="bar total"></div>
                </div>
                <span class="number-stat">${pokemon.hp + pokemon.attack + pokemon.defense + pokemon.sa + pokemon.sd + pokemon.speed}</span>
              </div>
            </div>
            ${showChain()}
          </div>
        </div>
      </div>
    </div>`
}

document.body.onload = () => {
  setTimeout(() => {
    document.getElementById('load-box').style.display = 'none'
    document.body.classList.remove('noscroll')
  }, 1000)
}

// Get target element clicked of pokemon details container
pokemonDetail.addEventListener('click', event => {
  const element = event.target
  const dropDown = document.getElementById('drop-down')
  const selectMenu = document.getElementById('selected')

  // Show Detail of Chain Pokemon
  if (element.nodeName == 'IMG' && element.className == 'chain') {
    const pokemonId = element.src.slice(0, element.src.length - 4).substr(96)
    poke.getPokemon(pokemonId).then(result => pokemonDetail.innerHTML = showPokemonDetails(result))
  }

  // Open & close dropdown of variant pokemon list
  if (element.id == 'selected') {
    const dpLength = dropDown.lastElementChild.childElementCount

    if (dropDown.style.display == 'none') {
      dropDown.style.display = 'block'
      selectMenu.style.setProperty('--rotate-arrow', 'rotate(180deg)')
    
      if (dpLength == 2)
        dropDown.style.setProperty('--height-dropdown', '62px')
      else if (dpLength > 2)
        dropDown.style.setProperty('--height-dropdown', '92px')

    } else {
      dropDown.style.display = 'none'
      selectMenu.style.setProperty('--rotate-arrow', 'rotate(0deg)')
    }
  }

  // Close dropdown menu list when click out
  if (element.id != 'selected') {
    if (dropDown != null) {
      dropDown.style.display = 'none'
      selectMenu.style.setProperty('--rotate-arrow', 'rotate(0deg)')
    }
  }

  // Show detail of variant pokemon selected
  if (element.classList == 'item') {
    const idPokemon = element.getAttribute('value')
    poke.getPokemon(idPokemon).then(result => pokemonDetail.innerHTML = showPokemonDetails(result))
  }

  // Close pokemon details container
  if (element.id == 'back') {
    if (window.screen.width < 800) {
      pokemonDetail.classList.remove('show-animation')
      pokemonDetail.classList.add('close-animation')
    } else {
      pokemonDetail.classList.remove('show-animation')
      pokemonDetail.classList.remove('close-animation')
    }
    pokemonDetail.classList.remove('show')
    pokemonDetail.classList.add('close')
    divMaster.style.filter = 'grayscale(0)'
    divMaster.style.pointerEvents = 'auto'

    if (window.screen.width < 800) {
      setTimeout(() => {
        pokemonDetail.innerHTML = ''
        pokemonDetail.classList.add('hidden')
        document.body.classList.remove('noscroll')
      }, 1200)
    } else {
      pokemonDetail.innerHTML = ''
      pokemonDetail.classList.add('hidden')
      document.body.classList.remove('noscroll')

    }
  }
})

// Create each pokemon list item card 
function loadPokemons(offset, limit) {
  poke.getPokemons(offset, limit).then((pokemon = []) => {
    pokemon.map(async (currentPoke) => {
      const newLi = document.createElement('li')
      newLi.className = `${currentPoke.type} card-effect`
      newLi.value = currentPoke.number
      newLi.onclick = pokemonInfo
      newLi.innerHTML = showPokemonHTML(currentPoke)
      pokemonCards.appendChild(newLi)

      // Open pokemon details container
      function pokemonInfo() {
        console.log(window.screen.width)
        const pokemonSelected = currentPoke.number
        document.body.className = 'noscroll'
        poke.getPokemon(pokemonSelected).then(result => pokemonDetail.innerHTML = showPokemonDetails(result))
        pokemonDetail.classList.remove('hidden')
        pokemonDetail.classList.remove('close')
        pokemonDetail.classList.add('show')
        divMaster.style.filter = 'grayscale(1)'
        divMaster.style.pointerEvents = 'none'
        if (window.screen.width < 800) {
          pokemonDetail.classList.add('show-animation')
          pokemonDetail.classList.remove('close-animation')
        } else {
          pokemonDetail.classList.remove('show-animation')
          pokemonDetail.classList.remove('close-animation')
        }
      }
    })
  })
}

pokemonCards.onload = () => {
  console.log('oi')
}

// Load first list of pokemon cards items
loadPokemons(offset, limit)

// Load next list of pokemon cards items
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