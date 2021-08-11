<template>
	<div class="product-list">
		<!--提示三栏-->
		<home-tag></home-tag>
		<!--商品列表-->
		<div class="class-block">
			<img class="customize-img" v-if="listPicKey" :src="$utils.imageHandler(3, listPicKey)" />
			<div class="class-title">
				<span class="class-tag">{{ title }}</span>
				<span class="sort-by" v-if="topicId == 'search'"
					>Sort By
					<el-select v-model="sortValue" size="small" placeholder="sort" @change="sortValueFunc()">
						<el-option v-for="(item, index) in sortList" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</span>
			</div>
			<blockquote v-if="isGoods">
				<blockquote v-if="goodsAllList.length">
					<el-row :gutter="20">
						<el-col :span="6" v-for="(item, index) in goodsAllList" :key="index">
							<div class="product-detail" @click="goodsDetail(item)">
								<blockquote>
									<div v-if="item.isFlashSale && item.isNew && item.discountRate == 0"></div>
									<div class="discount-rate" v-else-if="item.isFlashSale && item.discountRate > 0">-{{ Math.floor(item.discountRate * 100) }}%</div>
									<div class="product-sign" v-else-if="item.isNew">New</div>
								</blockquote>
								<el-image class="product-img" :src="$utils.imageHandler(14, item.picKey)" fit="cover">
									<div slot="placeholder" class="image-slot">
										<img src="@/assets/images-pc/default.png" />
									</div>
									<div slot="error" class="image-slot">
										<img src="@/assets/images-pc/default.png" />
									</div>
								</el-image>
								<span class="like-bg" @click.stop="collectProduct(item, devwishlist.indexOf(item.productNo) > -1 ? 1 : 0)">
									<i class="iconfont icon-like" v-if="devwishlist.indexOf(item.productNo) > -1"></i>
									<i class="iconfont icon-xihuan1" v-else></i>
								</span>
								<div class="product-title">{{ item.productName || item.name }}</div>
								<div class="product-price" v-if="item.discountPrice == item.price || item.discountPrice == 0">
									US${{ item.discountPrice == 0 ? (item.price / 100).toFixed(2) : (item.discountPrice / 100).toFixed(2)
									}}<!-- <i class="iconfont icongouwuche2" @click.stop="openEditAttr(item)"></i> -->
								</div>
								<div class="product-price text-red" v-else>
									US${{ (item.discountPrice / 100).toFixed(2) }}<span>US${{ (item.price / 100).toFixed(2) }}</span
									><!-- <i class="iconfont icongouwuche2" @click.stop="openEditAttr(item)"></i> -->
								</div>
								<div class="product-rate" v-if="item.evaluateStartPercentage"><el-rate v-model="item.evaluateStartPercentage" disabled :colors="['#FFBF00', '#FFBF00', '#FFBF00']"></el-rate>({{ item.evaluateNums }})</div>
								<div class="product-rate text-gray" v-else>No Reviews</div>
							</div>
						</el-col>
					</el-row>
					<div class="page-block" v-if="goodsTotal > 12">
						<el-pagination layout="prev, pager, next" :page-size="goodsPageSize" :total="goodsTotal" :current-page="goodsPageNum" @current-change="goodsCurrentChange"></el-pagination>
					</div>
				</blockquote>
				<blockquote v-else>
					<div class="no-goods">
						<img src="../../assets/images-pc/noOrders.png" />
						<div v-if="topicId == 'search'">Your search did not match any products</div>
						<div v-else>It is empty here!</div>
					</div>
				</blockquote>
			</blockquote>
		</div>
		<!--返回顶部-->
		<el-backtop>
			<div class="scroll-top">
				<i class="el-icon-arrow-up"></i>
			</div>
		</el-backtop>

		<!-- 编辑商品属性弹窗 -->
		<div class="edit-car edit-car-attributes" v-if="isEditAttr">
			<edit-attr @closeEdit="closeEdi" :goodsInfo="goodsInfo" :skuNo="skuNo" :addType="addChange" :newAdd="newAddShopcar"></edit-attr>
		</div>
	</div>
</template>

