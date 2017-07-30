import StateMachine from 'core/state'
import { autoDetectRenderer } from 'pixi'
import State from 'states'
import clamp from 'lodash.clamp'
import MapChunkLoader from 'world/MapChunkLoader'


class Game {

  constructor () {
    this.renderer = autoDetectRenderer({
      width: window.innerWidth,
      height: window.innerHeight,
      transparent: true,
    })

    this.states = new StateMachine()

    this.states.addState('loading', new State.LoadingState(this))
    this.states.addState('splash', new State.SplashState(this))
    this.states.addState('menu', new State.MenuState(this))
    this.states.addState('town', new State.MenuState(this))
    this.states.addState('game', new State.GameState(this))

    this.states.setState('loading')
  }

  setState (state) {
    this.states.setState(state)
  }

  run () {
    if (this.running) return
    this.running = true

    let then = false
    let inv = 60/1000
    const loop = now => {
      if (this.running) requestAnimationFrame(loop)
      if (!then) then = now - 1000/60
      const dt = now - then
      this.tick(clamp(dt * inv, 0, 3))
      then = now
    }
    requestAnimationFrame(loop)
  }

  stop () {
    this.running = false
  }

  tick (dt) {
    this.states.current.tick(dt)
  }

}

window.addEventListener('load', () => {
  const game = new Game()
  game.run()

  document.body.appendChild(game.renderer.view)
})

