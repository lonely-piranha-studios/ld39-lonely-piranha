import { Entity } from 'ecs'
import { autoDetectRenderer } from 'pixi'

import { Keyboard } from 'core/input'
import { State } from 'core/state'

import Component from 'components'




export default class GameState extends State {

  constructor (game) {
    super()

    this.ecs = game.ecs
    this.renderer = game.renderer
    this.viewPort = game.viewPort
  }

  enter () {
    const entity = new Entity(null, [
      Component.Camera,
      Component.Physic,
      Component.Position,
      Component.Shape,
      Component.Sprite,
      Component.Keyboard,
      Component.Bar,
      Component.Money,
      Component.Interaction,
    ])
    entity.updateComponents({
      pos: {
        x: 16 * 300, y: 16 * 300,
      },
      shape: {
        width: 4, height: 4,
      },
      sprite: {
        namespace: 'character',
        anchor: { x: 0.375, y: 0.75 },
        scale: { x: 0.5, y: 0.5 },
        animationSpeed: 0.3,
        animationState: 'east-rest',
        previousAnimationState: 'east-rest',
      }
    })
    entity.components.keyboard = new Keyboard({
      up:    ['up', 'w'],
      left:  ['left', 'a'],
      down:  ['down', 's'],
      right: ['right', 'd'],
    })

    this.viewPort.moveToCenter(entity.components.pos.x, entity.components.pos.y)

    this.ecs.addEntity(entity)
  }

  tick (dt) {
    this.ecs.update(dt)
    this.viewPort.render(this.renderer)
  }

}

