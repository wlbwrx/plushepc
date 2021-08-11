import Vue from 'vue'
import App from './App.vue'
import VueClipBoard from 'vue-clipboard2'
import router from '@/router/index.js'
import { Icon } from 'vant'
import 'animate.css'
import '../theme/index.css'
import ElementUI from 'element-ui'
import VueAwsomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import '@/style/style_pc.less'
import moment from 'moment' // 日期处理类库
import store from './store/index.js'
import './permission.js'
Vue.config.productionTip = false
Vue.prototype.moment = moment

Vue.use(Icon)
import { Lazyload } from 'vant'
Vue.use(Lazyload)
Vue.use(VueClipBoard)

// 引入上报所需要的像素代码
import './utils/pixel.js'

// 新注册一个全局变量用来区分是否是PC端
Vue.prototype.$terminal = true

Vue.use(ElementUI, VueAwsomeSwiper)
import filters from '@/filters/index.js'
for (let key in filters) {
	Vue.filter(key, filters[key])
}

import mixin from './mixins/index.js'
import * as utils from '@/utils/index'
Vue.prototype.$utils = utils

Vue.mixin(mixin)
const Bus = new Vue()
new Vue({
	router,
	store,
	render: h => h(App),
	data() {
		return {
			Bus,
		}
	},
}).$mount('#app')

//解决路由切换滚动条不置顶
router.beforeEach((to, from, next) => {
	// chrome
	document.body.scrollTop = 0
	// firefox
	document.documentElement.scrollTop = 0
	// safari
	window.pageYOffset = 0
	next()
})
