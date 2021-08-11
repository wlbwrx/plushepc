<template>
	<div class="my-profile">
		<div class="my-right">
			<div class="order-head">My Profile</div>
			<div class="profile-title">Information</div>
			<div class="profile-text">Nickname:<span>*</span></div>
			<el-input v-model="nickName" placeholder="Please write a review" disabled size="medium"></el-input>

			<div class="profile-title profile-title-email">Email Verfication</div>
			<el-input v-model="userEmail" placeholder="Please write a review" disabled size="medium" prefix-icon="el-icon-message"></el-input>
			<div class="save-button">Save</div>
		</div>
	</div>
</template>

<script>
import store from 'store'
export default {
	data() {
		let userInfo = store.get('userInfo')
		let { nickName, userEmail } = userInfo || {}
		return {
			userEmail,
			nickName,
		}
	},
	components: {
	},
	mounted() {},
	methods: {},
}
</script>

<style lang="less" scoped>
.my-profile {
	/deep/.el-input__inner {
		width: 440px;
	}
	.profile-title {
		font-size: 18px;
		font-family: Montserrat Regular;
		margin: 10px 0 20px 0px;
		color: #222;
	}
	.profile-title-email {
		margin-top: 40px;
	}
	.profile-text {
		color: #767676;
		font-size: 12px;
		font-family: Montserrat Light;
		margin-bottom: 10px;
		span {
			color: #e84646;
		}
	}
	.save-button {
		font-size: 18px;
		font-family: Montserrat Regular;
		width: 286px;
		height: 44px;
		opacity: 1;
		background: #222222;
		margin: 120px auto;
		color: #fff;
		line-height: 44px;
		text-align: center;
		cursor: pointer;
	}
}
</style>
