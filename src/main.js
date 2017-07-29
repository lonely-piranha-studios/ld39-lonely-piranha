import ECS from 'ecs'
import { autoDetectRenderer, Container } from 'pixi'
import { Keyboard } from 'core/input'
import { ViewPort } from 'core/gfx'
import System from 'systems'
import Component from 'components'
import Map from 'world/Map'


class Game {

  constructor () {
    this.renderer = autoDetectRenderer({
      width: 800,
      height: 600,
    })
    const map = new Map(require('assets/maps.json').maps[0])
    this.viewPort = new ViewPort(this.renderer, map.width * map.tileSize, map.height * map.tileSize)

    this.viewPort.add(map.texture)

    this.ecs = new ECS()
    this.systems = this.initSystems(this.ecs)

    this.keyboard = new Keyboard({
      up:    ['up'],
      down:  ['down'],
      left:  ['left'],
      right: ['right']
    })
  }

  initSystems (ecs) {
    const systems = {
      keyboard: new System.KeyboardSystem(this.renderer),
      physic: new System.PhysicSystem(this.renderer),
    }
    Object.keys(systems).forEach((name) => {
      ecs.addSystem(systems[name])
    })
    return systems
  }

  run () {
    if (this.running) return
    this.running = true

    let then = performance.now()
    const loop = now => {
      if (this.running) requestAnimationFrame(loop)
      this.tick(now - then)
      then = now
    }
    requestAnimationFrame(loop)
  }

  tick (dt) {
    const input = this.keyboard.getState()
    const speed = 3
    const dx = speed * (input.down('right') - input.down('left'))
    const dy = speed * (input.down('down') - input.down('up'))

    this.viewPort.move(dx, dy)

    this.ecs.update(dt)
    this.viewPort.render(this.renderer)
  }

}

window.addEventListener('load', () => {
  const game = new Game()
  game.run()

  document.body.appendChild(game.renderer.view)
})

