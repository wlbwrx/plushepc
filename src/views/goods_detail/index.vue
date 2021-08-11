<template>
	<div>
		<!--提示三栏-->
		<home-tag></home-tag>

		<div class="product-detail">
			<template v-if="!isInvalid">
				<!--商品信息-->
				<div class="product-info">
					<div class="product-left">
						<div class="swiper-container swiper-detail-small">
							<div class="swiper-wrapper">
								<div class="swiper-slide" v-for="(item, index) in goodsImgList" :key="index">
									<el-image class="product-small-img" :class="index === activeImgIndex ? 'active-img' : ''" :src="item" fit="cover" @click="selectImg(item, index)">
										<div slot="placeholder" class="image-slot">
											<img src="@/assets/images-pc/default.png" />
										</div>
										<div slot="error" class="image-slot">
											<img src="@/assets/images-pc/default.png" />
										</div>
									</el-image>
								</div>
							</div>
							<div class="small-icon small-icon-fanhui2"><i class="el-icon-arrow-up"></i></div>
							<div class="small-icon small-icon-fanhui"><i class="el-icon-arrow-down"></i></div>
						</div>
					</div>
					<div class="product-center">
						<div class="swiper-container swiper-detail-big">
							<div class="swiper-wrapper">
								<div class="swiper-slide" v-for="(item, index) in goodsImgList" :key="index">
									<el-image class="product-big-img" :src="item" fit="cover">
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
						<div class="product-title">
							<span v-if="goodsInfo.tagsMap.indexOf('flash_sale') > -1 && goodsInfo.tagsMap.indexOf('new_in') > -1 && goodsInfo.discountRate == 0"></span>
							<span class="detail-rate" v-else-if="goodsInfo.tagsMap.indexOf('flash_sale') > -1 && goodsInfo.discountRate > 0">-{{ Math.floor(goodsInfo.discountRate * 100) }}%</span>
							<span class="detail-sign" v-else-if="goodsInfo.tagsMap.indexOf('new_in') > -1">New</span>
							{{ goodsInfo.productName }}
						</div>
						<div class="product-rate" v-if="goodsEvaluate.evaluateStartPercentage"><el-rate v-model="goodsEvaluate.evaluateStartPercentage" disabled show-score text-color="#FFBF00"></el-rate>({{ goodsEvaluate.evaluateNums || 0 }})</div>
						<div class="product-rate text-gray" v-else>No Reviews</div>

						<!--价格-->
						<div class="product-price" v-if="goodsInfo.discountPrice == goodsInfo.price || goodsInfo.discountPrice == 0">US${{ goodsInfo.discountPrice == 0 ? (goodsInfo.price / 100).toFixed(2) : (goodsInfo.discountPrice / 100).toFixed(2) }}</div>
						<div class="product-price text-red" v-else>
							US${{ (goodsInfo.discountPrice / 100).toFixed(2) }}<span>US${{ (goodsInfo.price / 100).toFixed(2) }}</span>
						</div>
						<el-divider></el-divider>

						<div class="attribute-list" v-for="(item, index) in goodsInfo.list" :key="index">
							<div class="attribute-title">
								{{ item.attrName }}
								<span v-for="(items, indexs) in item.attrValList" :key="indexs">
									<span v-if="item.showPicOrText == 1 && items.isDefault">: {{ items.val }}</span>
								</span>
							</div>
							<!--带图片属性-->
							<div v-if="item.showPicOrText == 1">
								<div class="attribute-list-img" :class="items.isDefault ? 'active-attribute' : ''" v-for="(items, indexs) in item.attrValList" :key="indexs" @click="selectAttribute(items, index, indexs)">
									<el-image class="attribute-img" :src="$utils.imageHandler(2, items.valKey)" fit="cover"></el-image>
								</div>
							</div>
							<!--文字属性-->
							<div v-else>
								<div :class="['attribute-list-text', { 'active-attribute': items.isDefault }, { disabled: items.disabled }]" v-for="(items, indexs) in item.attrValList" :key="indexs" @click="selectAttribute(items, index, indexs)">{{ items.val }}</div>
								<!--显示当前选中尺码-->
								<div v-if="item.sizeList.length" class="attribute-size">
									<span v-for="(items, indexs) in item.sizeList" :key="indexs"
										>{{ items.label }}: <font>{{ items.value }}inch{{ indexs == item.sizeList.length - 1 ? '' : ',' }}</font></span
									>
								</div>
							</div>
						</div>
						<div class="size-guide">
							<span @click="sizeGuide()"><i class="iconfont icon-chima"></i>Size Guide</span>
						</div>
						<div class="add-to-cart">
							<el-button type="primary" @click="addToBag">ADD TO CART</el-button>
							<div class="wish">
								<i class="iconfont icon-like" v-if="devwishlist.indexOf(goodsInfo.productNo) > -1" @click="collectProduct(goodsInfo, 1)"></i>
								<i class="iconfont icon-xihuan1" v-else @click="collectProduct(goodsInfo, 0)"></i>
							</div>
						</div>
						<div class="shopping-info">
							<div class="shopping-title">Shipping Info</div>
							<div class="shopping-list" @click="shippingInformation()">
								<i class="iconfont icon-yushu1"></i><span>Shipping Information</span><i class="iconfont icon-wenhao"></i>
								<p>Free Shipping Orders Over $59</p>
							</div>
							<div class="shopping-list" @click="returnPolicy()">
								<i class="iconfont icon-fuwu"></i><span>Return & Exchanges</span><i class="iconfont icon-wenhao"></i>
								<p>45-Days Free Return</p>
							</div>
						</div>
						<div class="product-description" v-if="modelsList.length">
							<div class="description">Size & Fit</div>
							<div class="models-block">
								<div class="models-list" v-for="(item, index) in modelsList" :key="index">
									<div class="models-author"><img :src="$utils.imageHandler(16, item.modelPic)" /></div>
									<div class="models-item">
										<div class="models-title">
											<span class="bold">Model Wear:</span>
											<span>{{ item.modelSize || '' }}</span>
										</div>
										<div class="models-item-list">
											<p class="models-item-list-item">
												<span class="bold">Height:</span>
												<span>{{ item[`height`] }}</span>
											</p>
											<p class="models-item-list-item">
												<span class="bold">Bust:</span>
												<span>{{ item[`bust`] }}</span>
											</p>
											<p class="models-item-list-item">
												<span class="bold">Waist:</span>
												<span>{{ item[`waist`] }}</span>
											</p>
											<p class="models-item-list-item">
												<span class="bold">Hips:</span>
												<span>{{ item[`hips`] }}</span>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="product-description">
							<div class="description">Product Measurements</div>
							<div class="size-guide-head">
								<span>Switch to</span>
								<el-radio-group v-model="radioValue" size="mini">
									<el-radio-button label="CM">CM</el-radio-button>
									<el-radio-button label="IN">IN</el-radio-button>
								</el-radio-group>
							</div>
							<el-table size="medium" class="size-guide-table" :data="sizeGuideList[radioValue].datas" border>
								<template slot="empty"> No data </template>
								<el-table-column :class="index == 0 ? 'bgc-gery' : ''" v-for="(item, index) in sizeGuideList[radioValue].xTitle" :key="index" :label="item" :fixed="index == 0 ? 'left' : false" align="center" min-width="100">
									<template slot-scope="scope">
										<div :class="'cell-' + index">{{ scope.row[index] || '/' }}</div>
									</template>
								</el-table-column>
							</el-table>
							<div class="manually" v-if="radioValue == 'CM'">*This data was obtained from manually measuring the product; it may be off by 1-2 CM.</div>
							<div class="manually" v-else-if="radioValue == 'IN'">*This data was obtained from manually measuring the product; it may be off by half an inch.</div>
						</div>
						<div class="product-description" v-if="goodsInfo.productDesc || goodsInfo.additionalAttrList.length">
							<div class="description">Description</div>
							<div class="description-block" v-if="goodsInfo.productDesc">
								<div v-html="goodsInfo.productDesc"></div>
							</div>
							<div class="description-block" v-if="goodsInfo.additionalAttrList">
								<el-row v-for="(item, index) in goodsInfo.additionalAttrList" :key="index" :gutter="20">
									<el-col :span="8" class="description-key">{{ item.key }}</el-col>
									<el-col :span="16">{{ item.val }}</el-col>
								</el-row>
							</div>
						</div>
					</div>
				</div>
				<!--商品详情图-->
				<div class="product-ad">
					<el-image class="product-big-img" v-for="(item, index) in goodsInfo.tipPicKey" :key="index" :src="$utils.imageHandler(3, item)" fit="cover"></el-image>
				</div>
				<!--评论-->
				<div class="customer-reviews" v-if="goodsEvaluate.evaluateNums">
					<div class="customer-title">Reviews({{ goodsEvaluate.evaluateNums || 0 }})</div>
					<!--评分-->
					<el-row class="customer-rate" type="flex">
						<el-col :span="12">
							<div class="customer-category">Average Rating</div>
							<div><el-rate v-model="goodsEvaluate.evaluateStartPercentage" disabled show-score text-color="#FFBF00"></el-rate></div>
						</el-col>
						<el-col :span="12">
							<div class="customer-well">Did the item fit well?</div>
							<el-row class="customer-progress" type="flex">
								<el-col :span="4">Small</el-col>
								<el-col :span="10"><el-progress :percentage="goodsEvaluate.smallPercentage" :stroke-width="8"></el-progress></el-col>
							</el-row>
							<el-row class="customer-progress" type="flex">
								<el-col :span="4">True to size</el-col>
								<el-col :span="10"><el-progress :percentage="goodsEvaluate.tureToSizePercentage" :stroke-width="8"></el-progress></el-col>
							</el-row>
							<el-row class="customer-progress" type="flex">
								<el-col :span="4">Large</el-col>
								<el-col :span="10"><el-progress :percentage="goodsEvaluate.largePercentage" :stroke-width="8"></el-progress></el-col>
							</el-row>
						</el-col>
					</el-row>
					<!--评论列表-->
					<el-tabs class="customer-tab">
						<el-tab-pane>
							<div class="customer-list" v-for="(item, index) in reviewsList" :key="index">
								<div class="customer-content">
									<div class="customer-left">
										<div class="customer-author">
											<span>{{ item.userEmail }}</span>
											<div><el-rate v-model="item.evaluateStart" disabled text-color="#FFBF00"></el-rate></div>
											<span v-for="i in 4" :key="i" v-show="item['attr' + i]">{{ item['attr' + i] }}:{{ item['attrVal' + i] }}</span>
										</div>
										<div class="customer-text">{{ item.evaluateContent }}</div>
										<div class="customer-time">{{ moment(item.evaluateTime).format('l') }}</div>
									</div>
									<div class="customer-img">
										<el-image v-if="item.evaluatePicsOnekey" :src="$utils.imageHandler(0, item.evaluatePicsOnekey)" fit="cover" :preview-src-list="[$utils.imageHandler(3, item.evaluatePicsOnekey)]"></el-image>
										<el-image v-if="item.evaluatePicsTwokey" :src="$utils.imageHandler(0, item.evaluatePicsTwokey)" fit="cover" :preview-src-list="[$utils.imageHandler(3, item.evaluatePicsTwokey)]"></el-image>
										<el-image v-if="item.evaluatePicsThreekey" :src="$utils.imageHandler(0, item.evaluatePicsThreekey)" fit="cover" :preview-src-list="[$utils.imageHandler(3, item.evaluatePicsThreekey)]"></el-image>
									</div>
								</div>
							</div>
						</el-tab-pane>
					</el-tabs>
					<div class="page-block">
						<el-pagination layout="prev, pager, next" :page-size="reviewsPageSize" :total="reviewsTotal" :current-page="reviewsPageNum" @current-change="reviewsCurrentChange"></el-pagination>
					</div>
				</div>
				<div class="customer-reviews" v-else>
					<div class="customer-title">Reviews(0)</div>
				</div>
				<img class="product-reviews-img" src="@/assets/images-pc/home4.png" @click="$router.push({ path: '/home' })" />
			</template>
			<template v-else>
				<div class="no-goods">
					<img src="@/assets/images-pc/goods_invalid2x.png" />
					<div>The item has expired and does not exist</div>
				</div>
			</template>

			<!--猜你喜欢-->
			<div class="you-like">
				<div class="you-like-title">You Might Also Like</div>
				<el-row :gutter="20">
					<div class="el-col-5" v-for="(item, index) in youLikeList" :key="index">
						<div class="product-list" @click="goodsDetail(item)">
							<template>
								<div v-if="item.isFlashSale && item.isNew && item.discountRate == 0"></div>
								<div class="discount-rate" v-else-if="item.isFlashSale">-{{ Math.floor(item.discountRate * 100) }}%</div>
								<div class="product-sign" v-else-if="item.isNew">New</div>
							</template>
							<!--收藏-->
							<!-- <i class="iconfont icon-like" v-if="devwishlist.indexOf(item.productNo) > -1" @click.stop="collectProduct(item, 1)"></i>
                            <i class="iconfont icon-xihuan1" v-else @click.stop="collectProduct(item, 0)"></i> -->
							<el-image class="product-img" :src="$utils.imageHandler(14, item.picKey)" fit="cover">
								<div slot="placeholder" class="image-slot">
									<img src="@/assets/images-pc/default.png" />
								</div>
								<div slot="error" class="image-slot">
									<img src="@/assets/images-pc/default.png" />
								</div>
							</el-image>
							<div class="product-name">{{ item.productName || item.name }}</div>
							<div class="product-money" v-if="item.discountPrice == item.price || item.discountPrice == 0">US${{ item.discountPrice == 0 ? (item.price / 100).toFixed(2) : (item.discountPrice / 100).toFixed(2) }}</div>
							<div class="product-money text-red" v-else>
								US${{ (item.discountPrice / 100).toFixed(2) }}<span>US${{ (item.price / 100).toFixed(2) }}</span>
							</div>
						</div>
					</div>
				</el-row>
				<div class="view-more" v-if="youLikePageNum < youLikeTotal">
					<el-button type="primary" @click="getMoreYouLike()">View More</el-button>
				</div>
			</div>
		</div>

		<!--返回顶部-->
		<el-backtop>
			<div class="scroll-top">
				<i class="el-icon-arrow-up"></i>
			</div>
		</el-backtop>

		<!--侧边浮窗-->
		<slide-coupon v-if="!hideSlideCoupon"></slide-coupon>

		<!--商品尺码弹框-->
		<size-guide :writeSizeGuide="showSizeGuide"></size-guide>

		<!--物流信息弹框-->
		<shipping-information :writeShippingInformation="showShippingInformation"></shipping-information>

		<!--退货政策弹框-->
		<return-policy :writeReturnPolicy="showReturnPolicy"></return-policy>

		<!--编辑商品属性弹窗-->
		<div class="edit-car edit-car-attributes" v-if="isEditAttr">
			<edit-attr @closeEdit="closeEdi" :goodsInfo="addGoodsInfo" :skuNo="skuNo" :addType="addChange" :newAdd="newAddShopcar"></edit-attr>
		</div>
	</div>
