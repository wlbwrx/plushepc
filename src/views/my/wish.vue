<template>
	<div class="wish-box">
		<div class="order-head">WISHLIST</div>
		<div class="no-wish" v-if="wishData.list.length == 0">
			<img :src="ImageEmpty" alt="" class="no-wish" />
			<div class="empty-box-text">No favrites yet</div>
		</div>
		<div class="wishList" v-if="wishData.list.length > 0">
			<div v-for="(item, index) in wishData.list" :key="index" v-bind:class="[index % 3 != 0 ? 'wish-img-box mr-28' : 'wish-img-box']">
				<img :src="$utils.imageHandler(14, item.defaultPickey)" alt="" class="wish-img" @click="goodsDetail(item)" />
				<div class="wish-text" v-if="item.dicountAmount">
					<div v-if="item.dicountAmount != item.saleAmount">
						<span class="wish-text-0">US${{ item.dicountAmount | pricesFilter }} </span>
						<span class="wish-text-1">US${{ item.saleAmount | pricesFilter }} </span>
					</div>
					<div v-else>
						<span class="wish-text-3">US${{ item.saleAmount | pricesFilter }} </span>
					</div>
				</div>
				<div class="wish-text" v-if="!item.dicountAmount">
					<span class="wish-text-3">US${{ item.saleAmount | pricesFilter }} </span>
				</div>
				<div class="wish-del" @click="toConfirm(item.productNo)"><i class="iconfont icon-guanbi"></i></div>
			</div>
		</div>
		<div style="float: left; height: 50px; width: 1096px; text-align: right" v-if="wishData.list.length > 150">
			<el-pagination layout="prev, pager, next" :total="wishData.total" :page-size="150" @current-change="handleSizeChange"> </el-pagination>
		</div>
	</div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
	data() {
		return {
			ImageEmpty: require('@/assets/images-pc/noWish.png'),
		}
	},

	created() {
		this.getQueryWishList()
	},
	computed: {
		...mapState('wish', ['wishData']),
	},
	components: {},
	methods: {
		...mapActions('wish', ['queryWishList', 'deleteWishList']),
		getQueryWishList() {
			this.queryWishList({ pageNum: 1, pageSize: 150 })
		},
		handleSizeChange(val) {
			console.log(val)
			this.queryWishList({ pageNum: val, pageSize: 150 })
		},
		toConfirm(id) {
			this.$confirm('Are you sure to delete this item?', {
				customClass: 'confirm-dialog',
				confirmButtonText: 'DELETE',
				cancelButtonText: 'CANCEL',
				type: 'warning',
				center: true,
			}).then(() => {
				this.deleteWishList({ productNo: id }).then(() => {
					this.getQueryWishList()
				})
			})
		},
		goodsDetail(e) {
			this.$router.push({
				path: this.formatUrl(`/product/`, `${e.productName || e.name}-${e.productNo}`),
			})
		},
	},
}
</script>
 
<style lang="less" scoped>
.wish-box {
	width: 1096px;
	margin-left: 24px;
	float: left;
	text-align: center;
	margin-bottom: 80px;
	.no-wish {
		img {
			margin-top: 80px;
		}
		.empty-box-text {
			font-size: 12px;
			font-family: Montserrat Regular;
			height: 14px;
			line-height: 14px;
			margin-top: 20px;
			color: #999;
		}
	}
	.wish-img-box {
		width: 280px;
		height: 481px;
		float: left;
	}
	.mr-28 {
		margin-left: 28px;
	}
	.wish-img {
		width: 280px;
		height: 422px;
		cursor: pointer;
	}
	.wish-text {
		font-family: Montserrat Medium;
		text-align: left;
		margin-top: 10px;
		.wish-text-0 {
			color: #e84646;
			font-size: 16px;
		}
		.wish-text-1 {
			color: #999999;
			text-decoration: line-through;
			font-size: 12px;
			font-family: Montserrat Regular;
		}
		.wish-text-2 {
			color: #999;
			font-size: 12px;
			text-decoration: line-through;
		}
		.wish-text-3 {
			color: #222222;
			font-size: 16px;
		}
	}
	.wish-del {
		position: relative;
		top: -440px;
		left: 238px;
		width: 28px;
		height: 28px;
		opacity: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 50%;
		cursor: pointer;
		text-align: center;
	}
	.icon-guanbi {
		font-size: 18px;
		color: #222;
		line-height: 28px;
	}
}
</style>
