const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");

const PLUGIN_NAME = "ImageResizePlugin";
const IMAGES_POSTFIX = /\.(jpe?g|png|webp)/;
const GIF_POSTFIX = /\.(gif)/;

class ImageResizePlugin {
  constructor({ outputPath = "dist", gifInfo, imgInfo }) {
    this.gifInfo = gifInfo || { scale: 1, toWebp: true };
    this.imgInfo = imgInfo || {
      width: 1920,
      height: 1080,
      quality: 75,
      toWebp: true,
    };
    this.outputPath = outputPath;
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

          const processImageminForAssetFileAsyncs = assetFileNames.map(
            (assetFileName) => {
              if (GIF_POSTFIX.test(assetFileName)) {
                const removedPostFixName = assetFileName
                  .split(".")
                  .slice(0, -1)
                  .join(".");
                const inputFilePath = `./${this.outputPath}/${assetFileName}`;
                const outputFilePath = this.gifInfo.toWebp
                  ? `./${this.outputPath}/${removedPostFixName}.wepb`
                  : `./${this.outputPath}/${assetFileName}`;

                console.warn("This Plugin is not support [gif] format.");
                console.warn(`Please run this command`);
                console.warn(
                  `gifsicle --scale ${this.gifInfo.scale} -i  ${inputFilePath} -o  ${outputFilePath}`
                );
              } else if (IMAGES_POSTFIX.test(assetFileName)) {
                const removedPostFixName = assetFileName
                  .split(".")
                  .slice(0, -1)
                  .join(".");
                const convertedFileName = this.imgInfo.toWebp
                  ? `${removedPostFixName}.webp`
                  : assetFileName;

                const assetFile = compilation.assets[assetFileName];

                const processImageminAsync = imagemin
                  .buffer(assetFile.source(), {
                    plugins: [
                      imageminWebp({
                        quality: this.imgInfo.quality,
                        size: 200,
                        resize: {
                          width: this.imgInfo.width,
                          height: this.imgInfo.height,
                        },
                      }),
                    ],
                  })
                  .then((processedBuffer) => {
                    delete compilation.assets[assetFileName];

                    compilation.emitAsset(convertedFileName, {
                      source: () => processedBuffer,
                      size: () => processedBuffer.length,
                    });
                  })
                  .catch((error) => {
                    console.error(error);
                  });

                return processImageminAsync;
              }
            }
          );

          Promise.allSettled(processImageminForAssetFileAsyncs).then(() => {
            callback();
          });
        }
      );
    });
  }
}

module.exports = ImageResizePlugin;
