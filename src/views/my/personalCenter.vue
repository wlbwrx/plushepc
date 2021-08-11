<template>
	<div class="my">
		<div class="content-box">
			<div class="content-box-top">
				<div class="all-title">
					<div class="all-title-left">Hi, {{ nickName }}</div>
					<div class="all-title-right" v-on:click="changeMenu('myProfile')">My Profile <i class="iconfont iconfont-all icon-fanhui"></i></div>
				</div>
				<div class="all-content-top">
					<div class="icon-item" v-for="(item, index) in minMenusPc" :key="index" v-on:click="changeMenu(item.link)">
						<i :class="'iconfont iconfont-order icon ' + item.value" />
						<p class="icon-item-text">{{ item.label }}</p>
					</div>
				</div>
			</div>
			<div class="content-box-bottom">
				<div class="all-title">
					<div class="all-title-left">My Orders</div>
					<div class="all-title-right" v-on:click="changeMenu('allOrders/0')">View All <i class="iconfont iconfont-all icon-fanhui"></i></div>
				</div>
				<div class="all-content-bottom">
					<div class="icon-item" v-for="(item, index) in minOrdersPc" :key="index" v-on:click="changeMenu('allOrders/' + index)">
						<i :class="'iconfont iconfont-order icon ' + item.value"></i>
						<p class="icon-item-text">{{ item.label }}</p>
					</div>
				</div>
				<div class="empty-box">
					<img :src="noOrder" alt="" class="empty-box-img" />
					<div class="empty-box-text">It is empty here!</div>
				</div>
			</div>
		</div>
		<div class="wishlist-box">
			<div class="all-title">
				<div class="all-title-left">Wishlist</div>
				<div class="all-title-right" v-on:click="changeMenu('/wishlist')">More <i class="iconfont iconfont-all-wish icon-fanhui"></i></div>
			</div>
			<div class="wishlist-centent" v-if="wishList.length > 0">
				<img :src="$utils.imageHandler(11, item.defaultPickey)" alt="" v-for="(item, index) in wishList" :key="index" :class="index > 0 ? 'img-left' : ''" @click="goodsDetail(item)" />
			</div>
			<div class="no-wishlist" v-if="wishList.length == 0">
				<img :src="ImageEmpty" alt="" class="no-wish" />
				<div class="empty-box-text">It is empty here!</div>
			</div>
		</div>
	</div>
</template>

<script>
import store from 'store'
import { minMenusPc, minOrdersPc, msgTabs } from '@/utils/enums'
import { mapActions, mapState } from 'vuex'
import img1 from '@assets/images-pc/1.png'
import noOrder from '@assets/images-pc/noOrders.png'
export default {
	data() {
		let userInfo = store.get('userInfo')
		let { nickName, userToken, headPhoto } = userInfo || {}
		return {
			minMenusPc,
			minOrdersPc,
			msgTabs,
			img1: img1,
			noOrder: noOrder,
			nickName: nickName,
			headPhoto: headPhoto,
			userToken: userToken,
			ImageEmpty: require('@/assets/images-pc/noWish.png'),
		}
	},

	created() {
		this.getQueryWishList()
	},
	computed: {
		...mapState('wish', ['wishList']),
	},
	components: {},
	methods: {
		...mapActions('wish', ['queryWishList', 'deleteWishList']),
		getQueryWishList() {
			this.queryWishList({ pageNum: 1, pageSize: 3 })
		},
		toConfirm() {
			this.deleteWishList({ productId: this.productId }).then(() => {
				this.getQueryWishList()
			})
		},
		goodsDetail(e) {
			this.$router.push({
                path: this.formatUrl(`/product/`, `${e.productName || e.name}-${e.productNo}`)
            })
		},
		changeMenu(link) {
			switch (link) {
				case 'allOrders/0':
					this.$router.push({ path: '/personalCenter/allOrders/ALL' })
					break
				case 'allOrders/1':
					this.$router.push({ path: '/personalCenter/allOrders/Unpaid' })
					break
				case 'allOrders/2':
					this.$router.push({ path: '/personalCenter/allOrders/Processing' })
					break
				case 'allOrders/3':
					this.$router.push({ path: '/personalCenter/allOrders/Shipped' })
					break
				default:
					this.$router.push({ path: link })
			}
		},
	},
}
</script>
 <style lang="less">