</template>

<script>
// import { Toast} from 'vant'
import store from 'store'
import homeTag from '@/components/homeTag.vue'
import SlideCoupon from '@/components/SlideCoupon.vue'
import shopcar from '@/mixins/shopCar.js'
import editAttr from '@/views/shopping_car/component/editCarAttributes'
import http from '@/api/index.js'
import { mapActions, mapGetters, mapState } from 'vuex'
import sizeGuide from './component/SizeGuide.vue'
import shippingInformation from './component/shippingInformation.vue'
import returnPolicy from './component/returnPolicy.vue'

export default {
	name: 'product',
	mixins: [shopcar],
	data() {
		return {
			productNo: '', // 商品id
			activeImgIndex: 0, // 滚动图选中下标
			smallImgSwiper: '',
			bigImgSwiper: '',
			isLike: 0, // 是否已加入心愿
			goodsImgList: [], // 商品滚动图
			radioValue: 'IN',
			sizeGuideList: { CM: { datas: [] }, IN: { datas: [] } }, // 商品尺码
			activeNames: [0, 1],
			goodsEvaluate: {}, // 商品评估
			reviewsList: [], // 评论列表
			reviewsPageNum: 1, // 页码
			reviewsPageSize: 5, // 每页条数
			reviewsTotal: 0, // 总条数
			youLikeList: [], // You Like
			youLikeListAll: [], // You Like所有数据
			youLikePageNum: 1, // You Like当前页码
			youLikeTotal: 0, // You Like总页码
			goodsInfo: {
				tagsMap: [],
				price: 0,
				discountPrice: 0,
				productModels: [],
				additionalAttrList: [],
			}, // 商品信息
			isInvalid: false, // 无效商品
			showSizeGuide: { show: false, productNo: '', modal: true }, // 商品尺码弹框（父传子）
			showShippingInformation: { show: false }, // 物流信息弹框（父传子）
			showReturnPolicy: { show: false }, // 退货政策弹框（父传子）

			// 商品列表加购
			skuNo: '', //点击时获取sku
			isEditAttr: false,
			addGoodsInfo: {},
			addChange: 'addChange',
			newAddShopcar: 'new',
		}
	},
	components: {
		homeTag,
		SlideCoupon,
		editAttr,
		sizeGuide,
		shippingInformation,
		returnPolicy,
	},
	mounted() {
		// 广播更新头部分类
		this.$root.Bus.$emit('shopClass')

		// 获取参数
		this.getParameter()
	},
	computed: {
		...mapState({
			wishList: (state) => state.wish.wishList,
			devwishlist: (state) => state.wish.devwishlist,
			carList: (state) => state.shopCar.carList,
			slideCouponHide: (state) => state.user.slideCouponHide,
		}),
		...mapGetters('shopCar', {
			totalNum: 'totalNum',
		}),
		...mapGetters(['shopsId', 'token']),
		hideSlideCoupon() {
			return this.token || !this.$route.meta.showSlideCoupon || this.slideCouponHide
		},
		modelsList() {
			const { list = [], productModels = [] } = this.goodsInfo
			const activeAttr = list
				.map((item) => item.attrValList)
				.flat()
				.filter((item) => item.isDefault)
				.map((item) => item.val)
			return productModels
				.map((modes) => ({
					...modes,
					waist: `${(modes.bustCm / 2.54).toFixed() + '"'}/${Number(modes.bustCm).toFixed()}cm`,
					hips: `${(modes.hipsCm / 2.54).toFixed() + '"'}/${Number(modes.hipsCm).toFixed()}cm`,
					height: `${(modes.heightCm / 100 / 0.3048).toFixed(1).replace('.', "'") + '"'}/${Number(modes.heightCm).toFixed()}cm`,
					bust: `${(modes.bustCm / 2.54).toFixed() + '"'}/${Number(modes.bustCm).toFixed()}cm`,
					// waistCM: item.waistCm + 'CM',
					// waistIN: (item.waistCm / 2.54).toFixed(2) + 'IN',
					// hipsCM: item.hipsCm + 'CM',
					// hipsIN: (item.hipsCm / 2.54).toFixed(2) + 'IN',
					// heightCM: item.heightCm + 'CM',
					// heightIN: (item.heightCm / 2.54).toFixed(2) + 'IN',
					// bustCM: item.bustCm + 'CM',
					// bustIN: (item.bustCm / 2.54).toFixed(2) + 'IN',
				}))
				.filter((item) => activeAttr.includes(item.attrValName))
		},
	},
	methods: {
		...mapActions('wish', ['addWishList', 'isUserCollect', 'deleteWishList', 'devAddWishList', 'addBatchWishList']),
		...mapActions({
			addItem: 'shopCar/addItem',
		}),

		// 获取参数
		getParameter: function () {
			var params = this.$route.params.productNo
			var lastIndex = params.lastIndexOf('-')
			this.productNo = params.substring(lastIndex + 1, params.length)

			// 获取商品详情
			this.getGoodsDatail()

			// 获取当前是否加入心愿
			// this.getWishStatus()

			// 获取商品尺码
			this.getGoodsSize()

			// 获取商品评估
			this.getGoodsEvaluate()

			// 获取评论列表
			this.getReviewsList()

			// 获取You Like数据
			this.getYouLike()
		},

		// 获取商品详情
		getGoodsDatail: function () {
			http.goodsDetail
				.detail({
					productNo: this.productNo,
				})
				.then((res) => {
					var list = res.data.list // 属性组
					this.isInvalid = false

					// 获取第一组选中的属性图片（带图片）
					for (const i in list) {
						list[i].sizeList = [] // 选中尺寸属性当前显示的尺寸信息
						if (list[i].isValHavePics) {
							for (const j in list[i].attrValList) {
								if (list[i].attrValList[j].isDefault) {
									for (const m in list[i].attrValList[j].picList) {
										this.goodsImgList.push(this.$utils.imageHandler(3, list[i].attrValList[j].picList[m]))
									}
								}
							}
						}
					}

					// 处理附加信息，前端需要合并这种原数据确实很low
					if (res.data.additionalAttrList) {
						var attrList = res.data.additionalAttrList
						var tb = []
						var narr = []
						for (let i = 0; i < attrList.length; i++) {
							var n = tb.indexOf(attrList[i].key)
							if (n == -1) {
								tb.push(attrList[i].key)
								narr.push({
									key: attrList[i].key,
									val: attrList[i].val,
								})
							} else {
								narr[n].val += ',' + attrList[i].val
							}
						}
						res.data.additionalAttrList = narr
					}

					// //////////////////////////////////////新修改详情页面接口
					let data = res.data,
						attrValObj = {}
					data.list.forEach((item, i) => {
						data['attr' + (i + 1)] = item.attrName
						attrValObj['attrVal' + (i + 1)] = ''
						item.attrValList.forEach((obj) => {
							if (obj.isDefault) {
								attrValObj['attrVal' + (i + 1)] = obj.val
								// 取默认轮播图
								if (item.isValHavePics) {
									data.swipeList = obj.picList
								}
							}
							// 然后 绑定轮播图的属性 默认选中,其它默认不选中:
							if (!item.isValHavePics) {
								obj.isDefault = false
							}
						})
					})
					this.calculationInventory(data) // 对数据进行处理
					let info = {}
					data.skus.forEach((item) => {
						let bool = this.dealObj(attrValObj, item)
						if (bool) info = item
					})
					data.attrObj = attrValObj
					data.skuNo = info.skuNo
					this.goodsInfo = data
					// ---------------------------------
					this.$nextTick(() => {
						this.initDetailSku() // 初始化商品详情滚动图
					})
					// 数据上报-浏览的的商品
					this.reportGtag('view_item', this.reportData('GA4'), 'GA4') // 新版
					this.reportGtag('view_item', this.reportData('UA')) // 老版
					this.reportFB('ViewContent', this.reportData('fb'))
				})
				.catch((err) => {
					this.isInvalid = err.code == '20060102'
				})
		},

		// 获取当前是否加入心愿
		getWishStatus: function () {
			if (!this.token) return
			this.isUserCollect({ productNo: this.productNo }).then((res) => {
				if (res.code === 0) {
					let { data } = res
					this.isLike = data || 0
				}
			})
		},

		// 获取商品尺码
		getGoodsSize: function () {
			http.goodsDetail
				.size({
					productNo: this.productNo,
				})
				.then((res) => {
					this.sizeGuideList['CM'] = JSON.parse(res.data.sizeCm)
					this.sizeGuideList['IN'] = JSON.parse(res.data.sizcInch)
				})
		},

		// 获取商品评估
		getGoodsEvaluate: function () {
			http.review
				.evaluateStatistics({
					productNo: this.productNo,
				})
				.then((res) => {
					this.goodsEvaluate = res.data
				})
		},

		// 获取评论列表
		getReviewsList: function () {
			http.review
				.evaluateList({
					productNo: this.productNo,
					pageNum: this.reviewsPageNum,
					pageSize: this.reviewsPageSize,
				})
				.then((res) => {
					var list = res.data.list
					for (const i in list) {
						var user = list[i].userEmail.substring(0, list[i].userEmail.indexOf('@'))
						list[i].userEmail = user.substr(0, 1) + '***' + user.substr(-1)
					}
					this.reviewsList = res.data.list
					this.reviewsTotal = res.data.total
				})
		},

		// 评论列表分页
		reviewsCurrentChange: function (e) {
			this.reviewsPageNum = e
			// 获取评论列表
			this.getReviewsList()
		},

		// 获取You Like数据
		getYouLike: function () {
			http.home
				.recommend({
					// noInProductNo: this.productNo,
					type: 3,
					pageNum: 1,
					pageSize: 100,
				})
				.then((res) => {
					var list = res.data
					for (const i in list) {
						list[i].isFlashSale = list[i].tagsMap.indexOf('flash_sale') > -1
						list[i].isNew = list[i].tagsMap.indexOf('new_in') > -1
					}
					this.youLikeListAll = list
					this.youLikeList = list.slice(0, 20)
					this.youLikeTotal = Math.ceil(list.length / 20)
				})
		},

		// 获取更多You Like数据
		getMoreYouLike: function () {
			var list = this.youLikeListAll
			this.youLikePageNum++
			this.youLikeList = this.youLikeList.concat(list.slice((this.youLikePageNum - 1) * 20, this.youLikePageNum * 20))
		},

		// 选择小图进行大图展示
		selectImg: function (e, index) {
			this.activeImgIndex = index
			this.bigImgSwiper.slideTo(index)
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
		// 选择属性
		selectAttribute: function (e, index, indexs) {
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
					imgList.push(this.$utils.imageHandler(3, this.goodsInfo.list[index].attrValList[indexs].picList[i]))
				}
				this.goodsImgList = imgList
				this.goodsInfo.defaultPicKey = this.goodsInfo.list[index].attrValList[indexs].picList[0]
				this.activeImgIndex = 0
				setTimeout(() => {
					this.smallImgSwiper.slideTo(0)
					this.bigImgSwiper.slideTo(0)
				})
			}
			// 显示选中的尺寸信息
			this.showAttributeSize(e, index, indexs)

			let isAll = true,
				attrValObj = {} // 属性:属性值, 已选中的组合eg: {'尺码': 'M码', '颜色': 'red'}
			for (let i = 0; i < this.goodsInfo.list.length; i++) {
				let item = this.goodsInfo.list[i]
				attrValObj['attrVal' + (i + 1)] = ''
				isAll = item.attrValList.some((obj) => {
					if (obj.isDefault) attrValObj['attrVal' + (i + 1)] = obj.val
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
			// 重新赋值计算的价格sku等等信息（属性没有选全，价格显示就是默认商品价格）
			this.goodsInfo.attrObj = info.attrValObj
			this.goodsInfo.skuNo = info.skuNo
			this.goodsInfo.discountPrice = info.discountPrice || this.goodsInfo.discountPrice
			this.goodsInfo.discountRate = info.discountRate
			this.goodsInfo.price = info.price || this.goodsInfo.price
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
		// 商品尺码弹框
		sizeGuide: function () {
			this.showSizeGuide = { show: true, productNo: this.goodsInfo.productNo }
		},

		// 物流信息弹框
		shippingInformation: function () {
			this.showShippingInformation = { show: true }
		},

		// 退货政策弹框
		returnPolicy: function () {
			this.showReturnPolicy = { show: true }
		},

		// 初始化商品详情滚动图
		initDetailSku: function () {
			// 滚动小图
			this.smallImgSwiper = new Swiper('.swiper-detail-small', {
				direction: 'vertical',
				loop: false, // 循环
				autoplay: false, // 禁止自动滑动
				prevButton: '.swiper-detail-small .small-icon-fanhui2',
				nextButton: '.swiper-detail-small .small-icon-fanhui',
				slidesPerView: 'auto',
				observer: true,
				observeParents: true,
				onSlideChangeStart: (swiper) => {},
			})
			// 滚动大图
			this.bigImgSwiper = new Swiper('.swiper-detail-big', {
				loop: false, // 循环
				autoplay: false, // 禁止自动滑动
				prevButton: '.swiper-detail-big .icon-fanhui2',
				nextButton: '.swiper-detail-big .icon-fanhui',
				observer: true,
				observeParents: true,
				onSlideChangeStart: (swiper) => {
					this.activeImgIndex = swiper.activeIndex
					this.smallImgSwiper.slideTo(swiper.activeIndex)
				},
			})
		},

		// 商品详情
		goodsDetail: function (e) {
			this.$router.push({
				path: this.formatUrl(`/product/`, `${e.productName || e.name}-${e.productNo}`),
			})
		},

		// 添加到购物车：
		addToBag() {
			// 判断属性是否都选中
			var list = this.goodsInfo.list
			var list_ = []
			for (const i in list) {
				var flag = list[i].attrValList.some((e) => {
					return e.isDefault == true
				})
				list_.push(flag)
			}
			if (list_.indexOf(false) > -1) {
				// Toast({ message: 'Please Select Your Preference' })
				this.$message.warning('Please Select Your Preference')
				return
			}

			if (!this.goodsInfo.skuNo) return
			const obj = this.carList.find((item) => item.skuNo == this.goodsInfo.skuNo)
			if (obj && obj.num == 99) {
				this.$message.error('Add failed, shopping bag has reached the limit')
				return
			}
			this.addItem(this.goodsInfo)
				.then(() => {
					this.$message.success('Added successfully')
					this.$store.commit('user/shopCarStatus', true)
					setTimeout(() => {
						this.$store.commit('user/shopCarStatus', false)
					}, 2000)
				})
				.catch((error) => {
					this.$message.error(error.msg)
				})
			// 数据上报：
			this.reportGtag('add_to_cart', this.reportData('GA4'), 'GA4') // 新版
			this.reportGtag('add_to_cart', this.reportData('UA'))
			this.reportFB('AddToCart', this.reportData('fb'))
		},

		// 喜欢/取消喜欢
		shouCang: function () {
			if (this.token) {
				let funName = this.isLike ? 'deleteWishList' : 'addWishList'
				this[funName]({ productNo: this.productNo }).then((res) => {
					if (res.code === 0) {
						this.isLike = this.isLike ? 0 : 1
					}
				})
				if (!this.isLike) {
					// 数据上报：
					this.reportGtag('add_to_wishlist', this.reportData('UA'))
					this.reportGtag('add_to_wishlist', this.reportData('GA4'), 'GA4')
					this.reportFB('AddToWishlist', this.reportData('fb'))
				}
			} else {
				this.$store.commit('user/backPath', this.$route.fullPath)
				this.$store.commit('user/loginDialogIs', true)
			}
		},

		// 收藏
		collectProduct: function (item, type) {
			if (this.token) {
				let funName = type == 1 ? 'deleteWishList' : 'addWishList'
				this[funName]({ productNo: item.productNo }).then((res) => {
					if (res.code === 0) {
						this.reportGtag('add_to_wishlist', this.reportData())
						this.reportFB('AddToWishlist', this.reportData('fb'))
						this.devAddWishList({
							productNo: item.productNo,
							type: type,
						})
						// Toast({
						//     duration: 3000,
						//     message: (type == 1) ? 'Cancel success!'  : 'Add success!',
						//     icon: ' iconfont iconsuccess_no_circle',
						// });
						this.$message.success(type == 1 ? 'Cancel success!' : 'Add success!')
					}
				})
			} else {
				let params = {
					productNo: item.productNo,
					type: type,
				}
				this.devAddWishList(params)
			}
		},

		// 打开商品属性选择加购
		openEditAttr: function (item) {
			const that = this
			const params = {
				productNo: item.productNo,
			}
			that.skuNo = item.skuNo
			// that.addGoodsInfo = item
			http.goodsDetail.detail(params).then((res) => {
				res.data.attrObj = item.attrObj || {} // 当前选中的 属性-属性值
				// res.data.skuNo = item.skuNo
				// res.data.price = item.price
				res.data.discountPrice = item.discountPrice
				// that.addGoodsInfo.num = item.num //现有的购物车数量
				that.addGoodsInfo = res.data
				// this.calculationInventory(that.addGoodsInfo) // 对属性进行 禁用项处理.
				that.isEditAttr = true
			})
		},

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
				const { productNo } = this.goodsInfo
				items[0].id = productNo
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
				})
			})
		},
	},
	watch: {
		$route(to, from) {
			this.$router.go(0)
		},
	},
	created() {},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';

