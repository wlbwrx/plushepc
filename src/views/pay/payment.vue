<template>
	<div class="pay-success">
		<div class="success-state">
			<div class="pay-state">
				<i v-if="payType == 1" class="iconfont iconsuccess_no_circle"></i>
				<i v-else-if="payType == 2" class="iconfont icon-guanbi1"></i>
				<img v-else src="@/assets/images/paying.gif" />
				<!-- <i  class="icon iconjiazaizhong"></i> -->
			</div>
			<div v-show="type !== 'cancel'">
				<div v-if="payType == 1">
					<p class="success-mess">Your payment was successful!</p>
					<div class="sucess-order">Your order: {{ param.orderSn }}</div>
					<div class="success-text">is being processed, and will be delivered ASAP</div>
				</div>
				<div class="faild-text" v-else-if="payType == 2">Payment failed. Your order has been canceled; please try again.</div>
				<div v-else>
					<p class="success-mess">Payment Confirmed. Processing.</p>
					<div class="sucess-order">Please wait for your item(s) to be shipped after it is processed.</div>
					<div class="success-text">Order could be cancelled if the payment is declined.</div>
				</div>
			</div>
		</div>
		<div class="submit-order-box" v-show="type !== 'cancel'">
			<el-button type="primary" class="submit-order" @click="gotoNext">Check My Order</el-button>
		</div>
	</div>
</template>

<script>
import mixin from './payment'
export default {
	mixins: [mixin],
	methods:{
		gotoNext() {
			let { orderSn } = this.param
			this.$router.replace({ name: 'orderDetail', params: { orderSn } })
		}
	}
}
</script>
<style lang="less" scoped>
.pay-success {
	height: 100%;
	background: #fff;margin:120px auto 80px;
	.submit-order-box{margin-top:40px;width:100%;text-align:center;}
}
.success-state {
	background: #fff;
	// position: absolute;
	width: 100%;
	// height: calc(100% - 80px);
	// padding-top: 112px;
	font-size: 16px;
	text-align: center;
	.success-mess {
		margin: 20px 0 40px;
	}
	.pay-state {
		width: 100px;
		height: 100px;
		margin: 0 auto;
		border-radius: 50%;
		background: #222;
		display: flex;
		justify-content: center;
		align-items: center;
		img {
			width: 100%;
			height: 100%;
		}
		i {
			color: #fff;
			font-size: 60px;
		}
	}
}
</style>
