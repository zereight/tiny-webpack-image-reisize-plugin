const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");
const imageminGif2Webp = require("imagemin-gif2webp");

class WebpConvertPlugin {
  constructor({}) {}

  apply(compiler) {
    const onEmit = (compilation, callback) => {
      console.log(compilation.getAssets());
      let assertNames = Object.keys(compilation.getAssets());
    };
  }
}

module.exports = WebpConvertPlugin;
