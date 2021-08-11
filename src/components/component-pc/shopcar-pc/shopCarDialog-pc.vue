<template>
	<div class="shopCarDialog">
		<!-- 有商品 -->
		<div class="shopcar_dialog_full" v-if="!isEmpty">
			<div class="shopcar_dialog_full_div">
				<!-- 有效商品 -->
				<dialog-pc :list="goodsList"></dialog-pc>
				<!-- 无效商品 -->
				<dialog-pc :list="expiredList" expired></dialog-pc>
			</div>
			<!-- 下方全部价格 -->
			<div class="priceType">
				<div class="priceTypeLeft" v-if="lackForFreeExpressAmount <= 0">Eligible for free shipping</div>
				<div class="priceTypeRight">
					<span class="price">Price: <font>US${{ listPrice | filterPrice }}</font></span><br />
					<span class="total">Total: <font>US${{ listRealPrice | filterPrice }}</font></span>
				</div>
			</div>
			<!-- 操作按钮前往购物车 -->
			<div class="full_view_bag">
				<el-button class="full_view_bag-btn" @click="openShoppingCar()">VIEW CART</el-button>
			</div>
		</div>
		<!-- 无商品 -->
		<div class="shopcar_dialog_empty" v-else>
			<el-image :src="require('@/assets/images/shoppingbag_empty_chatu.png')" class="shop-car__empty_img"></el-image>
			<p class="shop-car__empty_des">Your cart is empty.</p>
		</div>
		<!-- 确认删除弹框 -->
		<delete-popup></delete-popup>
	</div>
</template>

<script>
import shopcar from '@/mixins/shopCar.js'
import DeletePopup from '@/views/shopping_car/component/DeletePopup.vue'
import dialogPc from './diaLost-pc'
export default {
	mixins: [shopcar],
	data() {
		return {}
	},
	methods: {
		// 打开购物车页面
		openShoppingCar: function () {
			this.$router.push({
				path: '/shopping_car',
			})
		},
	},
	components: {
		dialogPc,
		DeletePopup,
	},
	computed: {
		listPrice: function () {
			let newprice = 0
			// 计算首页顶部金额显示（和勾选状态没关系）
			this.goodsList.map((item) => {
				newprice += item.price * item.num
			})
			return newprice
		},
		listRealPrice: function () {
			let newprice = 0
			this.goodsList.map((item) => {
				newprice += item.discountPrice * item.num
			})
			return newprice
		},
	},
	watch: {},
	created() {
		this.checkout()
		// 计算首页顶部金额显示（和勾选状态没关系）
		// this.goodsList.map(item => {
		//     this.listPrice += (item.price * item.num)
		//     this.listRealPrice += (item.discountPrice * item.num)
		// })
	},
	mounted() {},
	updated() {},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';
.shopCarDialog {
	padding: 30px 28px;
	background: @color-FFF;
	position: absolute;
	box-shadow: 0 0 10px #eeeeee;
	width: 400px;
	left: -292px;
	top: 59px;
	z-index: 10;
	cursor: default;
	line-height: 20px;
	// 有商品
	.shopcar_dialog_full {
		.priceType {
			overflow: hidden;
			text-align: right;
			margin: 10px 0;
			line-height: 35px;
			.priceTypeLeft {
				font-size: 12px;
                font-family: Montserrat Light;
				color: #2fc083;
				text-align: left;
			}
			.priceTypeRight {
				font-size: 16px;
				.price {
                    font-size: 14px;
					font-family: Montserrat Light;
					color: #666;
					margin-right: 5px;
					font {
						color: #999;
						text-decoration: line-through;
					}
				}
				.total {
					font-family: Montserrat Regular;
                    color: #333;
                    font {
                        color: @color-promo;
                    }
				}
			}
		}
		.shopcar_dialog_full_div {
			// min-height:350px;
			max-height: 400px;
			overflow: auto;
		}
		// 进入购物车按钮
		.full_view_bag-btn {
			width: 100%;
			padding: 13px 0;
			text-align: center;
			border-radius: 0;
			background: @color-222;
			font-size: 18px;
			color: #fff;
			font-family: Montserrat Regular;
		}
	}
	// 无商品
	.shopcar_dialog_empty {
		.shop-car__empty_img {
			width: 101px;
			height: 98px;
			display: block;
			margin: 0 auto;
		}
		.shop-car__empty_des {
			text-align: center;
			color: @color-999;
			font-size: 14px;
			font-family: Montserrat Light;
			margin-top: 15px;
		}
	}
}
</style>