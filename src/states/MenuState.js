import { State } from 'core/state'
import { ViewPort } from 'core/gfx'
import ECS from 'ecs'
import { Container } from 'pixi'


export default class GameState extends State {
	constructor (game) {
		super()

		this.renderer = game.renderer

		this.g = new Container()


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

		this.g.addChild(clickHere)
		this.g.addChild(credits)
		this.g.addChild(creditsISPY)

		document.body.onclick = () => {
			game.states.setState('game')
		}
	}

	tick() {
		this.renderer.clear(0x556677)
		this.renderer.render(this.g)

	}
}

