const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/FlawCraLIB.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),
    new webpack.BannerPlugin({
      banner: `FlawCraLIB v${require("./package.json").version}
@author  FlawCra <office@flawcra.cc>
@license GPL-3.0-or-later`,
    }),
    new webpack.BannerPlugin({
      banner: `SHA-256 (FIPS 180-4) implementation in JavaScript
@author  Chris Veness
@license MIT License`,
    })
  ]
};