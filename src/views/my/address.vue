<template>
	<div class="my-address">
		<div class="my-right">
			<div class="order-head">My Addresses</div>
			<div v-if="addressList.length > 0">
				<div class="address-box" v-if="defaultAddress.isDefaultAddress">
					<div class="address-box-left">
						<div class="address-box-top">
							<div class="address-name">{{ defaultAddress.firstName + ' ' + defaultAddress.lastName }}</div>
							<div class="address-phone">{{ defaultAddress.phoneCode }} {{ defaultAddress.phoneNumber }}</div>
						</div>
						<div class="address-box-bottom">
							<div class="address-default">Default</div>
							<div class="address-text default">{{ defaultAddress.firstAddress + ' ' + defaultAddress.secondAddress + ' ' + defaultAddress.city + ' ' + defaultAddress.state + ' ' + defaultAddress.country + ' ' + defaultAddress.postCode }}</div>
						</div>
					</div>
					<div class="address-box-right">
						<div class="address-btn default" v-on:click="getAddres('edit', defaultAddress.addressId)">Edit</div>
						<div class="address-btn default" v-on:click="delAddress(defaultAddress.addressId)">Delete</div>
					</div>
				</div>
				<template v-for="(item, i) in addressList">
					<div class="address-box address-box-no-default" v-if="!item.isDefaultAddress" :key="i">
						<div class="address-box-left">
							<div class="address-box-top">
								<div class="address-name">{{ item.firstName + ' ' + item.lastName }}</div>
								<div class="address-phone">{{ item.phoneCode }} {{ item.phoneNumber }}</div>
							</div>
							<div class="address-box-bottom">
								<div class="address-text main">{{ item.firstAddress + ' ' + item.secondAddress + ' ' + item.city + ' ' + item.state + ' ' + item.country + ' ' + item.postCode }}</div>
							</div>
						</div>
						<div class="address-box-right">
							<div class="address-box-right-top" v-on:click="setAddress(item.addressId)">
								<div>Set as Defalut</div>
							</div>
							<div class="address-box-right-bottom">
								<div class="address-btn" v-on:click="getAddres('edit', item.addressId)">Edit</div>
								<div class="address-btn" v-on:click="delAddress(item.addressId)">Delete</div>
							</div>
						</div>
					</div>
				</template>
			</div>
			<newAddress @click-newaddres="setAddress1" ref="newAddress" />
			<div class="no-address-box" v-if="addressList.length == 0">
				<img :src="address" alt="" />
				<div>No address yet</div>
			</div>
			<div class="save-button" v-on:click="getAddres('new')">+ Add New Address</div>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import newAddress from '../order/modules/newAddress'
export default {
	data() {
		let { souceType } = this.$route.query
		return {
			address: require('@/assets/images-pc/dizhikong.png'),
			souceType,
			addressList: [],
			defaultAddress: {},
		}
	},
	components: {
		newAddress,
	},
	created() {
		this.getUserAddresList()
	},
	methods: {
		...mapActions('address', ['GET_USERADDRESS', 'DEL_ADDRESS', 'SET_DEFAULTARRESSADD_ADDRESS']),
		getUserAddresList() {
			this.GET_USERADDRESS({ pageNum: 1, pageSize: 20 }).then((res) => {
				let { data } = res
				this.addressList = data.list
				this.defaultAddress = {}
				this.addressList.forEach((item) => {
					if (item.isDefaultAddress==1) {
						this.defaultAddress = item
					}
				})
			})
		},
		view(addressId) {
			//   let addressId = encodeURIComponent(JSON.stringify(item))
			this.$router.push({ name: 'shippingAddress', query: { addressId } })
		},
		setAddress1() {
			this.getUserAddresList()
		},
		setAddress(addressId) {
			this.SET_DEFAULTARRESSADD_ADDRESS({ addressId }).then(() => {
				this.$notify({
					title: 'success',
					message: 'Set As Default Address successfully',
					type: 'success',
				})
				this.getUserAddresList()
			})
		},
		getAddres(type, address) {
			if (type === 'edit') {
				this.$refs.newAddress.show('addreslist', address)
			} else if (type === 'new') {
				if(this.addressList.length < 20){
					let length = this.addressList.length;
					if(length>0) {
						this.$refs.newAddress.show('addreslist')
					} else {
						this.$refs.newAddress.show('confirm',{ isDefaultAddress: 1, isPress: true })
					}
				}else{
					this.$notify({
						title: 'warning',
						message: 'You can only add up to 20 addresses', 
						type: 'warning',
					})
				}
				
			}
		},
		delAddress(addressId) {
			this.$confirm(' Are you sure to delete this address?', 'Remind', {
				confirmButtonText: 'Delete',
				cancelButtonText: 'Cancel',
				type: 'warning',
				center: true,
			}).then(() => {
				this.DEL_ADDRESS({ addressId }).then(() => {
					this.getUserAddresList()
				})
			})
		},
	},
}
</script>

<style lang="less" scoped>
.my-address {
/deep/	.address-step{
		display: none;
	}
	.no-address-box {
		width: 1096px;
		text-align: center;
		img {
			width: 164px;
			height: 154px;
			margin: 0 auto;
		}
		div {
			line-height: 17px;
			margin-top: 21px;
			color: #999;
		}
	}
	.address-box-no-default {
		margin-top: 30px;
	}
	.address-box {
		width: 1096px;
		height: 88px;
		box-shadow: 0px -1px 0px 0px #f5f5f5 inset;
		.address-box-left {
			width: 697px;
			float: left;
			.address-box-top {
				width: 697px;
				float: left;
				.address-name {
					font-size: 22px;
					line-height: 26px;
					height: 26px;
					margin-top: 20px;
					font-family: Montserrat Semi Bold;
					float: left;
				}
				.address-phone {
					font-size: 20px;
					font-family: Montserrat Regular;
					line-height: 26px;
					height: 26px;
					margin-top: 20px;
					margin-left: 20px;
					color: #595959;
					float: left;
				}
			}
			.address-box-bottom {
				font-family: Montserrat Regular;
				width: 697px;
				float: left;
				margin: 8px 0 10px 0;
				.address-text {
					font-size: 20px;
					line-height: 24px;
					height: 24px;
					color: #222222;
					float: left;
					overflow: hidden; //溢出隐藏
					word-break: keep-all; //
					white-space: nowrap; //文本不折行
					text-overflow: ellipsis;
				}
				.default {
					width: 633px;
				}
				.main {
					width: 697px;
				}

				.address-default {
					width: 60px;
					height: 21px;
					background: rgba(224, 116, 116, 0.3);
					text-align: center;
					font-size: 14px;
					line-height: 21px;
					float: left;
					color: #e84646;
					margin-right: 4px;
				}
			}
		}
		.address-box-right {
			font-family: Montserrat Regular;
			width: 113px;
			float: right;
			.default {
				margin-top: 46px;
			}
			.address-box-right-top {
				width: 113px;
				height: 29px;
				line-height: 29px;
				float: right;
				text-align: center;
				border: 1px solid #222222;
				margin-top: 16px;
				cursor: pointer;
			}
			.address-box-right-bottom {
				margin-top: 10px;
				float: right;
			}
			.address-btn {
				font-size: 14px;
				color: #5689c6;
				float: right;
				margin-left: 10px;
				cursor: pointer;
			}
		}
	}
	.save-button {
		font-size: 18px;
		font-family: Montserrat Bold;
		width: 286px;
		height: 44px;
		opacity: 1;
		background: #222222;
		margin: 50px auto;
		color: #fff;
		line-height: 44px;
		text-align: center;
		cursor: pointer;
	}
}
</style>
