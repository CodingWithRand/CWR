const path = require('path');

module.exports = {
  target: 'node',
  entry: './ssr/scripts/server.js',
  output: {
    path: path.resolve(__dirname, "../ssr/"),
    filename: 'server.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
