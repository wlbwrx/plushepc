<template>
	<div class="my-breadcrumb">Home  /  Personal Center</div>
</template>

<script>
export default {
	data() {
		return {
			active:""
		}
	},
	watch: {
        $route (to) {
			this.active = to.name
        }
    },
	
}
</script>

<style lang="less" scoped>
@import '@/style/variable.less';

.left-menu {
	height: 660px;
	width: 280px;
	background-color: @color-FFF;
	padding-left: 20px;
	float: left;
	/deep/.icon-bianji {
		font-size: 20px;
		line-height: 44px;
		margin-left: 45px;
	}
	.menu-detail {
		height: 84px;
		padding: 30px 0 10px 0;
		.menu-detail-img {
			width: 44px;
			height: 44px;
			border-radius: 22px;
			background: red;
			float: left;
		}
		.menu-detail-text {
			font-size: 20px;
			margin-left: 10px;
			float: left;
			line-height: 44px;
			font-weight: 600;
		}
	}
	.menu-title {
		font-size: 18px;
		font-weight: 700;
		padding: 30px 0px 10px 0px;
		height: 58px;
		line-height: 18px;
		cursor: pointer;
	}
	.menu-parent {
		height: 36px;
		padding: 20px 20px 0 0px;
		font-weight: 500;
		font-size: 16px;
		line-height: 16px;
		cursor: pointer;
	}
	.menu-child-list {
		margin-top: 10px;
	}
	.menu-parent-list {
		margin-bottom: 10px;
	}
	.menu-child {
		height: 34px;
		line-height: 14px;
		padding: 10px 0 10px 20px;
		font-size: 14px;
		color: @color-666;
		cursor: pointer;
	}
}
</style>


