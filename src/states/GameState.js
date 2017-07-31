import { Entity } from 'ecs'
import { autoDetectRenderer } from 'pixi'

import { Keyboard } from 'core/input'
import { State } from 'core/state'

import Component from 'components'




export default class GameState extends State {

  constructor (game) {
    super()

    this.initialized = false
    this.ecs = game.ecs
    this.renderer = game.renderer
    this.viewPort = game.viewPort
  }

  enter () {
    if (!this.initialized) {
      const player = new Entity(null, [
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
      // SMELL: haxx identifier for townstate mojjen
      player.isPlayer = true
      player.updateComponents({
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
      player.components.keyboard = new Keyboard({
        up:    ['up', 'w'],
        left:  ['left', 'a'],
        down:  ['down', 's'],
        right: ['right', 'd'],
      })

      this.viewPort.moveToCenter(player.components.pos.x, player.components.pos.y)

      this.ecs.addEntity(player)
      this.initialized = true
    }
  }

  tick (dt) {
    this.ecs.update(dt)
    this.viewPort.render(this.renderer)
  }

}

