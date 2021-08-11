import $http from '@/api/modules/mine'
import { setDevWishList, getDevWishList } from '@/utils/auth.js'
const state = {
	wishList: [],
	wishData:{
		list:[]
	},
	devwishlist: getDevWishList() || []
}

const mutations = {
	setWishList(state, payload) {
		state.wishList = payload
	},
	setWishData(state, payload) {
		state.wishData = payload
	},
	devWishlistData(state, payload){
		
		if(payload.type == 0){
			state.devwishlist.push(payload.productNo)
		}else{
			// 如果是本地已有的 取消收藏（）
			let newDevWishList =  state.devwishlist.filter((item) => {
				return item != payload.productNo
			})
			state.devwishlist = newDevWishList
		}
		setDevWishList(state.devwishlist)
	},
	setWishListData(state, list){
		state.devwishlist = list
		setDevWishList(state.devwishlist)
	}
}

const actions = {
	addWishList({commit},payload){
		console.log(commit)
		return $http.addWishList(payload)
	},
    deleteWishList({commit},payload){
		console.log(commit)
		return $http.deleteWishList(payload)
	},
    queryWishList({commit},payload){
		$http.queryWishList(payload).then((res)=>{
			let {data} = res
			commit('setWishList', data.list)
			commit('setWishData', data)
			// 将请求获得设置成本地列表
			let newDevListData = []
			data.list.map(item => {
				newDevListData.push(item.productNo)
			})
			commit('setWishListData', newDevListData)
		})
	},
    updateWishList({commit},payload){
		console.log(commit)
		return $http.updateWishList(payload)
	},
	isUserCollect({commit}, payload){
		console.log(commit)
		return $http.isUserCollect(payload)
	},
	addBatchWishList({commit}, payload){
		console.log(commit)
		// 登录以后清空本地存储的收藏
		commit('devWishlistData', [])
		return $http.addBatchWishList(payload)
	},
	devAddWishList({commit}, devwishlist){
		commit('devWishlistData', devwishlist)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
