import { State } from 'core/state'
import { ViewPort } from 'core/gfx'
import ECS from 'ecs'
import { Container, Text, TextStyle, Graphics } from 'pixi'


export default class GameOverState extends State {
  constructor (game) {
    super()

    this.game = game
    this.renderer = game.renderer

    this.container = new Container()

    const background = new Graphics()
    background.beginFill(0x000000)
    background.drawRect(0, 0, game.renderer.width, game.renderer.height)
    this.container.addChild(background)

    const message = new Text('u ded son', new TextStyle({ fontSize: 48, fill: '#ff0000' }))
    message.x = this.renderer.width/2
    message.y = this.renderer.height/2
    message.anchor.x = 0.5
    this.container.addChild(message)
  }

  tick() {
    this.update()
    this.renderer.render(this.container)
  }

  update () {
  }
}

