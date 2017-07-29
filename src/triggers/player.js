export const CONNECT = '@player/connect'
export const INPUT = '@player/input'


export const connect = id => ({
  type: CONNECT,
  payload: {
    id: id,
  },
})

