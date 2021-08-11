import http from '@/api/user.js'
import store from 'store'
import { mapActions, mapState } from 'vuex'

export default {
	data() {
		return {
			form: {
				userEmail: '',
				userPassword: '',
			},
			errorEmail: '',
			errorPassword: '',
			btnHaveClick: true, // 按钮是否可以点击，防接口长时间不返回，用户再次触发按钮问题
		}
	},
	methods: {
		...mapActions('wish', ['queryWishList', 'deleteWishList']),
		blurEmail() {
			const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
			if (!this.form.userEmail) {
				this.errorEmail = 'Please enter an email address.'
			} else if (!reg.test(this.form.userEmail)) {
				this.errorEmail = 'Please enter your vaild email.'
			} else {
				this.errorEmail = ''
				// 将正确格式的邮箱存入：
				this.$store.commit('user/SET_USEREMAIL', this.form.userEmail)
			}
		},
		blurPassword() {
			const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/
			if (!this.form.userPassword) {
				this.errorPassword = 'Please enter your password.'
			} else if (!reg.test(this.form.userPassword)) {
				this.errorPassword = 'Your password must be at least 8 characters long, with at least one number and one letter.'
			} else {
				this.errorPassword = ''
			}
		},
		submit(formName, type) {
			this.blurEmail()
			if (formName != 'sendRestEmail') this.blurPassword()
			if (this.errorEmail || this.errorPassword) return
			if (this.btnHaveClick) this[formName](type)
		},
		login() {
			let params = Object.assign({ authType: 0 }, this.form)
			this.btnHaveClick = false
			this.$store
				.dispatch('user/Login', params)
				.then(() => {
					this.btnHaveClick = true
					this.reportGtag('login', {
						method: 'Email',
					})
					this.reportFB(
						'Login',
						{
							method: 'Email',
						},
						true
					)

					// 除了商品详情，购物车，下单，其余页面登录都跳转首页
					if (this.$route.name == 'product' || this.$route.name == 'shoppingCar') {
					} else if (this.$route.name == 'orderConfirm') {
						this.$router.push({
							path: '/shopping_car',
						})
					} else {
						this.$router.push({
							path: '/home',
						})
					}

					// 登录成功以后需要对Pc弹窗进行处理,以及里跳转到登录之前的页面
					this.$store.commit('user/loginDialogIs', false)
					// 登录后，立马将购车数据上传：
					this.$store
						.dispatch('shopCar/addItems')
						.then(() => {
							// this.$router.push({
							// 	path: this.$route.fullPath || '/home',
							// })
						})
						.catch(() => {
							// this.$router.push({
							// 	path: this.$route.fullPath || '/home',
							// })
						})
					// 新增登录后 将本地的收藏商品上传
					let wishList = []
					if (this.$store.state.wish.devwishlist.length > 0) {
						this.$store.state.wish.devwishlist.map(item => {
							wishList.push({
								productNo: item,
								userId: store.get('userInfo').userId,
								platformId: this.$store.getters.platformId,
							})
						})
					}
					this.$store
						.dispatch('wish/addBatchWishList', { wishList })
						.then(() => {
							this.queryWishList({ pageNum: 1, pageSize: 20 })
							// this.$router.push({
							// 	path: this.$route.fullPath || '/home',
							// })
						})
						.catch(() => {
							// this.$router.push({
							// 	path: this.$route.fullPath || '/home',
							// })
						})
				})
				.catch(() => {
					this.btnHaveClick = true
				})
		},
		register() {
			let params = Object.assign({ authType: 0, shopsId: this.$store.getters.shopsId || undefined }, this.form)
			this.btnHaveClick = false
			this.$store
				.dispatch('user/Register', params)
				.then(() => {
					this.btnHaveClick = true
					this.reportGtag('sign_up', {
						method: 'Email',
					})

					// 注册成功以后需要关闭弹窗
					this.reportFB(
						'SignUp',
						{
							method: 'Email',
						},
						true
					)
					this.$store.commit('user/loginDialogIs', false)
					this.$store
						.dispatch('shopCar/addItems')
						.then(() => {
							this.$router.push({
								path: '/register_success',
								query: {
									redirect: this.$route.query.redirect,
								},
							})
						})
						.catch(() => {
							this.$router.push({
								path: '/register_success',
								query: {
									redirect: this.$route.query.redirect,
								},
							})
						})
					// 新增登录后 将本地的收藏商品上传
					let wishList = []
					if (this.$store.state.wish.devwishlist.length > 0) {
						this.$store.state.wish.devwishlist.map(item => {
							wishList.push({
								productNo: item,
								userId: store.get('userInfo').userId,
								platformId: this.$store.getters.platformId,
							})
						})
					}
					this.$store
						.dispatch('wish/addBatchWishList', { wishList })
						.then(() => {
							this.queryWishList({ pageNum: 1, pageSize: 20 })
							this.$router.push({
								path: this.$route.fullPath || '/home',
							})
						})
						.catch(() => {
							this.$router.push({
								path: this.$route.fullPath || '/home',
							})
						})
				})
				.catch(() => {
					this.btnHaveClick = true
				})
		},
		sendRestEmail(type) {
			let params = {
				authEmail: this.form.userEmail,
			}
			this.btnHaveClick = false
			http.sendEmail(params)
				.then(() => {
					this.btnHaveClick = true
					this.progress = 1
					this.$router.push({
						path: '/reset_self',
						query: {
							userEmail: this.form.userEmail,
						},
					})
					// if (type == 1) {
					// 	Toast('Email Sent!')
					// }
					this.$message.success('Send success!')
				})
				.catch(() => {
					this.btnHaveClick = true
				})
		},
		// 将store 中的邮箱赋值给当前：
		setEmail() {
			this.form.userEmail = this.$store.state.user.userEmail
			this.form.userPassword = ''
			this.errorPassword = ''
		},
	},
}
