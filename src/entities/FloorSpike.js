import { Entity } from 'ecs'
import { Sprite, Texture } from 'pixi'

import Component from 'components'


export default class FloorSpike {

  static create (options) {
    const o = new Entity(null, [
      Component.Position,
      Component.Shape,
      Component.Sprite,
      Component.Interaction,
    ])

    o.updateComponents({
      pos: { x: options.x, y: options.y },
      shape: { width: options.w, height: options.h },
      sprite: {
        namespace: `tiles/lever`, // ${options.type}
        animationState: options.data.state,
        previousAnimationState: options.data.state,
        animationSpeed: options.data.animationSpeed,
      },
      interaction: {
        x: [-1, -1],
        y: [-1, -1],
      }
    })
    return o
  }

}
