import store from 'store'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { payList, paypalAdd } from '@/utils/enums'
import { loadStripe } from '@stripe/stripe-js'

export default {
	activated() {
		this.SET_TITLE('')
		let payBack = store.get('payBack')
		if (payBack) {
			this.gotoDetail(payBack)
			return
		}
		this.init()
		// 这个是终端判断: ios / android / h5
		const client = store.get('client')
		if (client) {
			this.param.sourceType = (client == 'ios' && 2) || (client == 'android' && 1) || 3
		}
	},
	inject: ['reload'],
	data() {
		let shopsId = store.get('shopsId')
		return {
			form: {
				userEmail: '',
			},
			// promoCode: '',
			addBillAddress: '1',

			isCreateOrder: false,
			// orderList: {},
			payList,
			// conponDetail: {},
			// totalAmount: 0,
			// lackForFreeExpressAmount: 0,
			// availableShippings: [],
			// shopListlenth: 0,
			// shopList: [],
			availableCoupons: [],
			param: {
				promoCode: '',
			},
			// shippingName: '',
			// shippingCode: '',
			// shippingPhone: '',
			// shippingAddress: '',
			// billingName: '',
			// billingPhone: '',
			// billingCode: '',
			// billingAddress: '',
			shippMethod: 0,
			// param: {
			// 	couponCode:'',
			// 	payType: 1,
			// 	sourceType: 3, // 默认是3 表示 h5
			// 	billAddressId: '',
			// 	receiverAddressId: '',
			// 	shopsId,
			// 	verifyKey: '',
			// 	productSkuVoList: [],
			// },
			reportItems: [], // 上报的商品信息
			otherParms: {
				payType: 4,
				sourceType: 4, // 默认是3 表示 h5,4表示 pc
				shopsId,
				receiverAddressId: '',
				billAddressId: '',
			},
		}
	},
	computed: {
		...mapState('shopCar', {
			selectPromo: state => state.checkOrderDetail.selectPromo || {},
			checkOrderDetail: state => state.checkOrderDetail,
			orderParams: state => state.orderParams,
			selectCoupon: state => state.checkOrderDetail.selectCoupon || {},
			carList: state => state.carList,
		}),
		...mapState('address', {
			shippingAddress: state => state.shippingAddress,
			billingAddress: state => state.billingAddress,
		}),
		...mapGetters(['token']),
		...mapState('app', ['goBackUrlList', 'payPalOnly']),
		shopListlenth() {
			const total = (this.checkOrderDetail.items || []).reduce((pre, cur) => {
				if (!cur.check) return pre
				return pre + cur.num
			}, 0)
			return total
		},
		shoplenth() {
			let lenth = 0
			if (this.checkOrderDetail && this.checkOrderDetail.items) {
				lenth = this.checkOrderDetail.items.filter(v => v.check).length
			}
			return lenth
		},
		availableShippings() {
			const { lackForFreeExpressAmount, availableShippings } = this.checkOrderDetail
			let arr = [{ name: 'Free Shipping', fee: 'Free', id: 0 }]
			if (lackForFreeExpressAmount > 0) {
				arr = availableShippings
			}
			return arr
		},
		shippingName() {
			const { firstName = '', lastName = '' } = this.shippingAddress
			return `${firstName} ${lastName}`
		},
		shippingPhone() {
			const { phoneCode = '', phoneNumber = '' } = this.shippingAddress
			return `${phoneCode} ${phoneNumber}`
		},
		shippingDetailAddress() {
			const { firstAddress = '', secondAddress = '', city = '', state = '', country = '', postCode = '' } = this.shippingAddress
			return `${firstAddress} ${secondAddress} ${city} ${state} ${country} ${postCode}`
		},
		billingName() {
			const { firstName = '', lastName = '' } = this.billingAddress
			return `${firstName} ${lastName}`
		},
		billingPhone() {
			const { phoneCode = '', phoneNumber = '' } = this.billingAddress
			return `${phoneCode} ${phoneNumber}`
		},
		billingDetailAddress() {
			const { firstAddress = '', secondAddress = '', city = '', state = '', country = '', postCode = '' } = this.billingAddress
			return `${firstAddress} ${secondAddress} ${city} ${state} ${country} ${postCode}`
		},
	},
	methods: {
		...mapMutations('shopCar', ['setOrderParams', 'setCheckOrderDetail', 'setCarListData']),
		...mapActions('shopCar', ['checkout', 'getPaypalUserInfo']),
		// ...mapActions('coupon', ['ORDER_CONFIG']),
		...mapActions('address', ['getUserDefaultAddress', 'GET_USERADDRESS']),
		...mapActions('order', ['createOrder', 'createGuestUserOrder', 'queryGetOrderDetail']),
		...mapActions('pay', ['createPayment']),
		...mapMutations('pay', ['setPayInfo']),
		...mapMutations('app', ['SET_TITLE', 'SET_goBackUrl']),
		...mapMutations('address', ['SET_shippingAddress', 'SET_billingAddress']),

		init() {
			this.shippMethod = this.orderParams.shippingMethod
			this.otherParms.payType = 4
			if (this.selectPromo) {
				this.param.promoCode = this.selectPromo.couponCode
			}
			this.getOrderConfig()
			this.getUserAddress()
			const { code, error_description } = this.$route.query
			if (code || error_description) {
				this.SET_goBackUrl(['/shopping_car'])
				if (!code) return
				// paypal地址回调
				const couponCode = localStorage.getItem('couponCode')
				this.payList = this.payList.filter(v => v.value === 1)
				this.otherParms.payType = 1
				if (couponCode) this.param.promoCode = couponCode
				this.getPaypalUserInfo({
					authCode: code,
					channelId: 1,
				}).then(res => {
					if (!res.data) return
					this.backfillAddress(res.data)
				})
			}
		},
		backfillAddress(data) {
			const { address, emails, familyName, givenName } = data
			const { country, postalCode, streetAddress, locality } = address
			this.provinces = []
			this.$nextTick(() => {
				this.form.userEmail = emails && emails[0] ? emails[0].value : ''
				let param = {
					// ...this.form,
					firstName: familyName,
					lastName: givenName,
					country: paypalAdd[country],
					city: locality,
					postCode: postalCode,
					firstAddress: streetAddress,
				}
				this.SET_shippingAddress(param)
				this.SET_billingAddress(param)
				if (this.token) {
					this.$refs.newAddress.setShowAddress(param, true)
				} else {
					this.$refs.shipping.setShowAddress(param)
				}
			})
		},
		/**
		 *
		 */
		async getUserAddress() {
			if (!this.token) return
			this.otherParms.receiverAddressId = this.shippingAddress.addressId
			this.otherParms.billAddressId = this.billingAddress.addressId
			if (this.shippingAddress.addressId && this.billingAddress.addressId) {
				return
			}
			let res = await this.getUserDefaultAddress({})
			// 默认第一条数据
			if (res && res.data) {
				this.SET_shippingAddress(res.data)
				this.SET_billingAddress(res.data)
				return
			}
			// 没有地址跳转地址，有地址列表跳转选择地址，都没有跳转新增地址
			let { data } = await this.GET_USERADDRESS({ pageNum: 1, pageSize: 20 })
			if (data && data.list && data.list.length > 0) {
				this.SET_shippingAddress(data.list[0])
				this.SET_billingAddress(data.list[0])
			} else {
				this.gotoAddress('newAddress', { isDefaultAddress: 1, isPress: true })
			}
		},
		getOrderConfig() {
			let { payType } = this.otherParms
			this.orderParams['payType'] = payType
			this.isCreateOrder = true
			return this.checkout({ ...this.orderParams })
				.then(res => {
					// this.setOrderParams(requestParam)
					this.setCheckOrderDetail(res.data)
					this.getConfigInfo()
				})
				.catch(err => {
					let { shortCode, msg } = err

					if (shortCode === '001' || shortCode === '002' || shortCode === '004') {
						// Toast.fail(msg)
						this.toastShow(msg)
						setTimeout(() => {
							this.$router.replace({ name: 'shoppingCar' })
						}, 3000)
					} else if (shortCode === '003' || shortCode === '005' || shortCode === '006') {
						this.toastShow(msg)
					}
					//   001,
					//   002,004 返回购物车

					//   003 005 在当前页面 刷新
				})
				.finally(() => {
					this.isCreateOrder = false
				})
		},
		getConfigInfo() {
			// const data = this.checkOrderDetail
			const orderParams = { ...this.orderParams }
			let { items, lackForFreeExpressAmount, availableShippings } = this.checkOrderDetail

			if (availableShippings.length == 1 && !this.shippMethod) {
				this.shippMethod = availableShippings[0].id
				orderParams.shippingMethod = availableShippings[0].id
				this.$nextTick(this.getOrderConfig)
			}

			if (lackForFreeExpressAmount === 0) {
				this.shippMethod = 0
			}
			orderParams.productSkuVoList = items.map(item => {
				let { productId, productNo, skuNo, num } = item
				return { productId, productNo, skuNo, productQuantity: num }
			})
			this.setOrderParams(orderParams)
		},
		getVisitorAddress(reviewObj, key) {
			let { country, firstName, lastName, phoneCode, phoneNumber, state, city, postCode, firstAddress, secondAddress } = reviewObj
			let keyRec = key === 'bill' ? `${key}Rec` : key
			return {
				[`${key}DetailAddressone`]: firstAddress,
				[`${key}DetailAddresstwo`]: secondAddress,
				[`${key}PhoneCode`]: phoneCode, // 国家区号
				[`${keyRec}FirstName`]: firstName,
				[`${keyRec}LastName`]: lastName,
				[`${keyRec}Phone`]: phoneNumber,
				[`${keyRec}Country`]: country,
				[`${keyRec}City`]: city,
				[`${keyRec}State`]: state,
				[`${keyRec}PostCode`]: postCode,
				[`${keyRec}Ting`]: '',
				[`${keyRec}KatakanaFirstName`]: '',
				[`${keyRec}KatakanaLastName`]: '',
				fieldValue: '',
			}
		},
		async createOrderFun() {
			if (this.isCreateOrder) return
			const { shippingMethod } = this.orderParams
			const { lackForFreeExpressAmount, verifyKey } = this.checkOrderDetail
			if (lackForFreeExpressAmount > 0 && !shippingMethod) {
				this.toastShow('Please choose a shipping method.')
				return
			}
			const { addressId: billAddressId } = this.billingAddress
			const { addressId: receiverAddressId } = this.shippingAddress
			const invitationCode = this.InvitationCode || ''
			let params = { ...this.otherParms, invitationCode, billAddressId, receiverAddressId, ...this.orderParams, notRealUserFlag: false, verifyKey, shippMethod: shippingMethod }
			if (!this.token) {
				this.$refs.emailValidateForm.validate()
				let shipping = this.$refs.shipping.getShowAddress()
				if (!this.form.userEmail || !shipping) return
				let { userEmail } = this.form
				let reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
				if (!reg.test(userEmail)) {
					this.toastShow('Please enter your vaild email')
					return
				}
				let receiverAdderss = this.getVisitorAddress(shipping, 'receiver') // 'bill' : 'receiver'
				let billAddress = {}
				// shipping billing  getShowAddress

				if (this.addBillAddress === '1') {
					// 账单地址与默认地址相同
					billAddress = this.getVisitorAddress(shipping, 'bill')
				} else {
					let billing = this.$refs.billing.getShowAddress()
					if (!billing) return
					billAddress = this.getVisitorAddress(billing, 'bill')
				}
				params = {
					items: this.orderParams.items,
					orderVo: {
						billAddress, //{ ...this.billForm },
						receiverAdderss: { ...receiverAdderss, userEmail },
						...this.orderParams,
						...this.otherParms,
						couponCode: this.orderParams.couponCode || '',
						promotionCode: this.selectPromo.couponCode || '',
						invitationCode,
						shippMethod: this.orderParams.shippingMethod,
						shippingMethod,
						verifyKey,
					},
					notRealUserFlag: true,
					userVo: {
						country: 'USA',
						currency: 'USD',
						userEmail: this.form.userEmail,
					},
				}
			}
			this.isCreateOrder = true
			this[this.token ? 'createOrder' : 'createGuestUserOrder'](params)
				.then(res => {
					// console.log('createOrder,success', res)
					let { data } = res
					this.dataReport(data) // 执行数据上报
					if (this.InvitationCode) this.$store.commit('app/SET_INVITATION_CODE', null)
					if (data.createResult) {
						store.set('guestToken', data.guestToken)
						this.payFun(data.orderSn)
					} else {
						this.toastShow(data.createResultDesc)
						// Toast.fail(data.createResultDesc)
						// setTimeout(() => {
						// 	this.$router.replace({ name: 'shoppingCar' })
						// }, 3000)
					}
				})
				.catch(err => {
					console.log('createOrder,fail', err)
					let { shortCode, code, msg } = err
					if (shortCode === '001' || shortCode === '002' || shortCode === '006') {
						// Toast.fail(msg)
						this.toastShow(msg)
						setTimeout(() => {
							this.$router.replace({ name: 'shoppingCar' })
						}, 3000)
					} else if (shortCode === '003' || shortCode === '004' || shortCode === '005') {
						this.toastShow(msg)
						this.getOrderConfig()
					} else if (code === 20199010) {
						this.toastShow(msg)
						// Toast.fail(msg)
						this.deleAddress()
					} else {
						// 未知异常
						this.$router.go(-1)
					}
				})
				.finally(() => {
					setTimeout(() => {
						this.isCreateOrder = false
					}, 500)
				})
		},
		// 数据上报
		dataReport(data) {
			// 结算过程中上报,第一步创建订单：
			let reportItems = []
			this.checkOrderDetail.items.forEach(item => {
				// 将本次购买的商品上报
				if (item.check) {
					reportItems.push({
						id: item.skuNo,
						name: item.productName,
						brand: item.brandName,
						quantity: item.num,
						price: (item.discountPrice || item.price) / 100,
						// 新版GA4 字段
						promotion_name: '常规',
						item_id: item.skuNo,
						item_name: item.productName,
						item_brand: item.brandName,
						// 自定义参数-spu
						spuNo: item.productNo,
					})
				}
			})
			let reportData = {
				coupon: this.orderParams.couponCode || undefined,
				promotionCode: this.selectPromo.couponCode || undefined,
				currency: 'USD',
				checkout_option: (this.otherParms.payType == 1 && 'ppaypal') || (this.otherParms.payType == 2 && 'visa') || (this.otherParms.payType == 3 && 'master') || (this.otherParms.payType == 4 && 'stripe'),
				checkout_step: 1,
				value: this.checkOrderDetail.totalAmount / 100,
				shipping: this.checkOrderDetail.shippingFeeAmount / 100, // 运费
				tax: this.checkOrderDetail.taxAmount / 100, // 税费
				transaction_id: data.orderSn,
				items: reportItems,
			}
			let reportOrderGoods = store.get('reportOrderGoods') || []
			reportOrderGoods.push(reportData)
			store.set('reportOrderGoods', reportOrderGoods) // 将数据缓存起来，结算完成后将对应的存入删除
			// UA 上报
			this.reportGtag('checkout_progress', reportData)
			// GA4 上报
			let ga4Data = {
				coupon: this.orderParams.couponCode || undefined,
				currency: 'USD',
				value: this.checkOrderDetail.totalAmount / 100,
				payment_type: (this.otherParms.payType == 1 && 'ppaypal') || (this.otherParms.payType == 2 && 'visa') || (this.otherParms.payType == 3 && 'master') || (this.otherParms.payType == 4 && 'stripe'),
				items: reportItems,
			}
			this.reportGtag('add_payment_info', ga4Data, 'GA4')
			// FB 上报--使用spu
			let fbData = {
				currency: 'USD',
				value: this.checkOrderDetail.totalAmount / 100,
				content_type: 'product_group',
				contents: reportItems.map(item => {
					item.id = item.spuNo
					return item
				}),
				client_user_agent: window.navigator.userAgent,
				action_source: 'website',
				event_source_url: location.href,
				// 'external-id': data.orderSn,
			}
			this.reportFB('AddPaymentInfo', fbData, false, { eventID: data.orderSn })
		},
		async deleAddress() {
			const { addressId: billAddressId } = this.billingAddress
			const { addressId: receiverAddressId } = this.shippingAddress
			let res = await this.GET_USERADDRESS({ pageNum: 1, pageSize: 20 })
			let { data } = res
			let receAid = data.list.some(item => item.addressId === receiverAddressId)
			if (!receAid) {
				this.SET_shippingAddress()
			}
			let billAid = data.list.some(item => item.addressId === billAddressId)
			if (!billAid) {
				this.SET_billingAddress()
			}
			setTimeout(() => {
				this.reload()
			}, 1500)
		},
		getAddress(item) {
			return item.firstAddress + ' ' + item.secondAddress + ' ' + item.city + ' ' + item.state + ' ' + item.country + ' ' + item.postCode
		},
		async payFun(orderSn) {
			let { shopsId } = this.otherParms
			let { data } = await this.queryGetOrderDetail(orderSn)
			if (data.orderResp.orderStatus !== 0) {
				this.toastShow('Sorry! The order information has been changed.')
				// Toast.fail()
				setTimeout(() => {
					this.reload()
				}, 1500)
				return
			}
			let param = { shopsId, orderChannel: this.otherParms.payType, orderSn }
			this.createPayment(param)
				.then(res => {
					this.setPayInfo(res.data)
					let shipping = store.get('shipping')
					if (shipping) store.remove('shipping')
					let billing = store.get('billing')
					if (billing) store.remove('billing')
					this.setCarListData(this.carList.filter(item => !item.check)) // 更新购物车数据
					store.set('payBack', orderSn)
					// 创建支付失败:
					if (res.data.paymentStatus == 5) {
						this.$router.replace({ name: 'orderDetail', params: { orderSn } })
						return
					}
					// 如果是stripe 支付
					if (param.orderChannel == 4) {
						loadStripe(res.data.thirdClientKey).then(stripe => {
							stripe.redirectToCheckout({ sessionId: res.data.paymentRespSn })
						})
					} else {
						window.location.href = res.data.thirdPaymentUrl
					}
				})
				.catch(err => {
					// let { msg } = err
					// Toast.fail(msg)
					let { msg } = err
					this.toastShow(msg)
					setTimeout(() => {
						this.$router.replace({ name: 'orderDetail', params: { orderSn } })
					}, 1500)
				})
		},
	},
}
