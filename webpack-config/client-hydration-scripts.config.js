const path = require('path');

module.exports = {
  target: 'node',
  entry: {
    test: './ssr/client-hydration-scripts/test.js'
  },
  output: {
    path: path.resolve(__dirname, "../build/client-hydration"),
    filename: '[name].bundle.js',
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
