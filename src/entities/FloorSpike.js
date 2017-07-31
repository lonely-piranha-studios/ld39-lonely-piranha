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
        namespace: `tiles/${options.type}`,
        animationState: options.data.state,
        animationSpeed: options.data.animationSpeed,
      },
      interaction: {
        x: [0, 0],
        y: [0, 0],
        onInteraction: (entityId) => {
          const player = options.ecs.entities.find(({ id }) => id === entityId)

          if (player.components.bar.currentValue) {
            player.components.bar.currentValue--
          }
        }
      }
    })
    return o
  }

}
