import { platformConfig } from '@/utils/enums.js'
export default {
	data() {
		return {}
	},
	craeted() {},
	filters: {
		// 价格后端是分，所以要除以100
		filterPrice(value) {
			return value ? (value / 100).toFixed(2) : 0
		},
		// 时间格式化
		formatTime(time) {
			if (!time) return ''
			let date = new Date(time.replace(/-/g, '/'))
			return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
		},
	},
	methods: {
		// 处理跳转的url地址
		formatUrl(url, params) {
			params = params.replace(/\s/g, '-')
			params = encodeURIComponent(params)
			return url + params
		},
		reportGtag(eventName, data, isNew) {
			if (!window.gtag) return
			const { googlePixelId, googlePixelOldId } = platformConfig.plushe
			// 携带的公共数据：
			let params = {}
			Object.assign(params, data)
			if (isNew) {
				window.gtag('event', eventName, { ...params, send_to: googlePixelId }) // 新版的GA
			} else {
				window.gtag('event', eventName, { ...params, send_to: googlePixelOldId }) // 老版的UA
			}
			// 仅正式环境才上报:
			// if (process.env.VUE_APP_PROJECT === 'prod' && googlePixelOldId) {
			// 	window.gtag('event', eventName, { ...params, send_to: 'AW-365802310' }) // 7月21, ads--营销--同GA老版本数据保一致
			// }
		},
		reportFB(eventName, params, isCustom, otherData) {
			// 事件名, 数据, 自定义
			if (!window.fbq) return
			if (window.fbq && typeof fbq == 'function') {
				if (otherData) {
					window.fbq(isCustom ? 'trackCustom' : 'track', eventName, params, otherData)
				} else {
					window.fbq(isCustom ? 'trackCustom' : 'track', eventName, params)
				}
			}
		},
	},
}
