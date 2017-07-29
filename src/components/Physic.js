

const Physic = {
  name: 'physic',
  getDefaults: () => ({
    vel: { x: 0, y: 0 },
    cor: { x: 0, y: 0 },
    onGround: false,
    jumpCount: 0,
  })
}

export default Physic

