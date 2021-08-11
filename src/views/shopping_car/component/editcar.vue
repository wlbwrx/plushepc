<template>
	<div class="edit_car">
		<i class="iconfont icon-guanbi" @click="loginClose()"></i>
		<div class="edit_car_i">
			<div class="shop_car__tools">
				<span class="shop_car__tools_title">Your Cart</span>
				<span class="shop_car__tools_des">Prices are subject to change based on the price in effect the day you checkout.</span>
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
					<!-- <div class="car-list_tools">
                        <span class="car-list_tools_left"></span>
                    </div> -->
					<!-- 编辑商品 -->
					<cart-listpc :list="goodsList" editCar></cart-listpc>
					<cart-listpc :list="expiredList" expired editCar></cart-listpc>
				</div>
			</div>
			<!-- 操作 -->
			<div class="edit-car-all">
				<div class="all-el-check">
					<el-checkbox class="car-check" :value="isAllChecked" size="medium" @change="selectAll"></el-checkbox>
					<span class="car-check-text">All</span>
					<span class="all-num"> {{ skuNos.length }} Select </span>
				</div>
				<div class="all-eidt-btn">
					<el-button class="bth" :disabled="skuNos.length == 0" @click="addWish">MOVE TO WISHLIST</el-button>
					<el-button class="bth" :disabled="skuNos.length == 0" @click="clickDelete">DELETE</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Toast } from 'vant'
import { mapActions } from 'vuex'
import shopcar from '@/mixins/shopCar.js'
import cartListpc from './CarList'
export default {
	mixins: [shopcar],
	data() {
		return {
			checked: true,
		}
	},
	components: {
		cartListpc,
	},
	computed: {},
	methods: {
		...mapActions('wish', ['addBatchWishList']),
		loginClose() {
			this.$emit('clostCarBox', false)
		},
		clickSelectSingle(item) {
			if (this.expired) return
			this.selectSingle(item)
		},
		addWish() {
			if (this.token) {
				let wishList = []
				this.goodsList.map((item) => {
					if (item.check) {
						let { userId, platformId, productNo } = item
						let pro = { userId, platformId, productNo }
						wishList.push(pro)
					}
				})
				this.addBatchWishList({ wishList }).then(() => {
					this.reportGtag('add_to_wishlist', this.reportData())
					this.reportFB('AddToWishlist', this.reportData('fb'))
					Toast({
						duration: 3000,
						message: 'Moved success!',
						icon: ' iconfont iconsuccess_no_circle',
					})
				})
			} else {
				// this.$router.push({
				//     path: '/login',
				//     query: {
				//         redirect: `/shopping_car`,
				//     },
				// })
				this.loginClose()
				this.$store.commit('user/loginDialogIs', true)
			}
		},
		// 点击删除按钮：
		clickDelete() {
			this.switchDelete()
		},
	},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';
.edit_car {
	position: absolute;
	width: 990px;
	height: 800px;
	left: 50%;
	top: 50%;
	margin: -400px 0 0 -495px;
	background: #fff;
	.icon-guanbi {
		font-size: 24px;
		position: absolute;
		right: 40px;
		top: 40px;
		cursor: pointer;
	}
	.edit_car_i {
		padding: 40px;
		.shop_car__tools {
			padding: 20px 0 30px;
			position: relative;
			width: 100%;
			margin-top: 35px;
			.shop_car__tools_title {
				font-size: 24px;
				font-family: Montserrat Regular;
				color: @color-222;
				display: block;
			}
			.shop_car__tools_des {
				font-size: 14px;
				font-family: Montserrat Light;
				color: #767676;
				display: block;
				margin-top: 8px;
			}
		}
		// 购物车列表
		.car-list {
			width: 100%;
			height: 530px;
			overflow: auto;
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
						width: 427px;
					}
					&:nth-child(2) {
						width: 154px;
					}
					&:nth-child(3) {
						width: 174px;
					}
					&:nth-child(4) {
						width: 105px;
						text-align: right;
					}
				}
			}
			.car-list__item {
				width: 100%;
				margin-top: 20px;
				font-size: 12px;
				font-weight: 400;
				.car-list_tools {
					overflow: hidden;
					height: 26px;
					.car-list_tools_left {
						float: left;
						color: @color-999;
						cursor: pointer;
						i {
							margin-right: 8px;
							color: @color-999;
						}
					}
					.car-list_tools_right {
						float: right;
						color: @color-222;
						cursor: pointer;
					}
				}
			}
		}
		// 底部全选框
		.edit-car-all {
			width: 100;
			height: 54px;
			margin-top: 20px;
			padding: 10px 52px;
			border-top: 1px solid #f5f5f5;
			.all-el-check {
				display: -webkit-flex;
				display: flex;
				overflow: hidden;
				float: left;
				.car-check {
					transform: scale(1.3);
					display: table-cell;
					vertical-align: middle;
					margin-right: 10px;
					margin-left: 5px;
				}
				.car-check-text {
					font-size: 16px;
					font-family: Montserrat Light;
					color: @color-222;
					margin-right: 30px;
				}
				.all-num {
					font-size: 16px;
					font-family: Montserrat Light;
					color: #767676;
				}
			}
			.all-eidt-btn {
				float: right;
				.bth {
					padding: 10px 20px;
					font-size: 14px;
					font-family: Montserrat Regular;
					color: @color-222;
					border: 1px solid @color-222;
					margin-left: 30px;
					&:disabled {
						opacity: 0.3;
					}
				}
			}
		}
	}
}
</style>