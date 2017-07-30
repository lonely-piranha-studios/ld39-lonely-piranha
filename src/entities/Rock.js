import { Entity } from 'ecs'
import { Sprite, Texture } from 'pixi'

import Component from 'components'


export default class Rock {

  static create (options) {
    const x = options.x * this.tileSize
    const y = options.y * this.tileSize

    const o = new Entity(null, [
      Component.Position,
      Component.Shape,
      Component.Sprite,
    ])

    o.updateComponents({
      pos: { x: x, y: y },
      shape: { width: this.tileSize, height: this.tileSize },
      sprite: { namespace: `tiles/${options.type}` },
    })
    o.components.sprite.graphic = new Sprite(Texture.fromFrame(o.components.sprite.namespace + '.png'))
    return o
  }

}
