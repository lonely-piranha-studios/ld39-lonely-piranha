import { utils, Container, Texture, Sprite } from 'pixi'

const spriteSheetWidth = 24

const waterTile = [21, 9]
const voidTile = [1, 1]
const block = [10, 4]

const wallTop = [6, 1]
const wallBottom = [6, 3]
const wallRight = [7, 2]
const wallLeft = [5, 2]
const wallHorizontal = [11, 3]
const wallVertical = [11, 1]
const cornerTopLeft = [5, 1]
const cornerTopRight = [7, 1]
const cornerBottomLeft = [5, 3]
const cornerBottomRight = [7, 3]
const edgeTopLeft = [8, 0]
const edgeTopRight = [9, 0]
const edgeBottomLeft = [8, 3]
const edgeBottomRight = [9, 3]

const notFoundTile = block[1] * spriteSheetWidth + block[0]

const bitMaskMap = {
  0: block,
  255: voidTile,
  31: wallTop,
    63: wallTop,
    159: wallTop,
    191: wallTop,
    95: wallTop,
    159: wallTop,
  249: wallBottom,
    248: wallBottom,
    250: wallBottom,
    252: wallBottom,
    253: wallBottom,
  246: wallRight,
    214: wallRight,
    215: wallRight,
    247: wallRight,
  111: wallLeft,
    107: wallLeft,
    235: wallLeft,
    239: wallLeft,
    123: wallLeft,
  127: cornerTopLeft,
  223: cornerTopRight,
  251: cornerBottomLeft,
  254: cornerBottomRight,
    27: cornerBottomRight,
  208: edgeTopLeft,
    240: edgeTopLeft,
    244: edgeTopLeft,
    245: edgeTopLeft,
    216: edgeTopLeft,
  120: edgeTopRight,
    104: edgeTopRight,
    232: edgeTopRight,
    233: edgeTopRight,
    125: edgeTopRight,
    106: edgeTopRight,
    105: edgeTopRight,
    238: edgeTopRight,
  22: edgeBottomLeft,
    151: edgeBottomLeft,
    23: edgeBottomLeft,
    62: edgeBottomLeft,
    30: edgeBottomLeft,
    119: edgeBottomLeft,
    158: edgeBottomLeft,
  11: edgeBottomRight,
    15: edgeBottomRight,
    47: edgeBottomRight,
    75: edgeBottomRight,
    43: edgeBottomRight,
    175: edgeBottomRight,
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
    ctx.font="8px Arial";

    const x_tiles = this.img.width / tileSize
    const y_tiles = this.img.height / tileSize

    const bitMasks = this.tiles.map((tile, i) => {
      const x = i % this.width
      const y = Math.floor(i / this.width)
      return this.getNeighbors(x, y, tile)
    })

    for (let i = 0; i < this.tiles.length; i++) {
      const tileType = this.tiles[i]
      if (tileType === 1) continue // Normal ground, nothing to draw
      if (tileType === 2) { // Water
        const tile = waterTile[1] * spriteSheetWidth + waterTile[0]
        const x = i % width
        const y = i / width << 0
        const tx = tile % x_tiles
        const ty = tile / x_tiles << 0
        ctx.drawImage(this.img,
          tileSize * tx, tileSize * ty, tileSize, tileSize,
          x * tileSize, y * tileSize, tileSize, tileSize
        )
      }
      if (tileType === 0) { // Wall
        const tileBitmask = bitMasks[i];
        const tile = (bitMaskMap[tileBitmask] && bitMaskMap[tileBitmask][1] * spriteSheetWidth + bitMaskMap[tileBitmask][0])
          || notFoundTile;
        const x = i % width
        const y = i / width << 0

        if (tile) {
          const tx = tile % x_tiles
          const ty = tile / x_tiles << 0
          ctx.drawImage(this.img,
            tileSize * tx, tileSize * ty, tileSize, tileSize,
            x * tileSize, y * tileSize, tileSize, tileSize
          )
        } 
        if (!tile || tile === notFoundTile || true){
          ctx.fillText(tileBitmask, x * tileSize, y * tileSize + 10)
        }
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
