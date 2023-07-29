const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	devtool: false,
	devServer: {
		client: {
			overlay: {
				warnings: false,
			},
		},
		open: false,
		port: 8080,
		server: 'https',
	},
	entry: {
		example: './example.js',
		robroy: './robroy.js',
	},
	output: {
		filename: '[name].min.js?[contenthash]',
		path: path.resolve(__dirname, 'build'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.join('./src', 'index.hbs'),
		}),
		new MiniCssExtractPlugin({
			filename: '[name].min.css?[contenthash]',
		}),
		new CopyPlugin({
			patterns: [
				{
					from: './public',
					to: './',
					globOptions: {
						ignore: ['.DS_Store', '**/.DS_Store'],
					},
				},
			],
			options: {
				concurrency: 100,
			},
		}),
		new BrowserSyncPlugin({
			proxy: 'https://localhost:8080',
			port: 3000,
			files: [
				'helpers/**/*',
				'js/**/*',
				'scss/**/*',
				'src/**/*',
			],
			snippetOptions: {
				rule: {
					match: /<body[^>]*>/i,
					fn: (snippet, match) => (
						// Allow Browsersync to work with Content-Security-Policy without script-src 'unsafe-inline'.
						`${match}${snippet.replace('id=', 'nonce="browser-sync" id=')}`
					),
				},
			},
		}, {
			reload: false,
		}),
	],
	module: {
		rules: [
			{
				test: /\.hbs$/,
				use: [
					{
						loader: 'handlebars-loader',
						options: {
							helperDirs: path.join(__dirname, 'helpers'),
						},
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									'autoprefixer',
									'cssnano',
								],
							},
						},
					},
					'sass-loader',
				],
			},
		],
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
		],
		splitChunks: {
			cacheGroups: {
				example: {
					name: 'example',
					type: 'css/mini-extract',
					chunks: (chunk) => (chunk.name === 'example'),
					enforce: true,
				},
				robroy: {
					name: 'robroy',
					type: 'css/mini-extract',
					chunks: (chunk) => (chunk.name === 'robroy'),
					enforce: true,
				},
			},
		},
	},
};
