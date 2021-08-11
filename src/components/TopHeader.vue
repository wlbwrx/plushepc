<template>
	<div class="top-header">
		<div class="swiper-container notice-swiper-notice" ref="headerNotice">
			<div class="swiper-wrapper">
				<template v-for="item in noticesList">
					<a class="swiper-slide" :href="item.internalUrl || 'javascript: void(0);'" :key="item.id" v-html="item.content">
						<!-- {{ item.content }} -->
					</a>
				</template>
			</div>
		</div>
		<div class="top-header__menu" ref="headerMenu">
			<div :class="['top-header__menu-content', { 'menu--fixed': isMenuFixed }]">
				<div class="th__menu-left">
					<img v-if="iconBack" class="th__menu-icon-back th__menu-icon" @click="toBack" src="@/assets/images/icons/back.png" alt="" />
					<img v-if="iconFenLei" class="th__menu-icon-fenlei th__menu-icon" @click="goPage('/category?hideTabbar=1')" src="@/assets/images/icons/fenlei.png" alt="" />
				</div>
				<img class="th__menu-logo" src="@/assets/images/logo.png" alt="" @click="goPage('/home')" />
				<div class="th__menu-right">
					<img class="th__menu-icon-search th__menu-icon" src="@/assets/images/icons/search.png" @click="goPage('/search')" alt="" />
					<span class="th__menu-shopcar" @click="goPage('/shopping_car?hideTabbar=1')">
						<img class="th__menu-icon-cart th__menu-icon" src="@/assets/images/icons/bag.png" alt="" />
						<i class="th__menu-cart--num" v-if="totalNum">{{ totalNum }}</i>
					</span>
				</div>
			</div>
		</div>

		<div class="top-header__other" ref="headerOther">
			<img class="th__other-img" src="@/assets/images/home/home-free.png" alt="" @click="goPage('/otherInfo?id=1')" />
			<img class="th__other-img" src="@/assets/images/home/home-return.png" alt="" @click="goPage('/otherInfo?id=2')" />
		</div>
	</div>
</template>

<script>
import http from '@/api/index.js'
import { mapGetters } from 'vuex'
export default {
	props: {
		// 控制 返回键
		iconBack: {
			type: Boolean,
			default: false,
		},
		// 控制 分类按钮
		iconFenLei: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			noticesList: [],
			noticesHeight: 0,
			isMenuFixed: false,
			menuHeight: 0,
			otherHeight: 0,
		}
	},
	computed: {
		...mapGetters('shopCar', {
			totalNum: 'totalNum',
		}),
	},
	created() {
		if (this.from == 'home') {
			this.noticesList = this.list
			this.$nextTick(_ => {
				new Swiper('.notice-swiper-notice', {
					direction: 'vertical',
					autoplay: 3000,
					autoplayDisableOnInteraction: false,
					loop: true,
				})
			})
			return
		}
		http.home.notices().then(res => {
			if (res.code == 0) {
				this.noticesList = res.data
				this.$nextTick(_ => {
					new Swiper('.notice-swiper-notice', {
						direction: 'vertical',
						autoplay: 3000,
						autoplayDisableOnInteraction: false,
						loop: true,
					})
				})
			}
		})
	},
	activated() {
		this.noticesHeight = this.$refs['headerNotice'].offsetHeight
		this.otherHeight = this.$refs['headerOther'].offsetHeight
		this.menuHeight = this.$refs['headerMenu'].offsetHeight
		window.addEventListener('scroll', this.pageScroll)
	},
	deactivated() {
		window.removeEventListener('scroll', this.pageScroll)
	},
	methods: {
		// 返回:
		toBack() {
			this.$router.go(-1)
		},
		// 前往页面：
		goPage(path) {
			this.$router.push({
				path: path,
			})
		},
		pageScroll() {
			let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
			this.isMenuFixed = scrollTop > this.noticesHeight

			this.$emit('scroll', {
				scrollTop: scrollTop,
				noticesHeight: this.noticesHeight,
				menuHeight: this.menuHeight,
				otherHeight: this.otherHeight,
			})
		},
	},
}
</script>

<style lang="less" scoped>
.top-header {
	color: #222;
	position: relative;
	z-index: 101;
	.notice-swiper-notice {
		height: 36px;
		background: #fdc9ac;

		.swiper-slide {
			display: block;
			text-align: center;
			height: 36px;
			line-height: 36px;
			background: #fdc9ac;
			font-size: 12px;
			color: #222;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.top-header__menu {
		height: 44px;

		.top-header__menu-content {
			position: relative;
			z-index: 100;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 44px;
			padding: 0 16px;
			background: #fff;
			box-shadow: inset 0 -1px 0 0 #f5f5f5;
			&.menu--fixed {
				position: fixed;
				top: 0;
				max-width: 375px;
				margin-top: constant(safe-area-inset-top); /* 兼容 iOS < 11.2 */
				margin-top: env(safe-area-inset-top); /* 兼容 iOS >= 11.2 */
			}
			> div {
				display: flex;
				align-items: center;
				font-size: 0;
			}
		}

		.th__menu-icon {
			width: auto;
			height: 22px;
		}
		.th__menu-icon-back {
			margin-right: 8px;
		}
		.th__menu-icon-search {
			font-size: 26px;
			margin-right: 12px;
		}
		.th__menu-logo {
			width: auto;
			height: 18px;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
		.th__menu-shopcar {
			position: relative;
			.th__menu-cart--num {
				position: absolute;
				left: 15px;
				top: -5px;
				min-width: 14px;
				padding: 0 4px;
				background: #e84646;
				color: #fff;
				font-size: 12px;
				border-radius: 7px;
				transform: scale(0.8);
				text-align: center;
				display: flex;
				align-items: center;
			}
		}
	}
	.top-header__other {
		display: flex;
		.th__other-img {
			height: 36px;
		}
	}
}
</style>
