const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './src/web',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    stats: {
      colors: true,
    },
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'IDENTITY_POOL_ID',
      'AWS_REGION',
      'USER_POOL_ID',
      'USER_POOL_WEB_CLIENT_ID'
    ]),
    new HtmlWebpackPlugin({
      template: './src/web/index.html'
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    }),
    new CleanWebpackPlugin('dist')
  ]
}
