export const INPUT = '@gamePad/input'
export const Type = {
  JOYSTICK: 1 << 0,
  BUTTON: 1 << 1,
}


export const input = state => ({
  type: INPUT,
  payload: state,
})

