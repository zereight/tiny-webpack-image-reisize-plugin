# webpack-webp-convert-plugin

이미지들을 webp로 변환해주는 webapck plugin

누구나 따라할 수 있게 쉽게 구현

## Support

Only webpack 5

## Before

<img width="738" alt="이미지사이즈 전" src="https://user-images.githubusercontent.com/42544600/131214048-99cc4907-7654-4341-83ed-6af12185cf3c.png">

## After

<img width="738" alt="스크린샷 2021-08-28 오후 6 51 02" src="https://user-images.githubusercontent.com/42544600/131214045-5eebdec3-90ed-4e37-912f-32ada84592e3.png">

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
plugins: [new WebpackImageResizePlugin(),]
...

```
