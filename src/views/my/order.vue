 <template>
	<div class="my-orders">
		<div class="order-all-right">
			<div class="order-head">My Orders</div>
			<div class="order-tabs">
				<div :class="currentTabComponent == 'ALL' ? 'check' : ''" @click="handleTabClick('ALL')">All Orders</div>
				<div :class="currentTabComponent == 'Unpaid' ? 'check' : ''" @click="handleTabClick('Unpaid')">Unpaid</div>
				<div :class="currentTabComponent == 'Processing' ? 'check' : ''" @click="handleTabClick('Processing')">Processing</div>
				<div :class="currentTabComponent == 'Shipped' ? 'check' : ''" @click="handleTabClick('Shipped')">Shipped</div>
			</div>
			<div class="content-title" v-if="orderList.list && orderList.list.length > 0">
				<div class="title-products">Products</div>
				<div class="title-total">Total</div>
				<div class="title-status">Status</div>
				<div class="title-order-operation">Operation</div>
			</div>
			<div class="empty-box" v-if="!(orderList.list && orderList.list.length > 0)">
				<img :src="noOrder" alt="" class="empty-box-img" />
				<div class="empty-box-text">It is empty here!</div>
			</div>
			<div v-if="orderList.list && orderList.list.length > 0">
				<div class="content" v-for="(item, index) in orderList.list" :key="index">
					<div class="content-head">
						<div class="content-head-left">
							{{ $utils.orderTime(item.orderResp.createTime.slice(0, 19)) }} Order NO. {{ item.orderResp.orderSn }}
							<div style="color: #999; border-bottom: 1px solid #999; float: right; margin-left: 20px; font-size: 12px; cursor: pointer" v-clipboard:copy="item.orderResp.orderSn" v-clipboard:success="onCopy">copy</div>
						</div>
						<!-- <div class="content-head-right"><i class="iconfont icon-shanchu" ></i></div> -->
					</div>
					<div class="content-bottom">
						<img-view :data="item.orderItemResp"></img-view>
						<div class="content-total">{{ 'US$' + item.orderResp.totalPayAmountYuan }}</div>
						<div class="content-status">{{ orderStatus[item.orderResp.orderStatus] }}</div>
						<div class="content-operation">
							<div class="order-btn" @click="goDetail(item.orderResp.orderSn)">Order Details</div>
							<div class="order-btn-2 payNow" v-show="$utils.getOrderStatus(item.orderResp, 1)" @click="paymentFun(item)">Pay Now</div>
							<div class="order-review" v-show="$utils.getOrderStatus(item.orderResp, 3) && !item.orderResp.isOverEvaluate" @click="viewReview(item.orderResp)">Review</div>
							<div class="order-btn-2 track" v-show="$utils.getOrderStatus(item.orderResp, 2)" @click="viewLogistics(item)">Track</div>
						</div>
					</div>
				</div>
				<div style="float: left; height: 50px; width: 1096px; text-align: right">
					<el-pagination layout="prev, pager, next" :total="orderList.total" @current-change="handleSizeChange"> </el-pagination>
				</div>
			</div>

			<template v-if="trankOut || trankInner">
				<trank :outerVisible="trankOut" :innerVisible="trankInner" :data="itemData" v-on:changeVisible="changeVisible" v-on:changeVisibleDetail="changeVisibleDetail"></trank>
			</template>
			<el-dialog title="Please select the payment method" :visible.sync="dialogFormVisible">
				<el-form>
					<el-form-item v-for="item in payList" label="" :key="item.value" label-width="0">
						<el-radio v-model="payType" class="pay-type" :label="item.value"
							><img class="pay-type-img" :src="item.icon" /><label class="pay-type-content">{{ item.label }}</label></el-radio
						>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">Cancal</el-button>
					<el-button
						type="primary"
						@click="
							dialogFormVisible = false
							toCreatePay()
						"
						>Confirm</el-button
					>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { orderTabs, msgTabs, tabKeyToValue, payList, orderStatus } from '@/utils/enums'
import Trank from './components/trank.vue'
import imgView from './components/imgView.vue'
import noOrder from '@assets/images-pc/noOrders.png'
import { loadStripe } from '@stripe/stripe-js'
import store from 'store'

