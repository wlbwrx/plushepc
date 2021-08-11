<template>
	<div id="app" :class=" smallScreen ? 'smallScreen' : 'normalScreen' ">
		<el-header height="auto">
			<header-pc></header-pc>
		</el-header>
		<!-- 路由已添加缓存 -->
		<el-main :style="'background:' + mainColor">
			<keep-alive>
				<router-view v-if="isRouterAlive && $route.meta.keepAlive"></router-view>
			</keep-alive>
			<router-view v-if="isRouterAlive && !$route.meta.keepAlive"></router-view>
		</el-main>
		<!-- 底部公共区域 -->
		<el-footer height="auto" :style="'background:' + footColor">
			<footer-pc></footer-pc>
		</el-footer>
		<!-- 登录弹窗 -->
		<div class="login-dialog" v-if="dialogState">
			<login-pc></login-pc>
		</div>
	</div>
</template>

<script>
import headerPc from '@/components/component-pc/header-pc.vue'
import footerPc from '@/components/component-pc/footer-pc.vue'
import LoginPc from '@/views/login/index-pc.vue'
import { mapGetters, mapState, mapActions } from 'vuex'
import { getQueryString } from '@/utils/index'

export default {
	components: {
		headerPc,
		footerPc,
		LoginPc,
	},
	provide() {
		return {
			reload: this.reload,
		}
	},
	data() {
		return {
			isRouterAlive: true,
			dialogLogin: false, //是否显示登录弹框
			mainColor: '#ffffff',
			footColor: '#f7f8fa',
			smallScreen: window.innerWidth < 1200,
		}
	},
	computed: {
		...mapState('user', ['slideCouponHide']),
		...mapGetters(['shopsId', 'token']),
		showTabbar() {
			return !this.$store.getters.shopsId && !this.$route.query.hideTabbar
		},
		dialogState() {
			return this.$store.state.user.loginDialogIs
		},
	},
	mounted() {
		let invitationCode = getQueryString('invitationCode')
		if (invitationCode) this.$store.commit('app/SET_INVITATION_CODE', invitationCode) //SET_INVITATION_CODE(invitationCode);
		this.getNewPeopleCoupon() // 获取浮窗提示信息
	},
	methods: {
		...mapActions({
			getNewPeopleCoupon: 'user/getNewPeopleCoupon',
			// getFreeShipping: 'app/getFreeShipping',
		}),
		isLogin(loginData) {
			return loginData == 0 ? (this.dialogLogin = true) : (this.dialogLogin = false)
		},
		reload() {
			this.isRouterAlive = false
			this.$nextTick(() => {
				this.isRouterAlive = true
			})
		},
		// 处理全局性请求错误问题:
		loadErrCode() {
			window.errCode = (code, msg, cb) => {
				if (code == 401) {
					// 登录失效:
					this.$store.dispatch('user/Signout')
				} else if (code == 'exception') {
					// 接口异常:
					this.reportGtag('exception', {
						description: msg,
					})
				} else if (code == 'timeOut') {
					// 请求超时:
					this.reportGtag('timing_complete', {
						name: 'requestFail',
					})
				}
				// 回调函数处理:
				if (cb && typeof cb === 'function') cb()
			}
		},
	},
	watch: {
		$route: {
			handler(to) {
				if (to && to.name === 'personalCenterIndex') {
					this.mainColor = '#f7f8fa'
					this.footColor = '#ffffff'
				} else {
					this.mainColor = '#ffffff'
					this.footColor = '#f7f8fa'
				}
			},
			deep: true,
			immediate: true,
		},
	},
}
</script>

<style lang="less">
.el-message-box {
	width: 425px;
}
.el-message-box__header {
	display: none;
}
.el-message-box__message p {
	font-size: 20px;
	line-height: 24px;
}
.el-message-box--center {
	padding: 40px 0;
}
.el-message-box__content {
	padding: 0;
}
.el-message-box__btns {
	padding: 20px 0 0 0;
}
.el-message-box__btns button:nth-child(2) {
	margin-left: 40px;
}
.el-message-box__btns .el-button {
	padding: 9px 24px;
	font-size: 18px;
	line-height: 18px;
	font-weight: 500;
}
.smallScreen {
	.logo-img {
		transform: translate(-200px, -50%);
	}
	.foot-content {
		padding-left: 100px;
	}
	.shop-car__exist{
		overflow-x: auto;
		flex-wrap: nowrap;
	}
	.product-info .product-right{
		padding-left: 20px;
	}
	
}
.normalScreen{
	.class-block{
		max-width: 1200px;
	}
}
</style>
<style scoped lang="less">
#app {
	min-width: 760px;
	.login-dialog {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 10;
	}
}
</style>
