import { loader, Texture } from 'pixi'


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
  
  getFrameSet (namespace, count) {
    let frames = []
    for (let i = 0; i < count; i++) {
      const val = i < 10 ? '0' + i : i
      frames.push(Texture.fromFrame(`${namespace}/${val}.png`))
    }

    return frames
  }
}
