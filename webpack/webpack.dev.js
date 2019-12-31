require("dotenv").config();
const path = require("path");

const merge = require("webpack-merge");
const common = require("./webpack.common.js");

// TODO: dynamic meta data

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    hot: true,
    open: true,
    compress: true, // gzip compression
    port: process.env.CLIENT_PORT,
    index: "index.html",
    historyApiFallback: true
  }
});
