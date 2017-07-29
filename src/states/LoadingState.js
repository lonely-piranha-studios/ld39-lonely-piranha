import { State } from 'core/state'
import { Sprite } from 'core/gfx'


export default class LoadingState extends State {

  constructor (game) {
    super()

    this.renderer = game.renderer
    this.sprite = new Sprite('/assets/spriteatlas.json')
    this.sprite.onLoad = () => {
      game.states.setState('game')
    }
    game.sprite = this.sprite
  }

  enter () {
    this.sprite.load()
  }
}