/*商品信息*/
.product-info {
	display: flex;
	margin: 50px auto;
	margin-top: 20px;
	max-width: 1200px;
}

.product-left {
	text-align: center;
	max-width: 85px;
	width: 17%;
	height: 900px;
}

.swiper-detail-small {
	position: relative;
	width: 100%;
	height: 100%;
	padding: 30px 0;
}

.swiper-detail-small .small-icon {
	position: absolute;
	left: 5px;
	font-size: 20px;
	color: #222222;
	text-align: center;
	width: 75px;
	height: 25px;
	line-height: 25px;
	background-color: #f5f5f5;
	cursor: pointer;
	z-index: 1;
}

.swiper-detail-small .small-icon:hover i {
	color: #999999;
}

.swiper-detail-small .small-icon-fanhui2 {
	top: 0;
}

.swiper-detail-small .small-icon-fanhui {
	bottom: 0;
}

.swiper-detail-small .swiper-slide {
	height: initial;
}

.product-small-img {
	width: 75px;
	height: 113px;
	border: 1px solid #ffffff;
	border-radius: 2px;
	cursor: pointer;
}

.active-img {
	border: 1px solid #222222;
}

.product-center {
	max-width: 600px;
	width: 50%;
	height: 900px;
	background-color: #f9f9f9;
	overflow: auto;
}

