import { System } from 'yagl-ecs'


export default class PhysicSystem extends System {

  test (entity) {
    return ['pos', 'physic'].every(comp => !!entity.components[comp])
  }

  update (entity) {
    const { pos, physic } = entity.components
    const { vel } = physic

    pos.x += vel.x
    pos.y += vel.y

    physic.vel.y = Math.min(12, physic.vel.y + 0.5)
  }

}
