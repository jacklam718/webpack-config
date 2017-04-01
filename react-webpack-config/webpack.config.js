const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const dotenv = require('dotenv');

dotenv.load();

const src = path.join(__dirname, '/src');
const dist = path.join(__dirname, '/public');
const isProd = process.env.NODE_ENV === 'production';

const joinSrc = filename => path.join(src, filename);
const joinDist = filename => path.join(dist, filename);

module.exports = {
  context: src,
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      src,
    ],
  },
  devServer: {
    hot: true,
    contentBase: dist,
    compress: false,
  },
  output: {
    filename: 'js/app.js',
    path: dist,
  },
  devtool: isProd ? false : 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: !isProd ? false : {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      debug: isProd,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
      },
      ENV: {
      },
    }),
    new HtmlWebpackPlugin({
      template: joinSrc('index.html'),
      filename: joinDist('index.html'),
      inject: 'body',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'babel-preset-react',
              ['babel-preset-es2015', { modules: false }],
              'babel-preset-stage-0',
            ],
          },
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        query: {
          minimize: isProd,
        },
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  },
};
