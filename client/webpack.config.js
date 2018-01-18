const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './src/index.js',
      'babel-polyfill'
    ],
    output: {
      path: path.join(__dirname, 'build'),
      publicPath: '/build',
      filename: "bundle.js",
      chunkFilename: '[name].js'
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
           presets: ['react', 'es2015', 'stage-2']
         }
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            'style-loader', 'css-loader', 'less-loader'
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                query: {
                  progressive: true,
                  optimizationLevel: 7,
                  interlaced: false,
                  pngquant: {
                    quality: '65-90',
                    speed: 4
                  },
                  gifsicle: {
                    interlaced: true,
                  },
                  optipng: {
                    optimizationLevel: 7,
                  },
                  mozjpeg: {
                    progressive: true,
                  },
                }
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        querystring: 'querystring-browser'
      }
    },
    devServer: {
      contentBase: __dirname + "/build/",
      inline: true,
      host: '0.0.0.0',
      port: 8080,
    //   path.resolve(__dirname, './build'),
    //   hot: true,
    //   historyApiFallback: true,
    //   publicPath: '/',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        //new BundleAnalyzerPlugin({ analyzerMode: 'static' })
      ],
      watch: false
    };
