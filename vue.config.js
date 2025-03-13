module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api2.arduino.cc',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
