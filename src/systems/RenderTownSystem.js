import { System } from 'ecs'
import { Graphics, Container } from 'pixi'

export default class RenderTownSystem extends System {

	constructor (renderer) {
		super()
		this.renderer = renderer
		this.container = new Container()
	}

	test (entity) {
		//console.log(entity);
		return !!entity.components.option
	}

	enter (entity) {

		const { option } = entity.components
		let label = new PIXI.Text(
			option.label,
			new PIXI.TextStyle(
				{ fontSize: 48, stroke: '#4aff50' }
			)
		)

		label.anchor.x = 0.5
		label.x = this.renderer.width/2
		label.y = option.index*this.renderer.height/5

		//console.log(this.g.addChild);
		//console.log(this.container);
		//console.log(this.renderer.render);

		this.container.addChild(label)
		console.log(this.container);
	}
}