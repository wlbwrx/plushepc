<template>
	<!-- 通用商品列表 -->
	<div class="goods-list">
		<h3 class="goods-list__title" v-if="title">{{ title }}</h3>
		<div class="goods-list__wrapper">
			<ul class="goods-list__list">
				<li class="goods-list__goods" v-for="item of list" :key="item.productNo">
					<div class="goods-list__detail" @click="goGoodsDetail(item)">
						<van-image class="goods-list__goods-pic" fit="cover" lazy-load :src="$utils.imageHandler(0, item.picKey)" />
						<!-- <p class="goods-list__brand-name" v-if="item.brandName">{{ item.brandName }}</p> -->
						<div class="goods-list__content">
							<p class="goods-list__goods-name text-hidden-row-2">{{ item.productName || item.name }}</p>
							<div class="goods-list__other">
								<div class="goods-list__goods-price text-hidden-row-1">
									<template v-if="item.discountPrice && item.discountPrice < item.price">
										<span class="sale-price">US${{ item.discountPrice | filterPrice }}</span>
										<span class="old-price">US${{ item.price | filterPrice }}</span>
									</template>
									<span v-else class="original-pirce">US${{ item.price | filterPrice }}</span>
								</div>
								<div class="goods-list__goods-rate" v-if="showColors">
									<template v-if="item.evaluateNums">
										<rate :size="12" :value="item.evaluateStartPercentage || 0"></rate>
										<span class="rate-review-num">({{ item.evaluateNums || 0 }})</span>
									</template>
									<span v-else class="no-review">No Reviews</span>
								</div>
							</div>
						</div>
						<p class="goods-labels" v-if="(item.tags || item.tagsMap).length">
							<template v-if="(item.tags || item.tagsMap).indexOf('flash_sale') > -1">
								<span v-if="item.discountRate" class="goods-sign goods-sign-sale">-{{ Math.floor(item.discountRate * 100) }}%</span>
							</template>
							<span class="goods-sign" v-else>NEW</span>
						</p>
					</div>
					<!-- <van-tabs class="goods-list__tabs" v-if="showColors && item.isShowAttrValPic && item.attrValList && item.attrValList.length" @click="attrClick($event, item.productNo)" :line-width="0">
						<van-tab v-for="obj in item.attrValList" :key="obj.val" :name="obj.val">
							<template #title>
								<div :class="['goods-list__goods-color', { selected: obj.isDefault }]">
									<van-image class="val-pic" round :src="$utils.imageHandler(0, obj.valKey)" fit="cover"></van-image>
								</div>
							</template>
						</van-tab>
					</van-tabs> -->
				</li>
			</ul>
			<div class="goods-list__mask" v-if="showMore && !isEnd">
				<div class="goods-list__more" @click="toMore">
					<span>View more</span>
					<i class="icon icon-xiala"></i>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { Tab, Tabs, Image } from 'vant'
import Rate from '@/components/rate/index.vue'

export default {
	props: {
		title: {
			type: String,
		},
		showColors: {
			type: Boolean,
			default: false,
		},
		list: {
			type: Array,
		},
		// 是否显示更多按钮：
		showMore: {
			type: Boolean,
			default: false,
		},
		// 是否结束：
		isEnd: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {}
	},
	components: {
		[Tab.name]: Tab,
		[Tabs.name]: Tabs,
		[Image.name]: Image,
		Rate,
	},
	created() {},
	mounted() {},
	methods: {
		// 前往商品详情
		goGoodsDetail(item) {
			this.$router.push({
                path: this.formatUrl(`/product/`, `${item.productName || item.name}-${item.productNo}`)
            })
		},
		// 点击属性
		attrClick(name, id) {
			let index = this.list.findIndex(item => item.productNo == id)
			this.list[index].attrValList.forEach(item => {
				item.isDefault = false
				if (name == item.val) {
					item.isDefault = true
					this.list[index].picKey = item.picList[0] // 取第一张
				}
			})
		},
		// 加载更多
		toMore() {
			this.$emit('showMore')
		},
	},
}
</script>
<style scoped lang="less">
@import '@/style/variable.less';

.goods-list {
	padding: 24px 16px;
	background: @color-FFF;

	.goods-list__title {
		font-size: 18px;
		color: @color-222;
		line-height: 24px;
		margin-bottom: 13px;
		font-weight: 600;
	}

	.goods-list__wrapper {
		.goods-list__list {
			display: flex;
			flex-wrap: wrap;

			.goods-list__goods {
				width: 164px;
				margin-right: 15px;
				margin-bottom: 25px;
				color: @color-222;
				position: relative;

				&:nth-child(even) {
					margin-right: 0;
				}

				.goods-list__goods-pic {
					width: 164px;
					height: 246px;
					margin-bottom: 6px;
				}

				.goods-list__brand-name {
					font-size: 12px;
					color: @color-666;
					margin-bottom: 5px;
				}

				.goods-list__goods-name {
					font-size: 14px;
					line-height: 17px;
					max-height: 34px;
					min-height: 17px;
					margin-bottom: 6px;
				}

				.goods-list__goods-price {
					font-size: 13px;
					line-height: 14px;
					font-weight: 600;
					.sale-price {
						color: @color-red;
						// margin-right: 4px;
					}
					.old-price {
						text-decoration: line-through;
						color: @color-999;
						font-weight: normal;
						font-size: 12px;
						display: inline-block;
						transform: scale(0.8);
					}
					.original-pirce {
						color: @color-222;
						text-decoration: none;
					}
				}

				.goods-list__goods-color {
					width: 20px;
					height: 20px;
					border-radius: 50%;
					font-size: 0;
					display: flex;
					align-items: center;
					justify-content: center;

					&.selected {
						border: 1px solid @color-222;
					}
					.val-pic {
						width: 14px;
						height: 14px;
						object-fit: cover;
						border-radius: 50%;
						overflow: hidden;
					}
				}

				.goods-labels {
					position: absolute;
					left: 0;
					top: 0;
					.goods-sign {
						display: block;
						height: 18px;
						line-height: 18px;
						background: #87c6a1;
						color: #fff;
						font-size: 12px;
						padding: 0 6px;
						margin-bottom: 6px;
						&.goods-sign-sale {
							background: #ffb84e;
							color: #222;
						}
					}
				}
				.goods-list__goods-rate {
					margin-top: 10px;
					font-size: 12px;
					color: @color-666;
					display: flex;
					align-items: center;
					.rate-review-num {
						margin-left: 4px;
					}
					.no-review {
						color: #ccc;
					}
				}
			}
		}
	}

	.goods-list__detail {
		height: 100%;
		display: flex;
		flex-direction: column;

		.goods-list__content {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}

	.goods-list__mask {
		position: relative;
		z-index: 1;
		margin-top: 20px;
		display: flex;
		justify-content: center;
		background: #fff;
		.goods-list__more {
			width: 120px;
			height: 32px;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1px solid @color-222;
			font-size: 14px;
			.icon {
				margin-left: 6px;
			}
		}
	}

	.goods-list__tabs {
		/deep/ .van-tab {
			flex: none;
		}
	}
}
</style>
