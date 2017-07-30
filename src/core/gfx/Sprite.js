import { loader, Texture } from 'pixi'


export default class Sprite {

  constructor (name, path) {
    this.name = name
    this.path = path
  }

  load () {
    loader
      .add(this.name, this.path)
      .load((...args) => {
        const [loader, resources] = args
        this.resource = resources[this.name]
        this.onLoad(...args)
      })
  }

  onLoad () {
    console.log('loaded!')
  }

  getFrameCount (namespace) {
    const namespaceRe = new RegExp(`^${namespace}`)

    return Object
      .keys(this[this.name].textures)
      .filter(key => namespaceRe.test(key))
      .length
  }
  
  getFrameSet (namespace) {
    const frameCount = this.getFrameCount(namespace)

    let frames = []
    for (let i = 0; i < frameCount; i++) {
      const val = i < 10 ? '0' + i : i
      frames.push(Texture.fromFrame(`${namespace}/${val}.png`))
    }

    return frames
  }
}
