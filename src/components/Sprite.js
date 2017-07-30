const Sprite = {
  name: 'sprite',

  getDefaults: () => ({
    namespace: null,
    anchor: { x: 0, y: 0 },
    speed: 0,
    animationState: 'east-rest',
    previousAnimationState: 'east-rest',
  })
}

export default Sprite
