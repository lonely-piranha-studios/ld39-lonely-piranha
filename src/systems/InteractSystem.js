import { System } from 'yagl-ecs'
import { Graphics } from 'pixi'

const tileSize = 16

export default class InteractSystem extends System {

  constructor (viewPort) {
    super()
    this.viewPort = viewPort
  }
  
  test (entity) {
    return ['pos', 'shape', 'interaction'].every(comp => !!entity.components[comp])
  }

  enter (entity) {
    const { pos, shape, interaction } = entity.components
    this.hitBox = {
      x1: pos.x + interaction.x[0] * tileSize,
      y1: pos.y + interaction.y[0] * tileSize,

      x2: pos.x + shape.width + interaction.x[1] * tileSize,
      y2: pos.y + shape.height + interaction.y[1] * tileSize,
    }

    // draw hitbox for debugging purposes
    const { x1, y1, x2, y2 } = this.hitBox
    const g = new Graphics()
    g.beginFill(0xFF0000, 0.1)
    g.drawRect(x1, y1, (x2 - x1), (y2 - y1))
    g.endFill()
    this.viewPort.add(g)
  }

  update (entity) {

  }

}
