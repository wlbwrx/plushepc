import { Base64 } from 'js-base64'
import { platformId } from '@/utils/app.js'
export const LS = {
	get(key) {
		if (!localStorage) return
		const value = localStorage.getItem(key)
		if (value) {
			try {
				return JSON.parse(value)
			} catch (error) {
				return value
			}
		} else {
			return false
		}
	},
	set(key, value) {
		if (typeof value === 'object') {
			localStorage.setItem(key, JSON.stringify(value))
		} else {
			localStorage.setItem(key, value)
		}
	},
	remove(key) {
		localStorage.removeItem(key)
	},
	clear: function () {
		localStorage.clear()
	},
}
export const getQueryString = function(name) {
	let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
	let r = window.location.search.substr(1).match(reg)
	if (r != null) {
		return decodeURIComponent(r[2])
	}
	return null
}

export const creditAmount = function (item) {
	let num = 100
	let { discountModel, fixedAmount, discountProbability } = item
	let amount = discountModel === 1 ? fixedAmount / num : discountProbability
	if (discountModel === 1) {
		return 'US$' + amount.toFixed(2)
	} else {
		return amount + '% OFF'
	}
}

function timeToDate(days) {
	let date = new Date()
	let strtime = date.getTime() + days * 86400000
	let date2 = new Date(strtime)
	let startTime = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
	let endtTime = `${date2.getMonth() + 1}/${date2.getDate()}/${date2.getFullYear()}`

	return startTime + '-' + endtTime
}

export const creditDays = function(item, def) {
	let { timeModel, validPeriod, startTime, endTime, validTime, expireTime } = item
	if (timeModel === 1 || def === 'cop') {
		let date = ''
		let date2 = ''
		let startTime1 = ''
		let endtTime1 = ''
		console.log('-----')
		if (startTime) {
			date = new Date(startTime.replace(/-/g, '/').substr(0, 10))
			date2 = new Date(endTime.replace(/-/g, '/').substr(0, 10))
		} else if (validTime) {
			date = new Date(validTime.replace(/-/g, '/').substr(0, 10))
			date2 = new Date(expireTime.replace(/-/g, '/').substr(0, 10))
		}
		if (platformId == 3) {
			startTime1 = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
			endtTime1 = `${date2.getFullYear()}/${date2.getMonth() + 1}/${date2.getDate()}`
		} else {
			startTime1 = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
			endtTime1 = `${date2.getMonth() + 1}/${date2.getDate()}/${date2.getFullYear()}`
		}

		return startTime1 + '-' + endtTime1
	} else {
		return timeToDate(validPeriod)
	}
}
// 处理订单页面的数据
export const orderTime = function(item){
	return item.slice(5,7) + '-' + item.slice(8,10) + '-' + item.slice(0, 4) + ' ' + item.slice(11, 13) + ':' + item.slice(14,16)
}
// 对象赋值
export const deepCopy = function(source) {
	let target = Array.isArray(source) ? [] : {}
	for (var k in source) {
		if (typeof source[k] === 'object') {
			target[k] = deepCopy(source[k])
		} else {
			target[k] = source[k]
		}
	}
	return target
}
/**
 * @param {string} value - 字符串
 */
export const isEmpty = function (value) {
	return !value || value === undefined || value === null || value === '' || value.length === 0
}

/**
 * @param {string} obj - object
 */
export const isEmptyObject = function (obj) {
	for (let name in obj) {
		return false
	}
	return true
}
//productKey:  图片key值
//layout:  0 -> 默认产品尺寸   1 -> h5商品详情页, 首页banner  2 -> 分类,订单,sku图片, 3 --> 首页banner
export const imageHandler = function(layout, productKey) {
	if (!productKey) return ''
	const resize = {
		0: {
			width: 400,
			fit: 'cover'
		},
		1: {
			width: 720,
			fit: 'cover',
		},
		2: {
			height: 128,
			fit: 'cover'
		},
		3: {
			width: 1800,
			fit: 'cover'
		},
		4: {
			width: 640, // 分类弹框图片
			height: 400,
			fit: 'cover'
		},
		10: {
			width: 114,
			height: 171,
			fit: 'cover',
		},
		11: {
			width: 75,
			height: 113,
			fit: 'cover',
		},
		12: {
			width: 152,
			height: 228,
			fit: 'cover',
		},
		13: {
			width: 136,
			height: 204,
			fit: 'cover',
		},
		14: {
			width: 700,
			height: 1050,
			fit: 'cover',
		},
		15: {
			width: 324,
			height: 324,
			fit: 'cover'
		},
		16: {
			width: 100,
			height: 100,
			fit: 'cover'
		}
	}
	const parameter = {
		bucket: process.env.VUE_APP_BUCKET || 'test-plushe', // 根据host来识别，如果是sit则填：test-plushe；如果是生产则填：pro-plushe
		key: productKey, // productKey, // 后台放回S3 图片key
		edits: {
			resize: resize[layout || 0],
		},
	}
	if (productKey.includes('.gif')) delete parameter.edits
	return `https://img.plushe.com/${Base64.encode(JSON.stringify(parameter))}`
}









//订单详情
export const getDiscountAmount = function (orderResp) {
	let { promotionAmountYuan, integrationAmountYuan, couponAmountYuan, discountAmountYuan } = orderResp || {}
	return promotionAmountYuan + integrationAmountYuan + couponAmountYuan + discountAmountYuan
}
export const getShippingAddress = function (addressList) {

	if (addressList) {
		return addressList['detailAddressone'] + ' ' + addressList['detailAddresstwo'] + ' ' + addressList['city'] + ' ' + addressList['state'] + ' ' + addressList['country'] + ' ' + addressList['postCode']
	}
	return ""
}
export const getPaseJSON = function (orderDetail, param) {
	return orderDetail ? orderDetail[param] : ''
}
export const getOrderStatus = function (orderResp, type) {
	let { orderStatus } = orderResp || {}
	if (type === 1) {
		return orderStatus === 0
	} else if (type === 2) {
		return orderStatus === 2 || orderStatus === 3
	} else if (type === 3) {
		return orderStatus === 3 || orderStatus === 5
	}
}
export const getProduceLen = function (orderDetail) {
	let { orderItemResp } = orderDetail
	if (orderItemResp) {
		let len = orderItemResp.reduce((pre, cur) => {
			return pre + cur.productQuantity
		}, 0)
		return len
	}
	return 0
}
export const getAttrList = function(item){
	let arr1 = []
	let arr2 = []
	let arr3 = []
	for(let key in item){
		if(key.indexOf("attr")!=-1&&item[key]!=""&&key.indexOf("attrVal")==-1){
			arr1.push(item[key])
		}
		if(key.indexOf("attrVal")!=-1&&item[key]!=""){
			arr2.push(item[key])
		}
	}
	if(arr1.length==arr2.length){
		for(let i=0; i<arr1.length;i++){
			arr3.push({
				key:arr1[i],
				val:arr2[i]
			})
		}
		return arr3;
	}
	return arr3
}
