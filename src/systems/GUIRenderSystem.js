import { System } from 'yagl-ecs'
import { Graphics, Text, TextStyle, Container } from 'pixi.js'

export default class GUIRenderSystem extends System {
  constructor (renderer, viewPort) {
    super()
    this.renderer = renderer
    this.viewPort = viewPort
    this.height = 20
    this.x = 20
    this.y = 20
    this.fuelBarScale = 3
    this.fuelColor = 0x44ff44
    this.borderColor = 0x000000

    this.backgroundGraphic = new Graphics()
    this.foregroundGraphic = new Graphics()
    this.moneyLabel = new Text('$0', new TextStyle({ fontFamily: 'Arial' }))
  }

  test (entity) {
    return ['bar', 'money'].every(comp => entity.components.hasOwnProperty(comp))
  }

  renderFuelBar (maxValue, currentValue) {
    const bg = this.backgroundGraphic
    const fg = this.foregroundGraphic
    const x = this.x + this.viewPort.position.x * this.viewPort.zoom
    const y = this.y + this.viewPort.position.y * this.viewPort.zoom
    const max = maxValue * this.fuelBarScale
    const current = currentValue * this.fuelBarScale

    bg.clear()
    bg.beginFill(this.fuelColor)
    bg.drawRoundedRect(x, y, max, this.height, 5)
    bg.endFill()
    bg.beginFill(0xffffff, 0.9)
    bg.drawRect(x + current, y, max - current - 2, this.height)
    bg.endFill()

    fg.clear()
    fg.lineStyle(4, this.borderColor)
    fg.drawRoundedRect(x, y, max, this.height, 5)
  }

  renderMoneyCounter (amount) {
    this.moneyLabel.text = `$${amount}`
    this.moneyLabel.x = this.x + this.viewPort.position.x * this.viewPort.zoom
    this.moneyLabel.y = this.y * 2.5 + this.viewPort.position.y * this.viewPort.zoom
  }

  enter (entity) {
    const { maxValue, currentValue } = entity.components.bar
    this.renderFuelBar(maxValue, currentValue)
    this.renderMoneyCounter(entity.components.money.amount)

    this.stage = new Container()
    this.stage.addChild(this.backgroundGraphic)
    this.stage.addChild(this.foregroundGraphic)
    this.stage.addChild(this.moneyLabel)
    this.stage.scale.x = this.stage.scale.x/this.viewPort.zoom
    this.stage.scale.y = this.stage.scale.y/this.viewPort.zoom

    this.viewPort.add(this.stage)
  }

  update (entity) {
    const { maxValue, currentValue } = entity.components.bar
    const { amount } = entity.components.money
    this.renderFuelBar(maxValue, currentValue)
    this.renderMoneyCounter(amount)
  }
}
