import CircularBuffer from 'circular-buffer'
import keycode from 'keycode'


export default class Keyboard {

  constructor (actions) {
    // Can max hold 20 input actions
    this._actionBuffer = new CircularBuffer(20)
    this._state = {}
    this._bindings = {}

    if (actions) {
      this.bindActions(actions)
    }

    document.addEventListener('keydown', this._onKeyDown.bind(this), false)
    document.addEventListener('keyup',   this._onKeyUp.bind(this),   false)
  }

  dispose () {
    document.removeEventListener('keydown', this._onKeyDown.bind(this))
    document.removeEventListener('keyup',   this._onKeyUp.bind(this))
  }

  _onKeyDown (evt) {
    this._actionBuffer.enq({
      code: evt.keyCode,
      value: true,
    })
  }

  _onKeyUp (evt) {
    this._actionBuffer.enq({
      code: evt.keyCode,
      value: false,
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
      const { code, value } = this._actionBuffer.deq() || {}
      const fname = this._bindings[code]

      if (fname) {
        const action = state[fname] = state[fname] || {}
        action.pressed = !!action.pressed || (!action.down && value)
        action.down = !!action.down || value
        action.released = !!action.released || !value
      }
    }

    return this
  }

  bindAction (action, names) {
    if (String(action) === '[object Object]' && !names) {
      for (const key in action) {
        this.bindAction(key, action[key])
      }
    } else {
      const faction = String(action).toLowerCase()
      const fnames = Array.isArray(names) ? names : [names]
      for (let i = 0; i < fnames.length; i++) {
        const name = fnames[i]
        const keyCode = typeof name === 'number'
          ? name
          : keycode(name)
        if (keyCode) {
          this._bindings[keyCode] = faction
        }
      }
    }
    return this
  }

  bindActions (actions) {
    return this.bindAction(actions)
  }

  down (action) {
    const faction = String(action).toLowerCase()
    return (this._state[faction] && this._state[faction].down) || false
  }

  pressed (action) {
    const faction = String(action).toLowerCase()
    return (this._state[faction] && this._state[faction].pressed) || false
  }

  released (action) {
    const faction = String(action).toLowerCase()
    return (this._state[faction] && this._state[faction].released) || false
  }

}

