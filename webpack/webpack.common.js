const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");

module.exports = {
  // Client Entrypoint
  entry: path.resolve(__dirname, "../src/client", "index.js"),
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
      client: path.resolve(__dirname, "../src/client")
    }
  },
  plugins: [
    // Add environment variables
    new EnvironmentPlugin(["API_ADDRESS"]),
    new HtmlWebPackPlugin({
      hash: true,
      template: path.resolve(__dirname, "../src/client", "index.html")
    })
  ],
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.js"
  }
};
