

export default class StateMachine {

  constructor () {
    this._states = {}
    this._nextState = false
    this._current = null
  }

  addState (name, state) {
    this._states[name] = state
    if (!this._nextState) {
      this._nextState = state
    }
  }

  setState (name) {
    this.nextState = name
  }

  get current () {
    if (this._nextState) {
      if (this._current) this._current.exit()
      this._current = this._states[this.nextState]
      this._current.enter()
      this._nextState = false
    }
    return this._current
  }

}
