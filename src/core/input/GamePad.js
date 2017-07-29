import CircularBuffer from 'circular-buffer'
import * as gamePad from 'triggers/gamePad'


export default class GamePad {

  constructor (conn) {
    // Can max hold 20 input actions
    this._actionBuffer = new CircularBuffer(20)
    this._state = {}
    this._conn = conn

    this._conn.on('data', (action) => {
      switch (action.type) {
        case gamePad.INPUT:
          this._onInput(action.payload)
          break;
      }
    })
  }

  _onInput (actions) {
    if (Array.isArray(actions)) {
      for (let action of actions) {
        this._actionBuffer.enq(action)
      }
    }
  }

  send (action) {
    this._conn.send(action)
  }

  getState () {
    const state = this._state

    for (let key in state) {
      if (state[key].type === 'button') {
        if (state[key].released) {
          state[key].down = false
        }
        state[key].pressed = false
        state[key].released = false
      }
    }

    while (this._actionBuffer.size()) {
      const { type, value, name } = this._actionBuffer.deq() || {}
      const fname = String(name).toLowerCase()

      if (fname) {
        const action = state[fname] = state[fname] || {}
        switch (action.type = type) {
          case gamePad.Type.JOYSTICK:
            action.value = value
            break
          case gamePad.Type.BUTTON:
            action.down = !!action.down || value
            action.pressed = !!action.pressed || value
            action.released = !!action.released || !value
            break
        }
      }
    }
    return this
  }

  axis (name) {
    const fname = String(name).toLowerCase()
    return (this._state[fname] && this._state[fname].value) || {
      x: 0,
      y: 0,
    }
  }

  down (name) {
    const fname = String(name).toLowerCase()
    return (this._state[fname] && this._state[fname].down) || false
  }

  pressed (name) {
    const fname = String(name).toLowerCase()
    return (this._state[fname] && this._state[fname].pressed) || false
  }

  released (name) {
    const fname = String(name).toLowerCase()
    return (this._state[fname] && this._state[fname].released) || false
  }

}
