<template>
	<div class="header">
		<!-- <van-nav-bar :title="$utils.isEmpty(title) ? $route.meta.title : title" @click-left="goBack" left-text="" left-arrow> -->
		<van-nav-bar :title="$utils.isEmpty(title) ? $route.meta.title : title">
			<template #left>
				<span class="navbar__back" @click="goBack">
					<img class="navbar__icon-back" src="@/assets/images/icons/back.png" alt="" />
				</span>
			</template>
			<template v-if="operHead" #right>
				<van-icon class-prefix="icon" name="bianji" size="18" />
			</template>
		</van-nav-bar>
		<!-- <i v-if="retBack" class="icon icon-fanhui" @click="$router.go(-1)"></i>
        <span class="header-content">
            {{$route.meta.title}}
        </span>
        <i v-if="operHead" class="icon icon-bianji"></i> -->
	</div>
</template>
<script>
import { NavBar, Icon } from 'vant'
import { mapState } from 'vuex'
export default {
	computed: {
		...mapState('app', ['title']),
	},
	props: {
		retBack: {
			type: Boolean,
			default: true,
		},
		operHead: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		[NavBar.name]: NavBar,
		[Icon.name]: Icon,
	},
	methods: {
		goBack() {
			let { goBackUrl } = this.$route.meta
			if (goBackUrl) {
				this.$router.push({ name: goBackUrl })
			} else {
				this.$router.go(-1)
			}
		},
	},
}
</script>
<style lang="less" scoped>
.header {
	position: fixed;
	width: 100%;
	max-width: 375px;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	z-index: 9999;
}
.navbar__back {
	margin-left: -10px;
	padding: 0 10px;
}
.navbar__icon-back {
	width: 11px;
}
</style>
