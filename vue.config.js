const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const cdn = require('./src/config/cdn')
let isProduction = process.env.NODE_ENV === 'production'
function resolve(dir) {
	return path.join(__dirname, dir)
}

const theme = path.resolve(__dirname, './src/style/theme.less')
module.exports = {
	publicPath: '/',
	outputDir: 'dist',
	assetsDir: './static',
	lintOnSave: process.env.NODE_ENV === 'development',
	productionSourceMap: false,
	devServer: {
		open: true, // 'Google Chrome'直接打开谷歌， 设置true为打开默认浏览器
		port: 8080,
		hot: true,
		overlay: {
			warnings: false,
			errors: true, // 屏幕上显示错误
		},
		proxy: {
			'/api': {
				target: 'xxxx',
				changeOrigin: true, //
				ws: true,
				pathRewrite: {
					'^/api': '',
				},
			},
			'/dev': {
				target: 'http://172.30.41.223:8084',
				changeOrigin: true, //
				logLevel: 'debug',
				pathRewrite: {
					'^/dev': '',
				},
			},
			'/test': {
				target: 'https://sit-p.plushe.com/',
				pathRewrite: {
					'^/test': '',
				},
			},
			'/uat': {
				target: 'https://uat-p.plushe.com/',
				pathRewrite: {
					'^/uat': '',
				},
			},
			'/prod/plushemall': {
				target: 'https://m.plushe.com/',
				pathRewrite: {
					'^/prod/plushemall': '/plushemall',
				},
			},
			// wind 的本地测试地址
			'/wind': {
				target: 'http://192.168.8.86:10006',
				changeOrigin: true, //
				logLevel: 'debug',
				pathRewrite: {
					'^/wind': '',
				},
			},
			// raise 的本地测试地址
			'/raise': {
				target: 'http://192.168.8.44:10006',
				changeOrigin: true, //
				logLevel: 'debug',
				pathRewrite: {
					'^/raise': '/',
				},
			},
			// ice 的本地测试地址
			'/ice': {
				target: 'http://192.168.8.222:10017',
				changeOrigin: true, //
				logLevel: 'debug',
				pathRewrite: {
					'^/ice': '',
				},
			},
			// 申威 的本地测试地址
			// '/shenwei': {
			// 	target: 'http://192.168.8.70:10017',
			// 	changeOrigin: true, //
			// 	logLevel: 'debug',
			// 	pathRewrite: {
			// 		'^/shenwei': '',
			// 	},
			// },
		},
	},
	css: {
		extract: {
			ignoreOrder: true,
		},
		loaderOptions: {
			less: {
				lessOptions: {
					modifyVars: {
						// 或者可以通过 less 文件覆盖（文件路径为绝对路径）
						hack: `true; @import "${theme}";`,
					},
				},
			},
		},
	},
	chainWebpack: config => {
		if (isProduction) {
			config.plugin('html').tap(args => {
				args[0].cdn = cdn
				return args
			})
		}
		config.resolve.alias
			.set('@', resolve('src'))
			.set('@assets', resolve('src/assets'))
			.set('@config', resolve('src/config'))
			.set('@components', resolve('src/components'))
			.set('@static', resolve('src/static'))
			.set('@views', resolve('src/views'))

		if (isProduction && process.env.ANALYZER) {
			config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
		}
	},
	configureWebpack: config => {
		// 打包忽略
		if (isProduction) {
			const externals = {}
			cdn.js.forEach(item => {
				if (item.name) externals[item.name] = item.scope
			})
			config.externals = externals
			config.optimization = {
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							compress: {
								drop_console: true,
							},
						},
					}),
				],
			}
		}
	},
}
