import { System } from 'ecs'
import { Graphics } from 'pixi'


export default class TestSystem extends System {

  constructor (viewPort) {
    super()

    const g = this.graphic = new Graphics()

    g.beginFill(0xff0000)
    g.drawRect(150, 150, 300, 300)

    viewPort.add(g)
  }

}