</style>
<style lang="less" scoped>
@import '@/style/variable.less';

.my {
	height: 744px;
	/deep/ .iconfont-order {
		font-size: 34px;
	}
	.iconfont-all {
		font-size: 14px;
	}
	.iconfont-all-wish {
		font-size: 10px;
	}

	.left-menu {
		height: 660px;
		width: 280px;
		background-color: @color-FFF;
		padding-left: 10px;
		float: left;
		.menu-detail {
			height: 84px;
			padding: 30px 0 10px 0;
			.menu-detail-img {
				width: 44px;
				height: 44px;
				border-radius: 22px;
				background: red;
				float: left;
			}
			.menu-detail-text {
				font-size: 20px;
				margin-left: 10px;
				float: left;
				line-height: 44px;
				font-weight: 600;
			}
		}
		.menu-title {
			font-size: 18px;
			font-weight: 700;
			padding: 30px 0px 10px 0px;
			height: 58px;
			line-height: 18px;
			cursor: pointer;
		}
		.menu-parent {
			height: 36px;
			padding: 20px 20px 0 0px;
			font-weight: 500;
			font-size: 16px;
			line-height: 16px;
			cursor: pointer;
		}
		.menu-child-list {
			margin-top: 10px;
		}
		.menu-parent-list {
			margin-bottom: 10px;
		}
		.menu-child {
			height: 34px;
			line-height: 14px;
			padding: 10px 0 10px 20px;
			font-size: 14px;
			color: @color-666;
			cursor: pointer;
		}
	}
	.content-box {
		width: 600px;
		float: left;
		margin: 0px 10px 0 24px;
		.all-title {
			padding: 30px 20px 10px 20px;
			height: 64px;
			.all-title-left {
				width: 400px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 20px;
				float: left;
				height: 24px;
				line-height: 24px;
				font-weight: 600;
			}
			.all-title-right {
				font-size: 14px;
				color: @color-666;
				float: right;
				font-weight: 500;
				cursor: pointer;
			}
		}
		.content-box-top {
			height: 204px;
			background-color: @color-FFF;
		}
		.content-box-bottom {
			height: 450px;
			margin-top: 10px;
			background-color: @color-FFF;
		}
		.all-content-top {
			height: 120px;
			padding: 20px 20px 0 20px;
		}
		.all-content-bottom {
			height: 120px;
			padding: 0px 20px 0px 20px;
		}
		.icon-item {
			width: 140px;
			height: 120px;
			text-align: center;
			padding-top: 20px;
			float: left;
			cursor: pointer;
			.icon-item-img {
				width: 34px;
				height: 34px;
			}
			.icon-item-text {
				font-size: 14px;
				color: @color-666;
				height: 17px;
				line-height: 17px;
				margin-top: 10px;
			}
		}
		.empty-box {
			margin: 0 10px 20px 10px;
			background-color: #f7f8fa;
			height: 246px;
			width: 580px;
			text-align: center;
			.empty-box-img {
				width: 164px;
				height: 132px;
				margin-top: 40px;
			}
			.empty-box-text {
				font-size: 12px;
				font-family: Montserrat Regular;
				height: 14px;
				line-height: 14px;
				margin-top: 20px;
				color: @color-999;
			}
		}
	}
	.wishlist-box {
		width: 286px;
		float: left;
		background-color: @color-FFF;
		.all-title {
			padding: 30px 20px 10px 20px;
			height: 64px;
			.all-title-left {
				font-size: 20px;
				float: left;
				height: 24px;
				line-height: 24px;
				font-weight: 600;
			}
			.all-title-right {
				font-size: 14px;
				color: @color-666;
				float: right;
				font-weight: 500;
				cursor: pointer;
			}
		}
		.wishlist-centent {
			height: 126px;
			padding: 16px 24px 20px 24px;
			img {
				float: left;
				cursor: pointer;
			}
			.img-left {
				margin-left: 4px;
			}
		}
		.no-wishlist {
			height: 185px;
			color: @color-999;
			text-align: center;
			.no-wish {
				width: 99px;
				height: 92px;
				margin: 20px 94px;
			}
		}
	}
}
</style>
