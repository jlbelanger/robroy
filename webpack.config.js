const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

function getPages(dir) {
	let output = [];
	const files = fs.readdirSync(dir);
	files.forEach((filename) => {
		const filePath = path.join(dir, filename);
		const stat = fs.statSync(filePath);
		if (filename.endsWith('.hbs') && !filename.startsWith('_')) {
			output.push(filePath.replace(/^src\//, ''));
		} else if (stat.isDirectory()) {
			output = output.concat(getPages(filePath));
		}
	});
	return output;
}

const pages = getPages('./src');

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
		...pages.map((filename) => (new HtmlWebpackPlugin({
			filename: filename.replace('.hbs', '.html'),
			template: path.join('./src', filename),
			templateParameters: { filename: filename.replace('.hbs', '.html') },
		}))),
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
				'partials/**/*',
				'scss/**/*',
				'src/**/*.hbs',
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
									'postcss-preset-env',
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
