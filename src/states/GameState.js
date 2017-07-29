import ECS from 'ecs'
import { autoDetectRenderer } from 'pixi'

import { Keyboard } from 'core/input'
import { ViewPort } from 'core/gfx'
import { State } from 'core/state'

import System from 'systems'
import Component from 'components'
import Map from 'world/Map'


export default class GameState extends State {

  constructor (game) {
    super()

    this.renderer = game.renderer
    this.viewPort = new ViewPort(this.renderer)
  }

  enter () {
    const map = new Map(require('assets/maps.json').maps[1])
    this.viewPort.view(map.width * map.tileSize, map.height * map.tileSize)

    this.ecs = new ECS()
    this.systems = this.initSystems(this.ecs)

    this.systems.map.setMap(map)

    const entity = new ECS.Entity(null, [
      Component.Camera,
      Component.Physic,
      Component.Position,
      Component.Shape,
      Component.Keyboard
    ])
    entity.updateComponents({
      pos: {
        x: 300, y: 300,
      },
      shape: {
        width: 32, height: 32
      },
    })
    entity.components.keyboard = new Keyboard({
      up:    ['up'],
      down:  ['down'],
      left:  ['left'],
      right: ['right']
    })

    this.ecs.addEntity(entity)
  }

  initSystems (ecs) {
    const systems = {
      keyboard: new System.KeyboardSystem(),
      map: new System.MapSystem(this.viewPort),
      physic: new System.PhysicSystem(),
      camera: new System.CameraSystem(this.viewPort),
      render: new System.RenderingSystem(this.viewPort),
    }
    Object.keys(systems).forEach((name) => {
      ecs.addSystem(systems[name])
    })
    return systems
  }

  tick (dt) {
    this.ecs.update(dt)
    this.viewPort.render(this.renderer)
  }

}

