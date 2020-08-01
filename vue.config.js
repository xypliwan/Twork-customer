const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: 'error',
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('_a', resolve('src/assets'))
      .set('_c', resolve('src/components'))
      .set('_u', resolve('src/utils'))
      .set('_v', resolve('src/views'))
    config.module.rule('eslint')
    config.module.rule('eslint').use('eslint-loader')
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/styles/theme.scss";`
      }
    }
  },
  outputDir: process.env.outputDir,
  productionSourceMap: false
}
