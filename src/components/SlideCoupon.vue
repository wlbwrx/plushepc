<template>
	<div class="slide-coupon" v-if="newPeopleCouponVal > 0">
		<img src="@/assets/images/icons/u-close.png" alt="" class="sc__close" @click="toClose" />
		<div class="sc__cont" @click="$router.push({ path: '/myCoupons' })">
			<span class="sc-text">${{ newPeopleCouponVal }} OFF COUPON </span>
			<img src="@/assets/images/icons/u-arrow.png" alt="" class="sc__arrow" />
		</div>
	</div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters(['newPeopleCouponVal'])
	},
	methods: {
		...mapMutations('user', ['setSlideCoupon', 'SET_LOGINSWIPEINDEX']),
		toClose() {
			this.setSlideCoupon(1)
		}
	}
}
</script>

<style lang="less" scoped>
.slide-coupon {
	position: fixed;
	right: 0;
	top: calc(50% - 80px);
	z-index: 10;
	transform: translateY(-50%) rotate(-90deg);
	transform-origin: right bottom;
	height: 40px;
	background: rgba(34, 34, 34, 0.7);
	color: #fff;
	padding: 0 12px;
	display: flex;
	margin-top: -100px;
	align-items: center;
	cursor: pointer;
	.sc__close {
		width: 13px;
	}
	.sc__cont {
		display: flex;
		align-items: center;
		.sc-text {
			font-size: 20px;
			font-family: Montserrat Regular;
			font-weight: 500;
			margin: 0 10px;
		}
		.sc__arrow {
			width: 13px;
		}
	}
}
</style>
