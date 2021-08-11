import { mapGetters, mapActions } from 'vuex'
import '@/mock/modules/countrys'
import selectCountryComponent from './selectCountry'
export default {
	beforeRouteEnter(to, from, next) {
		let { goBackUrl } = to.query
		if (goBackUrl) {
			to.meta.goBackUrl = 'shoppingCar'
		} else {
			to.meta.goBackUrl = ''
		}
		next()
	},
	computed: {
		...mapGetters(['token']),
	},
	components: {
		selectCountryComponent
	},
	data() {
		let { goBackUrl, addressId, isDefaultAddress } = this.$route.query
		return {
			goBackUrl,
			selectCountry: {},
			showCountry: false,
			showPicker: false,
			phoneCode: '',
			provinces: [],
			addressId,
			cityValidator: /^.{2,60}$/,
			userNameValidator: /^[a-z\sA-Z0-9_-]+$/,
			phoneValidator: /^\d{5,16}$/,
			postCodeValidator: /^[0-9-]{4,10}$/,
			param: {
				firstName: '',
				lastName: '',
				phoneCode: '', // 国家区号
				phoneNumber: '',
				country: '',
				city: '',
				state: '',
				postCode: '',
				firstAddress: '',
				secondAddress: '',
				isDefaultAddress: isDefaultAddress ? Number(isDefaultAddress) : 0,
			},
			// isDefaultAddress: 1
		}
	},
	created() {
		// Toast.fail()
		let { addressId } = this
		if (addressId) {
			this.GET_USERADDRESS_DETAIL({ addressId }).then(res => {
				console.log(res)
				let { data } = res
				this.param = data
				this.getAddressList(data)
			})
		} else {
			this.getAddressList()
		}
	},
	methods: {
		...mapActions('address', ['ADD_ADDRESS', 'GET_USERADDRESS', 'GET_USERADDRESS_DETAIL', 'UPDATE_ADDRESS']),
		selectCountryClick() {
			this.showCountry = true
			this.$refs.country.show(true)
		},
		selectCountryCallBack(item) {
			this.param.city = ''
			this.param.state = ''
			this.param.postCode = ''
			this.showCountry = false
			this.selectCountry = item
			this.getAddressList()
		},
		getAddressList(data) {
			let country = this.selectCountry
			let countrys = window.countrys
			let defaultCountrys = countrys['U'].filter(v => v.name == 'United States')
			let seleCountry = this.$utils.isEmptyObject(country) ? defaultCountrys[0] : country
			if (data) {
				let index = data.country.substr(0, 1)
				seleCountry = countrys[index].filter(v => v.name == data.country)[0]
			}
			let { code, dial_code, name, provinces } = seleCountry
			// console.log(33333, Object.keys(provinces))
			this.phoneCode = code + ' ' + dial_code
			this.provinces = provinces ? Object.keys(provinces) : []
			this.param.phoneCode = dial_code
			this.param.country = name
		},
		onConfirm(value) {
			this.param.state = value
			this.showPicker = false
		},
		validator(val) {
			return /1\d{2}/.test(val)
		},
		// 异步校验函数返回 Promise
		onSubmit(values) {
			if (this.$utils.isEmpty(values.city) || values.city.length > 60) {
                this.errToast('fail', 'Please enter a valid city')
				return
			}
			if (!this.param.country || this.param.country === '') {
                this.errToast('fail', 'Please enter a valid Country/Region')
				return
			}
			if ((!this.param.state || this.param.state === '') && this.provinces.length > 0) {
                this.errToast('fail', 'Please enter a valid State/Province')
				return
			}
			// please enter a valid firstAddress
			let { param } = this
			let { goBackUrl } = this.$route.query
			if (this.addressId) {
				this.UPDATE_ADDRESS(param).then(() => {
                    this.errToast('success', 'Update successful')
					if (goBackUrl) {
						this.$router.replace({ name: 'orderConfirm' })
					} else {
						this.$router.go(-1)
					}
				})
			} else {
				this.ADD_ADDRESS(param).then(() => {
                    this.errToast('success', 'Add successful')
					if (goBackUrl) {
						this.$router.replace({ name: 'orderConfirm' })
					} else {
						this.$router.go(-1)
					}
				})
			}
		},
	},
}