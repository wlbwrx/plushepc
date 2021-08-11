import store from 'store'

// token
export function setToken(value) {
	store.set('token', value)
}

export function getToken() {
	return store.get('token')
}

export function removeToken() {
	store.remove('token')
	store.remove('userInfo')
}

// 用户信息
export function setUserInfo(obj) {
	store.set('userInfo', obj)
}
export function getUserInfo() {
	return store.get('userInfo')
}

// 购物车信息
export function setCarList(list) {
	store.set('carList', list)
}
export function getCarList() {
	return store.get('carList')
}
export function setExpiredList(list) {
	store.set('expiredList', list)
}
export function getExpiredList(list) {
	store.set('expiredList', list)
}
//本地存储的的收藏
export function setDevWishList(list){
	store.set('devwishlist', list)
}
export function getDevWishList() {
	return store.get('devwishlist')
}
// 登录方式
export function getLoginMethod() {
	return store.get('loginMethod')
}
export function setLoginMethod(type) {
	if (type == undefined) {
		store.remove('loginMethod')
	} else {
		store.set('loginMethod', type)
	}
}
