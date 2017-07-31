import ECS from 'ecs'
import { Container, Graphics, Text, TextStyle } from 'pixi'
import { State } from 'core/state'
import { ViewPort, Sprite, TileSet } from 'core/gfx'
import Collision from 'core/collision'

import MapGenerator from 'world/MapGenerator'
import mapList from 'assets/maps.json'
import System from 'systems'
import GameState from './GameState.js'


export default class LoadingState extends State {

  constructor (game) {
    super()

    this.initialized = false
    game.ecs = new ECS()
    game.viewPort = this.viewPort = new ViewPort(game.renderer)
    game.sprite = this.sprite = new Sprite('atlas', '/assets/spriteatlas.json')
    game.sprite.onLoad = () => {
      this.world = new Collision.World({ grid_size: 500 })
      game.systems = this.initSystems(game.ecs)

      const map = new MapGenerator().createMap({
        ecs: game.ecs,
        states: game.states,
        debug: true,
        tileset: new TileSet('tilesets/dungeon.png', game.sprite.resource.textures),
        rooms: Object.values(mapList.maps)
      })
      game.viewPort.view(map.width * map.tileSize, map.height * map.tileSize)
      game.viewPort.zoomTo(4)
      game.systems.map.setMap(map)
      // SMELL: tried doing some asynchronous promise stuff but got too tired.
      // this setTimeout seems to have magically solved it though???
      setTimeout(() => {
        this.initialized = true
        game.states.addState('game', new GameState(game))
        game.states.setState('game')
      }, 0)
    }


    this.states = game.states
    this.renderer = game.renderer
    this.container = new Container()

    const background = new Graphics()
    background.beginFill(0x000000)
    background.drawRect(0, 0, game.renderer.width, game.renderer.height)
    this.container.addChild(background)

    this.message = new Text('Loading...', new TextStyle({ fontSize: 48, fill: '#fff' }))
    this.message.x = this.renderer.width/2
    this.message.y = this.renderer.height/2
    this.message.anchor.x = 0.5
    this.message.anchor.y = 0.5
    this.container.addChild(this.message)
  }

  enter () {
    if (this.initialized) {
      console.log('switching to game state')
      return this.states.setState('game')
    }
    this.sprite.load()
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

  tick() {
    this.update()
    this.renderer.render(this.container)
  }

  update () {
  }
}

