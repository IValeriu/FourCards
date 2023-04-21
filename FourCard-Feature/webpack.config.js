const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [new TerserPlugin(), new CssMinimizerPlugin()]
  }

  return config
}

const filename = ext => (isDev ? `[name].${ext}` : `[name].hash.${ext}`)

const scssLoaders = extra => {
  const loaders = [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader'
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}

module.exports = {
  entry: './src/index.js',
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: scssLoaders()
      },
      {
        test: /\.less$/,
        use: scssLoaders('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: scssLoaders('sass-loader')
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: 'asset/resource'
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      }
    ]
  },
  optimization: optimization(),
  devServer: {
    port: 3000,
    hot: isDev
  }
}
