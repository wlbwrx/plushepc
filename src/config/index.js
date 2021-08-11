const envUrl = {
	dev: {
		baseUrl: '/uat',
	},
	test: {
		baseUrl: '',
	},
	uat: {
		baseUrl: '',
	},
	prod: {
		baseUrl: '',
	},
}
module.exports = envUrl[process.env.VUE_APP_PROJECT]
