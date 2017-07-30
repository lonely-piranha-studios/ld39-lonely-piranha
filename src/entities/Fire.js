import { Entity } from 'ecs'
import { Sprite, Texture } from 'pixi'

import Component from 'components'


export default class Fire {

  static create (options) {
    const o = new Entity(null, [
      Component.Position,
      Component.Shape,
      Component.Sprite,
    ])

    o.updateComponents({
      pos: { x: options.x, y: options.y },
      shape: { width: options.w, height: options.h },
      sprite: {
        namespace: `tiles/${options.type}`,
        scale: { x: 0.5, y: 0.5 },
        animationState: options.data.state,
        animationSpeed: options.data.animationSpeed,
      },
    })
    return o
  }

}
