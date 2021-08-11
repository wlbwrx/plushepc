<template>
	<div class="nav-head">
		<div class="home-tag-1800" v-if="showType == 1">
			<div>
				<img src="@/assets/images-pc/home-tag1.png" @click="$router.push({ path: '/other_info', query: { type: 'shipping_information' } })" />
				<img src="@/assets/images-pc/home-tag2.png" @click="$router.push({ path: '/other_info', query: { type: 'return_exchanges' } })" />
				<img src="@/assets/images-pc/home-tag3.png" @click="token ? $router.push({ path: '/myCoupons' }) : loginShow()" />
			</div>
		</div>
		<div class="home-tag-1200" v-else-if="showType == 2">
			<div>
				<img src="@/assets/images-pc/home-tag1.png" @click="$router.push({ path: '/other_info', query: { type: 'shipping_information' } })" />
				<img src="@/assets/images-pc/home-tag2.png" @click="$router.push({ path: '/other_info', query: { type: 'return_exchanges' } })" />
				<img src="@/assets/images-pc/home-tag3.png" @click="token ? $router.push({ path: '/myCoupons' }) : loginShow()" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
	name: 'home-tag',
	data() {
		return {
			showType: ''
		}
	},
	created() {},
	mounted() {
		// 显示哪种包邮条
		this.showShipping()
	},
	components: {},
	computed: {
		...mapGetters({
			token: 'token', // 判断是否登录
		}),
		...mapState('user', ['loginMethod']),
	},
	methods: {
		// 显示哪种包邮条
		showShipping: function () {
			var name = this.$route.name
			if (name == 'home') {
				this.showType = 1
			} else if (name == 'category' || name == 'product') {
				this.showType = 2
			}
		},

		// 点击banner
		loginShow: function () {
			this.$store.state.user.loginDialogIs = true
		},
	},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';
.nav-head {
	margin-bottom: 10px;
}

.home-tag-1800 {
	background-color: #ebebeb;
	max-width: 1800px;
	margin: auto;
}

.home-tag-1800 div {
	max-width: 1400px;
	margin: auto;
	display: flex;
}

.home-tag-1200 {
	background-color: #ebebeb;
	max-width: 1200px;
	margin: auto;
}

.home-tag-1200 div {
	max-width: 1200px;
	margin: auto;
	display: flex;
}

img {
	width: 33.333333%;
	cursor: pointer;
}
</style>
