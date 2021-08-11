<template>
	<div class="receive-list" :class="{ 'receive-list-success': !isReceive && btnTitle === 'Receive' }">
		<p class="receive-title">You have received the following coupons!</p>
		<div :class="{ 'coupon-box': btnTitle == 'OK' }">
			<div class="coupon-list" v-for="(item, index) in receiveList" :key="index">
				<div class="coupon-border"></div>
				<div class="coupon-item">
					<h2 class="coupon-title">
						<label>{{ $utils.creditAmount(item) }}</label
						><span>{{ item.couponCode }}</span>
					</h2>
					<p class="coupon-msg">For orders over US${{ (item.thresholdAmount / 100).toFixed(2) }}</p>
					<div class="coupon-state autoprefixer-one-clamp">{{ item.comment }}</div>
					<p class="coupon-limited">{{ $utils.creditDays(item) }}</p>
				</div>
				<div class="coupon-border"></div>
			</div>
		</div>
		<div class="submit-order-box">
			<van-button v-if="isReceive" class="submit-order" type="primary" @click="receiveBtn">{{ btnTitle }}</van-button>
			<div v-else class="receive-successfully">
				<span>
					<i class="icon iconsuccess_no_circle"></i>
				</span>
				<p>Received</p>
			</div>
		</div>
	</div>
</template>
<script>
import store from 'store'
import { mapState, mapActions, mapMutations } from 'vuex'
import { Button, Toast } from 'vant'
export default {
	data() {
		return {
			isReceive: true,
		}
	},
	props: {
		couponShow: {
			type: Boolean,
			default: false,
		},
		btnTitle: {
			type: String,
			default: 'Receive',
		},
	},
	components: {
		[Button.name]: Button,
	},
	created() {
		this.SET_COUPON_LIST([])
		// this.getNewComerCoupon()
		if (this.btnTitle == 'OK') {
			this.getNewComerCoupon()
		} else {
			this.getUserEnableSpecialCoupon()
		}
	},
	computed: {
		...mapState('coupon', ['receiveList']),
	},
	methods: {
		...mapActions('coupon', ['CONVERTCOUPON', 'getNewComerCoupon', 'getUserEnableSpecialCoupon']),
		...mapMutations('coupon', ['SET_COUPON_LIST']),
		receiveBtn() {
			let [{ campaignId }] = this.receiveList
			this.CONVERTCOUPON({ campaignId }).then(res => {
				if (res.code === 0) {
					Toast({
						message: 'Check "My Coupons" for coupons you just received!',
						icon: ' iconfont iconsuccess_no_circle',
					});
					setTimeout(() => {
						this.isReceive = false
						if (this.btnTitle == 'OK') {
							let userInfo = store.get('userInfo')
							userInfo.newPerson = false
							store.set('userInfo', userInfo)
							this.$emit('callbanckBtn', false)
						}
					}, 1500)
				}
			})
		},
	},
}
</script>
<style lang="less" scoped>
.receive-list {
	background: #fff;
}
.submit-order-box {
	max-width: 375px;
	margin: 0 auto;
}
.receive-title {
	background: #fff;
	width: 100%;
	text-align: center;
	padding: 40px 0 20px;
	color: #222;
	font-size: 16px;
}
.coupon-box {
	max-height: 400px;
	overflow-y: scroll;
}
.coupon-list {
	display: flex;
	margin: 0 16px;
	padding-top: 10px;
	.coupon-border {
		height: 87px;
		width: 18px;
		flex-grow: 0;
		background: url('../../assets/images/coupon_bd.png') no-repeat;
		background-size: 100% 100%;
	}
	.coupon-border:last-child {
		transform: scaleX(-1);
	}
	.coupon-item {
		color: #fff;
		width: auto;
		flex-grow: 1;
		min-height: 87px;
		font-size: 12px;
		background: url('../../assets/images/coupon_bj.png') repeat-x;
		background-size: 100% 100%;
		.coupon-title {
			display: flex;
			justify-content: space-between;
			margin-top: 6px;
			label {
				font-size: 16px;
			}
			span {
				font-size: 14px;
			}
		}
		.coupon-msg {
			font-size: 12px;
		}
		.coupon-state {
			margin-top: 8px;
			color: #4d4d4d;
		}
		.coupon-limited {
			color: #666;
		}
	}
}
.receive-list {
	margin-bottom: 80px !important;
}
.receive-list-success {
	margin-bottom: 130px !important;
}
.receive-successfully {
	// margin-top:40px;
	span {
		display: flex;
		justify-content: center;
		align-items: center;
		display: block;
		flex-shrink: 0;
		width: 52px;
		height: 52px;
		line-height: 52px;
		text-align: center;
		margin: 0 auto;
		border-radius: 50%;
		background: #222;

		i {
			color: #fff;
			font-size: 30px;
		}
	}
	p {
		font-size: 16px;
		width: 100%;
		text-align: center;
		margin-top: 10px;
	}
}
</style>
