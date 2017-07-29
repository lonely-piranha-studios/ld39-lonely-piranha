import ECS from 'ecs'
import { autoDetectRenderer } from 'pixi'
import System from 'systems'
import Component from 'components'


class Game {

  constructor () {
    this.renderer = autoDetectRenderer(800, 600)

    this.ecs = new ECS()
    this.systems = this.initSystems(this.ecs)
  }

  initSystems (ecs) {
    const systems = {
      test: new System.TestSystem(this.renderer),
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
    this.ecs.update(dt)
    this.renderer.clear(0xFFFFFF)
  }

}

window.addEventListener('load', () => {
  const game = new Game()
  game.run()

  document.body.appendChild(game.renderer.view)
})

