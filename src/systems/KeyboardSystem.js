import { System } from 'yagl-ecs'


export default class KeyboardSystem extends System {

  test (entity) {
    return ['physic', 'keyboard', 'shape'].every(comp => !!entity.components[comp])
  }

  update (entity) {
    const { physic, keyboard, shape } = entity.components
    const input = keyboard.getState()
    const speed = 3

    shape.previousFacingDirection = shape.facingDirection
    physic.vel.x = speed * (input.down('right') - input.down('left'))
    shape.facingDirection = physic.vel.x === 0 ? shape.facingDirection : (physic.vel.x < 0 ? 'west' : 'east')
    physic.vel.y = speed * (input.down('down') - input.down('up'))
    shape.facingDirection = physic.vel.y === 0 ? shape.facingDirection : (physic.vel.y < 0 ? 'north' : 'south')
  }

}
