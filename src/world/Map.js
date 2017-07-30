import collideAabbTilemap from 'collide-2d-aabb-tilemap'
import { Graphics, RenderTexture, Container, Sprite, autoDetectRenderer } from 'pixi'
import MapChunkLoader from './MapChunkLoader'

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
  '120': 29,
  '122': 30,
  '123': 31,
  '126': 32,
  '127': 33,
  '208': 34,
  '210': 35,
  '214': 36,
  '216': 37,
  '218': 38,
  '219': 39,
  '222': 40,
  '223': 41,
  '248': 42,
  '250': 43,
  '251': 44,
  '254': 45,
  '255': 46,
  '0': 47,
}


export default class Map {

  constructor (data, tileSet) {
    console.log(tileSet)
    if (data) {
      this.init(data, tileSet)
    }
  }

  init (data, tileSet) {
    this.width = data.width
    this.height = data.height
    this.tileSize = tileSet.tileSize
    this.tiles = data.tiles

    this.collision = data.collision
    this.collider = collideAabbTilemap((x, y) => this.collision[x + y*this.width], this.tileSize, [this.width, this.height])

    const test = new MapChunkLoader(data)
    this.texture = test.texture
    return
    const size = this.tileSize
    const g = new Graphics()

    const tilemap = {
      0: 0x2f293a,
      1: 0x92b09b,
      2: 0x83f3f2,
    }

    for (let i = 0; i < this.tiles.length; i++) {
      // const s = new Sprite(tileSet.tiles[tilemap[this.tiles[i]] || this.tiles[i]])
      // s.y = y * this.tileSize
      const t = this.tiles[i]
      const x = i % this.width
      const y = Math.floor(i/this.width)

      // s.x = x * this.tileSize
      // s.y = y * this.tileSize
      g.beginFill(tilemap[t]);
      g.drawRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize)
      g.endFill();
      // container.addChild(s)
    }

    /*
    const tilesTest = this.tiles.map((t, i) => {
      const x = i % this.width
      const y = Math.floor(i / this.width)
      const n = this.getNeighbors(x, y, t)
      return (t * 47) + bitmask[n]
    });
    */
    this.texture = g
  }

  dispose () {
    this.texture.clear()
    this.texture = undefined
  }

  collide (aabb, vel) {
    return this.collider && this.collider(aabb, [vel.x, vel.y], (moveAxis, moveDir, tileId, tileCoords) => {
      return tileId > 0
    })
  }

  get (x, y) {
    return this.tiles[x + y * this.width]
  }

  set (x, y, tileId) {
    this.tiles[x + y * this.width] = tileId
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

          if (tx + x >= 0 && tx + x <= this.width - 1
          && ty + y >= 0 && ty + y <= this.height - 1
          && this.tiles[neighbor] === tile) {
            count |= 1 << i
          }
          i++
        }
      }
    }

    return count
  }

}
