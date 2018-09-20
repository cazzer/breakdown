const CleanWebpackPlugin = require('clean-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  entry: {
    app: './src/web'
  },
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
        test: /\.(j|t)sx?$/,
        use: [
          'babel-loader',
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
    gitRevisionPlugin,
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_DATE: new Date().toString(),
        VERSION: JSON.stringify(gitRevisionPlugin.version())
      }
    }),
    new webpack.EnvironmentPlugin([
      'IDENTITY_POOL_ID',
      'AWS_REGION',
      'USER_POOL_ID',
      'USER_POOL_WEB_CLIENT_ID',
      'GRAPHQL_ENDPOINT'
    ]),
    new HtmlWebpackPlugin({
      template: './src/web/index.html'
    }),
    new CleanWebpackPlugin('dist')
  ]
}
