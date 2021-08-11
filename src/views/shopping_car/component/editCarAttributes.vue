<template>
	<div class="editCarAttributes">
		<div class="editCarAttributes_i">
			<i class="iconfont icon-guanbi" @click="loginClose()"></i>
			<div class="edit-pro-attr">
				<!--商品信息-->
				<div class="product-info">
					<div class="product-left">
						<el-image class="product-small-img" :class="index === activeImgIndex ? 'active-img' : ''" v-for="(item, index) in goodsImgList" :key="index" :src="$utils.imageHandler(3, item)" fit="cover" @click="selectImg(item, index)">
							<div slot="placeholder" class="image-slot">
								<img src="@/assets/images-pc/default.png" />
							</div>
							<div slot="error" class="image-slot">
								<img src="@/assets/images-pc/default.png" />
							</div>
						</el-image>
					</div>
					<div class="product-center">
						<div class="newAfale">
							<span class="detail-rate" v-if="goodsInfo.tagsMap.indexOf('flash_sale') > -1 && goodsInfo.discountRate > 0">-{{ Math.floor(goodsInfo.discountRate * 100) }}%</span>
							<span class="detail-sign" v-else-if="!(goodsInfo.tagsMap.indexOf('flash_sale') > -1) && goodsInfo.tagsMap.indexOf('new_in') > -1">New</span>
						</div>
						<div class="swiper-container swiper-detail-banner">
							<div class="swiper-wrapper">
								<div class="swiper-slide" v-for="(item, index) in goodsImgList" :key="index">
									<el-image class="product-big-img" :src="$utils.imageHandler(3, item)" fit="cover">
										<div slot="placeholder" class="image-slot">
											<img src="@/assets/images-pc/default.png" />
										</div>
										<div slot="error" class="image-slot">
											<img src="@/assets/images-pc/default.png" />
										</div>
									</el-image>
								</div>
							</div>
							<i class="iconfont icon-fanhui2"></i>
							<i class="iconfont icon-fanhui"></i>
						</div>
					</div>
					<div class="product-right">
						<div class="product-right_div">
							<div class="product-title">{{ goodsInfo.productName | productNameFilter(70) }}</div>
							<!-- <div class="product-rate"><el-rate v-model="goodsEvaluate.evaluateStartPercentage" disabled show-score text-color="#ff9900"></el-rate></div>
                        <div class="product-price">US${{ (goodsInfo.discountPrice / 100).toFixed(2) }}<span>US${{ (goodsInfo.price / 100).toFixed(2) }}</span></div> -->
							<div class="car-product__price_i">
								<div :class="['car_price_infact', { 'have-discount': goodsInfo.discountPrice && goodsInfo.discountPrice < goodsInfo.price }]">US${{ (goodsInfo.discountPrice || goodsInfo.price) | filterPrice }}</div>
								<div class="car_price_through" v-if="goodsInfo.discountPrice && goodsInfo.discountPrice < goodsInfo.price">US${{ goodsInfo.price | filterPrice }}</div>
							</div>
							<el-divider></el-divider>
							<div class="attribute-ul">
								<p class="attribute-ul-p">Select a specification</p>
								<div class="attribute-list" v-for="(item, index) in goodsInfo.list" :key="index">
									<div class="attribute-title">
										{{ item.attrName }}
										<!-- 新增图片颜色显示 -->
										<span v-for="(items, indexs) in item.attrValList" :key="indexs">
											<span v-if="item.showPicOrText == 1 && items.isDefault">: {{ items.val }}</span>
										</span>
									</div>
									<!--带图片属性-->
									<div v-if="item.showPicOrText == 1">
										<div :class="['attribute-list-img', { 'active-attribute': items.isDefault }, { disabled: items.disabled }]" v-for="(items, indexs) in item.attrValList" :key="indexs" @click="selectAttribute(items, index, indexs)">
											<el-image class="attribute-img" :src="items.valPic" fit="cover"></el-image>
											<el-image class="notAllowed" v-if="items.disabled" :src="require('@/assets/images/icons/notAllowed.png')"></el-image>
										</div>
									</div>
									<!--文字属性-->
									<div v-else>
										<div :class="['attribute-list-text', { 'active-attribute': items.isDefault }, { disabled: items.disabled }]" v-for="(items, indexs) in item.attrValList" :key="indexs" @click="selectAttribute(items, index, indexs)">{{ items.val }}</div>
										<!-- 显示当前选中尺码 -->
										<div v-if="item.sizeList && item.sizeList.length > 0" class="attribute-size">
											<span v-for="(items, indexs) in item.sizeList" :key="indexs"
												>{{ items.label }}: <font>{{ items.value }}inch{{ indexs == item.sizeList.length - 1 ? '' : ',' }}</font></span
											>
										</div>
									</div>
								</div>
								<div v-if="sizeGuideInfoHtml" class="goods-size__info" v-html="sizeGuideInfoHtml"></div>
								<!-- <div class="size-guide"><span @click="sizeGuide()"><i class="iconfont icon-chima"></i>Size Guide</span></div> -->
							</div>

							<div class="add-to-cart">
								<el-button type="primary" @click="addToBagChange()">ADD TO CART</el-button>
								<span class="add-to-cart-view-detail" @click="goGoodsDetail()">View Full Details</span>
								<!-- <div class="wish"><i class="iconfont icon-xihuan1"></i></div> -->
							</div>
							<!-- <div class="return-policy">
                            <div><i class="iconfont icon-fuwu"></i>Return Policy</div>
                        </div>
                        <div class="product-description">
                            <div>Description</div>
                            <div>
                                <span v-for="(item, key, index) in goodsDetailInfo.additionalAttrMap" :key="index">{{ key }}: {{ item }}</span>
                            </div>
                        </div> -->
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--商品尺码弹框-->
		<size-guide :writeSizeGuide="showSizeGuide"></size-guide>
	</div>
