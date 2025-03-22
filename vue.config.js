module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/<jorgeproject>/'
    : '/',
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