<template>
	<div class="shopping_car_pc">
		<div class="shopping_car">
			<div class="step_pc">
				<step-list></step-list>
			</div>
			<div class="shop_car_detail">
				<!-- 有商品时 -->
				<div class="shop-car__exist" v-if="!isEmpty">
					<div class="shop_car_left">
						<div class="shop-car__free" v-if="lackForFreeExpressAmount > 0">
							<span class="shop-car_title">Shipping fee:</span>
							<span class="shop-car__free-money"><i class="iconfont icon-yushu1"></i> Buy US$ {{ lackForFreeExpressAmount | filterPrice }} more to enjoy Free Standard Shipping</span>
						</div>
						<!-- 购物车工具条 -->
						<div class="shop_car__tools">
							<span class="shop_car__tools_title">Your Cart</span>
							<!-- <span class="shop_car__tools_des">Prices are subject to change based on the price in effect the day you checkout.</span> -->
							<span class="car_tools_set" v-if="this.token" @click="openEditCar(true)"> <i class="el-icon-s-unfold"></i>Select </span>
						</div>
						<!-- 购物车的所有商品 -->
						<div class="car-list">
							<div class="car-list__header">
								<li>Item</li>
								<li>Price</li>
								<li>Qty</li>
								<li>Total</li>
							</div>
							<div class="car-list__item">
								<div class="car-list_tools">
									<!-- <i class="iconfont icon-gouwudaishixiao"></i> -->
									<span class="car-list_tools_left"></span>
									<span :class="['car-list_tools_right', { disabled: skuNos.length == 0 }]" @click="deleteLot()">Move All</span>
								</div>
								<!-- 有效商品 -->
								<cart-listpc :list="goodsList"></cart-listpc>
								<!-- 无效商品 -->
								<cart-listpc :list="expiredList" expired></cart-listpc>
								<div class="selectAll">
									<el-checkbox class="car-check" size="medium" :value="isAllChecked" @change="selectAll"></el-checkbox>
									Select ALL
								</div>
							</div>
						</div>
					</div>
					<div class="shop_car_center_line"></div>
					<div class="shop_car_right">
						<div class="counpList">
							<!-- 优惠价格列表 -->
							<li class="counpList_li">
								<img class="li_cell_img" src="@/assets/images/icons/icon-discount.png" alt="" />

								<span class="li_cell_span" v-if="selectPromo.couponType == 4">
									Enjoy {{ selectPromo.discountProbability + '%' }} OFF your purchase over US${{ selectPromo.thresholdNumber }} {{ selectPromo.thresholdNumber > 1 ? 'items' : 'item' }} <br />
									<i>(CODE : {{ selectPromo.couponCode }})</i>
								</span>
								<span class="li_cell_span" v-else-if="selectPromo.couponType == 3">
									Enjoy {{ selectPromo.discountProbability + '%' }} OFF your purchase over US${{ selectPromo.thresholdAmount | filterPrice }} <br />
									<i>(CODE : {{ selectPromo.couponCode }})</i>
								</span>
								<span class="li_cell_span" v-else> Enjoy US${{ selectPromo.fixedAmount | filterPrice }} OFF your purchase over US${{ selectPromo.thresholdAmount | filterPrice }} </span>
								<span class="li_cell_right">
									<span v-if="checkOrderDetail.promoAmount > 0"> -US${{ checkOrderDetail.promoAmount | filterPrice }} </span>
									<i class="el-icon-arrow-right"></i>
								</span>
							</li>
							<el-form ref="validateForm" :model="param" :rules="rules" label-width="100px" class="coupon-ruleForm apply">
								<el-form-item label="" label-width="0px" prop="promoCode">
									<el-input v-model="param.promoCode" autocomplete="off" :clearable="true" @clear="getOrderConfig('clear')"></el-input>
								</el-form-item>
								<!-- <el-input v-model="couponCode" min="8" max="8" :clearable="true" @clear="getOrderConfig"></el-input> -->

								<el-form-item label-width="0px">
									<el-button class="btn" type="primary" @click="submitForm('validateForm')">APPLY</el-button>
								</el-form-item>
							</el-form>
							<li class="counpList_li" @click="clickSelectCoupon" v-show="token">
								<img class="li_cell_img" src="@/assets/images/icons/gift-icon.png" alt="" />
								<span class="li_cell_span span" v-if="!this.token">Register for {{ newPeopleCouponVal > 0 ? 'US$' + newPeopleCouponVal : '' }} coupon</span>
								<span class="li_cell_span span" v-else>Apply Coupon</span>
								<span class="li_cell_right right">
									<span v-if="!this.token" class="noLogin"> Register Now </span>
									<span v-else-if="this.token && selectCoupon">
										<span v-if="checkOrderDetail.couponAmount > 0"> -US$ {{ checkOrderDetail.couponAmount | filterPrice }} </span>
									</span>
									<i class="el-icon-arrow-right"></i>
								</span>
							</li>
						</div>
						<div class="shop_car_right_title">Order Summary</div>
						<div class="shop_car_choose_all">
							<li class="priceList_li">
								<div class="shop_car_choose_all_left">Price:</div>
								<div class="shop_car_choose_all_right old">US${{ checkOrderDetail.retailAmount | filterPrice }}</div>
							</li>
							<li class="priceList_li">
								<div class="shop_car_choose_all_left">Subtotal:</div>
								<div class="shop_car_choose_all_right">US${{ checkOrderDetail.subtotalAmount | filterPrice }}</div>
							</li>
							<li class="priceList_li" v-if="checkOrderDetail.promoAmount">
								<div class="shop_car_choose_all_left">Promo Code Discount:</div>
								<div class="shop_car_choose_all_right coupon">-US${{ checkOrderDetail.promoAmount | filterPrice }}</div>
							</li>
							<li class="priceList_li" v-if="checkOrderDetail.couponAmount">
								<div class="shop_car_choose_all_left">Coupon Discount:</div>
								<div class="shop_car_choose_all_right coupon">-US${{ checkOrderDetail.couponAmount | filterPrice }}</div>
							</li>
							<li class="priceList_li">
								<div class="shop_car_choose_all_left all">Total</div>
								<div class="shop_car_choose_all_right all">US${{ checkOrderDetail.totalAmount | filterPrice }}</div>
							</li>
						</div>
						<div class="eligible" v-if="lackForFreeExpressAmount <= 0">
							<!-- 显示足够满减的文案 -->
							Eligible for free shipping
						</div>
						<div class="car_checkout">
							<el-button :class="['car_paypal_btn', { disabled: effectiveTotalNum == 0 }]" :disabled="effectiveTotalNum == 0" @click="goPayPal">
								<!-- @click="goPayPal" -->
								<img class="image" src="@/assets/images/icons/paypalBtn.png" alt="" />
							</el-button>
							<el-button @click="gotoPay(1)" :class="['car_checkout_btn', { disabled: effectiveTotalNum == 0 }]" :disabled="effectiveTotalNum == 0"
								>Check Out <span v-if="effectiveTotalNum">({{ effectiveTotalNum }})</span></el-button
							>
							<!-- <el-button @click="gotoPay(2)" :class="['car_guest_btn', { disabled: effectiveTotalNum == 0 }]" :disabled="effectiveTotalNum == 0" v-if="!this.token">GUEST CHECKOUT</el-button> -->
						</div>
						<div class="payType">
							<img :src="item.src" alt="" class="payType-img" v-for="item of payTypeImgList" :key="item.name" />
						</div>
					</div>
				</div>
				<!-- 无商品 -->
				<div class="shop-car__empty" v-else>
					<div class="shop-car__empty_i">
						<el-image :src="require('../../assets/images/shoppingbag_empty_chatu.png')" class="shop-car__empty_img"></el-image>
						<p class="shop-car__empty_des">Your cart is empty.</p>
						<el-button class="car_empty_btn" v-if="this.token" @click="openLogin(true)">SHOP NOW</el-button>
						<el-button class="car_empty_btn" v-else @click="openLogin(false)">SIGN IN / REGISTER</el-button>
					</div>
				</div>
			</div>
			<!-- You Might Like to Fill With -->
			<div class="mightLike" v-if="recommendList.length > 0">
				<div class="mightLike_head">
					You Might Also Like
					<!-- <span class="foryouRight" @click="goodsfilterList()">
                        View More <i class="el-icon-arrow-right"></i>
                    </span> -->
				</div>
				<!--猜你喜欢 for you-->
				<for-you :commendList="recommendList"></for-you>
			</div>
		</div>
		<!-- 编辑商品弹窗 -->
		<div class="edit-car" v-if="isEditCar">
			<edit-car @clostCarBox="clostCarBoxOut"></edit-car>
		</div>
		<!-- 确认删除弹框 -->
		<delete-popup></delete-popup>
		<!-- 登录个人优惠券弹窗 -->
		<conpon :shippingmethod="shippMethod" :couponcode="selectCoupon.couponCode" @click-coupon="getCoupon" ref="coupon" />
	</div>
