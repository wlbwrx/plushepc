<template>
	<div class="field-input">
		<div class="field-input__fields">
			<span :class="['field-input__label', { 'is-active': labelActive }, { 'is-pc' : isIerminal}]">{{ label }}</span>
			<div v-if="!isIerminal">
				<van-field v-if="type == 'text'" v-model.trim="inputValue" clearable @focus="focus" @blur="blur" maxlength="250" />
				<van-field v-else v-model.trim="inputValue" :type="inputType" clearable :right-icon="pwdIcon" @focus="focus" @blur="blur" @click-right-icon="toView" maxlength="250" />
			</div>
			<!-- 配置Pc输入框按钮 -->
			<div v-else class="pc-input">
				<el-input v-if="type == 'text'" class="input_el_input" v-model.trim="inputValue" clearable @focus="focus" @blur="blur" maxlength="50" ></el-input>
				<el-input v-else v-model.trim="inputValue" :type="inputType" @focus="focus" clearable @blur="blur" maxlength="50">
					<i slot="suffix" :class="iconfonts" @click="toView"></i>
				</el-input>
			</div>
				
		</div>
		<p :class="['field-input__error', { 'is-pc': isIerminal }]" v-if="error">{{ error }}</p>
	</div>
</template>
<script>
import { Field, Icon } from 'vant'

export default {
	props: {
		type: {
			type: String,
			default: 'text',
		},
		label: {
			type: String,
			required: true,
		},
		value: {
			type: String,
			required: true,
		},
		error: {
			type: String,
			default: '',
		},
		hideIcon: {
			type: Boolean,
			default: false,
		},
		// 判断是否是pc端，使用不同的样式
		terminal: {
			type: String,
		},
	},
	data() {
		return {
			isFocus: false,
			inputType: this.type,
		}
	},
	components: {
		[Field.name]: Field,
		[Icon.name]: Icon,
	},
	computed: {
		inputValue: {
			get() {
				return this.value
			},
			set(val) {
				this.$emit('update:value', val)
			},
		},
		labelActive() {
			return this.inputValue || (!this.inputValue && this.isFocus)
		},
		pwdIcon() {
			if (this.hideIcon) return ''
			return this.inputType != 'password' ? 'eye-o' : 'closed-eye'
		},
		// 判断是否是Pc端
		isIerminal() {
			if (this.terminal == 'plushePc') return true
			return false
		},
		iconfonts() {
			if (this.hideIcon) return ''
			if (this.isIerminal) {
				return this.inputType != 'password' ? 'iconfont icon-xianshi' : 'iconfont icon-yincang'
			} else {
				return this.inputType != 'password' ? 'van-icon-eye-o' : 'van-icon-closed-eye'
			}
		},
	},
	methods: {
		focus() {
			this.isFocus = true
			this.$emit('onfocus')
		},
		blur() {
			this.isFocus = false
			this.$emit('onblur')
		},
		// 查看密码：
		toView() {
			this.inputType = this.inputType == 'text' ? 'password' : 'text'
		},
	},
}
</script>
<style scoped lang="less">
@import '@/style/variable.less';

.field-input {
	.field-input__fields {
		position: relative;
		border-bottom: 1px solid @color-bg;
		padding-top: 14px;
		margin-bottom: 10px;
		.field-input__label {
			color: @color-999;
			font-size: 14px;
			line-height: 14px;
			height: 14px;
			position: absolute;
			left: 0;
			top: 30px;
			transition: top 0.5s ease;
			&.is-active {
				top: 4px;
			}
			&.is-pc {
				font-size: 16px;
			}
		}
		.van-field {
			background: transparent;
			padding: 10px 16px 10px 0;
			/deep/.van-field__clear {
				color: #222;
			}
		}
		.pc-input{
			color:red;
			margin-top:10px;
			/deep/.el-input__inner{
				border:0;
				background:transparent;
				padding:0;
			}
			/deep/.el-input__suffix-inner{
				height: 100%;
				display: inline-block;
				.el-input__clear{
					font-size:18px;
				}
				.iconfont{
					font-size:24px;
					position: relative;
					height: 100%;
					top: 3px;
					line-height: 47px;
				}
			}
		}
	}
	.field-input__error {
		font-size: 12px;
		color: @color-red;
		line-height: 14px;
		&.is-pc {
			font-size: 16px;
		}
	}
}
</style>
