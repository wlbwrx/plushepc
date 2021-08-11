<template>
	<div class="content-products">
		<div class="content-products-left" v-if="data.length>1">
			<i class="iconfont icon-fanhui2" v-on:click="lastCheck()"></i>
		</div>
		<div class="content-products-content" :class="{ 'img-left': data.length<=1 }">
			<img :src="$utils.imageHandler(10, data[index].picKey)" alt="" />
			<div class="content-products-text">{{ numAll > 1 ? numAll+' items':'1 item' }}</div> 
		</div>
		<div class="content-products-right" v-if="data.length>1">
			<i class="iconfont icon-fanhui" v-on:click="nextCheck()"></i>
		</div>
	</div>
</template>

<script>
export default {
	props: ['data'],
	data() {
		return {
			index: 0,
			numAll: 0
		}
	},
	methods: {
		lastCheck() {
			if (this.index > 0) {
				this.index--
			} else {
				this.index = this.data.length - 1
			}
		},
		nextCheck() {
			if (this.index < this.data.length - 1) {
				this.index++
			} else {
				this.index = 0
			}
		},
	},
	created() {
		this.data.map(item => {
			this.numAll += item.productQuantity
		})
	},
}
</script>
<style scoped lang="less">
.icon-fanhui2 {
	width: 7px;
	height: 12px;
	cursor: pointer;
}
.img-left{
	padding-left: 60px;
}
.icon-fanhui {
	width: 7px;
	height: 12px;
	cursor: pointer;
}
.content-products-left {
	float: left;
	margin-left: 44px;
	margin-top: 100px;
}
.content-products-right {
	margin-right: 44px;
	float: right;
	margin-top: 100px;
}
.content-products-content {
	margin-left: 11px;
	margin-right: 11px;
	float: left;
}
.content-products-text {
	color: #666666;
	font-size: 14px;
	font-family: Montserrat Light;
	margin-top: 4px;
}
.content-products {
	float: left;
	width: 256px;
	img {
		margin-top: 20px;
	}
}
</style>