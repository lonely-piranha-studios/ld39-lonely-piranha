const Sprite = {
  name: 'sprite',

  getDefaults: () => ({
    animationStateFrames: {
      rest: 1,
      run: 4,
    },
    animationState: 'rest-east',
    previousAnimationState: 'rest-east',
  })
}

export default Sprite
