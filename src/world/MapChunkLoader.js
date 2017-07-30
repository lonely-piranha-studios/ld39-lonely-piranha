import { utils, Container, Texture, Sprite } from 'pixi'

const bitmask = {
  '2': 1,
  '8': 2,
  '10': 3,
  '11': 4,
  '16': 5,
  '18': 6,
  '22': 7,
  '24': 8,
  '26': 9,
  '27': 10,
  '30': 11,
  '31': 12,
  '64': 13,
  '66': 14,
  '72': 15,
  '74': 16,
  '75': 17,
  '80': 18,
  '82': 19,
  '86': 20,
  '88': 21,
  '90': 22,
  '91': 23,
  '94': 24,
  '95': 25,
  '104': 26,
  '106': 27,
  '107': 28,
  '111': 28,
  '235': 28,
  '120': 29,
  '122': 30,
  '123': 31,
  '126': 32,
  '127': 33,
  '208': 34,
  '210': 35,
  '214': 36,
  '215': 36,
  '216': 37,
  '218': 38,
  '219': 39,
  '222': 40,
  '223': 41,
  '244': 34,
  '248': 42,
  '246': 36,
  '249': 42,
  '250': 43,
  '251': 44,
  '252': 42,
  '254': 45,
  '255': 46,
  212: 34,
  '0': 47,
  159: 12,
  63: 12,
  150: 7,
  232: 26,
  105: 26,
  240: 34,
  140: 48,
  128: 48,
  130: 48,
  101: 48,
  106: 48,
  98: 48,
  122: 48,
  120: 48,
  136: 48,
  139: 48,
  15: 4,
  43: 4,
  23: 7,
}

const t = 24
const waterTile = 21 + t * 9;
const tilesetMap = {
  0: {
    46: 1 + t,
    12: 6 + t,
    28: 5 + t * 2,
    10: 6 + t,
    36: 7 + t * 2,
    42: 6 + t * 3,
    4: 9 + t * 3,
    7: 8 + t * 3,
    26: 9,
    34: 8,
    14: 1 + t,
    13: 1 + t,
    44: 5 + t * 3,
    45: 7 + t * 3,
    33: 5 + t,
    41: 7 + t,
    48: 1 + t,
  },
  2: {
    46: waterTile,
    12: waterTile,
    28: waterTile,
    10: waterTile,
    36: waterTile,
    42: waterTile,
    4: waterTile,
    2: waterTile,
    11: waterTile,
    17: waterTile,
    7: waterTile,
    8: waterTile,
    26: waterTile,
    34: waterTile,
    14: waterTile,
    13: waterTile,
    44: waterTile,
    45: waterTile,
    33: waterTile,
    41: waterTile,
    48: waterTile,
  }
}

export default class MapChunkLoader {

  constructor (data) {
    this.data = data

    this.texture = new Container()
    this.img = new Image()
    this.img.onload = this.init.bind(this)
    this.img.src = require('file-loader!sprites/tilesets/dungeon.png')

    this.width = data.width
    this.height = data.height
    this.tiles = data.tiles
  }

  init () {
    const { width, height, tiles } = this.data
    const tileSize = 16

    const canvas = document.createElement('canvas')
    canvas.width = tileSize * width
    canvas.height = tileSize * height

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'HSLA(138, 16%, 63%, 1.00)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#f00'

    const x_tiles = this.img.width / tileSize
    const y_tiles = this.img.height / tileSize

    const autoTiles = this.tiles.map((t, i) => {
      const x = i % this.width
      const y = Math.floor(i / this.width)
      const n = this.getNeighbors(x, y, t)

      if (t === 1) return 'continue'

      const out = bitmask[n] || t

      if (!out) {
        return n
      }

      return out
    })

    for (let i = 0; i < this.tiles.length; i++) {
      const l = this.tiles[i]
      const m = autoTiles[i]
      const t = (tilesetMap[l] && tilesetMap[l][m]) || m
      if (t === 'continue') continue

      const tx = t % x_tiles
      const ty = t / x_tiles << 0

      const x = i % width
      const y = i / width << 0

      ctx.drawImage(this.img,
        tileSize * tx, tileSize * ty, tileSize, tileSize,
        x * tileSize, y * tileSize, tileSize, tileSize
      )
      if (false) {
        ctx.fillText(m, x * tileSize, y * tileSize + 10)
      }
    }

    const texture = Texture.fromCanvas(canvas)

    this.texture.addChild(new Sprite(texture))
  }

  getNeighbors (x, y, tile) {
    const tx = x
    const ty = y
    let count = 0
    let i = 0

    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (x !== 0 || y !== 0) {
          const neighbor = ((ty + y) * this.width) + (tx + x)

          if (
            tx + x >= 0 && tx + x <= this.width - 1 &&
            ty + y >= 0 && ty + y <= this.height - 1 &&
            this.tiles[neighbor] === tile
          ) {
            count |= 1 << i
          }
          i++
        }
      }
    }

    return count
  }

}
