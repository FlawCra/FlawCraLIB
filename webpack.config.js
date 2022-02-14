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
      banner: `FlawCraLIB
@author  FlawCra <office@flawcra.cc>
@license GPL-3.0-or-later`,
    })
  ]
};