import $http from '@/api/modules/mine'
const state = {
	couponList: [],
	// isCoupon: false,
	receiveList:[]
}

const mutations = {
	SET_COUPON(state, data) {
		if(data && data.list && data.list.length>0){
			state.couponList = data.list.map((item)=>{
				if(!item['switchOn']) item['switchOn'] = true
				return item
			})
		}else{
			state.couponList = []
		}
		
	},
	SET_COUPON_LIST(state, payload){
		console.log(payload)
		state.receiveList = payload
	},
	// SET_COUPON_STATUS(state, payload){
	// 	state.isCoupon = payload
	// }
}
const actions = {
	CONVERTCOUPON ({commit}, payload){
		return $http.convertCoupon(payload)
	},	
	GET_USERCOUPON({commit}, payload){
		commit('SET_COUPON', [])
		$http.queryUserCoupon(payload).then((res)=>{
			let {data} = res
			commit('SET_COUPON', data)
		})
	},  
	ORDER_CONFIG({commit}, payload){
		return $http.orderConfig(payload)
		// .then((res)=>{
		// 	let {data} = res
		// 	commit('SET_ORDER_CONFIG', data)
		// })
	},
	getNewComerCoupon({commit}, payload){
		commit('SET_COUPON_LIST', [])
		$http.getNewComerCoupon(payload).then((res)=>{
			let {data} = res
			commit('SET_COUPON_LIST', data)
		})	
	},
	getUserEnableSpecialCoupon({commit}, payload){
		$http.getUserEnableSpecialCoupon(payload).then((res)=>{
			let {data} = res
			commit('SET_COUPON_LIST', data)
		})	
	}
	
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
