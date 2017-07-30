const Sprite = {
  name: 'sprite',

  getDefaults: () => ({
    namespace: null,
    anchor: { x: 0, y: 0 },
    animationSpeed: 0,
    animationState: null,
    previousAnimationState: null,
  })
}

export default Sprite
