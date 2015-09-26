module.exports = {
  entry: './src/app.js',

  output: {
    path: './',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['', '.js']
  },

  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' }
    ]
  }
}