</template>

<script>
import stepList from './component/steplist'
import DeletePopup from './component/DeletePopup.vue'
import ForYou from './component/ForYou.vue'
import cartListpc from './component/CarList'
import editCar from './component/editcar'
import shopcar from '@/mixins/shopCar.js'
import conpon from '@/views/order/modules/conpon'
export default {
	mixins: [shopcar],
	data() {
		return {
			isEditCar: false,
			expired: false,
			param: {
				promoCode: '',
			},
			payTypeImgList: [
				{ name: '1', src: require('@/assets/images/icons/cart-img-1.png') },
				{ name: '2', src: require('@/assets/images/icons/cart-img-2.png') },
				{ name: '3', src: require('@/assets/images/icons/cart-img-3.png') },
				{ name: '4', src: require('@/assets/images/icons/cart-img-4.png') },
				{ name: '5', src: require('@/assets/images/icons/cart-img-5.png') },
				{ name: '6', src: require('@/assets/images/icons/cart-img-6.png') },
				{ name: '7', src: require('@/assets/images/icons/cart-img-7.png') },
				{ name: '8', src: require('@/assets/images/icons/cart-img-8.png') },
				{ name: '9', src: require('@/assets/images/icons/cart-img-9.png') },
			],
			otherParms: {
				payType: 4,
			},
			rules: {
				promoCode: [
					{ required: true, message: 'Enter code', trigger: 'blur' },
					{ min: 1, max: 20, message: 'please enter a valid code', trigger: 'blur' },
				],
			},
		}
	},
	components: {
		cartListpc,
		editCar,
		stepList,
		ForYou,
		DeletePopup,
		conpon,
	},
	methods: {
		// 获得优惠券
		getCoupon(object) {
			let { couponCode } = object
			this.setOrderParams({
				...this.orderParams,
				couponCode,
			})
			// this.orderParams.couponCode = couponCode
			this.getOrderConfig()
		},
		clickSelectCoupon() {
			if (this.token) {
				this.$refs.coupon.show(true)
			} else {
				//  未登录 弹出登录框
				this.$store.commit('user/loginDialogIs', true)
			}
		},
		// 添加优惠券码
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
		getOrderConfig(type) {
			let { payType } = this.otherParms
			this.orderParams['payType'] = payType
			return this.checkout({ ...this.orderParams })
				.then((res) => {
					// this.setOrderParams(requestParam)
					this.setCheckOrderDetail(res.data)
					if (type == 'clear') {
						this.param.promoCode = ''
					} else {
						this.param.promoCode = res.data.selectPromo.couponCode
					}
					this.getConfigInfo()
				})
				.catch((err) => {
					let { shortCode, msg } = err

					if (shortCode === '001' || shortCode === '002' || shortCode === '004') {
						// Toast.fail(msg)
						this.toastShow(msg)
						setTimeout(() => {
							this.$router.replace({ name: 'shoppingCar' })
						}, 3000)
					} else if (shortCode === '003' || shortCode === '005' || shortCode === '006') {
						this.toastShow(msg)
					}
					//   001,
					//   002,004 返回购物车

					//   003 005 在当前页面 刷新
				})
		},
		goPayPal() {
			if (this.effectiveTotalNum <= 0) return
			// localStorage.setItem('couponCode', this.selectPromo.couponCode)
			this.getPublicKeyByChannelId().then((res) => {
				// 数据上报-开始结算:
				this.reportGtag('begin_checkout', this.reportData())
				this.reportGtag('begin_checkout', this.reportData('GA4'), 'GA4')
				this.reportFB('InitiateCheckout', this.reportData('fb'))
				// this.SET_payPalOnly(true)
				let testEnv = location.hostname.indexOf('uat') > -1 ? 'uat' : 'sit'
				let authCode = res.data,
					return_url = `${process.env.NODE_ENV === 'production' ? location.origin : `https://${testEnv}-p.plushe.com`}/orderConfirm`, // ${this.token ? 'shippingAddress' : 'orderConfirm'回调地址会携带 code, 与后端交互,得到paypal里的一些地址信息(本地测试请将ip 给后台,localhost不支持.)
					// client_id = 'AW1eAsY5kv98YhhFmvdlQumqtv0IDrxs9UIBmM-SqqE2gCCJnXLXjfgOsUGlaty6PWmU9I2aRovZZNct',
					scope = 'openid profile email address https://uri.paypal.com/services/paypalattributes' // 'openid profile email address'
				window.location.href = encodeURI(`${process.env.VUE_APP_PAYPALURL}/connect?flowEntry=static&client_id=${authCode}&response_type=code&scope=${scope}&redirect_uri=${return_url}`)
			})
		},
		// 操作编辑购物车商品弹窗
		gotoPay() {
			// if (!this.token && type === 1) {
			// 	this.openLogin(false)
			// 	return
			// }
			// 数据上报-开始结算:
			this.reportGtag('begin_checkout', this.reportData())
			this.reportGtag('begin_checkout', this.reportData('GA4'), 'GA4')
			this.reportFB('InitiateCheckout', this.reportData('fb'))

			this.$router.push({ name: 'orderConfirm' })
		},
		openEditCar(boolean) {
			this.isEditCar = boolean
		},
		clostCarBoxOut(bool) {
			this.isEditCar = bool
		},
		deleteLot() {
			if (this.skuNos.length == 0) return
			this.switchDelete()
		},
		// 打开登录弹窗
		openLogin(bool) {
			if (bool) {
				this.$router.push({
					path: '/home',
				})
			} else {
				this.$store.commit('user/backPath', this.$route.fullPath)
				this.$router.push({
					path: '/personalCenter',
				})
			}
		},
		initBanner: function () {},
		// 点击图片，前往商品详情：
		goGoodsDetail(item) {
			this.$router.push({
				path: this.formatUrl(`/product/`, `${item.productName || item.name}-${item.productNo}`),
			})
		},
		// 固定模块跳转商品列表
		goodsfilterList(name) {},
	},
	computed: {},
	activated() {
		this.setOrderParams({ ...this.orderParams, shippingMethod: undefined })
		if (this.selectPromo) {
			console.log(this.selectPromo)
			this.param.promoCode = this.selectPromo.couponCode
			console.log(this.param.promoCode)
		}
		this.getOrderConfig()
		this.getRecommend()
		console.log(this.checkOrderDetail)
	},
	created() {
		this.getCarList()
	},
	mounted() {},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';
.shopping_car_pc {
	.edit-car {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 10;
	}
	.coupon-ruleForm {
		.btn {
			font-size: 16px;
			font-family: Montserrat Light;
			padding: 10px 20px !important;
			margin-left: 10px;
		}
		.el-form-item {
			width: 150px;
			display: inline-block;
		}
	}
	.shopping_car {
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		background: @color-FFF;
		.mightLike_head {
			width: 100%;
			height: 29px;
			font-size: 24px;
			font-family: Montserrat Regular;
			color: @color-222;
			margin-bottom: 20px;
			.foryouRight {
				float: right;
				font-weight: normal;
				font-size: 14px;
				color: #222;
				cursor: pointer;
				i {
					margin-left: 5px;
				}
			}
		}
		.shop_car_detail {
			margin-bottom: 80px;
		}
		//有商品时 购物车左侧
		.shop-car__exist {
			display: -webkit-flex;
			display: flex;
			.shop_car_left {
				// 购物车工具条
				.shop_car__tools {
					padding: 20px 0 30px;
					position: relative;
					width: 850px;
					.shop_car__tools_title {
						font-size: 24px;
						font-family: Montserrat Regular;
						display: block;
					}
					.shop_car__tools_des {
						font-size: 14px;
						color: #767676;
						display: block;
						margin-top: 8px;
					}
					.car_tools_set {
						position: absolute;
						right: 0;
						top: 30px;
						font-family: Montserrat Light;
						color: #333;
						cursor: pointer;
						i {
							margin-right: 6px;
						}
					}
				}
				// 购物车列表
				.car-list {
					width: 850px;
					.car-list__header {
						display: -webkit-flex;
						display: flex;
						border-top: 1px solid #e5e5e5;
						border-bottom: 1px solid #e5e5e5;
						li {
							text-align: center;
							height: 34px;
							line-height: 34px;
							font-size: 14px;
							font-family: Montserrat Regular;
							color: @color-666;
							&:nth-child(1) {
								width: 424px;
							}
							&:nth-child(2) {
								width: 163px;
							}
							&:nth-child(3) {
								width: 160px;
							}
							&:nth-child(4) {
								width: 103px;
								text-align: right;
							}
						}
					}
					.car-list__item {
						width: 850px;
						margin-top: 20px;
						font-size: 12px;
						font-weight: 400;
						.selectAll {
							color: #222;
							font-size: 14px;
							font-family: Montserrat Light;
							margin-top: 25px;
							.el-checkbox {
								transform: scale(1.3);
								margin-right: 10px;
							}
						}
						.car-list_tools {
							overflow: hidden;
							height: 26px;
							line-height: 26px;
							i.iconfont {
								float: left;
								margin-right: 8px;
								color: @color-999;
								font-size: 24px;
							}
							.car-list_tools_left {
								float: left;
								color: @color-999;
								cursor: pointer;
							}
							.car-list_tools_right {
								font-family: Montserrat Regular;
								float: right;
								cursor: pointer;
								&.disabled {
									opacity: 0.6;
									cursor: not-allowed;
								}
							}
						}
						.carListPc {
							margin-top: 10px;
						}
					}
				}
				.shop-car__free {
					width: 850px;
					background: #f7f8fa;
					padding: 20px;
				}
				.shop-car_title {
					font-size: 16px;
					font-family: Montserrat Regular;
					color: @color-222;
					display: block;
				}
				.shop-car__free-money {
					font-size: 14px;
					font-family: Montserrat Light;
					display: block;
					margin-top: 8px;
					color: #333;
					.iconfont {
						font-size: 20px;
						float: left;
						margin-top: -2px;
						margin-right: 6px;
					}
				}
			}
			.shop_car_center_line {
				width: 1px;
				height: 700px;
				background: #e5e5e5;
				margin: 0 49px 0 50px;
			}
			.shop_car_right {
				width: 450px;
				.counpList {
					margin-bottom: 20px;
					.counpList_li {
						padding: 11px 14px;
						border: 1px solid #cccccc;
						align-items: center;
						display: -webkit-flex;
						display: flex;
						margin-bottom: 20px;
						cursor: pointer;
						.li_cell_img {
							width: 25px;
							height: 27px;
						}
						.li_cell_span {
							font-size: 14px;
							font-family: Montserrat Light;
							color: #222;
							width: 280px;
							line-height: 1.5;
							margin-left: 10px;
							&.span {
								width: 268px;
							}
							i {
								font-style: normal;
								font-weight: normal;
								color: #999;
							}
						}
						.li_cell_right {
							font-size: 14px;
							float: right;
							font-family: Montserrat Light;
							color: @color-promo;
							width: 130px;
							text-align: right;
							&.right {
								width: 150px;
							}
							.noLogin {
								color: #999;
								font-weight: normal;
							}
							i {
								font-weight: normal;
								color: #ccc;
							}
						}
					}
				}
				.shop_car_right_title {
					width: 100%;
					height: 40px;
					border-bottom: 1px solid #f5f5f5;
					font-size: 20px;
					font-family: Montserrat Regular;
					color: @color-222;
					margin-top: 40px;
				}
				.shop_car_choose_all {
					margin-top: 20px;

					.priceList_li {
						float: left;
						overflow: hidden;
						width: 100%;
						margin-bottom: 16px;
						.shop_car_choose_all_left {
							float: left;
							font-size: 16px;
							font-family: Montserrat Light;
							color: #666;
							&.all {
								color: #333;
								font-size: 18px;
								font-family: Montserrat Regular;
							}
						}
						.shop_car_choose_all_right {
							float: right;
							font-size: 16px;
							font-family: Montserrat Light;
							color: #222;
							&.old {
								text-decoration: line-through;
							}
							&.coupon {
								color: @color-promo;
							}
							&.all {
								color: #333;
								font-size: 20px;
								font-family: Montserrat Semi Bold;
							}
						}
					}
				}
				.eligible {
					color: #2fc083;
					text-align: right;
					font-size: 16px;
					font-family: Montserrat Light;
					margin-top: 6px;
				}
				.car_checkout {
					margin-top: 40px;
					cursor: pointer;
					.el-button {
						border: 0;
						margin: 0;
						width: 450px;
						height: 54px;
						border-radius: 0;
						margin-bottom: 20px;
						&.car_paypal_btn {
							background: #f5c657;
							.image {
								width: 125px;
								height: 44px;
								position: relative;
								top: -8px;
							}
							&.disabled {
								cursor: not-allowed;
								opacity: 0.5;
							}
						}
						&.car_checkout_btn {
							text-align: center;
							background: @color-222;
							font-size: 18px;
							font-family: Montserrat Regular;
							color: @color-FFF;
							&.disabled {
								cursor: not-allowed;
								opacity: 0.5;
							}
						}
						&.car_guest_btn {
							border: 1px solid #222;
							color: #222;
							font-size: 18px;
							font-family: Montserrat Regular;
							&.disabled {
								cursor: not-allowed;
								opacity: 0.5;
							}
						}
					}
				}
				.payType {
					margin-top: 30px;
					.payType-img {
						display: inline-block;
						width: auto;
						height: 30px;
						margin-right: 14px;
						margin-bottom: 14px;
					}
				}
			}
		}
		// 购物车为空时
		.shop-car__empty {
			.shop-car__empty_img {
				width: 164px;
				height: 159px;
				margin: 0 auto;
				display: block;
			}
			.shop-car__empty_des {
				margin-top: 20px;
				font-size: 14px;
				color: @color-999;
				text-align: center;
				font-family: Montserrat Light;
			}
			.car_empty_btn {
				margin: 0 auto;
				display: block;
				height: 44px;
				border-radius: 0;
				background: @color-222;
				color: #fff;
				font-size: 18px;
				font-family: Montserrat Regular;
				margin-top: 47px;
			}
		}
	}
	.el-steps--simple {
		background: @color-FFF;
	}
}
</style>