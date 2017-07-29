import { System } from 'yagl-ecs'


export default class KeyboardSystem extends System {

  test (entity) {
    return ['physic', 'keyboard'].every(comp => !!entity.components[comp])
  }

  update (entity) {
    const { physic, keyboard } = entity.components
    const input = keyboard.getState()
    const speed = 3
    const jump = 12

    if (physic.onGround) {
      physic.jumpCount = 0
    }
    if (input.pressed('up') && physic.onGround) {
      physic.vel.y = -jump
      physic.jumpCount++
    }
    if (input.released('up') && physic.vel.y < -jump/2) {
      physic.vel.y = -jump/2
    }
    if (input.pressed('up') && !physic.onGround && physic.jumpCount < 2) {
      physic.vel.y = -jump
      physic.jumpCount++
    }

    physic.vel.x = speed * (input.down('right') - input.down('left'))
    //physic.vel.y = speed * (input.down('down') - input.down('up'))
  }

}
