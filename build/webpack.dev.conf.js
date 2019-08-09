/*
config from development packages
* */
const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.base');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const root = p => path.join(__dirname, '..', p);

module.exports = merge(base, {
  mode: 'development',
  entry: {
	app: root('src/demo.js'),
  },
  module: {
	rules: [
	  {
		test: /(\.less)$/,
		use: [
		  {loader: 'style-loader'},
		  {loader: 'css-loader'},
		  {loader: 'less-loader'},
		],
	  },
	],
  },
  devServer: {
	contentBase: path.resolve(__dirname, '..'),
	compress: true,
	hot: true,
	port: 7778,
	host: '0.0.0.0',
	publicPath: '/',
	disableHostCheck: true,
  },
  plugins: [
	new webpack.HotModuleReplacementPlugin(),
	new HtmlWebpackPlugin({
	  filename: 'index.html',
	  template: 'index.html',
	  inject: true,
	  hash: true,
	}),
  ],
});
