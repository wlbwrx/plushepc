<template>
	<div :class="['dia-pc', { ifExpired: expired }]">
		<div class="full_list_ul">
			<div class="full_list_li" v-for="(item, index) of list" :key="index">
				<div class="full_list_li_left">
					<el-image class="full-image" :src="$utils.imageHandler(14, item.defaultPicKey || item.picKey)" fit="cover" @click="goGoodsDetail(item)">
						<div slot="placeholder" class="image-slot">
							<img src="@/assets/images-pc/default.png" />
						</div>
						<div slot="error" class="image-slot">
							<img src="@/assets/images-pc/default.png" />
						</div>
					</el-image>
					<div class="car-image-lo" v-if="expired">Sold Out</div>
				</div>
				<div class="full_list_li_right">
					<!-- 先隐藏掉品牌 -->
					<!-- <div class="full_right_title">
                        {{ item.brandName }}
                    </div> -->
					<div class="full_right_des">
						{{ (item.productName || item.name) | productNameFilter(25) }}
					</div>
					<div class="full_right_price">
						<span :class="['price', { price_z: item.discountPrice && item.discountPrice < item.price }]">US${{ (item.discountPrice || item.price) | filterPrice }}</span>
						<span class="price_through" v-if="item.discountPrice && item.discountPrice < item.price">US${{ item.price | filterPrice }}</span>
					</div>
					<div class="full_right_type-num" v-if="!expired">
						<div class="full_right_type">
							{{ item.attrObj | attrVals(5) }}
							<!-- <i class="el-icon-arrow-down"></i> -->
						</div>
						<div class="full_right-num">
							<span class="full-num-btn full_right-num-cut" @click="cutNum(item)">-</span>
							<span class="full_right-num-val">{{ item.num }}</span>
							<span class="full-num-btn full_right-num-add" @click="addNum(item)">+</span>
						</div>
					</div>
					<div class="full_right_empty" v-if="item.itemStatus == 35">Item is sold out.</div>
				</div>
				<i class="el-icon-delete cart_li_delete" @click="switchDelete(item.skuNo)"></i>
			</div>
		</div>
	</div>
</template>

<script>
import shopcar from '@/mixins/shopCar.js'
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
			default: true,
		},
	},
	data() {
		return {}
	},
	methods: {
		goGoodsDetail(item) {
			if (!this.expired) {
				this.$router.push({
					path: this.formatUrl(`/product/`, `${item.productName || item.name}-${item.productNo}`),
				})
			} else {
				return false
			}
		},
	},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';
.dia-pc {
	&.ifExpired {
		opacity: 0.5;
	}
	.full_list_ul {
		.full_list_li {
			display: -webkit-flex;
			display: flex;
			margin-bottom: 20px;
			position: relative;
			.cart_li_delete {
				position: absolute;
				right: 10px;
				top: 0;
				font-size: 20px;
				color: #666;
				cursor: pointer;
			}
			&:last-child {
				margin-bottom: 0;
			}
			.full_list_li_left {
				width: 96px;
				position: relative;
				.full-image {
					width: 96px;
					display: block;
					cursor: pointer;
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
			.full_list_li_right {
				width: 215px;
				margin-left: 12px;
				line-height: 20px;
				height: 128px;
				.full_right_title {
					font-size: 14px;
					color: @color-222;
					font-weight: bold;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.full_right_des {
					color: @color-666;
					font-size: 14px;
					font-family: Montserrat Light;
					height: 25px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 82%;
				}
				.full_right_price {
					margin-top: 4px;
					font-size: 14px;
					.price {
						color: @color-222;
						font-family: Montserrat Regular;
					}
					.price_z {
						color: #e84646;
					}
					.price_through {
						color: @color-999;
						text-decoration: line-through;
						font-size: 12px;
						font-family: Montserrat Light;
						margin-left: 4px;
					}
				}
				.full_right_type-num {
					overflow: hidden;
					margin-top: 16px;
					.full_right_type {
						float: left;
						font-size: 12px;
						font-family: Montserrat Regular;
						padding: 3px 14px;
						border-radius: 100px;
						background: #f6f6f6;
						color: @color-222;
						i {
							margin-left: 6px;
						}
					}
					.full_right-num {
						float: right;
						width: 89px;
						height: 24px;
						border: 1px solid @color-999;
						border-radius: 50px;
						align-items: center;
						display: -webkit-flex;
						display: flex;
						text-align: center;
						font-size: 14px;
						font-family: Montserrat Regular;
						color: @color-222;
						.full-num-btn {
							width: 27px;
							cursor: pointer;
							font-weight: bold;
						}
						.full_right-num-val {
							width: 36px;
							border-left: 1px solid @color-999;
							border-right: 1px solid @color-999;
						}
					}
				}
				.full_right_empty {
					line-height: 30px;
					color: #999;
				}
			}
		}
	}
}
</style>