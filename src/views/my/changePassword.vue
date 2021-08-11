<template>
	<div class="my-changePassword">
		<div class="my-right">
			<div class="change-password">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
					<div class="order-head">Change Password</div>
					<el-form-item prop="oldCertificate">
						<div class="possword-text">Old Password <span>*</span></div>
						<el-input v-model="ruleForm.oldCertificate" size="medium" show-password></el-input>
						<!-- <div class="password-sub">8 characters minmum with number and letter</div> -->
					</el-form-item>

					<el-form-item prop="newCertificate">
						<div class="possword-text">New Password <span>*</span></div>
						<el-input v-model="ruleForm.newCertificate" size="medium" show-password></el-input>
					</el-form-item>
					<el-form-item prop="confirmPassword">
						<div class="possword-text">Confirm Password <span>*</span></div>
						<el-input v-model="ruleForm.confirmPassword" size="medium" show-password></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div class="save-button" v-on:click="submitForm('ruleForm')">SUBMIT</div>
		</div>
	</div>
</template>

<script>
import http from '@/api/user.js'
import store from 'store'
export default {
	data() {
		var validatePass = (rule, value, callback) => {
			const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/
			if (!reg.test(value)) {
				callback(new Error("New password and confirm password don't match"))
			} else if (value !== this.ruleForm.newCertificate) {
				callback(new Error("New password and confirm password don't match"))
			}else if (value == this.ruleForm.oldCertificate) {
				callback(new Error("New password and old password can't be the same"))
			} else {
				callback()
			}
		}
		var validatePass1 = (rule, value, callback) => {
			const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/
			if (!reg.test(value)) {
				callback(new Error("New password and confirm password don't match"))
			} else if (value == this.ruleForm.oldCertificate) {
				callback(new Error("New password and old password can't be the same"))
			}else {
				callback()
			}
		}
		let userInfo = store.get('userInfo')
		let { userEmail } = userInfo || {}
		return {
			ruleForm: {
				authEmail: userEmail,
				oldCertificate: '',
				newCertificate: '',
				confirmPassword: '',
				resetType: 0,
			},
			showPassWord:[
				false,
				false,
				false,
			],
			rules: {
				oldCertificate: [
					{ required: true, message: 'Please enter the password.', trigger: 'blur' },
					{ min: 8, max: 20, message: '8 characters minmum with number and letter', trigger: 'blur' },
				],
				newCertificate: [
					{ required: true, message: 'Please enter a new password.', trigger: 'blur' },
					{ min: 8, max: 20, message: '8 characters minmum with number and letter', trigger: 'blur' },
					{ validator: validatePass1, trigger: 'blur' },
				],
				confirmPassword: [
					{ required: true, message: 'Please enter a confirm Password.', trigger: 'blur' },
					{ min: 8, max: 20, message: '8 characters minmum with number and letter', trigger: 'blur' },
					{ validator: validatePass, trigger: 'blur' },
				],
			},
		}
	},
	components: {},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					http.modify(this.ruleForm).then(() => {
						this.$notify({
							title: 'success',
							message: 'Password update successful',
							type: 'success',
						})
						this.$refs[formName].resetFields();
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
	},
}
</script>

<style lang="less" scoped>
.my-changePassword {
	.possword-text {
		font-size: 16px;
		font-family: Montserrat Regular;
		margin-bottom: 10px;
		color: #666666;
		span {
			color: #e84646;
		}
	}
	.password {
		display: flex;
		align-items: center;
		margin-top: 5px;
		font-size: 24px;
	}
	.password-sub {
		font-size: 14px;
		color: #999999;
		margin-top: 8px;
		margin-bottom: 30px;
	}
	.change-password {
		padding: 0 228px 0 128px;
	}
	.save-button {
		font-size: 18px;
		font-family: Montserrat Bold;
		width: 286px;
		height: 44px;
		opacity: 1;
		background: #222222;
		margin: 60px auto;
		color: #fff;
		line-height: 44px;
		text-align: center;
		cursor: pointer;
	}
}
</style>
<style>
.change-password .el-input__inner {
	border: none;
	border-radius: 0;
	border-bottom: 1px solid #cccccc;
}
</style>
