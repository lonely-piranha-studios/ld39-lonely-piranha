const gulp = require('gulp')
const spritesmith = require('gulp.spritesmith')


const texturePackerTemplate = (params) => {
  const items = params.items
  const itemObj = { frames: {} }
  const frames = itemObj.frames

  if (items.length > 0) {
    const item = items[0];
    itemObj.meta = {
      app: "https://github.com/Ensighten/spritesmith",
      image: item.image,
      format: 'RGBA8888',
      size: {
        w: item.total_width,
        h: item.total_height
      },
      scale: 1
    };
  }

  items.forEach((item) => {
    // SMELL but yeah
    const path = item.source_image.split('sprites/')[1]

    frames[path] = {
      frame: {
        x: item.x,
        y: item.y,
        w: item.width,
        h: item.height
      },
      rotated: false,
      trimmed: false,
      spriteSourceSize: {
        x: 0,
        y: 0,
        w: item.width,
        h: item.height
      },
      sourceSize: {
        w: item.width,
        h: item.height
      }
    };
  });

  return JSON.stringify(itemObj, null, 4);
}



gulp.task('spriteatlas', () => {
  return gulp
    .src(`./src/sprites/**/*.png`)
    .pipe(spritesmith({
      imgName: `spriteatlas.png`,
      cssName: `spriteatlas.json`,
      algorithm: 'binary-tree',
      cssTemplate: texturePackerTemplate,
      padding: 2,
    }))
    .pipe(gulp.dest('./dist/assets/'))
})

gulp.task('default', ['spriteatlas'])
