import { System } from 'yagl-ecs'


export default class KeyboardSystem extends System {

  test (entity) {
    return ['physic', 'keyboard', 'sprite'].every(comp => !!entity.components[comp])
  }

  update (entity) {
    const { physic, keyboard, sprite } = entity.components
    const input = keyboard.getState()
    const speed = 3

    sprite.previousAnimationState = sprite.animationState

    physic.vel.x = speed * (input.down('right') - input.down('left'))
    sprite.animationState = physic.vel.x === 0 ? sprite.previousAnimationState.split('-')[0] : (physic.vel.x < 0 ? 'west' : 'east')
    sprite.animationState += '-' + ((physic.vel.x === 0 && physic.vel.y === 0) ? 'rest' : 'run')

    physic.vel.y = speed * (input.down('down') - input.down('up'))
    sprite.animationState = physic.vel.y === 0 ? sprite.animationState.split('-')[0] : (physic.vel.y < 0 ? 'north' : 'south')
    sprite.animationState += '-' + ((physic.vel.x === 0 && physic.vel.y === 0) ? 'rest' : 'run')
  }

}
