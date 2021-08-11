<template>
	<div class="carListPc">
		<ul :class="['car-list__ul', { ifEditCar: editCar }]">
			<li :class="['car-list__li', { ifExpired: expired }]" v-for="(item, index) of list" :key="index">
				<div :class="['car-product__item', { ifEditCar: editCar }]">
					<div class="car-el-check">
						<el-checkbox class="car-check" size="medium" :disabled="expired" :value="item.check" @change="clickSelectSingle(item)"></el-checkbox>
					</div>
					<div class="car-el-image">
						<el-image :class="['car-image', { ifExpired: expired }]" :src="$utils.imageHandler(0, item.defaultPicKey || item.picKey)" fit="cover" @click="goGoodsDetail(item)"></el-image>
						<div class="car-image-lo" v-if="expired">Sold Out</div>
					</div>
					<div :class="['car_item_info', { ifEditCar: editCar }]">
						<!-- <div class="car_item_info_title">{{ item.brandName }}</div> -->
						<div class="car_item_info_des">{{ (item.productName || item.name) | productNameFilter(28) }}</div>
						<div class="car_item_info_attr" @click="openEditAttr(item, 0)" v-if="item.itemStatus == 10 || item.itemStatus == 35">
							{{ item.attrObj | attrVals(20) }}
							<i class="el-icon-arrow-down"></i>
						</div>
						<div class="car_item_info_move" v-if="!editCar">
							<el-button v-if="item.itemStatus == 35" @click="openEditAttr(item, 1)">Reselect</el-button>
							<span v-if="!expired">
								<i class="iconfont icon-like" v-if="devwishlist.indexOf(item.productNo) > -1" @click="addWish(item, 1)"></i>
								<i class="iconfont icon-xihuan1" v-else @click="addWish(item, 0)"></i>
							</span>
						</div>
					</div>
				</div>
				<div :class="['car-product__price', { ifEditCar: editCar }]">
					<div class="car-product__price_i">
						<div :class="['car_price_infact', { 'have-discount': item.discountPrice && item.discountPrice < item.price }]">US${{ (item.discountPrice || item.price) | filterPrice }}</div>
						<div class="car_price_through" v-if="item.discountPrice && item.discountPrice < item.price">US${{ item.price | filterPrice }}</div>
					</div>
				</div>
				<div :class="['car-product__qty', { ifEditCar: editCar }]">
					<div class="car-product__qty_i" v-if="!expired">
						<span class="g-stepper-btn g-stepper-cut" @click="cutNum(item)">-</span>
						<span class="g-stepper-val">{{ item.num }}</span>
						<span class="g-stepper-btn g-stepper-add" @click="addNum(item)">+</span>
					</div>
				</div>
				<div :class="['car-product__total', { ifEditCar: editCar }]">
					<div class="car-product__total_i">US$ {{ (item.discountPrice * item.num || item.price * item.num) | filterPrice }}</div>
				</div>
				<div class="cart_li_delete">
					<span class="spuEmpty" v-if="item.itemStatus == 35"> Item is sold out. Reselect another specification </span>
					<i class="el-icon-delete" @click="switchDelete(item.skuNo)"></i>
				</div>
			</li>
		</ul>

		<!-- 编辑商品属性弹窗 -->
		<div class="edit-car edit-car-attributes" v-if="isEditAttr">
			<edit-attr @closeEdit="closeEdi" :goodsInfo="goodsInfo" :skuNo="skuNo" :addType="addChange" :openTtype="openTtype" :skuChangeNum="skuChangeNum"></edit-attr>
		</div>
	</div>
</template>

