const webpack = require('webpack');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  bail: isProduction,
  context: path.join(__dirname, 'src'),
  entry: {
    src: [
      isDevelopment && 'react-hot-loader/patch',
      './index.jsx',
    ].filter(Boolean),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [isDevelopment && 'react-hot-loader/babel'].filter(Boolean),
            },
          },
        ],
      },
      isDevelopment && {
        test: /\.jsx?$/,
        include: /node_modules\/react-dom/,
        use: 'react-hot-loader/webpack',
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ].filter(Boolean),
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production', // use 'production' unless process.env.NODE_ENV is defined
    }),
    new CopyWebpackPlugin({
      patterns: [
        '.htaccess',
        'static/favicon.ico',
        'static/ogimage.png',
      ],
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    isProduction && new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css',
      chunkFilename: '[name].[chunkhash:8].css',
    }),
  ].filter(Boolean),
  optimization: {
    moduleIds: 'named',
  },
  stats: {
    assetsSort: '!size',
    entrypoints: false,
  },
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    hot: true,
    port: 1234,
  },
};
