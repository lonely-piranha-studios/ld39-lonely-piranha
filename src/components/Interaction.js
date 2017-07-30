

const Interaction = {
  name: 'interaction',

  getDefaults: () => ({
    x: [0, 0],
    y: [0, 0],
    action: () => {
      console.log('TRIGGERED')
    },
  })
}

export default Interaction
