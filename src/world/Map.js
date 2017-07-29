import { Container, Graphics } from 'pixi'

export default class Map {

  constructor (data) {
    this.width = data.width
    this.height = data.height
    this.tileSize = 64 * 3
    this.tiles = data.tiles

    this.init(data.tiles)
  }

  init () {
    const g = this.texture = new Graphics()
    const size = this.tileSize

    const tileSet = {
      0: 0xff0000
    }

    for (let i = 0; i < this.tiles.length; i++) {
      const t = this.tiles[i]
      const x = i % this.width
      const y = Math.floor(i / this.width)

      const color = tileSet[t]
      if (color) {
        g.beginFill(color)
        g.drawRect(x * size, y * size, size, size)
      }
    }
  }

  colllide (aabb) {
  }

  get (x, y) {
    return this.tiles[x + y * this.width]
  }

  set (x, y, tileId) {
    this.tiles[x + y * this.width] = tileId
  }

}
