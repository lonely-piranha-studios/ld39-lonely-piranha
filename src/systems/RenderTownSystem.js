import { System } from 'ecs'
import { Graphics, Container } from 'pixi'
import { Mouse } from 'core/input'

export default class RenderTownSystem extends System {

	constructor (renderer) {
		super()
		this.renderer = renderer
		this.container = new Container()
		this.focused = 1

		let g = new Graphics()

		g.beginFill(0x987654)
		g.drawRect(0,0,renderer.width,renderer.height)

		this.container.addChild(g)

		this.mouse = new Mouse()

	}

	dispose () {
		this.mouse.dispose()
		this.mouse = undefined
	}

	test (entity) {
		return !!entity.components.option
	}

	enter (entity) {
		const { option } = entity.components
		const color = option.index === this.focused ? 0x70ff90 : 0x000000
		const style = new PIXI.TextStyle({fill: color})
		let label = new PIXI.Text(
			option.label,
			style
		)

		label.anchor.x = 0.5
		label.x = this.renderer.width/2
		label.y = option.index*this.renderer.height/5
		label.interactive = true
		label.buttonMode = true

		label.mouseover = () => {
			this.focused = option.index
		}
		label.click = option.effect

		this.container.addChild(label)

		entity.updateComponent('option', { graphic: label })
	}

	preUpdate () {
		this.input = this.mouse.getState()
	}

	update (entity) {

		const { option } = entity.components

		const color = option.index === this.focused ? 0x70ff90 : 0x000000
		const style = new PIXI.TextStyle({fill: color})

		option.graphic.style = style
	}
}