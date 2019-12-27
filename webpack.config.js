require("dotenv").config();
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

// TODO: dynamic meta data
// TODO: minify js

const ENTRY_FILE = "index.html";

module.exports = {
  // Client Entrypoint
  entry: path.resolve(__dirname, "src/client", "index.js"),
  //devtool: "inline-source-map",
  // Build Destination
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  // Transformers
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(woff|woff2|ico)$/,
        use: [
          {
            loader: "url-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".html"],
    alias: {
      client: path.resolve(__dirname, "src/client")
    }
  },
  plugins: [
    // Add environment variables
    new webpack.EnvironmentPlugin(["API_ADDRESS"]),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "src/client", ENTRY_FILE),
      filename: `./src/client/${ENTRY_FILE}`
    }),
    new webpack.SourceMapDevToolPlugin({})
  ],
  devtool: "eval-source-map",
  devServer: {
    open: true,
    contentBase: path.join(__dirname, "dist/client"),
    compress: true, // gzip compression
    port: process.env.CLIENT_PORT,
    index: ENTRY_FILE,
    historyApiFallback: true
  }
};
