const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const paths = require('./paths');
const utils = require('./utils');

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [paths.src + '/main.js'],

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/'
  },

  // Customize the webpack build process
  plugins: [
    // Vue plugin for the vue sfc
    new VueLoaderPlugin(),

    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'static',
          globOptions: {
            ignore: ['*.DS_Store', '**/index.html', '**/favicon.ico']
          },
          noErrorOnMissing: true
        }
      ]
    }),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    new HtmlWebpackPlugin({
      title: 'Webpack5 Vue Boilerplate',
      favicon: paths.public + '/favicon.ico',
      template: paths.public + '/index.html', // template file
      filename: 'index.html' // output file
    })
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // Vue: Use vue-loader to transpile Vue files
      { test: /\.vue$/, loader: 'vue-loader' },

      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },

      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(sass|scss|css)$/,
        use: [
          // Note: Only style-loader works for me !!!
          // 'vue-style-loader',
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },

      // Images: Copy image files to build folder
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: utils.assetsPath('img/[name].[hash][ext]') // 局部指定输出位置
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 限制于 10kb
          }
        }
      },

      // Fonts and SVGs: Inline files
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: utils.assetsPath('fonts/[name].[hash][ext]') // 局部指定输出位置
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 限制于 10kb
          }
        }
      }
    ]
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
      assets: paths.public
    }
  }
};
