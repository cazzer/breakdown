const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const common = require('./webpack.config.js')

module.exports = merge(common, {
  devtool: false,
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          output: {
            beautify: false,
          },
        },
      }),
    ],
  }
})
