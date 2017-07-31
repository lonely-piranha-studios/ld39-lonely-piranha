import { System } from 'yagl-ecs'


export default class FuelSystem extends System {

  constructor (states) {
    super()
    this.states = states
  }

  test (entity) {
    return ['bar'].every(comp => !!entity.components[comp])
  }

  update (entity) {
    const { currentValue } = entity.components.bar

    if (currentValue === 0) {
      this.states.setState('gameover')
    }
  }

}
