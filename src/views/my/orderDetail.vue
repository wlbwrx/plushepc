<template>
	<div class="order-detail">
		<div class="my-breadcrumb">Personal Center / My Orders / Orders Details</div>
		<div class="order-detail-head">Order Details</div>
		<div class="order-detail-left">
			<div class="left-head">
				<div>Order ID: {{ orderSn }}</div>
			</div>
			<div class="left-items-text">Order Product({{ $utils.getProduceLen(orderDetail) > 1 ? $utils.getProduceLen(orderDetail) + ' items' : $utils.getProduceLen(orderDetail) + ' item' }})</div>
			<div class="left-items-block">
				<div class="left-items" v-for="(item, index) in orderDetail.orderItemResp" :key="index">
					<div class="left-items-img">
						<img :src="$utils.imageHandler(10, item.picKey)" alt="" />
					</div>
					<div class="left-items-detail">
						<!-- <div class="left-items-detail-text1" v-if="item.brand">{{ item.brand }}</div> -->
						<div class="left-items-detail-text2">{{ item.productName }}</div>
						<div class="left-items-detail-text3">US${{ item.payPriceYuan }}</div>
						<div class="left-items-detail-text4">x{{ item.productQuantity }}</div>
						<div class="left-items-detail-text5">
							<template v-for="(data, i) in $utils.getAttrList(item)">
								<div :key="i">
									<span>{{ data.key }}: </span><span>{{ data.val }}</span>
								</div>
							</template>
						</div>
					</div>
				</div>
			</div>

			<div class="detail-title">Shipping Address</div>
			<div class="address-box-left">
				<div class="address-box-top">
					<div class="address-name">{{ $utils.getPaseJSON(orderDetail.orderAddressRespList[1], 'firstName') + ' ' + $utils.getPaseJSON(orderDetail.orderAddressRespList[1], 'lastName') }}</div>
					<div class="address-phone">{{ $utils.getPaseJSON(orderDetail.orderAddressRespList[1], 'phoneCode') + ' ' + $utils.getPaseJSON(orderDetail.orderAddressRespList[1], 'phone') }}</div>
				</div>
				<div class="address-box-bottom">
					<div class="address-text">{{ $utils.getShippingAddress(orderDetail.orderAddressRespList[1]) }}</div>
				</div>
			</div>
			<div class="detail-title">Billing Address</div>
			<div class="address-box-left">
				<div class="address-box-top">
					<div class="address-name">{{ $utils.getPaseJSON(orderDetail.orderAddressRespList[0], 'firstName') + ' ' + $utils.getPaseJSON(orderDetail.orderAddressRespList[0], 'lastName') }}</div>
					<div class="address-phone">{{ $utils.getPaseJSON(orderDetail.orderAddressRespList[0], 'phoneCode') + ' ' + $utils.getPaseJSON(orderDetail.orderAddressRespList[0], 'phone') }}</div>
				</div>
				<div class="address-box-bottom">
					<div class="address-text">{{ $utils.getShippingAddress(orderDetail.orderAddressRespList[0]) }}</div>
				</div>
			</div>
			<div class="detail-title">Shipping Method</div>
			<div class="method-text">{{ $utils.getPaseJSON(orderDetail.orderResp, 'shippMethodName') || 'Free Shipping' }}</div>
			<div class="detail-title">Payment Method</div>
			<div class="method-text">
				<img v-if="orderDetail.orderResp.payType == 1" src="@/assets/images/icons/cart-img-7.png" />
				<img v-else-if="orderDetail.orderResp.payType == 4" src="@/assets/images/icons/stripe.png" alt="" />
				<img v-else-if="orderDetail.orderResp.payType == 5" src="@/assets/images/icons/delivery.png" alt="" />
			</div>
		</div>
		<div class="order-detail-right">
			<div class="right-title">Order Summary</div>
			<div class="order-detail-right-item">
				<div class="right-text">Retail Price:</div>
				<div class="right-us-text color-1">US$ {{ $utils.getPaseJSON(orderDetail.orderResp, 'saleAmountYuan') }}</div>
			</div>
			<div class="order-detail-right-item">
				<div class="right-text">Subtotal:</div>
				<div class="right-us-text color-2">US$ {{ $utils.getPaseJSON(orderDetail.orderResp, 'totalAmountYuan') }}</div>
			</div>
			<div class="order-detail-right-item">
				<div class="right-text">Taxes:</div>
				<div class="right-us-text color-2">US$ {{ $utils.getPaseJSON(orderDetail.orderResp, 'taxAmountYuan') }}</div>
			</div>
			<div class="order-detail-right-item">
				<div class="right-text">Shipping fee:</div>
				<div class="right-us-text color-2">US$ {{ $utils.getPaseJSON(orderDetail.orderResp, 'freightAmountYuan') }}</div>
			</div>
			<div class="order-detail-right-item">
				<div class="right-text">Discount:</div>
				<div class="right-us-text color-3">US$ {{ getDiscountAmount(orderDetail.orderResp) }}</div>
			</div>
			<div class="order-detail-right-all">
				<div class="right-text-all">Subtotal:</div>
				<div class="right-us-text color-4">US$ {{ $utils.getPaseJSON(orderDetail.orderResp, 'totalPayAmountYuan') }}</div>
			</div>

			<div v-if="$utils.getOrderStatus(orderDetail.orderResp, 1)" class="order-btn" @click="paymentFun">Pay Now</div>
			<div v-if="$utils.getOrderStatus(orderDetail.orderResp, 2)" class="order-btn" @click="viewLogistics(orderDetail)">TRACK</div>
			<div v-if="$utils.getOrderStatus(orderDetail.orderResp, 3) && !orderDetail.orderResp.isOverEvaluate" class="order-review" @click="viewReview(orderDetail.orderResp)">REVIEW</div>
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
</template>

