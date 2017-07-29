import { System } from 'ecs'
import { Container } from 'pixi'


export default class MapSystem extends System {

  constructor (viewPort) {
    super()
    this.stage = new Container()
    this.map = null

    viewPort.add(this.stage)
  }

  setMap (map) {
    if (this.map) {
      this.stage.removeChild(this.map.texture)
      this.map.dispose()
    }
    this.map = map
    this.stage.addChild(this.map.texture)
  }

  test (entity) {
    return ['pos', 'physic', 'shape'].every(comp => entity.components.hasOwnProperty(comp))
  }

  update (entity) {
    const { pos, physic, shape } = entity.components

    if (!this.map) return

    const aabb = [pos.x, pos.y, shape.width, shape.height]
    const offset = this.map.collide(aabb, physic.vel)

    if (offset) {
      physic.vel.x = offset[0]
      physic.vel.y = offset[1]
    }
  }

}

