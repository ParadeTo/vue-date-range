var webpack = require('webpack');
var path = require('path');


module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue-date-range.js',
    library: 'daterange',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: [path.join(__dirname, 'src')],
        exclude: /node_modules/
      },
    ]
  },
  vue: {
    // .vue 文件配置 loader 及工具 (autoprefixer)
    loaders: {
      less: 'vue-style!css!less'
    },
    postcss: [
      require('autoprefixer')({
        browsers: ['iOS >= 7', 'Android >= 4.1']
      })
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
