# webpack-webp-convert-plugin

Resize your images using webpack plugin!

## Support

Only webpack 5

## Before

<img width="532" alt="이미지 리사이즈 전" src="https://user-images.githubusercontent.com/42544600/131217247-ff6c2719-65a7-4d47-8221-21300ac4fe66.png">

## After

<img width="581" alt="이미지 리사이즈 후" src="https://user-images.githubusercontent.com/42544600/131217340-7dc0d07e-a61a-49d8-b728-311c1c40e366.png">

## Usage

```sh
npm i webpack-image-resize-plugin --save-dev

or

yarn add -D webpack-image-resize-plugin
```

```sh
// webpack.config.js
const WebpackImageResizePlugin = require("webpack-image-resize-plugin");

...
plugins: [
    new ImageResizePlugin({
      gifInfo: {
        width: 100,
        height: 100,
        toWebp: true
      },
      imgInfo: {
        width: 1920,
        height: 1080,
        quality: 100,
        toWebp: true
      },
    }),
]
...
```

### When you use `toWebp` options.

Please use file-loader like this. (webpack.config.js)

```js
// webpack.config.js

module: {
    rules: [
      {
        test: /\.(png|jpg|jpg|gif|webp)$/i,
        loader: "file-loader",
        options: {
          name: "static/[name].webp",
        },
      },
    ],
  },
```
