<template>
	<div class="my-All">
		<my-breadcrumb></my-breadcrumb>
		<left-menu></left-menu>
		<router-view></router-view>
	</div>
</template>

<script>
import store from 'store'
import leftMenu from '@/components/component-pc/my/leftMenu.vue'
import myBreadcrumb from '@/components/component-pc/my/myBreadcrumb.vue'
export default {
	data() {
		let userInfo = store.get('userInfo')
		let { nickName, userToken, headPhoto } = userInfo || {}
		return {
			nickName: nickName,
			headPhoto: headPhoto,
			userToken: userToken,
		}
	},
	components: {
		leftMenu,
		myBreadcrumb,
	},
	created() {},
	mounted() {},
	methods: {},
}
</script>
<style lang="less">

</style>
<style lang="less" scoped>
@import '@/style/variable.less';

.el-main {
	background-color: #ffffff;
}
.el-footer {
	background-color: #f7f8fa;
}

.my-All {
	width: 1400px;
	margin: auto;
}
</style>
