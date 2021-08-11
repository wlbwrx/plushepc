import store from 'store'
import http from '@/api/index'
import { platformId } from '@/utils/app.js'

const state = {
	client: store.get('client') || undefined, // ios、android,打包成app时,用于判断是否为ios
	title: '',
	platformId: platformId, // 1-Plushe,2-GeeMart 平台id
	InvitationCode: store.get('InvitationCode') || '', // 分销字段名
	shopsId: store.get('shopsId') || undefined, // 当前店铺id
	shopsInfo: store.get('shopsInfo') || [], // 所有店铺信息
	categoryMenu: store.get('categoryMenu') || [], // 分类信息
	categoryMenuId: store.get('categoryMenuId') || '', // 分类ID
	currentServerTime: 0, // 服务器当前时间
	freeShipping: '49.99', // 运费金额
	goBackUrlList: [],
	payPalOnly: false,
}

const mutations = {
	SET_payPalOnly: (state, payPalOnly) => {
		state.payPalOnly = payPalOnly || false
	},
	SET_goBackUrl: (state, goBackUrl) => {
		state.goBackUrlList = goBackUrl
	},
	SET_TITLE: (state, title) => {
		state.title = title
	},
	// 分销
	SET_INVITATION_CODE: (state, invitation) => {
		state.InvitationCode = invitation || undefined
		store.set('InvitationCode', invitation || undefined)
	},
	// 店铺
	SET_SHOPSID: (state, id) => {
		state.shopsId = id || undefined
		store.set('shopsId', id || undefined)
	},
	SET_SHOPSINFO: (state, info) => {
		state.shopsInfo = info
		store.set('shopsInfo', info)
	},
	// 分类
	SET_CATEGORYMENU: (state, menu) => {
		state.categoryMenu = menu
	},
	SET_CATEGORYMENUID: (state, id) => {
		state.categoryMenuId = id
		store.set('categoryMenuId', id)
	},
	// 服务器当前时间
	SET_CURRENTSERVERTIME: (state, time) => {
		state.currentServerTime = time
	},
	// ios 打包时的入口 https://m.plushe.com/home?client=ios, 登录时,会显示苹果登录
	SET_CLIENT: (state, name) => {
		state.client = name
		store.set('client', name)
	},
	// 设置运费金额:
	SET_FREESHIPPING(state, val) {
		state.freeShipping = val ? (val / 100).toFixed(2) : '49.99'
	},
}

const actions = {
	// 分类-左侧数据：
	CategoryMenu({ commit, state }) {
		return new Promise((resove, reject) => {
			const params = {
				shopsId: state.shopsId || undefined,
			}
			http.category
				.categoryLeft(params)
				.then(res => {
					const list = res.data
					if (state.platformId == 2 && !state.shopsId) {
						// GeeMart平台下-手动加上店铺信息
						list.push({
							name: 'Brand Wall',
							id: -1,
						})
					}
					store.set('categoryMenu', list)
					commit('SET_CATEGORYMENU', list)
					if (!state.categoryMenuId && list.length) commit('SET_CATEGORYMENUID', list[0].id)
					resove()
				})
				.catch(err => {
					reject(err)
				})
		})
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
