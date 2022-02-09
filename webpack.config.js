const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  entry: {
    main: './src/ZT.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
  plugins: [
      new NodePolyfillPlugin()
  ],
  resolve: {
    // ... rest of the resolve config
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false
    }
  },
};