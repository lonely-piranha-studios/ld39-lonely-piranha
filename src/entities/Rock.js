import { Entity } from 'ecs'
import { Sprite, Texture } from 'pixi'

import Component from 'components'


export default class Rock {

  static create (options) {
    const o = new Entity(null, [
      Component.Position,
      Component.Shape,
      Component.Sprite,
    ])

    o.updateComponents({
      pos: { x: options.x, y: options.y },
      shape: { width: this.tileSize, height: this.tileSize },
      sprite: { namespace: `tiles/${options.type}` },
    })
    o.components.sprite.graphic = new Sprite(Texture.fromFrame(o.components.sprite.namespace + '.png'))
    return o
  }

}
