import { System } from 'ecs'
import { Graphics } from 'pixi'


export default class RenderingSystem extends System {

  constructor (viewPort) {
    super()
    this.viewPort = viewPort
  }

  test (entity) {
    return ['pos', 'shape'].every(comp => entity.components.hasOwnProperty(comp))
  }

  enter (entity) {
    const { pos, shape } = entity.components

    const g = new Graphics()
    g.beginFill(0x00ffff)
    g.drawRect(0, 0, shape.width, shape.height)
    g.x = pos.x
    g.y = pos.y

    entity.updateComponent('shape', {
      graphic: g
    })

    this.viewPort.add(g)
  }

  exit (entity) {
    const { shape } = entity.components
    this.viewPort.remove(shape.graphic)
    shape.graphic = undefined
  }

  update (entity) {
    const { pos, shape } = entity.components
    shape.graphic.x = pos.x
    shape.graphic.y = pos.y
  }

}

