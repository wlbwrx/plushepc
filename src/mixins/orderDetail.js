import store from 'store'
import { mapState, mapActions, mapMutations } from 'vuex'
import { loadStripe } from '@stripe/stripe-js'

export default {
	created() {
		let payBack = store.get('payBack')
		if (payBack) store.remove('payBack')
		this.getOrderDetail(this.orderSn)
	},
	computed: {
		...mapState('order', ['closeReasonList', 'orderDetail']),
	},
	methods: {
		...mapMutations('order', ['SET_REVIEW']),
		...mapActions('order', ['getOrderDetail', 'getCloseReason', 'setCloseReason']),
		...mapActions('pay', ['createPayment']),
		...mapMutations('pay', ['setPayInfo']),
		getProduceLen(orderDetail) {
			let { orderItemResp } = orderDetail
			if (orderItemResp) {
				let len = orderItemResp.reduce((pre, cur) => {
					return pre + cur.productQuantity
				}, 0)
				return len
			}
			return 0
		},
		closeReaSOn(orderResp) {
			this.param.orderSn = orderResp.orderSn
			this.param.orderId = orderResp.id
			this.showCloseReason = true
			this.getCloseReason(2)
		},
		payFun() {
			let { shopsId, payType, orderSn } = this.orderDetail.orderResp
			this.createPayment({ shopsId, orderChannel: payType, orderSn }).then(res => {
				let { data } = res
				this.setPayInfo(data)
				window.location.href = data.thirdPaymentUrl
			})
		},
		// 弹框里的 pay now 支付按钮:
		toCreatePay() {
			let { shopsId, orderSn } = this.orderDetail.orderResp
			let payType = this.payType
			this.createPayment({ shopsId, orderChannel: payType, orderSn })
				.then(res => {
					this.setPayInfo(res.data)
					// 创建支付失败:
					if (res.data.paymentStatus == 5) {
						if (res.data.thirdErrorDesc) this.toastShow(res.data.thirdErrorDesc)
						setTimeout(() => {
							this.reload()
						}, 1500)
						return
					}
					try {
						// 数据上报,检查缓存中是否有该订单对应的商品信息缓存:
						let reportOrderGoods = store.get('reportOrderGoods') || []
						let isHaveOrderInfoStore = reportOrderGoods.some(item => item.transaction_id == orderSn)
						if (!isHaveOrderInfoStore) {
							// 没有该笔订单对应的商品缓存,
							let reportItems = []
							this.orderDetail.orderItemResp.forEach(item => {
								reportItems.push({
									id: item.skuNo,
									brand: item.brand,
									name: item.productName,
									price: item.productPriceYuan,
									quantity: item.productQuantity,
								})
							})
							let reportData = {
								coupon: this.orderDetail.orderResp.couponAmountYuan || undefined,
								promotionCode: this.orderDetail.orderResp.couponCode || undefined,
								currency: 'USD',
								checkout_option: (payType == 1 && 'ppaypal') || (payType == 2 && 'visa') || (payType == 3 && 'master') || (payType == 4 && 'stripe'),
								checkout_step: 1,
								value: this.orderDetail.orderResp.totalPayAmountYuan,
								shipping: this.orderDetail.orderResp.freightAmountYuan, // 运费
								tax: this.orderDetail.orderResp.taxAmountYuan, // 税费
								transaction_id: orderSn, // 订单编号
								items: reportItems,
							}
							reportOrderGoods.push(reportData)
							store.set('reportOrderGoods', reportOrderGoods) // 将数据缓存起来，结算完成后将对应的存入删除
						}
					} catch (err) {
						console.log(err)
					}
					// 4: Stripe 支付, 1: paypel 支付,
					if (payType == 4) {
						loadStripe(res.data.thirdClientKey).then(stripe => {
							stripe.redirectToCheckout({ sessionId: res.data.paymentRespSn })
						})
					} else {
						window.location.href = res.data.thirdPaymentUrl
					}
				})
				.catch(err => {
					let { msg } = err
					this.toastShow(msg)
					setTimeout(() => {
						this.reload()
					}, 1500)
				})
		},
		viewReview(item) {
			this.$router.push({ name: 'orderReview', query: { orderSn: item.orderSn, to: 'Orders Detail' } })
		},
		getDiscountAmount(orderResp) {
			let { promotionAmountYuan, integrationAmountYuan, couponAmountYuan, discountAmountYuan } = orderResp || {}
			let newnumber = promotionAmountYuan + integrationAmountYuan + couponAmountYuan + discountAmountYuan
			return newnumber.toFixed(2)
		},
		changeVisible(bool) {
			this.trankOut = bool
		},
		changeVisibleDetail(bool) {
			this.trankInner = bool
		},
		viewLogistics(item) {
			this.trankOut = false
			this.trankInner = false
			let { orderResp, orderLogisticsRespList } = item
			if (orderLogisticsRespList && orderLogisticsRespList.length > 1) {
				this.trankOut = true
				this.itemData = { orderSn: orderResp.orderSn }
			} else if (orderLogisticsRespList && orderLogisticsRespList.length == 1) {
				this.trankInner = true
				let [{ deliveryCompany, deliverySn, orderId, orderSn, shopsId }] = orderLogisticsRespList || []
				this.itemData = { deliveryCompany, deliverySn, orderId, orderSn, shopsId }
			}
		},
	},
}
