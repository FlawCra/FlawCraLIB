const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/FlawCraLIB.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.BannerPlugin({
      banner: `FlawCraLIB
@author  FlawCra <office@flawcra.cc>
@license GPL-3.0-or-later`,
    })
  ],
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false
    }
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    "jquery": "jquery"
  }
};