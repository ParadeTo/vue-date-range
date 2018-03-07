var webpack = require('webpack');
var path = require('path');

var projectRoot = path.resolve(__dirname, '../')

module.exports = {
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: [path.join(projectRoot, 'src'), path.join(projectRoot, 'dev')],
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
}
