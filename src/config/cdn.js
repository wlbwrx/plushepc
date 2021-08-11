module.exports = {
	// `${process.env.VUE_APP_CND}/plugn/css/vant@2.12.9/lib/index.css`
	css: [],
	js: [
		{
			name: `vue`,
			scope: `Vue`,
			js: `${process.env.VUE_APP_CND}/plugn/js/vue@2.6.12.js`,
		},
		{
			name: `element-ui`,
			scope: `ELEMENT`,
			js: `${process.env.VUE_APP_CND}/plugn/js/element-ui@2.15.1.js`,
		},
		// {
		// 	name: `vue-awesome-swiper`,
		// 	scope: `VueAwesomeSwiper`,
		// 	js: `https://unpkg.com/vue-awesome-swiper@4.1.1/dist/vue-awesome-swiper.js`,
		// },
		{
			name: `vue-router`,
			scope: `VueRouter`,
			js: `${process.env.VUE_APP_CND}/plugn/js/vue-route@3.5.1.js`,
		},
		{
			name: `vuex`,
			scope: `Vuex`,
			js: `${process.env.VUE_APP_CND}/plugn/js/vuex@3.6.2.js`,
		},
		{
			name: `axios`,
			scope: `axios`,
			js: `${process.env.VUE_APP_CND}/plugn/js/axios@0.21.1.js`,
		},
		{
			name: `better-scroll`,
			scope: `BetterScroll`,
			js: `${process.env.VUE_APP_CND}/plugn/js/better-scroll@2.2.1.js`,
		},
		{
			name: `countrys`,
			scope: `countrys`,
			js: `${process.env.VUE_APP_CND}/plugn/js/countrys.js`,
		},
	],
}
