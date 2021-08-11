import { Toast } from 'vant'
import http from '@/api/index.js'
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

export default {
	props: {
		actived: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			// 购物车step步骤条 共用 只需要修改actived的值即可修改状态
			// actived: 0,
			stepList: [
				{
					name: 'Your Cart',
					index: 0,
					next: true,
				},
				{
					name: 'Place Order',
					index: 1,
					next: true,
				},
				{
					name: 'Pay Now',
					index: 2,
					next: true,
				},
				{
					name: 'Order Complete',
					index: 3,
				},
			],
			// 猜你喜欢（推荐） you also like
			recommendList: [], // You Like
			shippMethod: 0,
			sizeGuideList: { CM: { datas: [] }, IN: { datas: [] } }, // 商品尺码
		}
	},
	filters: {
		// 过滤过长导致的内容溢出 obj 表示内容  num 表示截取多少长度
		attrVals(obj, num) {
			let vals = ''
			for (let key in obj) {
				vals += obj[key] + '/'
			}
			// return vals.substring(0, vals.length-1)
			return vals.length > num ? vals.substring(0, num) + '...' : vals.substring(0, vals.length - 1)
		},
		// 过滤过长的商品描述
		productNameFilter(obj, num) {
			return obj.length > num ? obj.substring(0, num) + '...' : obj
		},
	},
	// 计算属性 公共store值和方法
	computed: {
		// 购物车里的参数
		...mapState('shopCar', {
			goodsList: state => state.carList, // 购物车有效数据列表
			expiredList: state => state.expiredList, // 购物车失效数据列表
			isEdit: state => state.isEdit,
			totalPrice: state => state.totalPrice, // 购物车选中的商品总共价格
			retailPrice: state => state.retailPrice, // 购物车
			lackForFreeExpressAmount: state => state.lackForFreeExpressAmount, // 购物车还差多少金额满减
			isAllChecked: state => state.isAllChecked, // 购物车编辑时是否已经全选
			selectCoupon: state => state.checkOrderDetail.selectCoupon || {}, //选择的优惠券
			orderParams: state => state.orderParams,
			checkOrderDetail: state => state.checkOrderDetail, // 计算各种各样的价格
			selectPromo: state => state.checkOrderDetail.selectPromo || {}, //选择的优惠券
		}),
		...mapGetters({
			skuNos: 'shopCar/skuNos', // 选中的商品id
			token: 'token', // 判断是否登录
			effectiveTotalNum: 'shopCar/effectiveTotalNum', // 购物车已经选择的商品
			newPeopleCouponVal: 'newPeopleCouponVal',
		}),
		// 判断购物车是否为空
		isEmpty() {
			return this.goodsList.length == 0 && this.expiredList.length == 0
		},
	},
	methods: {
		...mapActions('shopCar', {
			getCarList: 'getCarList', // 获取购物车数据
			selectSingle: 'selectSingle', // 单选
			changeNum: 'changeNum', // 数量更改
			selectAll: 'selectAll', // 是否全选
			checkout: 'checkout', // 结账台
			getPublicKeyByChannelId: 'getPublicKeyByChannelId', // 获取支付通道公钥
		}),
		...mapActions('wish', ['addWishList', 'deleteWishList']),
		...mapMutations({
			switchDelete: 'shopCar/switchDelete', // 显示删除框
			setCheckOrderDetail: 'shopCar/setCheckOrderDetail',
			setOrderParams: 'shopCar/setOrderParams',
		}),
		// 公共优惠券处理模块
		getConfigInfo() {
			const data = this.checkOrderDetail
			const orderParams = { ...this.orderParams }
			let { availableCoupons, items, lackForFreeExpressAmount } = data

			this.availableCoupons = availableCoupons

			if (lackForFreeExpressAmount === 0) {
				this.shippMethod = 0
			}
			orderParams.productSkuVoList = items.map(item => {
				let { productId, productNo, skuNo, num } = item
				return { productId, productNo, skuNo, productQuantity: num }
			})
			this.setOrderParams(orderParams)
		},
		// 关闭编辑商品sku弹窗
		closeEdi(bool) {
			console.log(bool)
			this.isEditAttr = bool
		},
		// 获取猜你喜欢（推荐）：
		getRecommend() {
			const query = {
				pageNum: 1,
				pageSize: 20, // 后端做的最大100条
				// shopsId: this.$store.getters.shopsId || undefined,
				type: 2, // // 3-表示商品详情, 2-购物车, 1-首页
			}
			http.home.recommend(query).then(res => {
				this.recommendList = res.data
				this.$nextTick(() => {
					this.initBanner() // 初始化滚动导航
				})
			})
		},
		// 购物车增加/减少数量
		// 增加数量
		addNum(item) {
			if (item.num >= 99) {
				Toast('Only can add up to 99')
				return
			}
			this.changeNum({
				type: 1,
				goods: item,
			})
		},
		// 减少数量
		cutNum(item) {
			if (item.num <= 1) {
				// Toast('The quantity cannot be reduced anymore')
				this.switchDelete(item.skuNo)
				return
			}
			this.changeNum({
				type: 0,
				goods: item,
			})
		},
		// 数据上报：
		reportData(type) {
			let items = [],
				obj = {
					currentcy: 'USD',
					value: this.totalPrice / 100,
				}
			this.goodsList.forEach(item => {
				if (item.check) {
					if (type == 'GA4') {
						// 新版GA
						items.push({
							item_id: item.skuNo,
							item_name: item.productName,
							quantity: item.num,
							promotion_name: '常规',
							item_brand: item.brandName,
							price: (item.discountPrice || item.price) / 100,
						})
					} else {
						items.push({
							id: item.skuNo,
							name: item.productName,
							brand: item.brandName,
							price: (item.discountPrice || item.price) / 100,
							quantity: item.num,
							skuNo: item.skuNo,
						})
					}
				}
			})
			if (type == 'fb') {
				// fb 使用 spu
				obj.content_type = 'product_group'
				obj.num_items = this.totalNum
				items = items.map(item => {
					item.id = item.productNo
					return item
				})
				obj.contents = items
			} else {
				obj.items = items
			}
			return obj
		},
		// 根据属性计算sku库存
		calculationInventory(obj) {
			if (!obj.skus) return
			const { list, skus } = obj
			const active = []
			const skuObj = {}
			skus.forEach(item => {
				const attrVal1 = item.attrVal1 || '',
					attrVal2 = item.attrVal2 || '',
					attrVal3 = item.attrVal3 || '',
					attrVal4 = item.attrVal4 || ''
				const key = `${attrVal1},${attrVal2},${attrVal3},${attrVal4}`.replace(/(,+$)/gm, '')
				skuObj[key] = { ...item }
			})
			list.forEach((item, index) => {
				active[index] = '.+'
				item.attrValList.forEach(element => {
					if (element.isDefault) {
						active[index] = element.val
					}
				})
			})
			list.forEach((item, index) => {
				item.attrValList.forEach(element => {
					const currentObj = active.map((item, i) => (index == i ? element.val : item)).join(',')
					if (currentObj.includes('.+')) {
						element.disabled = false
						return
					}
					element.disabled = !skuObj[currentObj]
					if (element.disabled) {
						element.isDefault = false
					}
				})
			})
		},
	},
}
