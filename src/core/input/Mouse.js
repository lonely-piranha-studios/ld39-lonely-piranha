import CircularBuffer from 'circular-buffer'


const MOUSE_UP   = 1 << 0
const MOUSE_DOWN = 1 << 1
const MOUSE_MOVE = 1 << 2

export default class Mouse {

  constructor (actions) {
    this._actionBuffer = new CircularBuffer(20)
    this._state = {
      position: {
        x: 0, y: 0,
      },
    }
    this._bindings = {}

    if (actions) {
      this.bindActions(actions)
    }

    document.addEventListener('contextmenu', this._onDown.bind(this), false);
    document.addEventListener('mousemove',   this._onMove.bind(this), false);
    document.addEventListener('mousedown',   this._onDown.bind(this), false);
    document.addEventListener('mouseup',     this._onUp.bind(this),   false);
  }

  _onMove (e) {
    this._actionBuffer.enq({
      type: MOUSE_MOVE,
      value: {
        x: e.pageX,
        y: e.pageY,
      },
    })
  }

  _onDown (e) {
    this._actionBuffer.enq({
      type: MOUSE_DOWN,
      value: e.button,
    })
  }

  _onUp (e) {
    this._actionBuffer.enq({
      type: MOUSE_UP,
      value: e.button,
    })
  }

  getState () {
    const state = this._state

    while (this._actionBuffer.size()) {
      const { type, value } = this._actionBuffer.deq() || {}
    }
  }

  bindAction (action, button) {
    return this
  }

  bindActions (actions) {
    return this.bindAction(actions)
  }

  down () {
  }

  pressed () {
  }

  released () {
  }

}

