import store from 'store'
import { mapActions, mapMutations } from 'vuex'
export default {
	created() {
		if (this.type == 'cancel') {
			this.gotoNext()
			return
		}
		this.SET_TITLE('Payment')
		let shippingMethod = store.get('shippingMethod')
		if (shippingMethod) store.remove('shippingMethod')
		let couponCode = store.get('couponCode')
		if (couponCode) store.remove('couponCode')
		/*
			1.如果是stripe 支付,则先调用 查询支付订单 接口,若失败,继续调用订单查询接口
			2.如果是paypel 支付,则先调用 绑定支付订单 接口,若失败,继续调用订单查询接口
		*/
		let funName = this.param.orderChannel == 4 ? 'queryPayment2' : 'setCapturePayment'
		this[funName](this.param).then(res => {
			console.log('cancelProgress', this.cancelProgress)
			if (this.cancelProgress) return
			let { paymentStatus, orderSn } = res.data

			if (paymentStatus) {
				if (paymentStatus === 4) {
					console.log('成功')
					this.payType = 1
					this.SET_TITLE('Payment Successful')

					this.dataReport()
					// 成功回调
				} else if (paymentStatus === 5) {
					this.SET_TITLE('Payment failed')
					this.payType = 2
					// 失败回调
				} else {
					this.SET_TITLE('Payment')
					this.getOrderStatus(orderSn)
				}
			} else {
				this.SET_TITLE('Payment')
				this.getOrderStatus(orderSn)
			}
		})
	},
	data() {
		let shopsId = store.get('shopsId')
		let payInfo = store.get('payInfo')
		let { type } = this.$route.query
		let { orderSn, orderChannel, paymentRespSn } = payInfo || {}
		return {
			timer: null,
			type,
			cancelProgress: false,
			payType: 0,
			param: {
				captureSource: 0,
				orderChannel,
				shopsId,
				orderSn,
				paymentRespSn,
			},
		}
	},
	destroyed() {
		this.SET_TITLE('')
		this.cancelProgress = true
		clearTimeout(this.timer)
	},

	methods: {
		...mapActions('pay', ['setCapturePayment', 'queryPayment', 'queryPayment2']), //订单状态： (0,"创建订单"), (1,"保存订单状态"), (2,"付款中状态"), (3,"付款成功") (4,"付款失败")
		...mapMutations('app', ['SET_TITLE']),
		getOrderStatus(orderSn) {
			this.queryPayment(orderSn).then(res => {
				let { orderStatus } = res.data.orderResp
				if (orderStatus === 0 || orderStatus === 6) {
					// 订单状态：0->待支付；1->处理中；2->已发货；3->已收货；4->交易关闭；5->交易完成
					this.timer = setTimeout(() => {
						this.getOrderStatus(orderSn)
					}, 15000)
				} else if (orderStatus === 1) {
					this.SET_TITLE('Payment Successful')
					this.payType = 1
					this.dataReport()
				} else {
					this.gotoNext()
				}
			})
		},
		gotoNext() {
			let { orderSn } = this.param
			// this.$router.replace({ name: 'orderDetail', query: { orderSn } })
			this.$router.replace({ name: 'orderDetail', params: { orderSn } })
		},
		// 支付成功事件上报:
		dataReport() {
			// 上报数据：
			let reportOrderGoods = store.get('reportOrderGoods')
			let reportData = null,
				i = -1
			if (reportOrderGoods) {
				reportOrderGoods.forEach((item, index) => {
					if (item.transaction_id == this.param.orderSn) {
						reportData = item
						i = index
					}
				})
			}
			if (reportData) {
				let reportData2 = { ...reportData }
				let GA4Items = []
				reportData.items.forEach(item => {
					GA4Items.push({
						item_id: item.id, // sku
						item_name: item.name,
						quantity: item.quantity,
						promotion_name: '常规',
						item_brand: item.brand,
						price: item.price,
					})
				})
				this.reportGtag('purchase', reportData) // 老版
				reportData2.items = GA4Items
				this.reportGtag('purchase', reportData2, 'GA4') // 新版
				this.reportFB(
					'Purchase',
					{
						content_type: 'product_group',
						currency: reportData.currency,
						value: reportData.value,
						contents: reportData.items.map(item => {
							item.id = item.spuNo
							return item
						}),
						action_source: 'website',
						event_source_url: location.href,
						// 'external-id': this.param.orderSn,
					},
					false,
					{ eventID: this.param.orderSn }
				)
				reportOrderGoods.splice(i, 1)
				store.set('reportOrderGoods', reportOrderGoods)
			}
		},
	},
}
