// eslint-disable-next-line
const path = require('path')

module.exports = {
  entry: './src/index.ts',
  mode: 'development', // TODO production
  devtool: 'eval-cheap-module-source-map', // TODO source-map production
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module',
    },
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
  experiments: {
    outputModule: true,
  },
}
