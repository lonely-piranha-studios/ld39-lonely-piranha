import { State } from 'core/state'
import { ViewPort } from 'core/gfx'
import ECS from 'ecs'
import { Container,Text, TextStyle, Graphics } from 'pixi'


export default class GameOverState extends State {
  constructor (game) {
    super()

    this.renderer = game.renderer
    this.container = new Container()

    const background = new Graphics()
    background.beginFill(0x000000)
    background.drawRect(0, 0, game.renderer.width, game.renderer.height)
    this.container.addChild(background)

    this.message = new Text('u ded son', new TextStyle({ fontSize: 168, fill: '#ff0000' }))
    this.message.x = this.renderer.width/2
    this.message.y = this.renderer.height/2
    this.message.width = this.message.width * 50
    this.message.height = this.message.width
    this.message.anchor.x = 0.5
    this.message.anchor.y = 0.5
    this.container.addChild(this.message)
  }

  tick() {
    this.update()
    this.renderer.render(this.container)
  }

  update () {
    if (this.message.scale.x > 1) {
      this.message.scale.x -= this.message.scale.x / 10
      this.message.scale.y = this.message.scale.x
    }
  }
}