<script>
import { Toast } from 'vant'
import { mapState, mapGetters, mapActions } from 'vuex'
import shopcar from '@/mixins/shopCar.js'
import editAttr from './editCarAttributes'
import http from '@/api/index'
export default {
	mixins: [shopcar],
	props: {
		list: {
			type: Array,
		},
		expired: {
			type: Boolean,
			default: false,
		},
		// 判断是否是编辑状态
		editCar: {
			type: Boolean,
		},
	},
	components: {
		editAttr,
	},
	data() {
		return {
			skuNo: '', //点击时获取sku
			goodsInfo: {},
			isEditAttr: false,
			addChange: 'change',
			openTtype: 1,
			skuChangeNum: 1,
		}
	},
	computed: {
		...mapState('wish', ['devwishlist']),
		...mapGetters(['shopsId', 'token']),
	},
	methods: {
		...mapActions('wish', ['addBatchWishList', 'devAddWishList']),

		// 打开单个属性操作框 需要传参数
		openEditAttr(goods, type) {
			const that = this
			const params = {
				productNo: goods.productNo,
			}
			that.skuNo = goods.skuNo
			that.goodsInfo = goods
			http.goodsDetail.detail(params).then((res) => {
				res.data.list.forEach((item) => {
					// 根据购车当前商品属性，回显
					item.attrVal = ''
					item.attrValList.forEach((obj) => {
						obj.isDefault = false
						if (goods.attrObj[item.attrName] == obj.val) {
							// 同步购车选中属性
							obj.isDefault = true
							item.attrVal = obj.val
						}
						// 同步属性完成后-取轮播图
						if (item.isValHavePics && obj.isDefault) {
							res.data.swipeList = obj.picList
						}
					})
				})
				this.calculationInventory(that.goodsInfo) // 对属性进行 禁用项处理.
				if (type == 0) {
					res.data.attrObj = goods.attrObj // 当前选中的 属性-属性值
					res.data.skuNo = goods.skuNo
					res.data.price = goods.price
					res.data.discountPrice = goods.discountPrice
					// that.goodsInfo.num = goods.num //现有的购物车数量
				} else {
					that.openTtype = 0
				}
				that.goodsInfo = res.data
				this.skuChangeNum = goods.num
				that.isEditAttr = true
			})
		},
		// 点击复选框
		clickSelectSingle(item) {
			if (this.expired) return
			this.selectSingle(item)
		},
		// 点击图片，前往商品详情：
		goGoodsDetail(item) {
			if (this.expired) return
			this.$router.push({
				path: this.formatUrl(`/product/`, `${item.productName || item.name}-${item.productNo}`),
			})
		},
		// 单个点击收藏
		addWish(item, type) {
			if (this.token) {
				let funName = type == 1 ? 'deleteWishList' : 'addWishList'
				this[funName]({ productNo: item.productNo }).then((res) => {
					if (res.code === 0) {
						this.reportGtag('add_to_wishlist', this.reportData())
						this.reportFB('AddToWishlist', this.reportData('fb'))
						this.devAddWishList({
							productNo: item.productNo,
							type: type,
						})
						Toast({
							duration: 3000,
							message: type == 1 ? 'Cancel success!' : 'Add success!',
							icon: ' iconfont iconsuccess_no_circle',
						})
					}
				})
			} else {
				// this.$store.commit('user/loginDialogIs', true)
				let params = {
					userId: item.userId,
					productNo: item.productNo,
					platformId: item.platformId,
					type: type,
				}
				console.log(params)
				this.devAddWishList(params)
			}
		},
	},
	created() {},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';
.carListPc {
	// 编辑商品弹窗
	.edit-car {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 10;
	}
	.car-list__ul {
		&.ifEditCar {
			padding: 0 10px;
		}
		.car-list__li {
			justify-content: space-between;
			display: -webkit-flex;
			display: flex;
			position: relative;
			padding-bottom: 20px;
			margin-bottom: 20px;
			border-bottom: 1px solid #e5e5e5;
			&.ifExpired {
				opacity: 0.5;
			}
			.car-product__item {
				max-width: 424px;
				width: 49%;
				display: -webkit-flex;
				display: flex;
				&.ifEditCar {
					max-width: 477px;
				}
				.car-el-check {
					width: 20px;
					margin-right: 16px;
					height: 152px;
					display: table;
					.car-check {
						transform: scale(1.3);
						display: table-cell;
						vertical-align: middle;
					}
				}
				.car-el-image {
					position: relative;
					width: 116px;
					height: 173px;
					.car-image {
						width: 100%;
						height: 100%;
						cursor: pointer;
						&.ifExpired {
							cursor: not-allowed;
						}
					}
					.car-image-lo {
						width: 100%;
						height: 25px;
						line-height: 25px;
						background: rgba(0, 0, 0, 0.3);
						color: #fff;
						font-size: 14px;
						text-align: center;
						position: absolute;
						bottom: 0;
						left: 0;
					}
				}
				.car_item_info {
					margin-left: 16px;
					width: 211px;
					position: relative;
					.car_item_info_title {
						font-size: 14px;
						color: #c4c4c4;
						font-weight: bold;
					}
					.car_item_info_des {
						font-size: 15px;
						font-family: Montserrat Light;
						margin-top: 4px;
						line-height: 20px;
						color: #666;
					}
					.car_item_info_attr {
						font-size: 14px;
						font-family: Montserrat Light;
						padding: 2px 6px;
						border: 1px solid #c4c4c4;
						color: #333;
						display: inline-block;
						margin-top: 12px;
						cursor: pointer;
						border-radius: 4px;
					}
					.car_item_info_move {
						color: @color-222;
						font-size: 14px;
						margin-top: 38px;
						cursor: pointer;
						position: absolute;
						bottom: 0;
						left: 0;
						.el-button {
							font-family: Montserrat Light;
							border: 1px solid #333;
							color: #333;
							padding: 6px 14px;
						}
						i {
							font-size: 23px;
							margin-left: 10px;
							position: relative;
							top: 4px;
						}
					}
				}
			}
			.car-product__price {
				display: table;
				width: 19%;
				max-width:163px;
				height: 152px;
				&.ifEditCar {
					width: 154px;
				}
				.car-product__price_i {
					display: table-cell;
					vertical-align: middle;
					text-align: center;
					.car_price_infact {
						font-size: 16px;
						font-family: Montserrat Regular;
						color: #333;
						&.have-discount {
							color: @color-red;
						}
					}
					.car_price_through {
						font-size: 16px;
						font-family: Montserrat Light;
						text-decoration: line-through;
						color: @color-999;
						margin-top: 4px;
					}
				}
			}
			.car-product__qty {
				width: 18%;
				max-width:160px;
				display: table;
				height: 152px;
				&.ifEditCar {
					width: 174px;
				}
				.car-product__qty_i {
					display: table-cell;
					vertical-align: middle;
					text-align: center;
					.g-stepper-btn {
						width: 35px;
						height: 35px;
						line-height: 35px;
						cursor: pointer;
						color: @color-999;
						font-size: 18px;
						display: inline-block;
					}
					.g-stepper-val {
						font-size: 18px;
						font-family: Montserrat Regular;
						width: 45px;
						height: 35px;
						line-height: 35px;
						display: inline-block;
					}
				}
			}
			.car-product__total {
				width: 12%;
				max-width:103px;
				height: 152px;
				display: table;
				&.ifEditCar {
					width: 105px;
				}
				.car-product__total_i {
					text-align: right;
					display: table-cell;
					vertical-align: middle;
					font-size: 16px;
					font-family: Montserrat Regular;
					color: #333;
				}
			}
			.cart_li_delete {
				position: absolute;
				bottom: 20px;
				right: 0;
				cursor: pointer;
				.spuEmpty {
					color: #999;
					font-size: 14px;
				}
				i {
					font-size: 20px;
				}
			}
		}
	}
}
</style>