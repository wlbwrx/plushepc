<template>
	<div class="">
		<div class="step_pc">
			<step-list :actived="1"></step-list>
		</div>
		<div class="order-confirm main">
			<div class="main-left">
				<!-- 已登录 -->
				<template v-if="token">
					<div class="order-confirm-list">
						<h2>Shipping Address</h2>
						<div class="address-list" @click="clickSelectAddress('shipping')">
							<div class="contact">
								<div class="contact-number">
									<div class="autoprefixer-one-clamp">{{ shippingName }}</div>
									<label>{{ shippingPhone }}</label>
								</div>
								<i class="iconfont icon-fanhui"></i>
							</div>
							<p class="address-detail text-hidden-row-2">{{ shippingDetailAddress }}</p>
						</div>
					</div>
					<div class="order-confirm-list">
						<h2>Billing Address</h2>
						<div class="address-list" @click="clickSelectAddress('billing')">
							<div class="contact">
								<div class="contact-number">
									<div class="autoprefixer-one-clamp">{{ billingName }}</div>
									<label>{{ billingPhone }}</label>
								</div>
								<i class="iconfont icon-fanhui"></i>
							</div>
							<p class="address-detail text-hidden-row-2">{{ billingDetailAddress }}</p>
						</div>
					</div>
				</template>
				<!-- 未登录 -->
				<template v-else>
					<div class="order-confirm-list">
						<h2>Order Confirmation</h2>
						<div class="address-list">
							<el-form ref="emailValidateForm" :model="form" :rules="emailRules" class="email-ruleForm">
								<el-form-item label="Email" prop="userEmail">
									<el-input minlength="2" maxlength="50" v-model.trim="form.userEmail" autocomplete="off" :clearable="true" @clear="getOrderConfig" placeholder="Please enter a valid email address"></el-input>
								</el-form-item>
								<!-- <el-input v-model="couponCode" min="8" max="8" :clearable="true" @clear="getOrderConfig"></el-input> -->

								<!-- <el-form-item label-width="0px">
                                <el-button class="btn" type="primary" @click="submitForm('validateForm')">Apply</el-button>
                            </el-form-item> -->
							</el-form>
						</div>
					</div>
					<div class="order-confirm-list">
						<h2>Shipping Address</h2>
						<div class="address-list">
							<guest-address ref="shipping"></guest-address>
						</div>
					</div>
					<div class="order-confirm-list">
						<h2>Billing Address</h2>
						<div class="add-bill-address">
							<el-radio v-model="addBillAddress" label="0">Add a New Address</el-radio>
							<el-radio v-model="addBillAddress" label="1">Set as Shipping Address</el-radio>
						</div>
						<div class="address-list" v-show="addBillAddress === '0'">
							<guest-address ref="billing"></guest-address>
						</div>
					</div>
				</template>
				<div class="order-confirm-list">
					<h2>Shipping Method</h2>
					<el-radio-group v-model="shippMethod" @change="shipmethodChange">
						<div v-for="item in availableShippings" :key="item.id" class="select-shipping">
							<div>
								<el-radio :label="item.id">
									<span class="shipping-name">{{ item.name }}</span>
									<span v-if="isNaN(item.fee)" class="shipping-sum">{{ item.fee }}</span>
									<span v-else class="shipping-sum">US${{ item.fee | filterPrice }}</span>
								</el-radio>
							</div>
							<p class="delivry-data">{{ item.desc }}</p>
						</div>
					</el-radio-group>
				</div>
				<div class="order-confirm-list">
					<h2>Payment Method</h2>
					<el-radio-group v-model="otherParms.payType" @change="getOrderConfig">
						<div class="payment">
							<p v-for="item in payList" :key="item.value">
								<el-radio :label="item.value">
									<img :src="item.icon" /><span class="paypal">{{ item.label }}</span>
								</el-radio>
							</p>
						</div>
					</el-radio-group>
				</div>
				<div class="order-confirm-list">
					<h2 class="order-show-items">
						<label>Your Cart</label><span>{{ shopListlenth }}{{ shopListlenth > 1 ? ' items' : ' item' }}</span>
					</h2>
					<div class="slider">
						<i v-show="num > 0" @click="prevClick" class="iconfont icon-fanhui2"></i>
						<div class="slider-box">
							<ul class="slider-item" :style="'margin-left:-' + num * 860 + 'px;'">
								<li v-for="(item, index) in checkOrderDetail.items" v-show="item.check" :key="index">
									<div class="slider-item-img">
										<el-image :src="$utils.imageHandler(14, item.picKey)" fit="cover">
											<div slot="placeholder" class="image-slot">
												<img src="@/assets/images-pc/default.png" />
											</div>
											<div slot="error" class="image-slot">
												<img src="@/assets/images-pc/default.png" />
											</div>
										</el-image>
										<span class="slider-quantity">X{{ item.num }}</span>
									</div>
									<!-- <h2 class="slider-brand">{{item.brandName}}</h2> -->
									<p class="slider-product text-hidden-row-1">{{ item.productName }}</p>
									<p class="slider-sum">US${{ item.discountPrice | pricesFilter }}</p>
								</li>
							</ul>
						</div>
						<i v-show="shoplenth > 5 && num < Math.ceil(shoplenth / 5) - 1" @click="nextClick" class="iconfont icon-fanhui"></i>
					</div>
				</div>
			</div>
			<div class="main-right">
				<div class="order-confirm-list">
					<h2>Order Summary</h2>
					<ul class="summary">
						<li>
							<label>Price:</label>
							<span class="through">US${{ checkOrderDetail.retailAmount | filterPrice }}</span>
						</li>
						<li>
							<label>Subtotal:</label>
							<span class="color-222">US${{ checkOrderDetail.subtotalAmount | filterPrice }}</span>
						</li>
						<li>
							<label>Shipping Fee:</label>
							<span class="color-222" v-if="checkOrderDetail.lackForFreeExpressAmount != 0">US${{ checkOrderDetail.shippingFeeAmount | filterPrice }}</span>
							<span class="color-222" v-else>free</span>
						</li>
						<li v-if="checkOrderDetail.promoAmount">
							<label>Promo Code Discount:</label>
							<span class="color-red">-US${{ checkOrderDetail.promoAmount | filterPrice }}</span>
						</li>
						<li v-if="checkOrderDetail.couponAmount">
							<label>Coupon Discount:</label>
							<span class="color-red">-US${{ checkOrderDetail.couponAmount | filterPrice }}</span>
						</li>
						<li class="total">
							<label>Total:</label>
							<span class="weight">US${{ checkOrderDetail.totalAmount | filterPrice }}</span>
						</li>
					</ul>
					<div class="apply-conpun">
						<!-- <p class="coupon-title">Coupon Code:</p> -->
						<coupon-item mode="promo" :amount="checkOrderDetail.promoAmount">
							<template v-if="checkOrderDetail.promoAmount > 0">
								<h2 class="content" v-if="selectPromo.couponType == 3">
									Enjoy {{ selectPromo.discountProbability + '%' }} OFF your purchase over US${{ selectPromo.thresholdAmount | filterPrice }}<span class="coupon-item-code">(CODE : {{ selectPromo.couponCode }})</span>
								</h2>
								<h2 class="content" v-else-if="selectPromo.couponType == 4">
									Enjoy {{ selectPromo.discountProbability + '%' }} OFF your purchase over US${{ selectPromo.thresholdNumber }} {{ selectPromo.thresholdNumber > 1 ? 'items' : 'item' }}<span class="coupon-item-code">(CODE : {{ selectPromo.couponCode }})</span>
								</h2>
								<h2 class="content" v-else>Enjoy US${{ selectPromo.fixedAmount | filterPrice }} OFF your purchase over US${{ selectPromo.thresholdAmount | filterPrice }}</h2>
							</template>
							<h2 class="content" v-else>Promo Code</h2>
						</coupon-item>
						<!-- <div class="apply"> -->
						<el-form ref="validateForm" :model="param" :rules="rules" label-width="100px" class="coupon-ruleForm apply">
							<el-form-item label="" label-width="0px" prop="promoCode">
								<el-input v-model="param.promoCode" autocomplete="off" :clearable="true" placeholder="Apply Coupon" @clear="getOrderConfig"></el-input>
							</el-form-item>
							<!-- <el-input v-model="couponCode" min="8" max="8" :clearable="true" @clear="getOrderConfig"></el-input> -->

							<el-form-item label-width="0px">
								<el-button class="btn" type="primary" @click="submitForm('validateForm')">APPLY</el-button>
							</el-form-item>
						</el-form>
						<!-- </div> -->
						<!-- <a class="checkout-coupon" @click="clickSelectCoupon">Check out My Coupons</a> -->
						<div v-if="token" @click="clickSelectCoupon">
							<coupon-item :amount="checkOrderDetail.couponAmount" :couponCode="selectCoupon.couponCode" mode="coupon">
								<h2>Apply Coupon</h2>
								<p class="coupon-item-code" v-if="selectCoupon.couponCode">Coupon Code: {{ selectCoupon.couponCode }}</p>
							</coupon-item>
						</div>
					</div>
				</div>
				<div>
					<el-button type="primary" class="submit-order" :disabled="isCreateOrder" @click="createOrderFun">PLACE ORDER</el-button>
				</div>
			</div>
			<conpon :shippingmethod="shippMethod" :couponcode="selectCoupon.couponCode" @click-coupon="getCoupon" ref="coupon" />
			<selectAddress v-if="token" @click-addres="getAddres" :addressType="addressType" ref="address" />
			<newAddress v-if="token" @click-newaddres="setAddress" ref="newAddress" />
		</div>
	</div>