.swiper-detail-big {
	position: relative;
	width: 100%;
	height: 100%;
}

.swiper-detail-big i {
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
}

.swiper-detail-big i:hover {
	color: #999999;
}

.swiper-detail-big .icon-fanhui2 {
	left: 30px;
}

.swiper-detail-big .icon-fanhui {
	right: 30px;
}

.product-big-img {
	width: 100%;
	height: 100%;
}

.product-reviews-img {
	width: 100%;
	max-width: 1200px;
	height: 100%;
	margin: auto;
	display: block;
	cursor: pointer;
}

.product-right {
	width: 50%;
	padding-left: 40px;
	max-width: 515px;
}

// .product-right > div {
// 	height: 100%;
// 	padding-left: 40px;
// }

.product-title {
	font-size: 18px;
	font-family: Montserrat Light;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	word-break: break-all;
}

.detail-sign {
	color: #ffffff;
	padding: 4px 8px;
	margin-right: 5px;
	background-color: #87c6a1;
	display: inline-block;
}

.detail-rate {
	padding: 4px 8px;
	margin-right: 5px;
	background-color: #ffb84e;
	display: inline-block;
}

.product-rate {
	font-size: 13px;
	font-family: Montserrat Light;
	color: #666666;
	margin-top: 15px;
	display: flex;
	align-items: center;
}

