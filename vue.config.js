
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'  // Cambia 'jorgeproject' por el nombre correcto
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
