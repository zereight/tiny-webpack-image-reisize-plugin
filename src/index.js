const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");

const PLUGIN_NAME = "WebpConvertPlugin";
const IMAGES_POSTFIX = /\.(jpe?g|png|gif)/;

class WebpConvertPlugin {
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
              if (!IMAGES_POSTFIX.test(assetFileName)) return;

              const removedPostFixName = assetFileName
                .split(".")
                .slice(0, -1)
                .join(".");
              const convertedFileName = `${removedPostFixName}.webp`;

              const assetFile = compilation.assets[assetFileName];

              const processImageminAsync = imagemin
                .buffer(assetFile.source(), {
                  plugins: [
                    imageminWebp({
                      quality: 0,
                      size: 200,
                      resize: {
                        width: 1920,
                        height: 1080,
                      },
                    }),
                  ],
                })
                .then((processedBuffer) => {
                  const size =
                    (assetFile.size() - processedBuffer.length) / 1024;

                  delete compilation.assets[assetFileName];

                  compilation.emitAsset(convertedFileName, {
                    source: () => processedBuffer,
                    size: () => processedBuffer.length,
                  });

                  return size;
                })
                .catch((error) => {
                  console.error(error);
                });

              return processImageminAsync;
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

module.exports = WebpConvertPlugin;
