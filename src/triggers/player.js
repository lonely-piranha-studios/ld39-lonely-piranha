export const CONNECT = '@player/connect'
export const RECHARGE = '@player/recharge'
export const INPUT = '@player/input'


const initialState = {
  power: 200,
}

export default function player (state = initialState, action) {
  switch (action.type) {
    case RECHARGE:
      return Object.assign({}, state, {
        power: action.payload,
      })

    default:
      return state
  }
}

export const recharge = power => ({
  type: RECHARGE,
  paylod: power
})

export const connect = id => ({
  type: CONNECT,
  payload: {
    id: id,
  },
})

