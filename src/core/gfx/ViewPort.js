import { Container } from 'pixi'
import lerp from 'lerp'
import clamp from 'lodash.clamp'


export default class ViewPort {

  constructor (renderer, width, height, offset) {
    this.stage = new Container()

    this.renderWidth = renderer.width
    this.renderHeight = renderer.height

    this.position = {
      x: 0,
      y: 0,
    }

    if (width) {
      this.view(width, height, offset)
    }
  }

  get x () {
    return this.position.x
  }

  get y () {
    return this.position.y
  }

  view (width, height, offset) {
    this._width = width
    this._height = height
    this.width = width
    this.height = height

    this.offset = offset || {
      x: 0,
      y: 0,
    }

    this.recalculate()
  }

  moveToCenter (x, y, alpha) {
    this.moveTo(x - this.renderWidth / 2 / this.zoom, y - this.renderHeight / 2 / this.zoom, alpha)
  }

  moveTo (x, y, alpha = 0) {
    if (alpha > 0) {
      this.position.x = lerp(this.position.x, x, alpha)
      this.position.y = lerp(this.position.y, y, alpha)
    } else {
      this.position.x = x
      this.position.y = y
    }

    this.recalculate()
  }

  get zoom () {
    return this.stage.scale.x
  }

  zoomTo (zoom) {
    this._width = this.width * zoom
    this._height = this.height * zoom
    this.stage.scale.x = zoom
    this.stage.scale.y = zoom
  }

  resize (width, height) {
    this.width = width
    this.height = height
  }

  add (obj) {
    this.stage.addChild(obj)
  }

  remove (obj) {
    this.stage.removeChild(obj)
  }

  move (dx, dy) {
    if (dx * dx + dy * dy === 0) return

    this.position.x += dx
    this.position.y += dy

    this.recalculate()
  }

  render (renderer) {
    renderer.render(this.stage)
  }

  recalculate () {
    if (this._width && this._height && false) {
      const min_x = this.offset.x
      const min_y = this.offset.y

      const max_x = this.offset.x + this._width - this.renderWidth
      const max_y = this.offset.y + this._height - this.renderHeight

      this.position.x = clamp(this.position.x, min_x, max_x)
      this.position.y = clamp(this.position.y, min_y, max_y)
    }

    this.stage.x = -this.position.x * this.zoom
    this.stage.y = -this.position.y * this.zoom
  }

}

