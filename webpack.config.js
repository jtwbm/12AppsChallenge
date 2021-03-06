const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: path.resolve(__dirname, 'assets', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]' + (isProd ? '-[contenthash:8]' : '') + '.js',
  },
  optimization: {
    minimize: isProd,
    splitChunks: {
      cacheGroups: {
        'vendors': {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    runtimeChunk: 'single'
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/i,
        use: [
          {
            loader: 'css-hot-loader'
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              sourceMap: !isProd
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProd
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer()
              ]
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProd,
            }
          }
        ].filter((loader) => !isProd || 'css-hot-loader' !== loader.loader)
      },
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name]' + (isProd ? '-[contenthash:8]' : '') + '.[ext]'
            }
          }
        ]
      },
      {
        test: /\.(pdf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'pdf/[name].[ext]'
            }
          }
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './app/index.html', }),
    new MiniCssExtractPlugin({
      filename: '[name]' + (isProd ? '-[contenthash:8]' : '') + '.css'
    }),
    new CopyPlugin([
      { from: 'pdf', to: 'pdf' },
    ]),
    new CleanWebpackPlugin(),
  ],
};