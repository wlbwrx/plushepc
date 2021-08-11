<template>
	<div class="coupon">
		<div class="order-head">My Coupons</div>
		<div class="order-tabs">
			<div :class="param.couponStatus == 0 ? 'check' : ''" @click="handleTabClick(0)">Unused Coupons</div>
			<div :class="param.couponStatus == 2 ? 'check' : ''" @click="handleTabClick(2)">Expired Coupons</div>
		</div>
		<div v-if="couponList && couponList.length > 0">
			<div class="coupon-list" v-for="(item, index) in couponList" :key="index" :class="{ 'coupon-list-stale': param.couponStatus === 2, 'mr-16': index % 2 == 0 }">
				<div class="coupon-list-bj"></div>
				<div class="coupon-list-item">
					<div class="coupon-item">
						<h2 class="coupon-title">{{ $utils.creditAmount(item) }}</h2>
						<div class="coupon-content" v-if="item.couponType == 4">For orders over {{item.thresholdNumber}}</div>
						<div class="coupon-content" v-else>For orders over US${{ (item.thresholdAmount / 100).toFixed(2) }}</div>
						
						<div class="coupon-content">Code:{{ item.couponCode }}</div>
						<div class="coupon-data">
							<span>{{ $utils.creditDays(item, 'cop') }}</span>
							<div class="coupon-showAll">
								<span class="autoprefixer-one-clamp" :class="{ 'show-all': switchOn === false }">{{ item.comment }}</span
								><i v-show="item.comment.length > 50" class="icon" @click="switchOn = !switchOn" :class="{ 'el-icon-arrow-down': switchOn === true, 'el-icon-arrow-up': switchOn === false }"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="not-found" v-else>
			<img class="custom-image" :src="emptyImg" />
			<div class="custom-text">{{ param.couponStatus === 2 ? 'No coupons' : 'No coupons available' }}</div>
		</div>
	</div>
</template>
<script>
import minxin from './const/coupon'
export default {
	mixins: [minxin],
	methods: {
		handleTabClick(type) {
			this.param.couponStatus = type
			this.GET_USERCOUPON(this.param)
		},
	},
}
</script>
<style lang="less" scoped>
@import '@/style/modules/coupon.less';
.coupon {
	background: #fff;
	float: left;
	width: 1096px;
	margin-left: 24px;
	/deep/ .coupon-list {
		margin: 0;
		float: left;
		width: 440px;
		margin-bottom: 16px;
	}
	.mr-16 {
		margin-right: 16px;
	}
	.coupon-list .coupon-item .coupon-title {
		font-family: Montserrat Bold;
		margin-top: 16px;
		line-height: 24px;
	}
	.coupon-list .coupon-item .coupon-content {
		font-family: Montserrat Regular;
		line-height: 17px;
		margin-top: 5px;
	}
	.coupon-list .coupon-item .coupon-data {
		color: #666;
	}
	.coupon-list .coupon-item .coupon-data .coupon-showAll span {
		font-family: Montserrat Regular;
		width: 400px;
	}
	.not-found {
		text-align: center;
		margin-top: 80px;
	}
	.custom-text {
		margin-top: 10px;
		color: #999;
		font-family: Montserrat Light;
	}
}
</style>
