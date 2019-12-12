require('dotenv').config();
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

// TODO: dynamic meta data
// TODO: minify js

const ENTRY_FILE = 'index.html';

module.exports = {
  // Client Entrypoint
  entry: path.resolve(__dirname, 'client', 'index.js'),
  // Build Destination
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  // Transformers
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'client', ENTRY_FILE),
      filename: `client/${ENTRY_FILE}`
    })
  ],
  devServer: {
    open: true,
    contentBase: path.join(__dirname, '../dist/client'),
    compress: true, // gzip compression
    port: process.env.CLIENT_PORT,
    index: ENTRY_FILE,
    historyApiFallback: true
  }
};
