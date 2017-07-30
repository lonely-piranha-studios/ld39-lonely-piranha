import collideAabbTilemap from 'collide-2d-aabb-tilemap'
import MapChunkLoader from './MapChunkLoader'

import {
  Chest,
  FloorSpike,
  Lever,
  Rock,
} from '../entities'
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

    this.objects.push({
      type: 'floor_spike',
      x: 302,
      y: 302,
      data: {
        state: 'on-turning',
        animationSpeed: 0.1
      }
    })
    for (let i = 0; i < this.objects.length; i++) {
      const entity = {
        'floor_spike': FloorSpike,
        'lever': Lever,
        'chest': Chest,
        'rock': Rock,
      }[this.objects[i].type]

      if (entity) {
        const objectData = Object.assign({}, this.objects[i], {
          x: this.objects[i].x * this.tileSize,
          y: this.objects[i].y * this.tileSize,
          w: this.tileSize,
          h: this.tileSize,
        })

        const object = entity.create(objectData)
        ecs.addEntity(object)
      }
    }
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
