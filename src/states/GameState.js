import ECS from 'ecs'
import { autoDetectRenderer } from 'pixi'

import { Keyboard } from 'core/input'
import { ViewPort, TileSet } from 'core/gfx'
import { State } from 'core/state'
import Collision from 'core/collision'

import System from 'systems'
import Component from 'components'
import MapGenerator from 'world/MapGenerator'

import mapList from 'assets/maps.json'

export default class GameState extends State {

  constructor (game) {
    super()

    this.renderer = game.renderer
    this.viewPort = new ViewPort(this.renderer)
    this.sprite = game.sprite
    this.states = game.states
    this.mapGenerator = new MapGenerator()
  }

  enter () {
    this.ecs = new ECS()
    this.world = new Collision.World({ grid_size: 500 })
    this.systems = this.initSystems(this.ecs)

    const map = this.mapGenerator.createMap({
      ecs: this.ecs,
      debug: true,
      tileset: new TileSet('tilesets/dungeon.png', this.sprite.resource.textures),
      rooms: Object.values(mapList.maps)
    });
    this.viewPort.view(map.width * map.tileSize, map.height * map.tileSize)
    this.viewPort.zoomTo(4)
    this.systems.map.setMap(map)
    this.map = map

    const entity = new ECS.Entity(null, [
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

  initSystems (ecs) {
    const systems = {
      keyboard: new System.KeyboardSystem(),
      map: new System.MapSystem(this.viewPort),
      physic: new System.PhysicSystem(),
      camera: new System.CameraSystem(this.viewPort),
      render: new System.RenderingSystem(this.viewPort, this.sprite),
      gui: new System.GUIRenderSystem(this.renderer, this.viewPort),
      collision: new System.CollisionSystem(this.world),
      interact: new System.InteractSystem(this.viewPort, this.world),
      fuel: new System.FuelSystem(this.states)
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

