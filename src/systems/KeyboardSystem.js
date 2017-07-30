import { System } from 'yagl-ecs'


export default class KeyboardSystem extends System {

  constructor () {
    super()

    this.dirCache = {}
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const theta = Math.atan2(x, y)
        this.dirCache[`${x}${y}`] = {
          x: x === 0 ? 0 : Math.sin(theta),
          y: y === 0 ? 0 : Math.cos(theta),
        }
      }
    }
  }

  test (entity) {
    return ['physic', 'keyboard', 'sprite'].every(comp => !!entity.components[comp])
  }

  update (entity) {
    const { physic, keyboard, sprite } = entity.components
    const input = keyboard.getState()
    const speed = 2

    const dx = input.down('right') - input.down('left')
    const dy = input.down('down') - input.down('up')
    const d = this.dirCache[`${dx}${dy}`]

    sprite.previousAnimationState = sprite.animationState

    sprite.animationState = physic.vel.x === 0 ? sprite.previousAnimationState.split('-')[0] : (physic.vel.x < 0 ? 'west' : 'east')
    sprite.animationState += '-' + ((physic.vel.x === 0 && physic.vel.y === 0) ? 'rest' : 'run')

    sprite.animationState = physic.vel.y === 0 ? sprite.animationState.split('-')[0] : (physic.vel.y < 0 ? 'north' : 'west')
    sprite.animationState += '-' + ((physic.vel.x === 0 && physic.vel.y === 0) ? 'rest' : 'run')

    physic.vel.x = speed * d.x
    physic.vel.y = speed * d.y
  }

}
