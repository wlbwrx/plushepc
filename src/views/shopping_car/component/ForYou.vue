<template>
	<div class="mightLike-left">
		<ul class="myLikeForYou">
			<li class="myLikeForYou_li" v-for="item of commendList.slice(0, 10)" :key="item.productNo">
				<div class="newAfale">
					<span class="detail-rate" v-if="item.tagsMap.indexOf('flash_sale') > -1 && item.discountRate > 0">-{{ Math.floor(item.discountRate * 100) }}%</span>
					<span class="detail-sign" v-if="!(item.tagsMap.indexOf('flash_sale') > -1) && item.tagsMap.indexOf('new_in') > -1">New</span>
				</div>
				<div class="like_img">
					<el-image :src="$utils.imageHandler(14, item.picKey)" fit="cover" @click="goGoodsDetail(item)">
						<div slot="placeholder" class="image-slot">
							<img src="@/assets/images-pc/default.png" />
						</div>
						<div slot="error" class="image-slot">
							<img src="@/assets/images-pc/default.png" />
						</div>
					</el-image>
					<!-- <img :src="$utils.imageHandler(14, item.picKey)" @click="goGoodsDetail(item)" alt="" class="image"> -->
					<!-- <i class="iconfont icon-like" v-if="devwishlist.indexOf(item.productNo) > -1" @click="collectProduct(item, 1)"></i>
					<i class="iconfont icon-xihuan1" v-else @click="collectProduct(item, 0)"></i> -->
				</div>
				<div class="like_title">
					{{ item.name }}
				</div>
				<div class="like_price">
					<div class="like_price_p">
						<span class="price_one">{{ (item.discountPrice || item.price) | filterPrice }}</span>
					</div>
					<!-- <div class="like_price_car" @click="openEditAttr(item)">
						<i class="iconfont icongouwuche2"></i>
					</div> -->
				</div>
			</li>
		</ul>
		<!-- 编辑商品属性弹窗 -->
		<div class="edit-car edit-car-attributes" v-if="isEditAttr">
			<edit-attr @closeEdit="closeEdi" :goodsInfo="goodsInfo" :skuNo="skuNo" :addType="addChange" :newAdd="newAddShopcar"></edit-attr>
		</div>
	</div>
</template>

<script>
import { Toast } from 'vant'
import shopcar from '@/mixins/shopCar.js'
import editAttr from './editCarAttributes'
import http from '@/api/index'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
	mixins: [shopcar],
	props: {
		commendList: {
			type: Array,
		},
	},
	data() {
		return {
			skuNo: '', //点击时获取sku
			isEditAttr: false,
			goodsInfo: {},
			addChange: '',
			loginWishList: [],
			newAddShopcar: 'new',
		}
	},
	components: {
		editAttr,
	},
	computed: {
		...mapState('wish', ['devwishlist', 'wishData']),
		...mapGetters(['shopsId', 'token']),
	},
	methods: {
		...mapActions('wish', ['devAddWishList', 'addBatchWishList', 'queryWishList']),
		// 前往商品详情：
		goGoodsDetail(item) {
			this.$router.push({
				path: this.formatUrl(`/product/`, `${item.productName || item.name}-${item.productNo}`),
			})
		},
		// 得到登录后所有的收藏商品
		async getQueryWishList() {
			this.queryWishList({ pageNum: 1, pageSize: 150 })
		},
		// 打开商品属性选择加购
		openEditAttr(item) {
			const that = this
			const params = {
				productNo: item.productNo,
			}
			// console.log(item)
			// that.skuNo = item.skuNo
			// that.goodsInfo = item
			http.goodsDetail.detail(params).then((res) => {
				// this.calculationInventory(res.data) // 对属性进行 禁用项处理.
				res.data.attrObj = item.attrObj || {} // 当前选中的 属性-属性值
				// res.data.skuNo = item.skuNo
				// res.data.price = item.price
				res.data.discountPrice = item.discountPrice
				that.goodsInfo = res.data
				// that.goodsInfo.num = item.num //现有的购物车数量
				this.calculationInventory(that.goodsInfo) // 对属性进行 禁用项处理.
				that.isEditAttr = true
			})
		},
		// 收藏
		collectProduct(item, type) {
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
				let params = {
					// userId: item.userId,
					productNo: item.productNo,
					// platformId: item.platformId,
					type: type,
				}
				this.devAddWishList(params)
			}
		},
	},
	created() {},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';
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
.mightLike-left {
	.myLikeForYou {
		overflow: hidden;
		.myLikeForYou_li {
			width: 264px;
			float: left;
			margin-right: 20px;
			margin-bottom: 20px;
			position: relative;
			&:nth-child(5n) {
				margin-right: 0;
			}
			.newAfale {
				position: absolute;
				top: 0;
				left: 0;
				z-index: 2;
				span {
					display: block;
					padding: 4px 8px;
					font-size: 18px;
					&.detail-rate {
						color: #222222;
						background: #ffb84e;
					}
					&.detail-sign {
						color: #ffffff;
						background: #87c6a1;
					}
				}
			}
			.like_img {
				width: 264px;
				height: 396px;
				position: relative;
				cursor: pointer;
				.el-image {
					width: 100%;
					display: block;
				}
				i {
					font-size: 24px;
					color: @color-222;
					position: absolute;
					right: 12px;
					top: 12px;
					cursor: pointer;
				}
			}
			.like_title {
				color: #666;
				font-size: 15px;
				font-family: Montserrat Light;
				height: 20px;
				margin-top: 10px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				word-break: break-all;
			}
			.like_price {
				overflow: hidden;
				margin-top: 5px;
				line-height: 31px;
				.like_price_p {
					float: left;
					font-size: 16px;
					font-family: Montserrat Regular;
					.price_one {
						color: #222;
					}
				}
				.like_price_car {
					float: right;

					color: #222;
					cursor: pointer;
					i {
						font-size: 20px;
					}
				}
			}
		}
	}
}
</style>