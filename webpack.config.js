const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: path.resolve(__dirname, 'assets', 'index.js'),
    project: path.resolve(__dirname, 'assets', 'project.js'),
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
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './app/index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './app/scraper.html',
      filename: 'scraper.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name]' + (isProd ? '-[contenthash:8]' : '') + '.css'
    }),
    new CleanWebpackPlugin(),
    new ImageminPlugin({
      disable: true,
      test: /\.(jpg|jpeg|png|gif)$/i,
      plugins: [
        imageminMozjpeg({
          quality: 75
        })
      ]
    }),
  ],
};