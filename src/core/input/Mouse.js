import CircularBuffer from 'circular-buffer'


const MOUSE_UP   = 1 << 0
const MOUSE_DOWN = 1 << 1
const MOUSE_MOVE = 1 << 2

const Buttons = [
  'left',
  'middle',
  'right',
]

export default class Mouse {

  constructor () {
    this._actionBuffer = new CircularBuffer(20)
    this.position = {
      x: 0, y: 0,
    }
    this._state = {}
    this._bindings = {}

    document.addEventListener('contextmenu', this._onDown.bind(this), false);
    document.addEventListener('mousemove',   this._onMove.bind(this), false);
    document.addEventListener('mousedown',   this._onDown.bind(this), false);
    document.addEventListener('mouseup',     this._onUp.bind(this),   false);
  }

  dispose () {
    document.removeEventListener('contextmenu', this._onDown.bind(this));
    document.removeEventListener('mousemove',   this._onMove.bind(this));
    document.removeEventListener('mousedown',   this._onDown.bind(this));
    document.removeEventListener('mouseup',     this._onUp.bind(this));
  }

  _onMove (e) {
    this._actionBuffer.enq({
      position: {
        x: e.pageX,
        y: e.pageY,
      },
    })
  }

  _onDown (e) {
    if (e.button === 2) {
      e.preventDefault()
    }
    this._actionBuffer.enq({
      button: Buttons[e.button] || e.button,
      value: true,
      position: {
        x: e.pageX,
        y: e.pageY,
      }
    })
  }

  _onUp (e) {
    this._actionBuffer.enq({
      button: Buttons[e.button] || e.button,
      value: false,
      position: {
        x: e.pageX,
        y: e.pageY,
      }
    })
  }

  getState () {
    const state = this._state

    for (let key in state) {
      if (state[key].released) {
        state[key].down = false
      }
      state[key].pressed = false
      state[key].released = false
    }

    while (this._actionBuffer.size()) {
      const { position, button, value } = this._actionBuffer.deq() || {}

      if (position) {
        this.position.x = position.x
        this.position.y = position.y
      }
      if (button) {
        const action = state[button] = state[button] || {}

        action.pressed = !!action.pressed || (!action.down && !!value)
        action.down = !!action.down || !!value
        action.released = !!action.released || !value
      }
    }

    return this
  }

  down (button) {
    const fbutton = String(button).toLowerCase()
    return (this._state[fbutton] && this._state[fbutton].down) || false
  }

  pressed (button) {
    const fbutton = String(button).toLowerCase()
    return (this._state[fbutton] && this._state[fbutton].pressed) || false
  }

  released (button) {
    const fbutton = String(button).toLowerCase()
    return (this._state[fbutton] && this._state[fbutton].released) || false
  }

  get x () {
    return this.position.x
  }

  get y () {
    return this.position.y
  }

}

