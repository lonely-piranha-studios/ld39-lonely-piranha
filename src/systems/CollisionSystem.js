import { System } from 'ecs'
import Collision from 'core/collision'


const tileSize = 16

export default class CollisionSystem extends System {

  constructor (world) {
    super()

    this.world = world
  }

  test (entity) {
    return ['pos', 'shape', 'interaction'].every(comp => entity.components.hasOwnProperty(comp))
  }

  enter (entity) {
    const { interaction, pos, shape } = entity.components

    const collisionShape = new Collision.Rectangle(new Collision.Vector(
      pos.x + interaction.x[0] * tileSize,
      pos.y + interaction.y[0] * tileSize,
    ), new Collision.Vector(
      shape.width,
      shape.height,
    ), [entity.id])

    entity.updateComponent('interaction', {
      collisionShape: this.world.add(collisionShape)
    })
  }

  update (entity) {
    const { interaction, pos } = entity.components

    if (interaction.collisionShape) {
      const collide_with = this.world.pick_object(interaction.collisionShape)

      if (collide_with && interaction.onInteraction) {
        interaction.onInteraction(collide_with)
      }

      interaction.collisionShape.set_position({
        x: interaction.x[0] * tileSize + pos.x,
        y: interaction.y[0] * tileSize + pos.y,
      })
    }
  }

  leave (entity) {
    const { interaction } = entity.components
    this.world.remove(interaction.collisionShape)
  }

}

