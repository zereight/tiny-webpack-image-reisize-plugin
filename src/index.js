// const imagemin = require("imagemin");
// const imageminMozjpeg = require("imagemin-mozjpeg");
// const imageminPngquant = require("imagemin-pngquant");
// const imageminGiflossy = require("imagemin-giflossy");
// const imageminSvgo = require("imagemin-svgo");
// const imageminWebp = require("imagemin-webp");
// const imageminOptipng = require("imagemin-optipng");
const sharp = require("sharp");

const PLUGIN_NAME = "WebpConvertPlugin";
const IMAGES_POSTFIX = /\.(jpe?g|png|gif|webp)/;

class WebpConvertPlugin {
  constructor({ width, height }) {
    if (typeof width !== "number" || typeof height !== "number") {
      throw new Error("width, height must be number.");
    }

    this.width = width;
    this.height = height;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: PLUGIN_NAME,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets, callback) => {
          const assetFileNames = Object.keys(assets);

          const processedSharpToAssetFileAsyncs = assetFileNames.map(
            (assetFileName) => {
              if (!IMAGES_POSTFIX.test(assetFileName)) return;

              const assetFile = compilation.assets[assetFileName];

              // const processImageminAsync = imagemin
              //   .buffer(assetFile.source(), {
              //     plugins: [
              //       imageminOptipng({ interlaced: true, optimizationLevel: 7 }),
              //       imageminMozjpeg({ quality: 80 }),
              //       imageminPngquant(),
              //       imageminGiflossy(),
              //       imageminSvgo(),
              //       imageminWebp({
              //         quality: 75,
              //         // resize: {
              //         //   width: this.width,
              //         //   height: this.height,
              //         // },
              //       }),
              //     ],
              //   })
              //   .then((processedBuffer) => {
              //     const size =
              //       (assetFile.size() - processedBuffer.length) / 1024;

              //     delete compilation.assets[assetFileName];

              //     compilation.emitAsset(assetFileName, {
              //       source: () => processedBuffer,
              //       size: () => processedBuffer.length,
              //     });

              //     return size;
              //   })
              //   .catch((error) => {
              //     console.error(error);
              //   });

              // return processImageminAsync;

              const processedSharpToAssetFileAsync = sharp(assetFile.source())
                .resize(this.width, this.height)

                .toBuffer()
                .then((buffer) => {
                  const size = (assetFile.size() - buffer.length) / 1024;

                  delete compilation.assets[assetFileName];

                  compilation.emitAsset(assetFileName, {
                    source: () => buffer,
                    size: () => buffer.length,
                  });

                  return size;
                })
                .catch((error) => {
                  console.error(error);
                });

              return processedSharpToAssetFileAsync;
            }
          );

          Promise.allSettled(processedSharpToAssetFileAsyncs).then(() => {
            callback();
          });
        }
      );
    });
  }
}

module.exports = WebpConvertPlugin;
