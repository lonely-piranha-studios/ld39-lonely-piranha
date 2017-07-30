import ECS from 'ecs'
import { autoDetectRenderer } from 'pixi'

import { Keyboard } from 'core/input'
import { ViewPort } from 'core/gfx'
import { State } from 'core/state'

import System from 'systems'
import Component from 'components'

export default class TownState extends State {

	constructor (game) {
		super()

		this.renderer = game.renderer
		this.viewPort = new ViewPort(this.renderer)

		this.states = game.states
	}

	enter () {

		this.ecs = new ECS()
		this.systems = this.initSystems(this.ecs)
		this.viewPort.add(this.systems.town.container)

		let option1 = new ECS.Entity(null, [Component.TownOption])
		option1.updateComponents({
			option: {
				label: "Recharge",
				index: 1,
				effect: () => {console.log('You go girl!')}
			}
		})

		const option2 = new ECS.Entity(null, [Component.TownOption])
		option2.updateComponents({
			option: {
				label: "Buy something",
				index: 2,
				effect: () => {console.log('Buy something')}
			}
		})

		const option3 = new ECS.Entity(null, [Component.TownOption])
		option3.updateComponents({
			option: {
				label: "Explore Dungeon",
				index: 3,
				effect: () => {this.states.setState('loading')}
			}
		})

		this.ecs.addEntity(option1)
		this.ecs.addEntity(option2)
		this.ecs.addEntity(option3)

		

		//this.renderer.beginFill(0x123456)
		//this.drawRect(100,100,100,100)
	}

	initSystems (ecs) {
    const systems = {
    	town: new System.RenderTownSystem(this.renderer)
    }
    Object.keys(systems).forEach((name) => {
      ecs.addSystem(systems[name])
    })
    return systems
  }

  tick (dt) {
    this.ecs.update(dt)
    this.viewPort.render(this.renderer)
  }
}