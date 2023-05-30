const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/socket.io': {
        target: 'https://www.tsaiduck.cn', // target host
        changeOrigin: true, // needed for virtual hosted sites
        logLevel: 'debug'
      },
      '/sockjs-node': {
        target: 'https://www.tsaiduck.cn',
        ws: false,
        changeOrigin: true
      }
    }
  },
  publicPath: './'
})
