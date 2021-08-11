<template>
	<div class="login-register">
		<i class="iconfont icon-guanbi" @click="loginClose()"></i>
		<div class="login-register__menu">
			<li :class="['menu-item', { 'is-active': item.id == currentNavId }]" v-for="item of navList" :key="item.id" @click="switchLoginRegister(item.id)">{{ item.name }}</li>
		</div>
		<div class="login-register_detail">
			<div class="lr_detai" v-if="currentNavId == 0">
				<field-input :value.sync="form.userEmail" label="Email Address:" :error="errorEmail" @onblur="blurEmail" :terminal="plushePc"></field-input>
				<field-input :value.sync="form.userPassword" label="Password:" :error="errorPassword" type="password" @onblur="blurPassword" :terminal="plushePc"></field-input>
				<div class="login-submit-box">
					<el-button class="submit-btn-44" block @click="submit('login')">SIGN IN</el-button>
				</div>
				<p class="login__forgotten">
					<span @click="forget">Forgotten your password</span>
				</p>
			</div>
			<div class="lr_detai" v-if="currentNavId == 1">
				<field-input :value.sync="form.userEmail" label="Email Address:" :error="errorEmail" @onblur="blurEmail" :terminal="plushePc"></field-input>
				<field-input :value.sync="form.userPassword" label="Password:" :error="errorPassword" type="password" @onblur="blurPassword" :terminal="plushePc"></field-input>
				<div class="login-submit-box">
					<el-button class="submit-btn-44" block @click="submit('register')">REGISTER</el-button>
					<!-- 新增注册赠送优惠券提示 -->
					<div class="newPeopleCouponVal" v-if="newPeopleCouponVal > 0">GET US${{ newPeopleCouponVal }} OFF NEW ORDERS</div>
				</div>
			</div>
			<el-divider class="plushe-line">or</el-divider>
			<div class="login-regist-footer">
				<el-button class="login-other-btn" @click="thirdLogin(1)" v-google-signin-button="clientId">
					<el-image class="login-other-image" :src="require('../../assets/images/signin_icon_google.png')"></el-image>
					Sign in with Google
				</el-button>
				<el-button class="login-other-btn" @click="thirdLogin(2)" v-facebook-signin-button="appId">
					<el-image class="login-other-image" :src="require('../../assets/images/signin_icon_facebook.png')"></el-image>
					Sign in with Facebook
				</el-button>
				<!-- <el-button class="login-other-btn" @click="thirdLogin(2)" v-facebook-signin-button="appId">
                    <el-image class="login-other-image" :src="require('../../assets/images/signin_icon_line.png')"></el-image>
                    Sign in with Line
                </el-button> -->
				<p class="register__desc" v-if="currentNavId == 1">
					By clicking register, you agree to our
					<span class="register__link" @click="goPage('privacy_policy')">Privacy & Cookies Policy </span>
					and <span class="register__link" @click="goPage('terms_conditions')">Terms & Conditions</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { Toast } from 'vant'
import FieldInput from './components/FieldInput.vue'
import login from '@/mixins/login.js'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { platformConfig } from '@/utils/enums.js'

