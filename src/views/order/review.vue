<template>
	<div class="review">
		<div class="my-breadcrumb">Personal Center / {{active}} / Write A Review</div>
		<div class="order-head">Write a rivew</div>
		<div class="review-box" v-for="(item, index) in reviewDetail.orderItemResp" :reviewList="item" :key="index">
			<div class="review-left">
				<img :src="$utils.imageHandler(13, item.picKey)" />
				<!-- <div class="review-left-text1">{{ item.brand }}</div> -->
				<div class="review-left-text2">{{ item.productName }}</div>
			</div>
			<div class="review-right">
				<div class="form-item">
					<div class="right-label">Rating</div>
					<div><el-rate v-model="item.evaluateStart"></el-rate></div>
				</div>
				<div class="form-item">
					<div class="right-label">Overall Fit<span>*</span></div>
					<div>
						<el-radio-group v-model="item.productMatch">
							<el-radio :label="0">True to size</el-radio>
							<el-radio :label="1">Large</el-radio>
							<el-radio :label="2">Small</el-radio>
						</el-radio-group>
					</div>
				</div>
				<div class="form-item margin-m">
					<div class="right-label">Content<span>*</span></div>
					<el-input :autosize="{ minRows: 3, maxRows: 3 }" class="right-input" type="textarea" placeholder="Please write a review" v-model="item.evaluateContent" maxlength="1000" show-word-limit />
				</div>
				<div class="form-item">
					<div class="no-label right-text">
						<div class="no-label-left">
							<el-upload action="" :data="{ id: item.id }" :http-request="uploadFile" :before-remove="beforeRemove" accept="image/jpeg,image/gif,image/png" list-type="picture-card" :before-upload="beforeAvatarUpload" :limit="3" :on-exceed="handleExceed">
								<i class="el-icon-plus"></i>
							</el-upload>
							<div class="no-label-bottom">Formate only: JPEG, GIF, PNG(8 MB max)</div>
						</div>
						<div class="submit" v-on:click="submit(item)">SUBMIT</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="reviewDetail.userEvaluateList && reviewDetail.userEvaluateList.length > 0">
			<div class="review-box" v-for="(item, index) in reviewDetail.userEvaluateList" :reviewList="item" :key="index">
				<div class="review-left">
					<img :src="$utils.imageHandler(13, item.picKey)" />
					<!-- <div class="review-left-text1">{{ item.brand }}</div> -->
					<div class="review-left-text2">{{ item.productName }}</div>
				</div>
				<div class="review-right">
					<div class="form-item">
						<div class="right-label">Rating</div>
						<div><el-rate v-model="item.evaluateStart" :disabled="true"></el-rate></div>
					</div>
					<div class="form-item">
						<div class="right-label">Overall Fit<span>*</span></div>
						<div>
							<el-radio-group :disabled="true" v-model="item.productMatch">
								<el-radio :label="0">True to size</el-radio>
								<el-radio :label="1">Large</el-radio>
								<el-radio :label="2">Small</el-radio>
							</el-radio-group>
						</div>
					</div>
					<div class="form-item margin-m">
						<div class="right-label">Content<span>*</span></div>
						<div class="right-text-1">{{ item.evaluateContent }}</div>
					</div>
					<div class="form-item">
						<div class="no-label right-text">
							<div class="no-label-left">
								<img v-if="item.evaluatePicsOnekey != ''" :src="$utils.imageHandler(13, item.evaluatePicsOnekey)" />
								<img v-if="item.evaluatePicsTwokey != ''" :src="$utils.imageHandler(13, item.evaluatePicsTwokey)" />
								<img v-if="item.evaluatePicsThreekey != ''" :src="$utils.imageHandler(13, item.evaluatePicsThreekey)" />
								<div class="no-label-bottom">Formate only: JPEG, GIF, PNG(3 MB max)</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import mixin from './const/review'
