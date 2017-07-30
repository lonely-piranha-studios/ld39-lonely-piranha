import collideAabbTilemap from 'collide-2d-aabb-tilemap'
import { Entity } from 'ecs'
import MapChunkLoader from './MapChunkLoader'
import {
  Graphics,
  RenderTexture,
  Texture,
  Container,
  Sprite,
  autoDetectRenderer,
} from 'pixi'

import Component from 'components'

export default class Map {

  constructor (data, tileSet, ecs) {
    console.log(tileSet)
    if (data) {
      this.init(data, tileSet, ecs)
    }
  }

  init (data, tileSet, ecs) {
    this.width = data.width
    this.height = data.height
    this.tileSize = tileSet.tileSize
    this.tiles = data.tiles
    this.objects = data.objects
    this.collision = data.collision
    this.collider = collideAabbTilemap((x, y) => this.collision[x + y*this.width], this.tileSize, [this.width, this.height])

    const test = new MapChunkLoader(data)
    this.texture = test.texture

    for (let i = 0; i < this.objects.length; i++) {
      const d = this.objects[i]
      const x = i % this.width * this.tileSize
      const y = Math.floor(i/this.width) * this.tileSize


      const o = new Entity(null, [
        Component.Position,
        Component.Shape,
        Component.Sprite,
      ])

      o.updateComponents({
        pos: { x: x, y: y },
        shape: { width: this.tileSize, height: this.tileSize },
        sprite: { namespace: `tiles/${d.type}` },
      })
      o.components.sprite.graphic = new Sprite(Texture.fromFrame(o.components.sprite.namespace + '.png'))

      ecs.addEntity(o)
    }
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