.product-rate .el-rate {
	height: initial;
	margin-right: 5px;
	display: inline-block;
}

.text-gray {
	color: #bbb;
}

.product-price {
	font-size: 24px;
	font-family: Montserrat Medium;
	margin-top: 15px;
}

.text-red {
	color: #e81027;
}

.product-price span {
	font-size: 16px;
	font-family: Montserrat Light;
	color: #999999;
	text-decoration: line-through;
	margin-left: 10px;
}

.attribute-list {
	margin-bottom: 20px;
}

.attribute-title {
	font-size: 16px;
	font-family: Montserrat Regular;
	margin-bottom: 15px;
}

.attribute-title span {
	font-size: 14px;
	font-family: Montserrat Light;
	color: #666;
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

.attribute-size {
	font-size: 14px;
	font-family: Montserrat Light;
	line-height: 1.5;
	padding: 10px;
	background-color: #f6f6f6;
}

.attribute-size span {
	margin-right: 8px;
	display: inline-block;
}

.attribute-size font {
	color: #666;
}

.active-attribute {
	font-family: Montserrat Regular;
	border: 1px solid #222222;
}

.size-guide {
	color: #5689c6;
}

.size-guide span {
	font-size: 14px;
	font-family: Montserrat Light;
	width: max-content;
	display: flex;
	align-items: center;
	cursor: pointer;
}

.size-guide i {
	font-size: 32px;
	margin-top: 2px;
	margin-right: 3px;
}

.add-to-cart {
	margin-top: 20px;
	display: flex;
}

.add-to-cart .el-button {
	font-size: 18px;
	font-family: Montserrat Regular;
	flex: 1;
	max-width: 400px;
	height: 54px;
}

.wish {
	text-align: center;
	width: 54px;
	height: 54px;
	line-height: 54px;
	margin-left: 15px;
	border: 1px solid #d1d1d1;
	border-radius: 50%;
	vertical-align: top;
	display: inline-block;
	cursor: pointer;
}

.wish i {
	font-size: 26px;
}

.shopping-info {
	margin-top: 30px;
}

.shopping-title {
	font-size: 18px;
	font-family: Montserrat Regular;
	margin-bottom: 10px;
}

.shopping-list {
	margin-top: 20px;
	cursor: pointer;
}

.shopping-list span {
	font-size: 16px;
	font-family: Montserrat Regular;
}

.icon-yushu1,
.icon-fuwu {
	font-size: 26px;
	margin-right: 10px;
	vertical-align: middle;
}

.icon-wenhao {
	font-size: 14px;
	vertical-align: top;
}

.shopping-info p {
	font-size: 14px;
	font-family: Montserrat Light;
	color: #666666;
	margin-left: 35px;
}

.size-guide-table {
	margin-top: 10px;
}

.manually {
	font-size: 14px;
	font-family: Montserrat Light;
	color: #999999;
	margin-top: 10px;
}

.product-description {
	margin-top: 30px;
	word-break: break-all;
}

.size-guide-head {
	font-size: 16px;
	font-family: Montserrat Light;
	margin-top: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.description {
	font-size: 18px;
	font-family: Montserrat Regular;
}

.description-block {
	font-family: Montserrat Light;
	margin-top: 20px;
}

.description-block .el-row {
	margin-bottom: 10px;
}

.description-key {
	color: #999;
}

.models-block {
	margin-top: 20px;
}

.models-list {
	align-items: center;
	display: flex;
	margin-bottom: 20px;
}
.models-item-list {
	display: flex;
	flex-wrap: wrap;
	max-width: 270px;
	margin-top: 3px;
}
.models-item-list-item {
	margin: 3px 15px 3px 0;
	font-size: 14px;
	line-height: 22px;
	font-family: Montserrat Light;
	color: #666666;
	.bold {
		color: #222;
	}
}

.models-author {
	margin-right: 20px;
}

.models-author img {
	width: 50px;
	height: 50px;
	border-radius: 50px;
}

.no-goods {
	margin: 100px 0;
}

.no-goods img {
	width: 120px;
	margin: auto;
	display: block;
}

.no-goods div {
	font-size: 12px;
	font-family: Montserrat Regular;
	color: #999999;
	text-align: center;
	margin-top: 20px;
}

.product-ad {
	max-width: 1200px;
	margin: auto;
}

/*商品详情图*/
.customer-reviews {
	max-width: 1200px;
	margin: 50px auto;
}

/*评论*/
.customer-title {
	font-size: 24px;
	font-family: Montserrat Regular;
	margin-bottom: 20px;
}

.customer-rate {
	padding: 30px;
	background-color: #f7f8fa;
}

.customer-category {
	font-size: 16px;
	font-family: Montserrat Regular;
	margin-bottom: 20px;
}

.customer-well {
	font-size: 16px;
	font-family: Montserrat Light;
	margin-bottom: 20px;
}

.customer-progress {
	font-size: 14px;
	font-family: Montserrat Light;
	margin-top: 10px;
}

.customer-list {
	padding: 30px 0;
	border-bottom: 1px solid #f5f5f5;
}

.customer-author {
	align-items: center;
	display: flex;
}

.customer-author span:nth-child(1) {
	font-size: 14px;
	font-family: Montserrat Regular;
	color: #222222;
}

.customer-author > div {
	margin: 0 20px;
}

.customer-author span {
	font-size: 12px;
	font-family: Montserrat Semi Bold;
	color: #767676;
	margin-right: 5px;
}

.customer-content {
	display: flex;
}

.customer-left {
	flex: 1;
}

.customer-text {
	font-size: 15px;
	font-family: Montserrat Light;
	line-height: 1.5;
	word-break: break-all;
	margin-top: 20px;
}

.customer-img {
	width: 480px;
	padding-left: 120px;
}

.customer-time {
	font-size: 12px;
	font-family: Montserrat Light;
	color: #767676;
	margin-top: 20px;
}

.customer-img .el-image {
	width: 108px;
	height: 108px;
	margin-left: 10px;
	margin-bottom: 10px;
	cursor: pointer;
}

/*猜你喜欢*/
.you-like {
	max-width: 1200px;
	margin: 50px auto 70px auto;
	overflow: hidden;
}

.you-like-title {
	font-size: 24px;
	font-family: Montserrat Regular;
	margin-bottom: 30px;
}

.el-col-5 {
	width: 20%;
	padding-left: 10px;
	padding-right: 10px;
}

.product-list {
	position: relative;
	cursor: pointer;
}

.product-name {
	font-size: 18px;
	font-family: Montserrat Light;
	color: #666;
	height: 22px;
	margin: 10px 0;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	word-break: break-all;
}

.discount-rate {
	position: absolute;
	top: 0;
	left: 0;
	font-size: 18px;
	padding: 4px 8px;
	background-color: #ffb84e;
	z-index: 1;
}

.product-sign {
	position: absolute;
	top: 0;
	left: 0;
	font-size: 18px;
	color: #ffffff;
	padding: 4px 8px;
	background-color: #87c6a1;
	z-index: 1;
}

.product-list .icon-xihuan1,
.product-list .icon-like {
	position: absolute;
	font-size: 24px;
	right: 12px;
	top: 12px;
	z-index: 1;
}

.product-img {
	width: 100%;
	display: block;
}

.product-money {
	font-size: 16px;
	font-family: Montserrat Regular;
	margin-bottom: 40px;
}

.text-red {
	color: #e84646;
}

.product-money span {
	font-size: 12px;
	font-family: Montserrat Light;
	color: #999999;
	text-decoration: line-through;
	margin-left: 10px;
}

.product-money .icongouwuche2 {
	font-size: 24px;
	color: #222;
	float: right;
	margin-top: -6px;
}

.view-more {
	text-align: center;
	margin: 20px 0 100px;
}

.view-more .el-button {
	font-size: 18px;
	font-family: Montserrat Regular;
	width: 175px;
}

/*编辑商品弹窗*/
.edit-car {
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 10;
}
</style>
