import axios from 'axios'
import { Loading, Message } from 'element-ui'
import { Toast } from 'vant'
import router from '@/router'
import httpCode from './httpCode'
import { baseUrl } from '@/config/index'
import { platformId } from '@/utils/app.js'
import { getToken } from './auth'
import store from '@/store/index.js'

import LS from 'store'

let loadingInstance = null // 加载全局的loading
let timer = null
const TIME_LIMIT = 1000
const instance = axios.create({
	//创建axios实例，在这里可以设置请求的默认配置
	timeout: 100000, // 设置超时时间10s
	baseURL: baseUrl + '/plushemall/plushe-mall-web', //根据自己配置的反向代理去设置不同环境的baeUrl
})
// 文档中的统一设置post请求头。下面会说到post请求的几种'Content-Type'
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

let startTime = ''
/** 添加请求拦截器 **/

function debounce(fn, delay) {
	//借助闭包
	return function() {
		if (timer) clearTimeout(timer)
		timer = setTimeout(fn, delay) // 简化写法
	}
}

function showLoading() {
	// loadingInstance = Toast.loading({
	// 	// 发起请求时加载全局loading，请求失败或有响应时会关闭
	// 	loadingType: 'spinner',
	// 	forbidClick: true,
	// 	message: 'loading...',
	// 	duration: 0,
	// })
	// loadingInstance = Loading.service({
	// 	fullscreen: true,
	// 	lock: true,
	// 	text: 'Loading',
	// 	spinner: 'el-icon-loading',
	// 	// background: 'rgba(0, 0, 0, 0.3)'
	// });
	loadingInstance = Message({
		message: 'Loading...',
		duration: 0,
	})
}
instance.interceptors.request.use(
	config => {
		// config.headers['Authorization'] = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxNDAzNDI2OTc2MDM4OTQ0IiwidGltZW91dCI6MTYxODE3ODY0NjUwMn0.kEy-rmp5_gCuT1L3SImezqxcfL_U_7x1uVfeuOgVhNo'
		if (getToken()) {
			config.headers['Authorization'] = getToken()
		} else {
			const guestUrl = ['/cart/checkout', '/order/createGuestUserOrder']
			const tokenUrl = ['/order/orderDetail', '/orderPay/createPayment', '/orderPay/capturePayment', 'orderPay/queryPayment']
			if (guestUrl.includes(config.url)) {
				config.headers['accessUser'] = 'guest'
			}
			if (tokenUrl.includes(config.url)) {
				config.headers['accessUser'] = 'guest'
				config.headers['Authorization'] = LS.get('guestToken') || ''
			}
		}
		config.headers['platformId'] = platformId
		config.headers['userDevice'] = 2 // process.env.VUE_APP_PROJECT.indexOf('-pc') == -1 ? 1 : 2 // 1-h5, 2-pc
		debounce(showLoading, TIME_LIMIT)()
		if (config.method === 'get') {
			// 添加时间戳参数，防止浏览器（IE）对get请求的缓存
			config.params = {
				...config.params,
				t: new Date().getTime(),
			}
		}
		// 在这里：可以根据业务需求可以在发送请求之前做些什么:例如我这个是导出文件的接口，因为返回的是二进制流，所以需要设置请求响应类型为blob，就可以在此处设置。
		if (config.url.includes('pur/contract/export')) {
			config.headers['responseType'] = 'blob'
		}
		// 我这里是文件上传，发送的是二进制流，所以需要设置请求头的'Content-Type'
		if (config.url.includes('upload')) {
			config.headers['Content-Type'] = 'multipart/form-data'
		}
		startTime = new Date() // 开始时间
		return config
	},
	error => {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

/** 添加响应拦截器  **/
instance.interceptors.response.use(
	response => {
		store.commit('app/SET_CURRENTSERVERTIME', +new Date(response.headers.date) + (new Date() - startTime)) // 服务器时间--秒杀使用
		timer && clearTimeout(timer)
		loadingInstance && loadingInstance.close()
		if (response.data.code === 0) {
			// 响应结果里的code: ok是我与后台的约定，大家可以根据实际情况去做对应的判断
			return Promise.resolve(response.data)
		} else {
			// code 结尾为2 是不需要在这里谈提示,会出现shortCode字段，需要做页面交互处理,
			if (!response.data.shortCode) {
				Toast({
					message: response.data.msg,
					type: 'fail',
					duration: 2000,
					icon: ' iconfont icon-guanbi',
				})
			}
			// code 结尾为1, 是真正的异常事件:
			let errCode = response.data.code + ''
			if (errCode.charAt(errCode.length - 1) == '1') {
				// 异常事件记录：
				window.errCode('exception', response.data.msg)
			}
			return Promise.reject(response.data)
		}
	},
	error => {
		timer && clearTimeout(timer)
		loadingInstance && loadingInstance.close()
		if (error.response) {
			// 根据请求失败的http状态码去给用户相应的提示
			let tips = error.response.status in httpCode ? httpCode[error.response.status] : error.response.data.message

			Toast({
				message: tips || 'Request Timed Out',
				type: 'fail',
				icon: ' iconfont icon-guanbi',
			})
			if (error.response.status === 401) {
				// token或者登陆失效情况下跳转到登录页面，根据实际情况，在这里可以根据不同的响应错误结果，做对应的事。这里我以401判断为例
				window.errCode(401, '', () => {
					router.push({
						path: `/home`,
					})
				})
			}
			return Promise.reject(error)
		} else {
			Toast({
				message: 'Request Timed Out. Please check your network. Refresh and try again',
				type: 'fail',
				icon: ' iconfont icon-guanbi',
			})
			// 超时--需要上报数据:
			window.errCode('timeOut')
			return Promise.reject(new Error('Request Timed Out. Please check your network. Refresh and try again'))
		}
	}
)

/* 统一封装get请求 */
export const get = (url, params, config = {}) => {
	return new Promise((resolve, reject) => {
		instance({
			method: 'get',
			url,
			params,
			...config,
		})
			.then(response => {
				resolve(response)
			})
			.catch(error => {
				reject(error)
			})
	})
}

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
	return new Promise((resolve, reject) => {
		instance({
			method: 'post',
			url,
			data,
			...config,
		})
			.then(response => {
				resolve(response)
			})
			.catch(error => {
				reject(error)
			})
	})
}