export default {
	mixins: [login],
	data() {
		return {
			plushePc: 'plushePc',
			navList: [
				{ name: 'Sign In', id: 0 },
				{ name: 'Register', id: 1 },
			],
			currentNavId: 1,
			type: 0, // 登录方式 1-google, 2-facebook, 3-apple
			clientId: platformConfig.plushe.googleLoginID,
			appId: platformConfig.plushe.fbLoginID,
		}
	},
	components: {
		FieldInput,
	},
	computed: {
		...mapState({
			loginMethod: (state) => state.user.loginMethod,
			client: (state) => state.app.client, // app 才有, 值: ios | android
		}),
		...mapGetters({
			newPeopleCouponVal: 'newPeopleCouponVal', // 优惠券
		}),
	},
	created() {},
	directives: {
		'facebook-signin-button': {
			bind: function (el, binding, vnode) {
				CheckComponentMethods()
				let appId = binding.value
				let facebookSignInAPI = document.createElement('script')
				facebookSignInAPI.setAttribute('src', '//connect.facebook.net/en_US/sdk.js')
				document.head.appendChild(facebookSignInAPI)

				facebookSignInAPI.onload = InitFacebookButton

				function InitFacebookButton() {
					FB.init({
						appId: appId,
						xfbml: true,
						version: 'v3.1',
					})
					FB.logout()
				}

				// 点击按钮时:
				el.addEventListener('click', PopUp)

				function PopUp() {
					FB.login(function (facebookResponse) {
						if (facebookResponse.status === 'connected') {
							OnSuccess(facebookResponse.authResponse.accessToken)
						} else {
							Onfail()
						}
						// {scope: 'email public_profile user_photos user_birthday user_gender'}
					})
				}

				function OnSuccess(token) {
					vnode.context.OnFacebookAuthSuccess(token)
				}

				function Onfail() {
					vnode.context.OnFacebookAuthFail('Facebook sign-in failed')
				}

				function CheckComponentMethods() {
					if (!vnode.context.OnFacebookAuthSuccess) {
						throw new Error('The method OnFacebookAuthSuccess must be defined on the component')
					}

					if (!vnode.context.OnFacebookAuthFail) {
						throw new Error('The method OnFacebookAuthFail must be defined on the component')
					}
				}
			},
		},
		'google-signin-button': {
			bind: function (el, binding, vnode) {
				CheckComponentMethods()
				let clientId = binding.value
				let googleSignInAPI = document.createElement('script')
				googleSignInAPI.setAttribute('src', 'https://apis.google.com/js/api:client.js')
				document.head.appendChild(googleSignInAPI)

				googleSignInAPI.onload = InitGoogleButton

				function InitGoogleButton() {
					gapi.load('auth2', () => {
						const auth2 = gapi.auth2.init({
							client_id: clientId,
							cookiepolicy: 'single_host_origin',
						})
						// 点击按钮:
						auth2.attachClickHandler(el, {}, OnSuccess, Onfail)
					})
				}

				function OnSuccess(googleUser) {
					console.log(googleUser, googleUser.getAuthResponse(true))
					vnode.context.OnGoogleAuthSuccess(googleUser.getAuthResponse().id_token)
					googleUser.disconnect()
				}

				function Onfail(error) {
					vnode.context.OnGoogleAuthFail(error)
				}

				function CheckComponentMethods() {
					if (!vnode.context.OnGoogleAuthSuccess) {
						throw new Error('The method OnGoogleAuthSuccess must be defined on the component')
					}

					if (!vnode.context.OnGoogleAuthFail) {
						throw new Error('The method OnGoogleAuthFail must be defined on the component')
					}
				}
			},
		},
	},
	methods: {
		...mapMutations('user', ['SET_LOGINMETHOD']),
		// 谷歌登录:
		OnGoogleAuthSuccess(idToken) {
			this.loading()
			this.toLogin(idToken)
		},
		OnGoogleAuthFail(error) {
			console.log(error)
			this.$message({
				showClose: true,
				message: 'user cancel',
			})
		},
		// facebook 登录:
		OnFacebookAuthSuccess(idToken) {
			this.loading()
			this.toLogin(idToken)
		},
		OnFacebookAuthFail(error) {
			console.log(error)
			this.$message({
				showClose: true,
				message: 'user cancel',
			})
		},
		// 执行后台登录操作:
		toLogin(idToken) {
			let type = this.type
			const params = {
				authType: type,
				thirdToken: idToken,
				shopsId: this.shopsId || undefined,
			}
			this.$store.dispatch('user/ThirdLogin', params).then((data) => {
				this.loginClose()
				this.goPageDel(data.newPerson)
				// 将购物车数据上传：
				this.$store.dispatch('shopCar/addItems')
				// 数据上报:
				this.reportGtag(data.newPerson ? 'sign_up' : 'login', {
					method: (type == 1 && 'Google') || (type == 2 && 'Fackbook') || (type == 3 && 'Apple'),
				})
				this.reportFB(
					data.newPerson ? 'SignUp' : 'Login',
					{
						methods: (type == 1 && 'Google') || (type == 2 && 'Fackbook') || (type == 3 && 'Apple'),
					},
					true
				)
			})
		},
		// 新增关闭登录弹窗
		loginClose() {
			this.$store.commit('user/loginDialogIs', false)
		},
		// 选择登录or注册：
		switchLoginRegister(id) {
			if (id == this.currentNavId) return
			this.currentNavId = id
			this.form.userPassword = ''
		},
		// 忘记密码：重置密码
		forget() {
			console.log(this.form.userEmail)
			this.$store.commit('user/loginDialogIs', false)
			this.$router.push({
				path: '/reset_password',
				query: {
					userEmail: this.form.userEmail || '',
				},
			})
		},
		// 点击跳转协议页面
		goPage(type) {
			this.$store.commit('user/loginDialogIs', false)
			this.$router.push({
				path: '/other_info',
				query: {
					type: type,
				},
			})
		},
		searchClose() {},
		// 点击了三方登录按钮:
		thirdLogin(type) {
			this.type = type
			// 如果是APP,则走Fullter 对接三方返回的idToken
			if (this.client == 'ios' || this.client == 'android') {
				let method = (type == 1 && 'googleSignIn') || (type == 2 && 'facebookSignIn') || (type == 3 && 'appleSignIn')
				this.loading()
				window.flutter_inappwebview
					.callHandler('callNativeMethod', {
						method: method,
					})
					.then((res) => {
						if (res.result) {
							this.toLogin(res.data)
						} else {
							Toast('Access Denied')
						}
					})
			}
		},
		// 跳转判断:
		goPageDel(isNewPerson) {
			Toast.clear()
			if (isNewPerson) {
				this.$router.push({
					path: '/register_success',
					query: {
						redirect: this.$route.query.redirect,
					},
				})
			} else {
				this.$router.push({
					path: this.$route.query.redirect || '/home',
				})
			}
		},
		// 加载:
		loading() {
			Toast.loading({
				loadingType: 'spinner',
				forbidClick: true,
				message: 'loading...',
				duration: 0,
			})
		},
	},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';
.login-register {
	position: absolute;
	width: 520px;
	height: 786px;
	left: 50%;
	margin-left: -260px;
	top: 50%;
	margin-top: -393px;
	background: @color-FFF;
	.icon-guanbi {
		font-size: 24px;
		position: absolute;
		top: 40px;
		right: 40px;
		cursor: pointer;
	}
	.login-register__menu {
		display: flex;
		justify-content: center;
		margin-top: 69px;
		color: @color-222;
		.menu-item {
			font-size: 26px;
			position: relative;
			font-weight: bold;
			margin-top: 40px;
			cursor: pointer;
			&:first-child {
				margin-right: 120px;
			}
			&.is-active::after {
				content: '';
				position: absolute;
				left: 0;
				bottom: -16px;
				width: 100%;
				border-bottom: 3px solid @color-222;
			}
		}
	}
	.login-register_detail {
		margin-top: 60px;
		padding: 0 40px;
		.lr_detai {
			.newPeopleCouponVal {
				text-align: center;
				color: @color-promo;
				font-size: 17px;
				margin-top: 15px;
			}
			.login__forgotten {
				margin-top: 16px;
				text-align: center;
				color: @color-999;
				cursor: pointer;
			}
			.submit-btn-44 {
				height: 44px;
				background: @color-222;
				font-size: 18px;
				width: 100%;
				color: @color-FFF;
				border-radius: 0;
				margin-top: 40px;
			}
		}
		.plushe-line {
			margin-top: 29px;
			.el-divider__text {
				font-size: 14px;
				color: #c4c4c4c4;
			}
		}
		.login-regist-footer {
			.login-other-btn {
				width: 100%;
				border-radius: 0;
				border: 1px solid #ccc;
				background: @color-FFF;
				margin-left: 0;
				margin-top: 20px;
				position: relative;
				font-size: 16px;
				padding-top: 14px;
				padding-bottom: 14px;
				.login-other-image {
					width: 22px;
					height: 22px;
					position: absolute;
					top: 11px;
					left: 60px;
					color: @color-666;
				}
			}
			.register__desc {
				font-size: 12px;
				margin-top: 30px;
				color: @color-999;
				text-align: center;
				.register__link {
					cursor: pointer;
					font-size: 14px;
					color: @color-222;
				}
			}
		}
	}
}
</style>