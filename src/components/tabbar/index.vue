<template>
	<div class="tabbar">
		<van-tabbar route v-model="active" active-color="#222" inactive-color="#999">
			<van-tabbar-item v-for="item of list" :to="item.path" :name="item.id" :key="item.id">
				<span>{{ item.name }}</span>
				<template #icon="props">
					<van-icon class-prefix="icon" :name="item.icon" :color="props.active ? '#222' : '#999'"></van-icon>
				</template>
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
import { Tabbar, TabbarItem, Icon } from 'vant'

export default {
	data() {
		return {
			active: 'home',
			list: [
				{
					name: 'Home',
					id: 'home',
					path: '/home',
					icon: 'shouye',
				},
				{
					name: 'Category',
					id: 'category',
					path: '/category',
					icon: 'fenlei',
				},
				{
					name: 'Cart',
					id: 'shopBag',
					path: '/shopping_car',
					icon: 'gouwudai',
				},
				{
					name: 'Me',
					id: 'mine',
					path: '/my',
					icon: 'wode',
				},
			],
		}
	},
	components: {
		[Tabbar.name]: Tabbar,
		[TabbarItem.name]: TabbarItem,
		[Icon.name]: Icon,
	},
	created() {},
	mounted() {},
	watch: {
		$route(to, from) {
			console.log(to, from)
		},
	},
	methods: {},
}
</script>
<style scoped lang="less">
.tabbar {
	/deep/ .van-tabbar {
		z-index: 1000;
		max-width: 375px;
		left: 50%;
		transform: translateX(-50%);
		padding-bottom: 3px;
		.icon {
			font-size: 28px;
		}
		.van-tabbar-item__icon {
			margin-bottom: 0;
		}
	}
}
</style>
