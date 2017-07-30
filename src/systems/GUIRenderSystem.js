import { System } from 'yagl-ecs'
import { Graphics, Container } from 'pixi.js'

export default class GUIRenderSystem extends System {
  constructor (renderer, viewPort) {
    super()
    this.renderer = renderer
    this.viewPort = viewPort
    this.height = 20
    this.x = 20
    this.y = 20
    this.fuelColor = 0x44ff44
    this.borderColor = 0x000000
  }

  test (entity) {
    return !!entity.components.bar && !!entity.components.money	
  }

  enter (entity) {
    const backgroundGraphic = new Graphics() //new this.renderer.Graphics()

    const { maxValue, currentValue } = entity.components.bar

    backgroundGraphic.beginFill(this.fuelColor)
    backgroundGraphic.drawRoundedRect(this.x,this.y,maxValue,this.height,8)
    backgroundGraphic.beginFill(0xffffff,0.9)
    backgroundGraphic.drawRect(this.x+currentValue,this.y,maxValue-currentValue-2,this.height)
    backgroundGraphic.endFill()

    const foregroundGraphic = new Graphics()

    foregroundGraphic.lineStyle(4, this.borderColor)
    foregroundGraphic.drawRoundedRect(this.x,this.y,maxValue,this.height,8)

    const text = new Graphics()

    let moneyLabel = new PIXI.Text(`€${entity.components.money.amount}`, new PIXI.TextStyle({ fontFamily: 'Arial' }))
    moneyLabel.x = 20
    moneyLabel.y = 40

    entity.updateComponent('bar', {
      backgroundGraphic: backgroundGraphic,
      foregroundGraphic: foregroundGraphic
    })

    entity.updateComponent('money', {
      moneyLabel
    })

    this.stage = new Container()
    this.stage.addChild(backgroundGraphic)
    this.stage.addChild(foregroundGraphic)
    this.stage.addChild(moneyLabel)
    this.stage.scale.x = 1/this.viewPort.zoom
    this.stage.scale.y = 1/this.viewPort.zoom

    this.viewPort.add(this.stage)
  }

  update (entity) {
    const { backgroundGraphic, foregroundGraphic } = entity.components.bar

    backgroundGraphic.clear()

    const { maxValue, currentValue } = entity.components.bar

    backgroundGraphic.beginFill(this.fuelColor)
    backgroundGraphic.drawRoundedRect(this.x + this.viewPort.position.x,this.y + this.viewPort.position.y,maxValue,this.height,8)
    backgroundGraphic.beginFill(0xffffff,0.9)
    backgroundGraphic.drawRect(this.x+currentValue + this.viewPort.position.x,this.y + this.viewPort.position.y,maxValue-currentValue-2,this.height)
    backgroundGraphic.endFill()

    foregroundGraphic.clear()

    foregroundGraphic.lineStyle(4, this.borderColor)
    foregroundGraphic.drawRoundedRect(this.x + this.viewPort.position.x,this.y + this.viewPort.position.y,maxValue,this.height,8)

    let { moneyLabel } = entity.components.money

    moneyLabel.x = 20 + this.viewPort.position.x * this.viewPort.zoom
    moneyLabel.y = 40 + this.viewPort.position.y * this.viewPort.zoom

    moneyLabel.text = `€${entity.components.money.amount}`

  }
}
