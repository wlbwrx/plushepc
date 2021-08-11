<template>
	<div class="page-404">
		<!-- <nav-bar title="404" border></nav-bar> -->
		<div class="wrap-404">
			<img src="@/assets/images/status/page-404.png" alt="" />
			<h3>404 Error</h3>
			<p>Page not found</p>
		</div>
	</div>
</template>
<script>
// import NavBar from '@/components/navbar/index.vue'
export default {
	components: {
		// NavBar,
	},
}
</script>
<style lang="less" scoped>
.page-404 {
	min-height: 100vh;
	background: #fff;
	.wrap-404 {
		padding: 80px 0;
		text-align: center;
		img {
			width: 164px;
			height: auto;
			margin-bottom: 20px;
		}
		h3 {
			color: #222;
			font-size: 20px;
			font-weight: bold;
			margin-bottom: 4px;
			margin-top:20px;
		}
		p {
			font-size: 14px;
			color: #999;
		}
	}
}
</style>
