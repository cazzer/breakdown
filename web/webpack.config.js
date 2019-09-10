const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    stats: {
      colors: true,
    },
  },
  devtool: 'eval-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(j|t)sx?$/,
        use: [
          'ts-loader',
        ]
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx']
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  output: {
    filename: '[name].[hash].bundle.js',
    publicPath: '/'
  },
  plugins: [
    new CopyWebpackPlugin([ 'chrome/manifest.json' ]),
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_TIMESTAMP: Date.now()
      }
    }),
    new webpack.EnvironmentPlugin([
      'IDENTITY_POOL_ID',
      'AWS_REGION',
      'USER_POOL_ID',
      'USER_POOL_WEB_CLIENT_ID',
      'GRAPHQL_ENDPOINT',
      'SENTRY_DSN',
      'WEBSOCKET_URL'
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin('dist')
  ]
}
