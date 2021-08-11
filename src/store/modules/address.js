import $http from '@/api/modules/mine'
const state = {
	shippingAddress: {},
	billingAddress: {},
}

const mutations = {
	SET_shippingAddress(state, data) {
		state.shippingAddress = data || {}
	},
	SET_billingAddress(state, data) {
		state.billingAddress = data || {}
	},
}

const actions = {
	DEL_ADDRESS({commit},payload){
		console.log(commit)
		return $http.deleteByAddress(payload)
	},
	UPDATE_ADDRESS({commit},payload){
		console.log(commit)
		return $http.updatetUserAddress(payload)
	},
	ADD_ADDRESS({commit},payload){
		console.log(commit)
		return $http.addUserAddress(payload)
	},
    GET_USERADDRESS({commit}, payload){
		console.log(commit)
        return $http.querytUserAddress(payload)
		// .then((res)=>{
        //     let {data} = res
        //     commit('SET_USERADDRESS', data)
        // })
    },
	GET_USERADDRESS_DETAIL({commit}, payload){
		console.log(commit)
		return $http.getByAddress(payload)
		// .then((res)=>{
        //     let {data} = res
        //     commit('SET_USERADDRESS_DETAIL', data)
        // })
	},
	SET_DEFAULTARRESSADD_ADDRESS({commit},payload){
		console.log(commit)
		return $http.makeDefaultAddress(payload)
	},
	getUserDefaultAddress({commit},payload){
		console.log('getUserDefaultAddress')
		console.log(commit)
		return $http.getUserDefaultAddress(payload).then(res => {
			return res
		})
	}

}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
