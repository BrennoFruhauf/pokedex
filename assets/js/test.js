import ColorThief from "./color-thief.js";

const colorThief = new ColorThief();
const img = new Image()

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')


img.addEventListener('load', function() {
  const rgb = colorThief.getColor(img, 10)
  return console.log(rgbToHex(rgb[0], rgb[1], rgb[2]))
})

let imgURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url='

img.crossOrigin = 'Anonymous'
img.src = googleProxyURL + encodeURIComponent(imgURL)