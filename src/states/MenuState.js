import { State } from 'core/state'
import { ViewPort } from 'core/gfx'
import { Mouse } from 'core/input'
import ECS from 'ecs'
import { Container, Graphics } from 'pixi'


export default class GameState extends State {
  constructor (game) {
    super()

    this.game = game
    this.renderer = game.renderer

    this.container = new Container()

    const clickHere = new PIXI.Text('Click to Start Game!', new PIXI.TextStyle({fontSize: 48, stroke: '#4aff50', fill: ['#ff00ff', '#00ff99']}))
    clickHere.x = this.renderer.width/2
    clickHere.y = this.renderer.height/3

    clickHere.anchor.x = 0.5

    const credits = new PIXI.Text('Credits:\nTroy Erem\nAiman Josefsson\nJonathan Nguyen\nLinus Wahlgren\nMax Wihlborg')
    credits.x = this.renderer.width/2
    credits.y = this.renderer.height/2
    credits.anchor.x = 0.5

    const creditsISPY = new PIXI.Text('Special thanks to ISPY GROUP for letting us hack at their office!')
    creditsISPY.x = this.renderer.width/2
    creditsISPY.y = 9*this.renderer.height/10
    creditsISPY.anchor.x = 0.5

    const g = new Graphics()
    g.beginFill(0x556677)
    g.drawRect(0, 0, game.renderer.width, game.renderer.height)

    this.container.addChild(g)
    this.container.addChild(clickHere)
    this.container.addChild(credits)
    this.container.addChild(creditsISPY)
  }

  enter () {
    this.mouse = new Mouse()
  }

  exit () {
    this.mouse.dispose()
    this.mouse = undefined
  }

  tick() {
    this.update()
    this.renderer.render(this.container)
  }

  update () {
    const mouse = this.mouse.getState()

    if (mouse.pressed('left')) {
      this.game.setState('loading')
    }
  }
}