export default {
	mixins: [mixin],
	data() {
		return {
			imgObj: {},
			active:this.$route.query.to
		}
	},
	methods: {
		beforeAvatarUpload(file) {
			const isLt3M = file.size / 1024 / 1024 < 3
			const isType = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif'
			if (!isLt3M) {
				this.$message.error('Pictures should be within 3MB!')
			}
			if (!isType) {
				this.$message.error('Formate only: JPEG, GIF, PNG!')
			}
			return isLt3M && isType
		},
		// 图片选择超出限制
		handleExceed(files, fileList){
			this.$message.warning('You can only add up to 3 pictures')
		},
		uploadFile(file) {
			let formData = new FormData()
			formData.append('type', 'evaluate_img')
			formData.append('image', file.file)
			this.UploadImg(formData)
				.then((res) => {
					let { pathKey } = res.data
					if (res.code === 0) {
						if (this.imgObj[file.data.id]) {
							this.imgObj[file.data.id].push({
								url: pathKey,
								uid: file.file.uid,
							})
						} else {
							this.imgObj[file.data.id] = [
								{
									url: pathKey,
									uid: file.file.uid,
								},
							]
						}
					}
				})
				.catch(() => {})
		},
		beforeRemove(file) {
			for (let k in this.imgObj) {
				this.imgObj[k] = this.imgObj[k].filter((item) => item.uid !== file.uid)
				if (!this.imgObj[k].length) this.$delete(this.imgObj, k)
			}
		},
		submit(item) {
			console.log(item)
			let { productMatch, evaluateContent, evaluateStart, userId, orderId, orderSn, productNo, skuNo, shopsId } = item
			if (productMatch === '' || evaluateContent.length < 1) {
				this.$message.error('Please complete required fileds')
				return
			}
			let obj = {
				productMatch,
				evaluateContent,
				evaluateStart,
				userId,
				orderId,
				orderSn,
				productNo,
				skuNo,
				shopsId,
				evaluatePicsOnekey: (this.imgObj[item.id] && this.imgObj[item.id][0] && this.imgObj[item.id][0].url) || '',
				evaluatePicsTwokey: (this.imgObj[item.id] && this.imgObj[item.id][1] && this.imgObj[item.id][1].url) || '',
				evaluatePicsThreekey: (this.imgObj[item.id] && this.imgObj[item.id][2] && this.imgObj[item.id][2].url) || '',
			}
			this.createEvaluate(obj).then((res) => {
				if (res.code === 0) {
					let { orderSn } = this.$route.query
					this.getOrderDetail(orderSn)
					this.imgObj = {}
					this.$message.success('Submitted successfully!')
				}
			})
		},
	},
	components: {},
}
</script>
<style scoped lang="less">
.review {
	margin: 0px auto;
	overflow: hidden;
	margin-bottom: 80px;
}
.submit {
	width: 94px;
	height: 29px;
	opacity: 1;
	background: #222222;
	line-height: 29px;
	font-size: 14px;
	text-align: center;
	color: #fff;
	float: left;
	margin-top: 59px;
	cursor: pointer;
}
.no-label-left {
	width: 423px;
	float: left;
	img {
		width: 68px;
		height: 68px;
		margin-right: 8px;
		margin-top: 10px;
	}
}
.review-box {
	float: left;
}
.review-left {
	width: 450px;
	float: left;
	padding-left: 170px;
	img {
		margin-top: 40px;
	}
	.review-left-text1 {
		margin-top: 10px;
		color: #222;
		font-size: 12px;
		line-height: 14px;
	}
	.review-left-text2 {
		margin-top: 2px;
		font-size: 12px;
		line-height: 14px;
		color: #666;
		text-overflow: ellipsis;
		width: 136px;
		white-space: nowrap;
		overflow: hidden;
	}
}
.review-right {
	width: 750px;
	padding-top: 40px;
	float: right;
}
.form-item {
	margin-bottom: 24px;
}
.margin-m {
	margin-bottom: 10px;
}
.no-label {
	margin-left: 154px;
}
.no-label-bottom {
	color: #999;
	margin-top: 6px;
	font-size: 12px;
	line-height: 14px;
}
.right-label {
	font-size: 14px;
	line-height: 20px;
	color: #222;
	float: left;
	width: 154px;
	height: 14px;
	span {
		color: #e84646;
	}
}
.right-text {
	width: 517px;
	height: 88px;
}
.right-text-1 {
	font-size: 14px;
	color: #222;
	line-height: 17px;
	width: 517px;
	float: left;
	word-wrap: break-word;
}
.right-input {
	width: 517px;
}
/deep/.el-upload--picture-card {
	width: 68px;
	height: 68px;
	line-height: 78px;
}
/deep/.el-upload-list__item {
	width: 68px;
	height: 68px;
}
/deep/.el-radio {
	margin-right: 40px;
}
/deep/.el-radio__inner {
	width: 18px;
	height: 18px;
}
/deep/.el-rate__icon {
	font-size: 24px;
}
</style>