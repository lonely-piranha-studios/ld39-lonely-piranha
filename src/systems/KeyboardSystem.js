import { System } from 'yagl-ecs'


export default class KeyboardSystem extends System {

  test (entity) {
    return ['physic', 'keyboard', 'sprite'].every(comp => !!entity.components[comp])
  }

  update (entity) {
    const { physic, keyboard, sprite } = entity.components
    const input = keyboard.getState()
    const speed = 3

    sprite.previousFacingDirection = sprite.facingDirection
    physic.vel.x = speed * (input.down('right') - input.down('left'))
    sprite.facingDirection = physic.vel.x === 0 ? sprite.facingDirection : (physic.vel.x < 0 ? 'west' : 'east')
    physic.vel.y = speed * (input.down('down') - input.down('up'))
    sprite.facingDirection = physic.vel.y === 0 ? sprite.facingDirection : (physic.vel.y < 0 ? 'north' : 'south')
  }

}
