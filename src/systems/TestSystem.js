import { System } from 'ecs'
import { Graphics } from 'pixi'


export default class TestSystem extends System {

  constructor (renderer) {
    super()
    this.renderer = renderer

    const g = this.graphic = new Graphics()

    g.beginFill(0xff0000)
    g.drawRect(10, 10, 300, 300)
  }

  preUpdate () {
    this.renderer.render(this.graphic)
  }

}
