import { System } from 'ecs'


export default class CameraSystem extends System {

  constructor (viewPort) {
    super()
    this.viewPort = viewPort
  }

  test (entity) {
    return ['pos', 'camera'].every(comp => entity.components.hasOwnProperty(comp))
  }

  update (entity) {
    const { pos, camera } = entity.components

    if (camera.follow) {
      this.viewPort.moveToCenter(pos.x, pos.y, camera.alpha)
    }
  }

}