export default {
	computed: {
		...mapState('order', ['orderList']),
	},
	components: {
		Trank,
		imgView,
	},
	data() {
		let defaultTab = orderTabs[0]
		return {
			payList,
			currentTabComponent: defaultTab,
			orderTabs,
			orderStatus,
			msgTabs,
			noOrder,
			orderDetail: {},
			trankOut: false,
			trankInner: false,
			payType: 1,
			dialogFormVisible: false,
			itemData: {},
			param: {
				pageNum: 1,
				pageSize: 10,
				orderStatusList: tabKeyToValue[defaultTab],
			},
		}
	},
	created() {
		this.getOrderList(this.param)
	},
	mounted() {},
	methods: {
		...mapActions('order', ['getOrderList']),
		...mapActions('pay', ['createPayment']),
		...mapMutations('pay', ['setPayInfo']),
		toastShow(msg) {
			this.$message.error(msg)
		},
		onCopy() {
			this.$message.success('Copied')
		},
		paymentFun(orderDetail) {
			this.orderDetail = orderDetail
			this.payType = orderDetail.orderResp.payType
			this.dialogFormVisible = true
		},
		handleTabClick(tab) {
			this.currentTabComponent = tab
			this.param.orderStatusList = tabKeyToValue[tab]
			this.getOrderList(this.param)
		},
		handleSizeChange(val) {
			this.param.pageNum = val
			this.getOrderList(this.param)
		},
		goDetail(id) {
			this.$router.push({ path: `/orderDetail/${id}` })
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
			} else {
				this.$message.error('There is no logistics order！')
			}
		},
		viewReview(item) {
			console.log(item)
			this.$router.push({ name: 'orderReview', query: { orderSn: item.orderSn, to: 'My Orders' } })
		},
		payFun(item) {
			let { shopsId, payType, orderSn } = item
			this.createPayment({ shopsId, orderChannel: payType, orderSn }).then((res) => {
				let { data } = res
				this.setPayInfo(data)
				window.location.href = data.thirdPaymentUrl
			})
		},
		toCreatePay() {
			let { shopsId, orderSn } = this.orderDetail.orderResp
			let payType = this.payType
			this.createPayment({ shopsId, orderChannel: payType, orderSn })
				.then((res) => {
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
						let isHaveOrderInfoStore = reportOrderGoods.some((item) => item.transaction_id == orderSn)
						if (!isHaveOrderInfoStore) {
							// 没有该笔订单对应的商品缓存,
							let reportItems = []
							this.orderDetail.orderItemResp.forEach((item) => {
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
						loadStripe(res.data.thirdClientKey).then((stripe) => {
							stripe.redirectToCheckout({ sessionId: res.data.paymentRespSn })
						})
					} else {
						window.location.href = res.data.thirdPaymentUrl
					}
				})
				.catch((err) => {
					let { msg } = err
					this.toastShow(msg)
					setTimeout(() => {
						this.reload()
					}, 1500)
				})
		},
	},
}
</script>

<style lang="less" scoped>
@import '@/style/variable.less';
/deep/ .el-form-item {
	margin-bottom: 16px;
}
.pay-type {
	display: flex;
	.pay-type-img {
		max-height: 16px;
	}
	.pay-type-content {
		margin-left: 10px;
		line-height: 20px;
	}
}
.my-orders {
	.icon-shanchu {
		font-size: 20px;
	}
	.order-all-right {
		width: 1096px;
		float: right;
		margin-bottom: 80px;
	}
	.content-title {
		height: 54px;
		text-align: center;
		font-size: 14px;
		font-family: Montserrat Regular;
		line-height: 14px;
		padding: 20px 0 20px 0;
		color: @color-666;
		box-shadow: 0px 1px 0px 0px #f5f5f5 inset;
		.title-products {
			float: left;
			width: 256px;
		}
		.title-total {
			float: left;
			width: 146px;
		}
		.title-status {
			float: left;
			width: 130px;
		}
		.title-order-operation {
			float: left;
			width: 364px;
		}
	}
	.empty-box {
		margin: 0 auto;
		background-color: #f7f8fa;
		height: 246px;
		width: 1096px;
		text-align: center;
		.empty-box-img {
			width: 164px;
			height: 132px;
			margin-top: 40px;
		}
		.empty-box-text {
			font-size: 12px;
			font-family: Montserrat Regular;
			height: 14px;
			line-height: 14px;
			margin-top: 20px;
			color: @color-999;
		}
	}
	.content {
		text-align: center;
		float: left;
		margin-bottom: 30px;
		.content-bottom {
			background: #fff;
			float: left;
		}
		.content-head {
			font-family: Montserrat Light;
			padding: 14px 18px 14px 20px;
			height: 42px;
			background: #f7f8fa;
			.content-head-left {
				font-size: 12px;
				color: @color-666;
				float: left;
			}
			.content-head-right {
				font-size: 12px;
				color: @color-666;
				float: right;
			}
		}
		.content-total {
			font-size: 14px;
			font-family: Montserrat Medium;
			width: 146px;
			float: left;
			line-height: 213px;
		}
		.content-status {
			font-size: 14px;
			font-family: Montserrat Light;
			width: 130px;
			float: left;
			line-height: 213px;
		}

		.content-operation {
			width: 364px;
			float: left;
		}
		.order-btn {
			float: right;
			margin-left: 20px;
			line-height: 14px;
			margin-top: 100px;
			color: #5689c6;
			font-size: 12px;
			font-family: Montserrat Light;
			cursor: pointer;
		}
		.order-review {
			width: 69px;
			height: 25px;
			background: #fff;
			line-height: 25px;
			float: right;
			text-align: center;
			margin-left: 20px;
			margin-top: 94px;
			color: #222222;
			border: 1px solid #222222;
			cursor: pointer;
		}
		.order-btn-2 {
			font-size: 14px;
			font-family: Montserrat Light;
			height: 25px;
			line-height: 25px;
			background: #222222;
			float: right;
			text-align: center;
			margin-left: 20px;
			margin-top: 94px;
			color: #ffffff;
			cursor: pointer;
		}
		.payNow {
			width: 81px;
		}
		.track {
			width: 61px;
		}
	}
}
</style>