</template>
<script>
import mixin from './const/orderConfirm'
import conpon from './modules/conpon'
import newAddress from './modules/newAddress'
import selectAddress from './modules/selectAddress'
import couponItem from './modules/coupon-item.vue'
import guestAddress from './modules/guest-address.vue'
import stepList from '@/views/shopping_car/component/steplist'
export default {
	mixins: [mixin],
	components: {
		conpon,
		newAddress,
		selectAddress,
		couponItem,
		guestAddress,
		stepList,
	},
	created() {
		// this.param.sourceType = 4;
	},
	data() {
		let emailValidator = (rule, value, callback) => {
			let reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
			if (!reg.test(value)) {
				callback(new Error('Please enter your vaild email'))
			} else {
				callback()
			}
		}
		return {
			num: 0,
			addressType: 'shipping', // shipping, billing
			emailRules: {
				userEmail: [{ required: true, message: 'Please enter your vaild email', trigger: 'blur' }, [{ validator: emailValidator, trigger: 'blur' }]],
			},
			rules: {
				promoCode: [
					{ required: true, message: 'Enter code', trigger: 'blur' },
					{ min: 1, max: 20, message: 'please enter a valid code', trigger: 'blur' },
				],
			},
		}
	},
	methods: {
		shipmethodChange() {
			if (this.shippMethod > 0) {
				this.setOrderParams({ ...this.orderParams, shippingMethod: this.shippMethod })
			}
			this.getOrderConfig()
		},
		toastShow(msg) {
			this.$message({
				showClose: true,
				message: msg,
				type: 'error',
			})
		},
		gotoDetail(orderSn) {
			if (orderSn) this.$router.replace({ name: 'orderDetail', params: { orderSn } })
		},
		prevClick() {
			this.num--
		},
		nextClick() {
			this.num++
		},
		getCoupon(object) {
			let { couponCode } = object
			this.setOrderParams({
				...this.orderParams,
				couponCode,
			})
			// this.orderParams.couponCode = couponCode
			this.getOrderConfig()
		},
		gotoAddress(gotoPage, object) {
			if (gotoPage === 'newAddress') {
				this.$refs.newAddress.show('confirm', object)
			} else {
				this.addressType === object.souceType
				if (this.addressType === 'shipping') {
					this.$refs.address.showDialogs('shipping')
				} else {
					this.getBillAddress(this.shippingAddress)
				}
			}
		},
		setAddress(addreslist) {
			if (addreslist === 'addreslist') {
				this.$refs.address.showDialogs(this.addressType)
			}
			this.getUserAddress()
		},
		getAddres(type, address) {
			if (type === 'edit') {
				this.$refs.newAddress.show('addreslist', address)
			} else if (type === 'new') {
				this.$refs.newAddress.show('addreslist')
			}
		},
		clickSelectAddress(type) {
			this.addressType = type
			this.$refs.address.showDialogs(type)
		},
		clickSelectCoupon() {
			this.$refs.coupon.show(true)
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.setOrderParams({ ...this.orderParams, promoCode: this.param.promoCode })
					this.getOrderConfig().then(() => {
						this.setOrderParams({ ...this.orderParams, promoCode: this.param.promoCode })
						if (this.selectPromo) {
							this.param.promoCode = this.selectPromo.couponCode
						} else {
							this.param.promoCode = ''
						}
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
	},
}
</script>
<style scoped lang="less">
.order-confirm {
	margin-bottom: 80px;
	display: flex;
	width: 1400px;
	.main-left {
		width: 850px;
		flex-shrink: 0;
	}
	.main-right {
		margin-left: 50px;
		padding-left: 49px;
		border-left: 1px solid #f5f5f5;
		.submit-order {
			font-size: 18px;
			font-family: Montserrat Regular;
			width: 100%;
			margin-top: 50px;
		}
	}
}
.order-confirm-list {
	margin-top: 70px;
	.coupon-ruleForm {
		padding: 6px 0 50px;
	}
	.email-ruleForm {
		width: 50%;
		/deep/ .el-form-item {
			margin-right: 10px;
		}
	}
	.add-bill-address {
		margin-bottom: 20px;
	}
	.slider {
		position: relative;
		.icon-fanhui2 {
			position: absolute;
			left: -26px;
			top: 90px;
			cursor: pointer;
		}
		.icon-fanhui {
			position: absolute;
			right: -24px;
			top: 90px;
			cursor: pointer;
		}
		.slider-box {
			width: 850px;
			overflow-x: hidden;
		}
		.slider-item {
			display: flex;
			li {
				flex-shrink: 0;
				.slider-item-img {
					width: 152px;
					height: 228px;
					position: relative;
					/deep/ .el-image {
						width: 100%;
						height: 100%;
						background: #f5f7fa;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.slider-quantity {
						position: absolute;
						right: 10px;
						bottom: 10px;
						font-size: 13px;
						font-family: Montserrat Regular;
						text-align: center;
						line-height: 27px;
						width: 27px;
						height: 27px;
						background: #e9edee;
						border-radius: 50%;
					}
				}
				.slider-brand {
					font-size: 12px;
					color: #222;
					margin-bottom: 0;
					margin-top: 10px;
					font-weight: bold;
				}
				.slider-product {
					max-width: 152px;
					font-size: 12px;
					font-family: Montserrat Light;
					margin-top: 6px;
					color: #666;
				}
				.slider-sum {
					font-size: 14px;
					color: #222;
					margin-top: 8px;
					font-family: Montserrat Regular;
				}
			}
			li:not(:first-child) {
				margin-left: 20px;
			}
		}
	}
	h2 {
		font-size: 20px;
		color: #222;
		padding-bottom: 20px;
		margin-bottom: 20px;
		font-family: Montserrat Regular;
		font-weight: initial;
		border-bottom: 1px solid #f5f5f5;
	}
	.apply {
		font-family: Montserrat Light;
		display: flex;
		margin: 10px 0 10px;
		/deep/ .el-form-item {
			margin-bottom: 0px;
		}
	}
	.btn {
		width: 152px;
		margin-left: 10px;
	}
	.coupon-title {
		font-size: 14px;
		margin-top: 30px;
	}
	.checkout-coupon {
		color: #999;
		font-size: 12px;
	}
	.order-show-items {
		display: flex;
		width: 850px;
		align-items: center;
		padding-bottom: 0;
		border-bottom: 0;
		span {
			font-size: 16px;
			color: #666;
			font-family: Montserrat Light;
			margin-left: 10px;
		}
	}
	/deep/ .el-radio-group {
		font-size: 20px;
	}
	.select-shipping {
		/deep/ .el-radio {
			align-items: center;
            display: flex;
		}
		/deep/ .el-radio__label {
			color: #222;
			font-size: 18px;
			font-family: Montserrat Light;
		}
		.shipping-name {
			width: 300px;
            padding-right: 40px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: inline-block;
		}
		.shipping-sum {
			color: #222;
            display: inline-block;
		}
		.delivry-data {
			font-size: 18px;
			font-family: Montserrat Light;
			padding: 10px;
			padding-left: 25px;
		}
	}
	.select-shipping:not(:first-child) {
		margin-top: 10px;
	}
	.payment {
		p:not(:first-child) {
			margin-top: 10px;
		}
		.paypal {
			font-size: 20px;
            color: #222;
			line-height: 40px;
			margin-left: 8px;
			font-family: Montserrat Light;
		}
		/deep/ .el-radio__label {
            align-items: center;
			display: flex;
		}
		.el-radio {
			display: flex;
			align-items: center;
			img {
				height: 30px;
			}
		}
	}
	.summary {
		margin: 26px 0 25px;
		li {
			display: flex;
			margin-top: 10px;
			justify-content: space-between;
			color: #666;
			font-size: 16px;
			font-family: Montserrat Light;
			.through {
				text-decoration: line-through;
			}
			.color-222 {
				color: #222;
			}
			.color-red {
				color: #e84646;
			}
			.weight {
				font-size: 18px;
				font-family: Montserrat Medium;
				color: #333;
			}
		}

		.total {
			margin-top: 30px;
			font-family: Montserrat Medium;
		}
	}
}
.address-list {
	.contact {
		display: flex;
		justify-content: space-between;
		.contact-number {
			align-items: center;
			display: flex;
			.autoprefixer-one-clamp {
				display: block;
				white-space: nowrap;
				font-size: 18px;
				font-family: Montserrat Light;
				color: #222;
			}
			label {
				font-size: 16px;
				font-family: Montserrat Light;
				color: #666;
				margin-left: 20px;
			}
		}
	}
	.address-detail {
		margin-top: 10px;
		font-size: 18px;
		font-family: Montserrat Light;
	}
}
</style>
