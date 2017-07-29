import { loader, Texture, utils } from 'pixi'


export default class Sprite {

  constructor (path) {
    this.path = path
  }

  load () {
    loader
      .add(this.path)
      .load(() => this.onLoad())
  }

  onLoad () {
    console.log('loaded!')
  }

  getFrameCount (namespace) {
    const namespaceRe = new RegExp(`^${namespace}`)

    return Object
      .keys(utils.TextureCache)
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
