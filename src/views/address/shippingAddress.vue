<template>
	<div class="shipping-address header-title">
		<!-- <ul class="shipping-tab">
            <li>Country/Region</li>
            <li>United State</li>
        </ul> -->
		<div v-show="!showCountry">
			<van-cell center title="Country/Region" @click="selectCountryClick" cell-text-color="red" is-link :label="param.country" />
			<van-form validate-first @submit="onSubmit">
				<!-- 通过 pattern 进行正则校验 -->
				<div class="address-field">
					<div class="address-showname">
						<p v-show="param.firstName.length > 0">*First Name</p>
						<van-field v-model.trim="param.firstName" name="firstName" maxlength="30" placeholder="*First Name" :rules="[{ pattern: userNameValidator, message: 'Please enter a valid first name' }]" />
					</div>
					<!-- 通过 validator 进行函数校验 -->
					<div class="address-showname">
						<p v-show="param.lastName.length > 0">*Last Name</p>
						<van-field v-model.trim="param.lastName" name="lastName" maxlength="30" placeholder="*Last Name" :rules="[{ pattern: userNameValidator, message: 'Please enter a valid last name' }]" />
					</div>
					<div class="address-showname">
						<p v-show="param.phoneNumber.length > 0">*Phone Number</p>
						<van-field maxlength="16" :label="phoneCode" v-model.trim="param.phoneNumber" type="number" class="phone-number" name="phoneNumber" placeholder="*Phone Number" :rules="[{ pattern: phoneValidator, message: 'Please enter a valid phone number' }]" />
					</div>
				</div>

				<div class="address-field">
					<div class="address-showname">
						<p v-show="param.state.length > 0">*State/Province</p>
						<van-field v-show="provinces.length > 0" readonly clickable :value="param.state" name="state" right-icon="arrow" placeholder="*State/Province" @click="showPicker = true" />
						<van-popup v-model.trim="showPicker" class="province-show" round position="bottom">
							<van-picker show-toolbar :columns="provinces" @cancel="showPicker = false" @confirm="onConfirm" confirm-button-text="confirm" cancel-button-text="cancel" value-key="code" />
						</van-popup>
					</div>
					<!-- 通过 validator 进行异步函数校验 -->
					<div class="address-showname">
						<p v-show="param.city.length > 0">*City</p>
						<van-field v-model.trim="param.city" name="city" placeholder="*City" maxlength="60" :rules="[{ pattern: cityValidator, message: 'Please enter a valid city' }]" />
					</div>
					<!-- 通过 validator 进行函数校验 -->
					<div class="address-showname">
						<p v-show="param.postCode.length > 0">*Post/Zip Code</p>
						<van-field v-model.trim="param.postCode" name="postCode" maxlength="10" placeholder="*Post/Zip Code" :rules="[{ pattern: postCodeValidator, message: 'Please enter a valid Post/Zip Code' }]" />
					</div>
					<!-- { validator: postCodeValidator, message: 'Enter a valid ZIP / postal code for united States' }, -->
					<div class="address-showname">
						<p v-show="param.firstAddress.length > 0">*Address1</p>
						<van-field v-model.trim="param.firstAddress" name="firstAddress" placeholder="*Address1" maxlength="50" :rules="[{ required: true, message: 'Please enter a valid firstAddress' }]" />
					</div>
					<div class="address-showname">
						<p v-show="param.secondAddress.length > 0">Address2</p>
						<van-field maxlength="50" v-model.trim="param.secondAddress" name="secondAddress" placeholder="Address2" />
					</div>
				</div>
				<div class="address-field">
					<van-field name="switch" label="Make As Default">
						<template #input>
							<van-switch :active-value="1" :inactive-value="0" v-model.trim="param.isDefaultAddress" size="20" />
						</template>
					</van-field>
				</div>
				<div class="submit-btn">
					<van-button class="submit-order" type="primary" native-type="submit">SAVE</van-button>
				</div>
			</van-form>
		</div>
		<selectCountryComponent @selectCountry="selectCountryCallBack" ref="country" />
	</div>
</template>
<script>
import mixin from './shipping'
import { Form, Cell, Field, Toast, Button, Switch, Picker, Popup } from 'vant'
export default {
	mixins: [mixin],
	components: {
		[Form.name]: Form,
		[Field.name]: Field,
		[Button.name]: Button,
		[Switch.name]: Switch,
		[Picker.name]: Picker,
		[Popup.name]: Popup,
		[Cell.name]: Cell,
	},
	methods: {
		errToast(result, msg){
			if(result==='success'){
				Toast({
                    message: msg,
                    icon: ' iconfont iconsuccess_no_circle',
                });
			}else{
				Toast({
                    message: msg,
                    icon: ' iconfont icon-guanbi',
                });
			}
			
		}
	},
}
</script>
<style lang="less" scoped>
/deep/ .van-field__control {
	justify-content: flex-end;
}
/deep/ .van-cell__title {
	font-size: 16px;
	color: #222;
}
/deep/ .van-cell__label {
	font-size: 16px;
	color: #222;
	font-weight: bold;
}
.phone-number {
	/deep/ .van-field__label {
		width: auto;
		flex-grow: 0;
	}
}
.province-show {
	max-width: 375px;
	left: 50%;
	transform: translate(-50%, 0);
}
.address-showname {
	font-size: 14px;
	color: #999;
	p {
		margin-left: 16px;
	}
	/deep/ .van-field {
		padding-top: 0px;
	}
}
</style>
