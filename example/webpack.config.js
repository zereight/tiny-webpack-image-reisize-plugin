const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageResizePlugin = require("../src/index.js");
const { webpack } = require("webpack");

module.exports = {
  entry: "./src/index.js",
  resolve: { extensions: [".js", ".jsx"] },
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "/dist"),
    clean: true,
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./public", to: "./public" }],
    }),
    new Dotenv(),
    new ImageResizePlugin({
      gifInfo: {
        width: 100,
        height: 100,
      },
      imgInfo: {
        width: 1920,
        height: 1080,
        quality: 100,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp)$/i,
        loader: "file-loader",
        options: {
          name: "static/[name].[ext]",
        },
      },
    ],
  },
  optimization: {
    minimize: false,
  },
};
