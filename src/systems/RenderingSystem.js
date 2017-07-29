import { System } from 'ecs'
import { Graphics, extras } from 'pixi'
const { AnimatedSprite } = extras


export default class RenderingSystem extends System {

  constructor (viewPort, sprite) {
    super()
    this.viewPort = viewPort
    this.sprite = sprite
  }

  test (entity) {
    return ['pos', 'sprite'].every(comp => entity.components.hasOwnProperty(comp))
  }

  enter (entity) {
    const { pos, sprite } = entity.components

    const textures = this.sprite.getFrameSet(`character/run-${sprite.facingDirection}`, 4)
    const g = new AnimatedSprite(textures)
    g.x = pos.x
    g.y = pos.y
    g.anchor.set(0, 0.5);
    g.animationSpeed = 0.1;
    g.play()

    entity.updateComponent('sprite', {
      graphic: g
    })

    this.viewPort.add(g)
  }

  exit (entity) {
    const { sprite } = entity.components
    this.viewPort.remove(sprite.graphic)
    sprite.graphic = undefined
  }

  update (entity) {
    const { pos, sprite } = entity.components
    sprite.graphic.x = pos.x
    sprite.graphic.y = pos.y
    if (sprite.facingDirection !== sprite.previousFacingDirection) {
      const textures = this.sprite.getFrameSet(`character/run-${sprite.facingDirection}`, 4)
      sprite.graphic.textures = textures
      sprite.graphic.play()
    }
  }

}