<script>
import { Toast } from 'vant'
import homeTag from '@/components/homeTag.vue'
import shopcar from '@/mixins/shopCar.js'
import editAttr from '@/views/shopping_car/component/editCarAttributes'
import http from '@/api/index.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
	mixins: [shopcar],
	name: 'category',
	data() {
		return {
			title: '', // 专题名称（如果是New In和Flash Sale则单独请求）(三级分类名称)
			topicId: '', // 专题id
			sortValue: 0, // 排序值
			sortList: [
				{ label: 'Recommend', value: 0 },
				{ label: 'Price Low to High', value: 1 },
				{ label: 'Price High to Low', value: 2 },
			], // 排序列表
			isGoods: false,
			listPicKey: '', // 专题头部广告图
			goodsAllList: [], // 商品列表
			goodsPageNum: 1, // 页码
			goodsPageSize: 40, // 每页条数
			goodsTotal: 0, // 总条数

			skuNo: '', //点击时获取sku
			isEditAttr: false,
			goodsInfo: {},
			addChange: 'addChange',
			newAddShopcar: 'new',
		}
	},
	components: {
		homeTag,
		editAttr,
	},
	computed: {
		...mapState('wish', ['devwishlist']),
	},
	mounted() {
		// 如从店铺进入需更新头部分类
		this.checkShop()

		// 获取参数
		// （从其他页面进列表页加载，因为第一次进来的情况可能是首页跳转过来的专题，可以是首页搜索进来，也可能是通过带广告链接直接进来）
		// （之后在本页面内部继续跳转专题，或者搜索，就进入watch中的路由监听变化）
		this.getParameter()
	},
	methods: {
		...mapActions('wish', ['devAddWishList', 'addBatchWishList']),

		// 如从店铺进入需更新头部分类
		checkShop: function () {
			// 暂时不加
			// var shopsId = this.$route.query.shopsId
			// var shopName = this.$route.query.shopName
			// if (shopsId && shopName) {
			//     // 广播更新头部分类
			//     this.$root.Bus.$emit('shopClass')
			// }
		},

		// 获取参数
		getParameter: function () {
			var params = this.$route.params.categoryTitle
			if (params.indexOf('-c-') > -1) {
				params = params.replace('-c-', '-')
			}
			var lastIndex = params.lastIndexOf('-')
			this.topicId = params.substring(lastIndex + 1, params.length) // 专题id
			if (this.topicId == 'search') {
				this.title = params.substring(0, lastIndex) // 搜索名称
			} else {
				this.title = params.substring(0, lastIndex).replace(new RegExp(/(-)/g), ' ') // 专题名称
			}

			if (this.title != '' || this.topicId != '') {
				// 判断是否是搜索
				if (this.topicId == 'search') {
					this.searchListData() // 搜索商品列表
				} else {
					this.getQueryByTopic()
					this.getQueryInfo()
				}
			}
		},

		// 请求专题信息
		getQueryInfo() {
			// 请求专题页面信息
			if (this.topicId) {
				let params = {
					id: this.topicId,
				}
				http.home.getTopicConfig(params).then((res) => {
					this.listPicKey = res.data && res.data.listPicPc
				})
			} else {
				this.listPicKey = ''
			}
		},

		// 请求广告列表商品
		getDavertisData(list, total) {
			let params = {
				categoryId: this.$route.query.AdCode, // 如果是广告链接会有这个参数
				pageNum: 1,
				pageSize: 40,
			}
			http.home.getAdvertisingProducts(params).then((res) => {
				let newList = res.data.list
				let skuArray = []
				newList.map((item) => {
					skuArray.push(item.productNo)
				})
				list.map((item) => {
					if (!skuArray.includes(item.productNo)) {
						newList.push(item)
					}
				})
				this.setListData(newList, total)
			})
		},

		// 全部修改为关联专题商品
		getQueryByTopic() {
			// 新增请求专题接口的商品
			let params = {
				pageNum: this.goodsPageNum,
				pageSize: this.goodsPageSize,
				topicId: this.topicId,
			}
			http.home.queryByTopic(params).then((res) => {
				let list = res.data.list
				if (this.goodsPageNum == 1 && this.$route.query.AdCode) {
					// 将第一页的数据赋值 用于商品id的比较
					this.getDavertisData(list, res.data.total)
				} else {
					this.setListData(list, res.data.total)
				}
			})
		},

		// 搜索商品列表
		searchListData(isOrderByPriceDesc) {
			let params = {
				productName: this.title, // 直接搜索
				pageNum: this.goodsPageNum,
				pageSize: this.goodsPageSize,
				isOrderByPriceDesc: isOrderByPriceDesc == 1 ? false : true,
			}
			if (params.productName != '') {
				this.listPicKey = '' // 去掉专题图片
				http.home.search(params).then((res) => {
					var list = res.data.list
					this.setListData(list, res.data.total)
				})
			} else {
				this.$message.warning('Enter Search Content')
			}
		},

		// 修改下拉框排序
		sortValueFunc() {
			this.searchListData(this.sortValue)
		},

		// 请求到的商品处理
		setListData(list, total) {
			list.map((item) => {
				item.isFlashSale = (item.tagsMap && item.tagsMap.indexOf('flash_sale') > -1) || (item.tags && item.tags.indexOf('flash_sale') > -1)
				item.isNew = (item.tagsMap && item.tagsMap.indexOf('new_in') > -1) || (item.tags && item.tags.indexOf('new_in') > -1)
			})
			this.goodsAllList = list
			this.goodsTotal = total
			this.isGoods = true
		},

		// 商品列表分页
		goodsCurrentChange: function (e) {
			document.documentElement.scrollTop = 0
			this.goodsPageNum = e
			this.getParameter()
		},

		// 商品详情
		goodsDetail: function (e) {
			this.$router.push({
				path: this.formatUrl(`/product/`, `${e.productName || e.name}-${e.productNo}`),
			})
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
						Toast({
							duration: 3000,
							message: type == 1 ? 'Cancel success!' : 'Add success!',
							icon: ' iconfont iconsuccess_no_circle',
						})
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
			// that.skuNo = item.skuNo
			// that.goodsInfo = item

			http.goodsDetail.detail(params).then((res) => {
				// res.data.attrObj = item.attrObj // 当前选中的 属性-属性值
				res.data.attrObj = item.attrObj || {} // 当前选中的 属性-属性值
				// res.data.skuNo = item.skuNo
				// res.data.price = item.price
				res.data.discountPrice = item.discountPrice
				that.goodsInfo = res.data
				// that.goodsInfo.num = item.num //现有的购物车数量
				this.calculationInventory(that.goodsInfo) // 对属性进行 禁用项处理.
				that.isEditAttr = true
			})
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
	},
	watch: {
		$route(to, from) {
			// 如果当前已经在商品列表，再次选择分类需重新加载
			var params = this.$route.params.categoryTitle
			if (params.indexOf('-c-') > -1) {
				params = params.replace('-c-', '-')
			}
			var lastIndex = params.lastIndexOf('-')
			this.topicId = params.substring(lastIndex + 1, params.length) // 专题id
			if (this.topicId == 'search') {
				this.title = params.substring(0, lastIndex) // 搜索名称
			} else {
				this.title = params.substring(0, lastIndex).replace(new RegExp(/(-)/g), ' ') // 专题名称
			}

			if (this.title != '' || this.topicId != '') {
				this.goodsPageNum = 1
				// 判断是否是搜索
				if (this.topicId == 'search') {
					this.searchListData() // 搜索商品列表
				} else {
					this.getQueryByTopic()
					this.getQueryInfo()
				}
			}
		},
	},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';
.class-block {
	min-height: 400px;
	margin: 50px auto;
	margin-top: 0;
	overflow: hidden;
}

.class-title {
	padding-bottom: 30px;
	justify-content: space-between;
	display: flex;
}

.class-tag {
	font-size: 20px;
	font-family: Montserrat Medium;
}

.sort-by {
	align-items: flex-end;
	align-items: center;
	display: flex;
}

.sort-by .el-select {
	margin-left: 20px;
	width: 160px;
}

.customize-img {
	width: 100%;
	margin-bottom: 30px;
	display: block;
}

.product-detail {
	position: relative;
	cursor: pointer;
}

.discount-rate {
	position: absolute;
	top: 0;
	left: 0;
	font-size: 18px;
	font-family: Montserrat Regular;
	padding: 4px 8px;
	background-color: #ffb84e;
	z-index: 1;
}

.product-sign {
	position: absolute;
	top: 0;
	left: 0;
	font-size: 18px;
	font-family: Montserrat Regular;
	color: #ffffff;
	padding: 4px 8px;
	background-color: #87c6a1;
	z-index: 1;
}

.like-bg {
	position: absolute;
	right: 12px;
	top: 12px;
	width: 35px;
	height: 35px;
	line-height: 35px;
	text-align: center;
	background-color: #fff;
	border-radius: 50%;
	z-index: 1;
}

.product-detail .icon-xihuan1,
.product-detail .icon-like {
	font-size: 24px;
}

.product-img {
	width: 100%;
	display: block;
}

.product-title {
	font-size: 15px;
	font-family: Montserrat Light;
	color: #666;
	height: 20px;
	margin: 10px 0;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	word-break: break-all;
}

.product-price {
	font-size: 16px;
	font-family: Montserrat Regular;
}

.text-red {
	color: #e84646;
}

.product-price span {
	font-size: 12px;
	font-family: Montserrat Light;
	color: #999999;
	text-decoration: line-through;
	margin-left: 10px;
}

.product-price .icongouwuche2 {
	font-size: 24px;
	color: #222;
	float: right;
	margin-top: -6px;
}

.product-rate {
	font-size: 13px;
	font-family: Montserrat Light;
	color: #666666;
	height: 16px;
	margin-top: 10px;
	margin-bottom: 40px;
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

// 编辑商品弹窗
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
