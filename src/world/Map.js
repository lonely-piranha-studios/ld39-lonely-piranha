import collideAabbTilemap from 'collide-2d-aabb-tilemap'
import { Graphics } from 'pixi'


export default class Map {

  constructor (data) {
    this.width = data.width
    this.height = data.height
    this.tileSize = 32 * 2
    this.tiles = data.tiles

    this.collision = data.collision
    this.collider = collideAabbTilemap((x, y) => this.collision[x + y*this.width], this.tileSize, [this.width, this.height])

    this.init()
  }

  init () {
    const g = this.texture = new Graphics()
    const size = this.tileSize

    const tileSet = {
      0: 0xff0000,
      1: 0xffcccc,
      2: 0x0000ff,
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

  dispose () {
    this.texture.clear()
    this.texture = undefined
  }

  collide (aabb, vel) {
    return this.collider(aabb, [vel.x, vel.y], (moveAxis, moveDir, tileId, tileCoords) => {
      return tileId > 0
    })
  }

  get (x, y) {
    return this.tiles[x + y * this.width]
  }

  set (x, y, tileId) {
    this.tiles[x + y * this.width] = tileId
  }

}