</template>

<script>
import http from '@/api/index.js'
import { mapState, mapActions } from 'vuex'
import sizeGuide from '@/views/goods_detail/component/SizeGuide.vue'
import shopcar from '@/mixins/shopCar.js'
export default {
	mixins: [shopcar],
	props: {
		goodsInfo: {
			type: Object,
		},
		skuNo: {
			type: String,
		},
		addType: {
			// 打开选择属性的类型
			type: String,
		},
		newAdd: {
			type: String,
		},
		openTtype: {
			type: Number,
		},
		skuChangeNum: {
			type: Number,
		},
	},
	data() {
		return {
			activeImgIndex: 0, // 滚动图选中下标
			goodsImgSwiper: '',
			goodsImgList: [], // 商品滚动图
			sizeGuideList: {}, // 商品尺码
			goodsEvaluate: {}, // 商品评估
			showSizeGuide: { show: false, productNo: '', modal: false }, // 商品尺码弹框
			sizeGuideInfoHtml: '',
		}
	},
	components: {
		sizeGuide,
	},
	computed: {
		...mapState('shopCar', ['carList']),
	},
	beforeCreate() {},
	created() {
		// 获取商品尺码
		this.getGoodsSize()
		// 获取商品评估
		this.getGoodsEvaluate()
		// 获取商品详情
		this.getGoodsDatail()
	},
	methods: {
		...mapActions('shopCar', {
			changeNum: 'changeNum', // 数量更改
			addItem: 'addItem',
			changeSku: 'changeSku',
		}),
		// 点击前往商品详情：
		goGoodsDetail() {
			this.$router.push({
				path: this.formatUrl(`/product/`, `${this.goodsInfo.productName || this.goodsInfo.name}-${this.goodsInfo.productNo}`),
			})
		},
		// 获取商品尺码
		getGoodsSize() {
			http.goodsDetail
				.size({
					productNo: this.goodsInfo.productNo,
				})
				.then((res) => {
					this.sizeGuideList.CM = JSON.parse(res.data.sizeCm)
					this.sizeGuideList.IN = JSON.parse(res.data.sizcInch)
				})
		},
		// 点击打开商品尺码
		sizeGuide() {
			this.showSizeGuide = { show: true, productNo: this.goodsInfo.productNo }
		},
		// 获取商品详情
		getGoodsDatail: function () {
			// 赋值
			let list = this.goodsInfo.list
			if (this.newAdd === 'new' || (this.openTtype && this.openTtype == 0)) {
				// 当点击加入购物车弹窗时 默认显示第一组图片
				list.map((item) => {
					if (item.isValHavePics) {
						item.attrValList[0].picList.map((items) => {
							this.goodsImgList.push(items)
						})
					}
				})
			}
			// console.log(this.goodsInfo)
			// //////////////////////////////////////新修改详情页面接口
			let data = this.goodsInfo,
				attrValObj = {}
			data.list.forEach((item, i) => {
				data['attr' + (i + 1)] = item.attrName
				attrValObj['attrVal' + (i + 1)] = ''
				item.attrValList.forEach((obj) => {
					if (obj.isDefault) {
						attrValObj['attrVal' + (i + 1)] = obj.val
						// 取默认轮播图
						if (item.isValHavePics) {
							this.goodsImgList = obj.picList
						}
					}
					// 然后 绑定轮播图的属性 默认选中,其它默认不选中:
					if (this.newAdd === 'new') {
						if (!item.isValHavePics) {
							obj.isDefault = false
						}
					}
				})
			})
			let info = {}
			data.skus.forEach((item) => {
				let bool = this.dealObj(attrValObj, item)
				if (bool) info = item
			})
			data.attrObj = attrValObj
			data.skuNo = info.skuNo
			this.goodsInfo = data
			// this.calculationInventory(this.goodsInfo) // 对属性进行 禁用项处理.
			this.$nextTick(() => {
				this.initDetailSku() // 初始化商品详情滚动图
			})
		},
		// 选择小图进行大图展示
		selectImg: function (e, index) {
			this.activeImgIndex = index
			this.goodsImgSwiper.slideTo(index)
		},
		// 初始化商品详情滚动图
		initDetailSku: function () {
			this.goodsImgSwiper = new Swiper('.swiper-detail-banner', {
				loop: false, // 循环
				autoplay: false, // 禁止自动滑动
				prevButton: '.swiper-detail-banner .icon-fanhui2',
				nextButton: '.swiper-detail-banner .icon-fanhui',
				observer: true,
				observeParents: true,
				onSlideChangeStart: (swiper) => {
					this.activeImgIndex = swiper.activeIndex
					// this.smallImgSwiper.slideTo(swiper.activeIndex)
				},
			})
		},
		// 获取商品评估
		getGoodsEvaluate: function () {
			http.review
				.evaluateStatistics({
					productNo: this.$route.query.productNo,
				})
				.then((res) => {
					this.goodsEvaluate = res.data
				})
		},
		// 关闭编辑弹窗
		loginClose() {
			this.$emit('closeEdit', false)
		},
		// 选择属性
		selectAttribute: function (e, index, indexs) {
			console.log(e)
			if (e.isDefault || e.disabled) return
			// 更改属性值
			this.goodsInfo.list.forEach((item, i) => {
				if (i == index) {
					item.attrValList.forEach((attr, j) => {
						attr.isDefault = false
						if (j == indexs) {
							attr.isDefault = true
						}
					})
				}
			})
			// 替换商品滚动图
			if (this.goodsInfo.list[index].isValHavePics) {
				var imgList = []
				for (const i in this.goodsInfo.list[index].attrValList[indexs].picList) {
					imgList.push(this.goodsInfo.list[index].attrValList[indexs].picList[i])
				}
				this.goodsImgList = imgList
				this.activeImgIndex = 0
				this.goodsImgSwiper.slideTo(0)
			}

			let isAll = true,
				attrValObj = {} // 属性:属性值, 已选中的组合eg: {'尺码': 'M码', '颜色': 'red'}
			for (let k = 0; k < this.goodsInfo.list.length; k++) {
				let item = this.goodsInfo.list[k]
				attrValObj['attrVal' + (k + 1)] = ''
				isAll = item.attrValList.some((obj) => {
					if (obj.isDefault) attrValObj['attrVal' + (k + 1)] = obj.val
					return obj.isDefault
				})
				if (!isAll) break
			}

			let info = {}
			if (isAll) {
				let skus = this.goodsInfo.skus
				skus.forEach((item) => {
					let bool = this.dealObj(attrValObj, item)

					if (bool) info = item
				})
				info.attrValObj = attrValObj
			}
			// 重新赋值计算的价格sku等等信息
			this.goodsInfo.attrObj = info.attrValObj
			// this.goodsInfo.attrObj = {}
			this.goodsInfo.skuNo = info.skuNo
			this.goodsInfo.discountPrice = info.discountPrice
			this.goodsInfo.discountRate = info.discountRate
			this.goodsInfo.price = info.price
			// 显示选中的尺寸信息
			this.showAttributeSize(e, index, indexs)
			// 根据skus里的库存数据 计算当前商品是否可售
			this.calculationInventory(this.goodsInfo)
		},

		// 显示选中的尺寸信息
		showAttributeSize: function (e, index, indexs) {
			for (const i in this.sizeGuideList['IN'].datas) {
				if (this.sizeGuideList['IN'].datas[i].indexOf(e.val) > -1) {
					var list = []
					for (const j in this.sizeGuideList['IN'].xTitle) {
						if (j > 0 && this.sizeGuideList['IN'].datas[i][j] != '/') {
							list.push({
								label: this.sizeGuideList['IN'].xTitle[j],
								value: this.sizeGuideList['IN'].datas[i][j],
							})
						}
					}
					this.goodsInfo.list[index].sizeList = list
					break
				} else {
					this.goodsInfo.list[index].sizeList = []
				}
			}
		},

		// 添加进购物车
		addToBagChange() {
			let list = this.goodsInfo.list
			let list_ = []
			for (const i in list) {
				var flag = list[i].attrValList.some((e) => {
					return e.isDefault == true
				})
				list_.push(flag)
			}
			if (list_.indexOf(false) > -1) {
				this.$message.warning('Please Select Your Preference')
				return
			}
			const obj = this.goodsInfo
			if (obj && obj.num == 99) {
				this.$message.warning('Add failed, shopping bag has reached the limit')
				return
			}
			if (this.goodsInfo.skuNo == this.skuNo || this.addType == 'addChange') {
				this.loginClose()
				// 如果添加的skuNo 与购物车里的一样，则数量增加,即普通加购流程
				// if(this.addType == "addChange") obj.num = 1
				this.addItem(this.goodsInfo)
					.then(() => {
						this.$message.success('Added success!')
						this.$store.commit('user/shopCarStatus', true)
						setTimeout(() => {
							this.$store.commit('user/shopCarStatus', false)
						}, 2000)
						// 加购成功, 数量 0  --> 1
						if (this.addType == 'addChange') {
							// 数据上报：
							this.reportGtag('add_to_cart', this.reportData('GA4'), 'GA4') // 新版
							this.reportGtag('add_to_cart', this.reportData('UA'))
							this.reportFB('AddToCart', this.reportData('fb'))
						}
					})
					.catch((error) => {
						this.$message.error(error.msg)
					})
			} else {
				// 如果添加的skuNo 与购车不一样,则执行修改skuNo(添加新的，删除旧的)
				const query = {
					newSku: this.goodsInfo.skuNo,
					num: this.skuChangeNum + 1 || 1,
					oldSku: this.skuNo,
					goods: this.goodsInfo,
				}
				this.changeSku(query).then(() => {
					this.loginClose()
					this.$message.success('Added success!')
					this.$store.commit('user/shopCarStatus', true)
					setTimeout(() => {
						this.$store.commit('user/shopCarStatus', false)
					}, 2000)
				})
			}
		},
		// 判断属性值是否都相等:
		dealObj(o, o2) {
			for (let key in o) {
				if (o2[key] != o[key]) {
					return false
				}
			}
			return true
		},
		// 根据属性计算sku库存
		calculationInventory(obj) {
			if (!obj.skus) return
			const { list, skus } = obj
			const active = []
			const skuObj = {}
			skus.forEach((item) => {
				const attrVal1 = item.attrVal1 || '',
					attrVal2 = item.attrVal2 || '',
					attrVal3 = item.attrVal3 || '',
					attrVal4 = item.attrVal4 || ''
				const key = `${attrVal1},${attrVal2},${attrVal3},${attrVal4}`.replace(/(,+$)/gm, '')
				skuObj[key] = { ...item }
			})
			list.forEach((item, index) => {
				active[index] = '.+'
				item.attrValList.forEach((element) => {
					if (element.isDefault) {
						active[index] = element.val
					}
				})
			})
			list.forEach((item, index) => {
				item.attrValList.forEach((element) => {
					const currentObj = active.map((item, i) => (index == i ? element.val : item)).join(',')
					if (currentObj.includes('.+')) {
						element.disabled = false
						return
					}
					element.disabled = !skuObj[currentObj]
					if (element.disabled) {
						element.isDefault = false
					}
				})
			})
		},
		// 数据上报处理:
		reportData(type) {
			let obj = {}
			let items = [
				{
					id: this.goodsInfo.skuNo,
					name: this.goodsInfo.productName,
					brand: this.goodsInfo.branName,
					price: (this.goodsInfo.discountPrice || this.goodsInfo.price) / 100,
					quantity: 1,
				},
			]
			if (type == 'fb') {
				// facebook--用 SPU
				items[0].id = this.goodsInfo.productNo
				obj = {
					content_name: this.goodsInfo.productName,
					content_type: 'product_group',
					currency: 'USD',
					contents: items,
					value: (this.goodsInfo.discountPrice || this.goodsInfo.price) / 100,
				}
			} else if (type == 'GA4') {
				// 新版GA
				obj = {
					currency: 'USD',
					value: (this.goodsInfo.discountPrice || this.goodsInfo.price) / 100,
					items: [
						{
							item_id: this.goodsInfo.skuNo,
							item_name: this.goodsInfo.productName,
							quantity: 1,
							promotion_name: '常规', // 促销活动名称
							item_brand: this.goodsInfo.branName,
							price: (this.goodsInfo.discountPrice || this.goodsInfo.price) / 100,
						},
					],
				}
			} else {
				// 默认是老版GA(UA)
				obj.items = items
			}
			return obj
		},
	},
	mounted() {},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';
.editCarAttributes {
	width: 990px;
	height: 745px;
	background: #fff;
	position: absolute;
	left: 50%;
	margin-left: -495px;
	top: 50%;
	margin-top: -327.5px;
	.editCarAttributes_i {
		padding: 40px;
		i.icon-guanbi {
			font-size: 25px;
			position: absolute;
			right: 40px;
			top: 40px;
			cursor: pointer;
		}
		.edit-pro-attr {
			margin-top: 45px;
			height: 610px;
			overflow: auto;
		}
	}
}
/*商品信息*/
.product-info {
	display: flex;
	.product-left {
		text-align: center;
		width: 60px;
		.active-img {
			border: 1px solid #666;
		}
		.product-small-img {
			width: 54px;
			height: 77px;
			cursor: pointer;
			padding: 1px;
			// /deep/.el-image__inner{
			//     border:1px dashed #999;
			// }
		}
	}
	.product-center {
		width: 380px;
		overflow: auto;
		position: relative;
		.newAfale {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 2;
			span {
				display: block;
				padding: 4px 8px;
				color: #ffffff;
				&.detail-rate {
					color: #222222;
					background: #ffb84e;
				}
				&.detail-sign {
					color: #ffffff;
					background: #87c6a1;
				}
			}
		}
		.swiper-detail-banner {
			position: relative;
			width: 100%;
			height: 570px;
			// border:1px dashed #999;
			i {
				position: absolute;
				top: calc(50% - 20px);
				font-size: 20px;
				color: #222222;
				text-align: center;
				width: 40px;
				height: 40px;
				line-height: 40px;
				background-color: #ffffff;
				border-radius: 50%;
				cursor: pointer;
				transition: all 0.3s;
				z-index: 1;
				&:hover {
					color: #999999;
				}
			}
			.icon-fanhui2 {
				left: 30px;
			}
			.icon-fanhui {
				right: 30px;
			}
			.product-big-img {
				width: 100%;
				height: 100%;
			}
		}
	}
	.product-right {
		width: 470px;
		.product-right_div {
			height: 100%;
			margin-left: 50px;
			.car-product__price_i {
				vertical-align: middle;
				margin-top: 10px;
				div {
					display: inline-block;
					&.car_price_infact {
						font-size: 24px;
						color: #333;
						font-family: Montserrat Regular;
						&.have-discount {
							color: @color-red;
						}
					}
					&.car_price_through {
						text-decoration: line-through;
						font-size: 16px;
						font-family: Montserrat Light;
						color: @color-999;
						margin-top: 4px;
						margin-left: 10px;
					}
				}
			}
			.product-title {
				font-size: 14px;
				font-family: Montserrat Light;
				span {
					font-weight: bold;
				}
			}
			.product-rate {
				margin-top: 10px;
			}
			.product-price {
				font-size: 22px;
				font-weight: bold;
				color: #e84646;
				margin-top: 20px;
				span {
					font-size: 14px;
					color: #999999;
					text-decoration: line-through;
					margin-left: 10px;
				}
			}
			.attribute-ul {
				height: 350px;
				overflow: auto;
				.attribute-ul-p {
					font-size: 14px;
					font-family: Montserrat Light;
					color: #222;
				}
				.attribute-list {
					margin-top: 10px;
					.attribute-title {
						font-size: 18px;
						font-family: Montserrat Regular;
						margin-bottom: 15px;
						span {
							font-size: 14px;
							font-family: Montserrat Light;
							color: #666;
						}
					}
					.attribute-list-img {
						font-size: 0;
						padding: 2px;
						margin-right: 15px;
						border: 1px solid #ffffff;
						border-radius: 50%;
						display: inline-block;
						cursor: pointer;
						overflow: hidden;
						position: relative;
						&.disabled {
							cursor: not-allowed;
							&::before {
								content: '';
								position: absolute;
								width: 100%;
								height: 100%;
								background: rgba(255, 255, 255, 0.5);
								left: 0;
								top: 0;
								z-index: 1;
							}
						}
						.notAllowed {
							position: absolute;
							width: 100%;
							height: 100%;
							top: 0;
							left: 0;
						}
					}
					.attribute-img {
						width: 30px;
						height: 30px;
						border-radius: 50%;
					}
					.attribute-list-text {
						font-size: 14px;
						font-family: Montserrat Light;
						padding: 5px 20px;
						margin-right: 10px;
						margin-bottom: 10px;
						border: 1px solid #d1d1d1;
						border-radius: 2px;
						display: inline-block;
						cursor: pointer;
						&.disabled {
							border-style: dashed;
							color: @color-999;
							cursor: not-allowed;
						}
					}
					.active-attribute {
						font-family: Montserrat Regular;
						border: 1px solid #222222;
					}
					.attribute-size {
						font-size: 14px;
						font-family: Montserrat Light;
						line-height: 1.5;
						padding: 10px;
						background-color: #f5f5f5;
					}
					.attribute-size span {
						margin-right: 8px;
						display: inline-block;
					}
					.attribute-size font {
						color: #666;
					}
				}
			}
			.size-guide {
				color: #5689c6;
				font-size: 12px;
				span {
					width: max-content;
					display: flex;
					align-items: center;
					cursor: pointer;
				}
				i {
					font-size: 30px;
					margin-top: 3px;
				}
			}
			.add-to-cart {
				margin-top: 20px;
				.add-to-cart-view-detail {
					font-size: 14px;
					font-family: Montserrat Light;
					height: 40px;
					line-height: 40px;
					text-decoration: underline;
					color: #666666;
					text-align: center;
					cursor: pointer;
					display: block;
				}
				.el-button {
					width: 100%;
					padding: 18px 0;
					font-size: 18px;
					font-family: Montserrat Regular;
				}
			}
			.return-policy {
				margin-top: 30px;
				div {
					width: 395px;
					height: 45px;
					line-height: 45px;
					padding: 0 20px;
					background-color: #f7f8fa;
					cursor: pointer;
				}
				i {
					font-size: 20px;
					margin-right: 10px;
					vertical-align: middle;
				}
			}
			.product-description {
				margin-top: 30px;
				div {
					&:nth-child(1) {
						font-size: 15px;
						font-weight: bold;
					}
					&:nth-child(2) {
						margin-top: 20px;
					}
				}
				span {
					margin-top: 10px;
					display: block;
				}
			}
		}
	}
}
</style>