import ECS from 'ecs'
import { Application } from 'pixi'


class Game {

  constructor () {
    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xFFFFFF,
    })

    this.ecs = new ECS()

    this.initSystems()

    this.app.ticker.add(dt => {
      this.tick(dt)
    })
  }

  initSystems () {
  }

  tick (dt) {
    this.ecs.update(dt)
  }

}

window.addEventListener('load', () => {
  const game = new Game()
  document.body.appendChild(game.app.view)
})

