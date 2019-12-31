const merge = require("webpack-merge");
const common = require("./webpack.common.js");

// TODO: minify js

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map"
});
