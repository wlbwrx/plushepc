import http from '@/api/user'
import $http from '@/api/index'
import router from '@/router'

import { setToken, getToken, removeToken, setUserInfo, getUserInfo, getLoginMethod, setLoginMethod } from '@/utils/auth.js'

const state = {
	token: getToken(),
	user: getUserInfo() || {},
	loginSwipeIndex: 0,
	userList: {},
	userEmail: '', // 用户邮箱
	loginMethod: getLoginMethod() || 0, // 登录方式
	loginDialogIs: false, //登录框状态
	shopCarStatus: false, // 购物车状态
	backPath: '', //用来记录当前页面的上一个页面 直接用router返回会出现bug
	slideCouponHide: window.sessionStorage.getItem('slideCouponHide'), // 是否隐藏侧栏优惠券提示
	newPeopleCouponVal: 0, // 新人优惠券金额
}

const mutations = {
	SET_TOKEN: (state, token) => {
		setToken(token)
		state.token = token
	},
	SET_USER: (state, obj) => {
		setUserInfo(obj)
		state.user = obj
	},
	SETTING_USER(state, data) {
		state.userList = data
	},
	SET_USEREMAIL(state, email) {
		state.userEmail = email
	},
	SET_LOGINSWIPEINDEX(state, index) {
		state.loginSwipeIndex = index
	},
	SET_LOGINMETHOD(state, type) {
		state.loginMethod = type
		setLoginMethod(type)
	},
	setSlideCoupon(state, bool) {
		state.slideCouponHide = bool
		window.sessionStorage.setItem('slideCouponHide', bool)
	},
	loginDialogIs(state, boolean) {
		state.loginDialogIs = boolean
	},
	shopCarStatus(state, boolean){
		state.shopCarStatus = boolean
	},
	backPath(state, string) {
		state.backPath = string
	},
	// 新人优惠券金额:
	setNewPeopleCouponVal(state, val) {
		state.newPeopleCouponVal = val ? (val / 100).toFixed(2) : 0
	},
}

const actions = {
	// 邮箱-登陆
	Login({ commit }, params) {
		return new Promise((resolve, reject) => {
			http.login(params)
				.then(response => {
					const { data } = response
					commit('SET_TOKEN', data.userToken)
					commit('SET_USER', data)
					resolve()
				})
				.catch(error => {
					reject(error)
				})
		})
	},
	// 登出：
	Signout({ commit }) {
		return new Promise(resolve => {
			commit('SET_TOKEN', null)
			commit('shopCar/setCarExpiredList', null, { root: true })
			commit('shopCar/setCarListData', null, { root: true })
			commit('wish/setWishListData', null, { root: true }) // 清空本地存储的收藏列表
			removeToken()
			router.push({
				path: `/home`,
			})
			resolve()
		})
	},
	// 邮箱-注册
	Register({ commit }, params) {
		params.registerMode = 1
		return new Promise((resolve, reject) => {
			http.register(params)
				.then(response => {
					const { data } = response
					commit('SET_TOKEN', data.userToken)
					commit('SET_USER', data)
					resolve()
				})
				.catch(error => {
					reject(error)
				})
		})
	},
	// 三方-登录
	ThirdLogin({ commit }, params) {
		return new Promise((resolve, reject) => {
			http.third(params)
				.then(response => {
					const { data } = response
					commit('SET_TOKEN', data.userToken)
					commit('SET_USER', data)
					resolve(data)
				})
				.catch(error => {
					reject(error)
				})
		})
	},
	getUser({ commit }, params) {
		http.getUser(params).then(res => {
			let { data } = res || {}
			commit('SETTING_USER', data)
		})
	},
	updateUser({ commit }, payload) {
		console.log(commit)
		return http.updateByUser(payload)
	},
	getNewPeopleCoupon({ commit }) {
		$http.coupon.newPeople().then(res => {
			commit('setNewPeopleCouponVal', res.data.couponAmount)
		})
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
