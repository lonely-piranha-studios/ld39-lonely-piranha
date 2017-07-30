import { Texture, Rectangle } from 'pixi'


export default class TileSet {

  constructor (image, textures, tileSize = 16, tileMargin = 0) {
    const { width, height } = textures[image].orig

    this.image = image
    this.width = width
    this.height = height

    this.tileSize = tileSize
    this.tileMargin = tileMargin

    this.tiles = TileSet.initTilset(image, textures, width, height, tileSize, tileMargin)
  }

  static initTilset (image, textures, width, height, tileSize, tileMargin) {
    const x_tiles = (width - tileMargin)/(tileSize + tileMargin)
    const y_tiles = (height - tileMargin)/(tileSize + tileMargin)

    const tiles = new Array(Math.floor(x_tiles * y_tiles))
    for (let x = 0; x < x_tiles; x++) {
      for (let y = 0; y < y_tiles; y++) {
        const tx = x * (tileSize + tileMargin) + tileMargin
        const ty = y * (tileSize + tileMargin) + tileMargin
        tiles[x + y * x_tiles] = new Texture(textures[image], new Rectangle(tx, ty, tileSize, tileSize))
      }
    }
    return tiles
  }

}

