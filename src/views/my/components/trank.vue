<template>
	<div>
		<el-dialog :visible="outerVisible" width="804px" :close-on-click-modal="false" :close-on-press-escape="false" @close="close()">
			<template v-slot:title></template>
			<div class="logistics-title">
				<div>Logistics list</div>
			</div>
			<div class="logistics-item" v-for="(item, index) in logistics" :key="index">
				<div class="item-title">
					<div class="item-title-left">
						<i class="iconfont icon-yushu1"></i>
						<div>{{ getLogistics[item.logisticsStatus] }}</div>
					</div>
					<div class="item-title-right">{{ item.deliveryCompany }}. {{ item.deliverySn }}</div>
				</div>

				<div class="logistics-image-list">
					<div v-for="(item2, index) in item.productShops" :key="index" class="logistics-image-item">
						<div class="logistics-image">
							<img :src="$utils.imageHandler(12, item2.picKey)" />
							<div class="img-num">X{{item2.num}}</div>
						</div>
						<p><span>{{ item2.productName }}</span></p>
					</div>
				</div>
				<div class="logistics-btn">
					<div class="order-btn" @click="showDetail(item)">TRACK</div>
					<div class="logistics-btn-text" v-if="item.num>1">{{ item.num }} items</div>
					<div class="logistics-btn-text" v-if="item.num<=1">{{ item.num }} item</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer"></div>
		</el-dialog>

		<div class="dialog-two">
			<el-dialog width="423px" :visible="innerVisible" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeDetail()">
				<template v-slot:title></template>
				<div class="logistics-detail-title">
					<div>LOGISTICS DETAILS</div>
				</div>
				<div class="detail-top">
					<div class="text-box">
						<i class="iconfont icon-yushu1"></i>
						<div class="detail-text0">{{ getLogistics[logisticsStatus] }}</div>
					</div>
					<div class="text-box1 among">
						<div class="detail-text1">Logistics No.:</div>
						<div class="detail-text2">{{ deliverySn }}</div>
					</div>
					<div class="text-box1">
						<div class="detail-text1">Logistics company:</div>
						<div class="detail-text2">{{ deliveryCompany }}</div>
					</div>
				</div>
				<van-steps direction="vertical" :active="0">
				<van-step v-for="(item, index) in deliveryInfo" :key="index">
					<p>{{ item }}</p>
				</van-step>
			</van-steps>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import { Steps,Step } from 'vant'
import { mapActions } from 'vuex'
import { getLogistics } from '@/utils/enums'
export default {
	props: ['outerVisible', 'innerVisible', 'data'],
	data() {
		return {
			getLogistics,
			logistics: [],
			deliveryCompany: '',
			deliverySn: '',
			deliveryInfo: [],
			logisticsStatus: 0,
		}
	},
	methods: {
		...mapActions('order', ['getAllLogistics', 'getLogisticsDetail']),
		init() {
			if (this.outerVisible) {
				this.getAllLogistics(this.data.orderSn).then((res) => {
					if (res.code === 0) {
					let { data } = res
					data.orderLogisticsRespList &&
						data.orderLogisticsRespList.forEach(item => {
							let orderSkuList = JSON.parse(item.orderSkuList)
							item.num = 0
							item.productShops = Object.keys(orderSkuList).map(element => {
								item.num += orderSkuList[element]
								return {
									...data.orderItemResp.filter(item => item.skuNo == element)[0],
									skuNo: element,
									num: orderSkuList[element]
								}
							})
							this.logistics.push(item)
						})
				}
				})
			} else {
				this.showDetail(this.data)
			}
		},
		showDetail(param) {
            this.$emit('changeVisibleDetail', true)
			this.getLogisticsDetail({ ...param }).then((res) => {
				let { data } = res
				this.deliveryCompany = data.deliveryCompany 
				this.deliverySn = data.deliverySn 
				this.logisticsStatus = data.logisticsStatus 
				this.deliveryInfo = data.deliveryInfo.split('\n')
			})
		},
		close() {
			this.$emit('changeVisible', false)
		},
		closeDetail() {
			this.$emit('changeVisibleDetail', false)
		},
	},
	created() {
		this.init()
	},
	components: {
		[Step.name]: Step,
		[Steps.name]: Steps,
	},
}
</script>
<style scoped lang="less">
/deep/.el-dialog__body {
	padding: 20px 40px;
}
/deep/ .el-icon-close {
	font-size: 24px;
	margin-top: 10px;
}
.logistics-image {
	width: 152px;
	height: 238px;
}
.img-num {
	width: 27px;
	height: 27px;
	opacity: 0.9;
	background: rgba(255, 255, 255, 0.6);
	border-radius: 50%;
	top: -39px;
	left: 115px;
	position: relative;
	text-align: center;
	line-height: 27px;
	color: #222;
	font-size: 13px;
}
.dialog-two /deep/ .el-dialog {
	margin: 0;
	float: right;
}
.text-box {
	width: 343px;
	height: 32px;
	.icon-yushu1 {
		float: left;
		font-size: 32px;
		margin-right: 10px;
	}
}
.text-box1 {
	width: 343px;
	height: 14px;
}
.among {
	margin: 23px 0 21px 0;
}
.detail-top {
	width: 343px;
	height: 147px;
	padding: 24px 0 22px 0;
}
.detail-text0 {
	float: left;
	color: #222;
	font-size: 26px;
	line-height: 32px;
}
.detail-text1 {
	float: left;
	color: #999;
	font-size: 14px;
	line-height: 16px;
}
.detail-text2 {
	float: left;
	color: #222;
	font-size: 14px;
	line-height: 16px;
	margin-left: 20px;
}
.logistics-detail-title {
	width: 343px;
	margin: 11px 106px 0 0;
	div {
		color: #222222;
		font-size: 24px;
		line-height: 29px;
		padding: 10px 0 30px 0;
	}
}
.logistics-title {
	margin: 11px 90px 0 0;
	text-align: center;
	div {
		color: #222222;
		font-size: 24px;
		line-height: 29px;
		padding: 10px 0 30px 0;
	}
}
.item-title {
	color: #222;
	line-height: 26px;
	margin-bottom: 10px;
	width: 674px;
	height: 32px;
	.item-title-left {
		float: left;
		div {
			float: left;
			font-size: 22px;
			font-weight: 500;
		}
		.icon-yushu1 {
			float: left;
			font-size: 32px;
			margin-right: 10px;
		}
	}
	.item-title-right {
		float: right;
		font-size: 14px;
	}
}
.logistics-image-list {
	overflow:auto;
	height: 273px;
	display:-webkit-flex;
	width:100%;
	display:flex;
	p{
		
		overflow: hidden;
		text-overflow:ellipsis;

		white-space: nowrap;
	}
}
.logistics-item {
	height: 397px;
}
.logistics-image-item {
	width: 152px;
	height: 273px;
	margin-right: 20px;
	float: left;
}
.logistics-btn {
	width: 674px;
	height: 72px;
	.order-btn {
		width: 100px;
		height: 32px;
		font-size: 18px;
		line-height: 32px;
		background: #222222;
		float: right;
		text-align: center;
		margin-left: 20px;
		margin-top: 20px;
		color: #ffffff;
		cursor: pointer;
	}
	.logistics-btn-text {
		font-size: 18px;
		margin-top: 31px;
		line-height: 21px;
		float: right;
		color: #666;
	}
}
</style>