<script>
import mixin from '@/mixins/orderDetail'
import { payList, getPayTypes } from '@/utils/enums'
import Trank from './components/trank.vue'
export default {
	mixins: [mixin],
	components: {
		Trank,
	},
	data() {
		let { orderSn } = this.$route.params
		return {
			payList,
			dialogFormVisible: false,
			orderSn,
			getPayTypes,
			showCloseReason: false,
			trankOut: false,
			trankInner: false,
			itemData: {},
			payType: 1,
			param: {
				returnReasonId: 0,
				orderSn: '',
				orderId: 0,
			},
		}
	},
	methods: {
		toastShow(msg) {
			this.$message.error(msg)
		},
		closeReaSOn() {},
		paymentFun() {
			this.payType = this.orderDetail.orderResp.payType
			this.dialogFormVisible = true
		},
	},
	created() {},
}
</script>

<style lang="less" scoped>
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
.order-detail {
	max-width: 1200px;
	margin: auto;
}
.order-detail-head {
	height: 96px;
	text-align: center;
	line-height: 96px;
	font-size: 30px;
	color: #222222;
	font-family: Montserrat Regular;
}
.method-text {
	margin-top: 20px;
	margin-bottom: 24px;
	font-size: 18px;
	line-height: 24px;
	font-family: Montserrat Light;
	float: left;
	img {
		width: 80px;
	}
}
.order-detail-left {
	float: left;
	width: 750px;
	margin-bottom: 80px;
	.left-head {
		font-size: 12px;
		font-family: Montserrat Light;
		line-height: 42px;
		height: 42px;
		width: 100%;
		background: #f7f8fa;
		color: #222222;
		div {
			margin-left: 10px;
		}
	}
	.left-items {
		width: 750px;
		padding-bottom: 20px;
		margin-bottom: 20px;
		border-bottom: 1px solid #f5f5f5;
		display: flex;
	}
	.left-items-block .left-items:last-child {
		border-bottom: 0;
	}
	.left-items-text {
		color: #999;
		height: 44px;
		line-height: 44px;
		padding-left: 10px;
		font-size: 12px;
		font-family: Montserrat Light;
	}
	.left-items-img {
		width: 114px;
		margin-left: 10px;
		margin-right: 20px;
		img {
			display: block;
		}
	}
	.left-items-detail {
		width: 606px;
		.left-items-detail-text1 {
			color: #222222;
			font-size: 12px;
			margin-bottom: 6px;
			line-height: 1;
			font-weight: 700;
		}
		.left-items-detail-text2 {
			color: #666666;
			font-size: 14px;
			font-family: Montserrat Light;
			line-height: 14px;
			margin-bottom: 10px;
		}
		.left-items-detail-text3 {
			color: #e84646;
			font-size: 14px;
			font-family: Montserrat Regular;
			line-height: 14px;
			margin-bottom: 9px;
		}
		.left-items-detail-text4 {
			text-align: end;
			font-size: 18px;
			font-family: Montserrat Regular;
			line-height: 21px;
			margin-bottom: 71px;
			margin-right: 56px;
		}
		.left-items-detail-text5 {
			font-size: 12px;
			font-family: Montserrat Light;
			div {
				float: left;
				margin-right: 10px;
			}
			span:nth-child(odd) {
				color: #666666;
			}
			span:nth-child(even) {
				color: #222222;
			}
		}
	}
	.detail-title {
		width: 750px;
		margin-top: 56px;
		font-size: 24px;
		line-height: 29px;
		font-family: Montserrat Regular;
		color: #222222;
		float: left;
	}
	.address-box-left {
		width: 750px;
		float: left;
		.address-box-top {
			float: left;
			width: 750px;
			.address-name {
				font-size: 18px;
				line-height: 26px;
				height: 26px;
				margin-top: 20px;
				font-family: Montserrat Light;
				float: left;
			}
			.address-phone {
				font-size: 16px;
				font-family: Montserrat Light;
				line-height: 26px;
				height: 26px;
				margin-top: 20px;
				margin-left: 20px;
				color: #595959;
				float: left;
			}
		}
		.address-box-bottom {
			float: left;
			margin: 8px 0 24px 0;
			width: 750px;
			.address-text {
				font-size: 18px;
				font-family: Montserrat Light;
				line-height: 24px;
				height: 24px;
				color: #222222;
				float: left;
			}
		}
	}
}
.order-detail-right {
	float: right;
	width: 400px;
	border-left: 1px solid #f5f5f5;
	padding-left: 50px;
	.right-title {
		font-size: 20px;
		font-family: Montserrat Regular;
		line-height: 22px;
		padding-bottom: 16px;
		margin-bottom: 20px;
		border-bottom: 1px solid #f5f5f5;
	}
	.order-detail-right-all {
		padding-top: 23px;
		width: 349px;
		float: left;
	}
	.order-detail-right-item {
		font-family: Montserrat Light;
		width: 349px;
		float: left;
	}
	.right-text {
		line-height: 17px;
		margin-bottom: 10px;
		color: #666666;
		font-size: 14px;
		float: left;
	}
	.right-text-all {
		line-height: 18px;
		margin-bottom: 10px;
		color: #333;
		font-size: 16px;
		font-family: Montserrat Light;
		float: left;
	}
	.right-us-text {
		line-height: 17px;
		margin-bottom: 10px;
		font-size: 14px;
		float: right;
	}
	.color-1 {
		// color: #999999;
		text-decoration: line-through;
	}
	.color-2 {
		color: #222222;
	}
	.color-3 {
		color: #e84646;
	}
	.color-4 {
		color: #333;
		font-size: 18px;
		font-family: Montserrat Medium;
		line-height: 18px;
	}
	.order-review {
		font-size: 18px;
		font-family: Montserrat Regular;
		width: 349px;
		height: 54px;
		background: #fff;
		line-height: 54px;
		float: right;
		text-align: center;
		margin-top: 20px;
		color: #222222;
		border: 1px solid #222222;
		cursor: pointer;
	}
	.order-btn {
		font-size: 18px;
		font-family: Montserrat Regular;
		height: 54px;
		width: 349px;
		line-height: 54px;
		background: #222222;
		float: right;
		text-align: center;
		margin-top: 60px;
		color: #ffffff;
		cursor: pointer;
	}
}
</style>


