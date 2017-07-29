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
    return ['pos', 'shape'].every(comp => entity.components.hasOwnProperty(comp))
  }

  enter (entity) {
    const { pos, shape } = entity.components

    const g = new AnimatedSprite(this.sprite.getFrameSet('character/run-east', 4))
    g.x = pos.x
    g.y = pos.y
    g.anchor.set(0.5);
    g.animationSpeed = 0.1;
    g.play()

    entity.updateComponent('shape', {
      graphic: g
    })

    this.viewPort.add(g)
  }

  exit (entity) {
    const { shape } = entity.components
    this.viewPort.remove(shape.graphic)
    shape.graphic = undefined
  }

  update (entity) {
    const { pos, shape } = entity.components
    shape.graphic.x = pos.x
    shape.graphic.y = pos.y
  }

}

