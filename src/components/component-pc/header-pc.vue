<template>
	<div class="nav-head">
		<!--通知-->
		<div class="swiper-container swiper-no-swiping swiper-head-notice" v-if="noticeList.length">
			<div class="swiper-wrapper">
				<div class="swiper-slide" v-for="(item, index) in noticeList" :key="index" @click="internalUrl(item)"><div v-html="item.content"></div></div>
			</div>
		</div>
		<div :class="['head-logo', { 'head-shop-logo': shopName != '' }]">
			<img class="logo-img" :src="platList[platform].logo" @click="$router.push({ path: '/home' })" />
			<div class="head-icon">
				<div class="search-block">
					<el-input v-model="searchGoods" size="small" placeholder="SEARCH" @keyup.enter.native="searchAllGoods()"></el-input>
					<div class="search-btn" @click="searchAllGoods()"><i class="iconfont icon-chazhao"></i></div>
				</div>
				<el-dropdown>
					<span class="el-dropdown-link">
						<i class="iconfont icon-gerenzhongxin" style="margin-right: 25px" @click="openLoginRegist()"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<div class="dropdown-box-1 dropdown-box-shadow" @click="openPage('/personalCenter')">{{ token ? user.nickName : 'Sign In / Register' }}</div>
						<div class="dropdown-box-2" @click="openPage('/personalCenter/myProfile')">My Profile</div>
						<div class="dropdown-box-2" @click="openPage('/myCoupons')">My Coupons</div>
						<div class="dropdown-box-2" :class="token ? 'dropdown-box-shadow' : ''" @click="openPage('/myOrders')">My Orders</div>
						<div class="dropdown-box-2" @click="userNull()" v-if="token">Sign Out</div>
					</el-dropdown-menu>
				</el-dropdown>
				<span class="shop_car_span" @mouseenter="isShopCarDialogFuc(true)" @mouseleave="isShopCarDialogFuc(false)">
					<i class="iconfont icon-daohanggouwuche" @click="openShoppingCar()"></i>{{ totalNum ? totalNum : '' }}
					<!-- 加载购物车组件 -->
					<shopcar-dialog v-if="isShopCarDialog"></shopcar-dialog>
				</span>
				<span @click="openWishList()"><i class="iconfont icon-xihuan1"></i></span>
				<!-- {{ wishList.length > 0 ?  wishList.length : ''}} 暂时隐藏收藏数量 -->
			</div>
		</div>
		<!--店铺显示-->
		<div class="head-shop" v-show="shopName != ''">
			<span class="shop-name">{{ shopName }}</span>
			<div class="shop-search">
				<el-input v-model="searchGoods_" size="small" placeholder="SEARCH" @keyup.enter.native="searchShopGoods()"></el-input>
				<el-button type="primary" size="small" icon="el-icon-search" @click="searchShopGoods()"></el-button>
			</div>
		</div>
		<!--分类-->
		<div class="head-class">
			<div class="swiper-container swiper-head-class swiper-no-swiping">
				<div ref="headClass" class="swiper-wrapper">
					<span class="swiper-slide swiper-nav" :class="index === activeIndex ? 'active-nav' : ''" v-for="(item, index) in categoryList" :key="index" @mouseenter="openClass(index)" @mouseleave="hideClass()"
						>{{ item.name }}
						<div></div>
					</span>
				</div>
			</div>
			<div v-if="categoryShow" class="swiper-arrow">
				<i class="iconfont icon-fanhui2"></i>
				<i class="iconfont icon-fanhui"></i>
			</div>
		</div>
		<!--分类弹框-->
		<div ref="classDialog" class="class-dialog" @mouseenter="showClass()" @mouseleave="hideClass()">
			<div class="class-block" v-if="activeIndex !== ''">
				<!--文本和图片-->
				<el-row type="flex" v-if="categoryList[activeIndex].childrenType === 0">
					<el-col :span="12">
						<el-row>
							<!--只有1个分类往右偏移16-->
							<div v-if="categoryList[activeIndex].childrenTextNumber == 1">
								<el-col :span="8" :offset="16" v-for="(item, index) in categoryTwoList" :key="index">
									<div class="class-list" v-if="item.nodeType == 0">
										<div class="class-title">{{ item.name }}</div>
										<div class="class-three-title" v-for="(items, indexs) in item.children" :key="indexs" @click="selectClass(items)">{{ items.name }}</div>
									</div>
								</el-col>
							</div>
							<!--只有2个分类往右偏移8-->
							<div v-else-if="categoryList[activeIndex].childrenTextNumber == 2">
								<el-col :span="8" :offset="index == 1 ? 8 : 0" v-for="(item, index) in categoryTwoList" :key="index">
									<div class="class-list" v-if="item.nodeType == 0">
										<div class="class-title">{{ item.name }}</div>
										<div class="class-three-title" v-for="(items, indexs) in item.children" :key="indexs" @click="selectClass(items)">{{ items.name }}</div>
									</div>
								</el-col>
							</div>
							<!--2个以上分类不偏移-->
							<div v-else>
								<el-col :span="8" v-for="(item, index) in categoryTwoList" :key="index">
									<div class="class-list" v-if="item.nodeType == 0">
										<div class="class-title">{{ item.name }}</div>
										<div class="class-three-title" v-for="(items, indexs) in item.children" :key="indexs" @click="selectClass(items)">{{ items.name }}</div>
									</div>
								</el-col>
							</div>
						</el-row>
					</el-col>
					<el-col :span="12">
						<div class="class-right">
							<div v-for="(item, index) in categoryTwoList" :key="index">
								<template v-if="item.nodeType == 1">
									<div class="class-img-block" v-for="(items, indexs) in item.children" :key="indexs">
										<!--单图-->
										<div class="class-single" v-if="items.nodeType == 3">
											<!-- <span>SHOP NOW</span> -->
											<img :src="$utils.imageHandler(4, items.picKey)" @click="selectImgClass(items)" />
										</div>

										<!--多图-->
										<div class="class-multiple" v-if="items.nodeType == 2">
											<div class="class-img" v-for="(itemss, indexss) in items.children" :key="indexss">
												<!-- <span>SHOP NOW</span> -->
												<img :src="$utils.imageHandler(4, itemss.picKey)" @click="selectImgClass(itemss)" />
											</div>
										</div>
									</div>
								</template>
							</div>
						</div>
					</el-col>
				</el-row>
				<!--只有文本-->
				<el-row type="flex" justify="center" v-else-if="categoryList[activeIndex].childrenType === 1">
					<el-col :span="3" v-for="(item, index) in categoryTwoList" :key="index">
						<div class="class-list" v-if="item.nodeType == 0">
							<div class="class-title">{{ item.name }}</div>
							<div class="class-three-title" v-for="(items, indexs) in item.children" :key="indexs" @click="selectClass(items)">{{ items.name }}</div>
						</div>
					</el-col>
				</el-row>
				<!--只有图片-->
				<el-row type="flex" v-else-if="categoryList[activeIndex].childrenType === 2">
					<el-col :span="24">
						<div class="class-right class-right-only">
							<div v-for="(item, index) in categoryTwoList" :key="index">
								<template v-if="item.nodeType == 1">
									<div class="class-img-block" v-for="(items, indexs) in item.children" :key="indexs">
										<!--单图-->
										<div class="class-single" v-if="items.nodeType == 3">
											<!-- <span>SHOP NOW</span> -->
											<img :src="$utils.imageHandler(4, items.picKey)" @click="selectImgClass(items)" />
										</div>

										<!--多图-->
										<div class="class-multiple" v-if="items.nodeType == 2">
											<div class="class-img" v-for="(itemss, indexss) in items.children" :key="indexss">
												<!-- <span>SHOP NOW</span> -->
												<img :src="$utils.imageHandler(4, itemss.picKey)" @click="selectImgClass(itemss)" />
											</div>
										</div>
									</div>
								</template>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>
import http from '@/api/index.js'
import { mapState, mapActions, mapGetters } from 'vuex'
import shopcarDialog from '@/components/component-pc/shopcar-pc/shopCarDialog-pc'

export default {
	name: 'header-pc',
	data() {
		return {
			platform: this.$store.getters.platformId, // 1.Plushe 2.GeeMart
			platList: {
				1: { logo: require('@/assets/images-pc/logo.png') },
				2: { logo: require('@/assets/images-pc/gee-logo.png') },
			},
			noticeList: [], // 通知列表
			classIndex: '', // 当前悬浮的一级分类下标
			activeIndex: '', // 导航选中下标
			categoryShow: true, // 显示分类滚动箭头
			categoryList: [
				{
					childrenType: '',
				},
			], // 分类列表
			categoryTwoList: [], // 分类二级三级列表
			shopsId: '', // 当前店铺id
			shopName: '', // 当前店铺（如果今日店铺主页，需要显示店铺名称）
			searchGoods: '', // 搜索值
			searchGoods_: '', // 搜索店铺商品
			shopProduct: '', // 搜索店铺商品
			// isShopCarDialog: false, // 头部购物车弹窗是否显示
		}
	},
	created() {},
	mounted() {
		// 获取通知
		this.getNotice()
		// 获取分类数据
		this.getCategory()
		this.$nextTick(() => {
			this.getNotice() // 初始化滚动导航
		})
		// 接受更新头部分类广播
		this.$root.Bus.$on('shopClass', () => {
			this.activeIndex = ''
			// 获取分类数据
			this.getCategory()
		})
	},
	updated() {},
	components: {
		shopcarDialog,
	},
	computed: {
		...mapState('wish', ['wishList']),
		...mapGetters('shopCar', {
			totalNum: 'totalNum',
		}),
		...mapState('user', ['token', 'user']),
		isShopCarDialog() {
			return this.$store.state.user.shopCarStatus
		},
	},
	methods: {
		// 暂时调用获取user以及退出登录方法
		...mapActions('user', ['getUser', 'Signout']),
		// 退出登录
		userNull() {
			this.Signout().then(() => {})
		},

		// 获取参数
		getParameter: function () {
			this.shopName = this.$route.query.shopName || ''
		},

		// 获取分类数据
		getCategory: function () {
			if (this.shopsId) {
				http.category
					.categoryLeft({
						shopsId: this.shopsId,
					})
					.then((res) => {
						for (const i in res.data) {
							res.data[i].childrenType = '' // 当前一级分类下显示的二级分类种类（0：文本和图片；1：只有文本；2：只有图片）
							res.data[i].childrenTextNumber = '' // 当前一级分类是文本和图片，二级文本的个数
							res.data[i].children = []
						}
						this.categoryList = res.data
						this.$nextTick(() => {
							this.initNavHead() // 初始化滚动导航
						})
					})
			} else {
				http.category.categoryLeft().then((res) => {
					for (const i in res.data) {
						res.data[i].childrenType = '' // 当前一级分类下显示的二级分类种类（0：文本和图片；1：只有文本；2：只有图片）
						res.data[i].childrenTextNumber = '' // 当前一级分类是文本和图片，二级文本的个数
						res.data[i].children = []
					}
					this.categoryList = res.data
					this.$nextTick(() => {
						this.initNavHead() // 初始化滚动导航
					})
				})
			}
		},

		// 获取通知
		getNotice: function () {
			http.home.notices().then((res) => {
				this.noticeList = res.data

				this.$nextTick(() => {
					new Swiper('.swiper-head-notice', {
						loop: true, // 循环
						autoplay: 3000, // 自动滑动
						speed: 2000, // 滚动时间
						autoplayDisableOnInteraction: false,
					})
				})
			})
		},

		// 初始化滚动导航
		initNavHead: function () {
			new Swiper('.swiper-head-class', {
				autoplay: false, // 禁止自动滑动
				prevButton: '.head-class .icon-fanhui2',
				nextButton: '.head-class .icon-fanhui',
				slidesPerView: 'auto', // 同时显示的slides数量
				slidesPerGroup: 12, // slides的数量12个为一组
			})
			// 隐藏分类滚动箭头
			if (this.$refs.headClass.scrollWidth <= this.$refs.headClass.clientWidth) {
				this.categoryShow = false
			}
		},

		// 鼠标悬浮导航
		openClass: function (index) {
			this.activeIndex = index
			this.showClass() // 显示分类弹框
			if (this.categoryList[index].children.length == 0) {
				http.category
					.categoryRight({
						categoryId: this.categoryList[index].id,
					})
					.then((res) => {
						var list = res.data.children
						// nodeType（二级中 0：图文；1：分组）（三级中 0：图文；2：单图或多图；3：单图）
						this.categoryList[index].children = list
						this.categoryTwoList = list
						// 0：二级分类有文本和图片；1：二级分类只有文本；2：二级分类只有图片
						var type1 = list.every((item) => {
							return item.nodeType == 0
						})
						var type2 = list.every((item) => {
							return item.nodeType == 1
						})
						if (type1) {
							this.categoryList[index].childrenType = 1
						} else if (type2) {
							this.categoryList[index].childrenType = 2
						} else {
							var num = 0
							this.categoryList[index].childrenType = 0 // 默认
							for (const i in list) {
								if (list[i].nodeType == 0) {
									num++
								}
							}
							this.categoryList[index].childrenTextNumber = num
						}
					})
			} else {
				this.categoryTwoList = this.categoryList[index].children
			}
			this.classIndex = index // 当前悬浮的一级分类下标
		},

		// 显示分类弹框
		showClass: function () {
			this.$refs.classDialog.style.height = 'initial'
			this.$refs.classDialog.style.opacity = 1 // 显示分类
		},

		// 隐藏分类弹框
		hideClass: function () {
			this.$refs.classDialog.style.height = 0
			this.$refs.classDialog.style.opacity = 0 // 隐藏分类
		},

		// 选择三级分类（文本）
		selectClass: function (e) {
			this.$router.push({
				path: this.formatUrl(`/category/`, `${e.name}-${e.topicId}`),
			})
			this.$refs.classDialog.style.opacity = 0
		},

		// 选择三级分类（图片）
		selectImgClass: function (e) {
			if (e.relType == 1) {
				if (e.linkUrl) {
					window.location.href = e.linkUrl
				}
			} else if (e.relType == 2) {
				this.$router.push({
					path: this.formatUrl(`/category/`, `${e.name}-${e.topicId}`),
				})
				this.$refs.classDialog.style.opacity = 0
			}
		},

		// 搜索所有商品
		searchAllGoods: function () {
			var searchGoods = this.searchGoods
			if (searchGoods) {
				this.$router.push({
					path: `/category/${searchGoods}-c-search`,
				})
			} else {
				this.$message.warning('Enter Search Content')
			}
		},

		// 搜索店铺商品
		searchShopGoods: function () {
			if (this.searchGoods_) {
				// 暂时不加
			} else {
				this.$message.warning('Enter Search Content')
			}
		},

		// 跳转链接
		internalUrl: function (e) {
			window.location.href = e.internalUrl
		},

		// 打开登录弹窗 需判断是否已经登录
		openLoginRegist: function () {
			// 记录当前页面，注册成功以后需要跳转到对应页面

			this.$store.commit('user/backPath', this.$route.fullPath)
			this.$router.push({
				path: '/personalCenter',
			})
		},
		// 打开购物车页面
		openShoppingCar: function () {
			this.$router.push({
				path: '/shopping_car',
			})
		},
		// 打开心愿页面
		openWishList() {
			this.$router.push({
				path: '/wishlist',
			})
		},
		// 显示购物车弹窗
		isShopCarDialogFuc(bool) {
			this.$store.commit('user/shopCarStatus', bool)
		},
		openPage(data) {
			if (this.token) {
				this.$router.push({
					path: data,
				})
			} else {
				this.openLoginRegist()
			}
		},
	},
	watch: {
		$route(to) {
			// 店铺名称
			if (to.query.shopsId && to.query.shopName) {
				this.shopsId = to.query.shopsId
				this.shopName = to.query.shopName
			} else {
				this.shopsId = ''
				this.shopName = ''
			}
		},
	},
}
</script>

<style scoped lang="less">
@import '@/style/variable.less';
/deep/.el-dropdown {
	line-height: 24px;
	padding-top: 3px;
}

.dropdown-box-1 {
	height: 54px;
	width: 146px;
	line-height: 54px;
	margin-left: 20px;
	margin-right: 20px;
	cursor: pointer;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.dropdown-box-2 {
	height: 34px;
	width: 146px;
	line-height: 34px;
	margin-left: 20px;
	margin-right: 20px;
	font-size: 14px;
	color: #999999;
	cursor: pointer;
}
.dropdown-box-shadow {
	box-shadow: 0px 0px 1px 0px rgba(118, 118, 118, 0.1), 0px -1px 0px 0px #f5f5f5 inset;
}
.dropdown-box-2:hover {
	color: #222222;
}
.nav-head {
	position: relative;
	// box-shadow: 0 0 12px 0 rgb(0 0 0 / 10%);
	border-bottom: 1px solid #f5f5f5;
}

.swiper-head-notice {
	font-family: Montserrat Regular;
	text-align: center;
	padding: 12px 0;
	background-color: #222;
	cursor: pointer;
}

.head-logo {
	position: relative;
	height: 70px;
	line-height: 70px;
	padding: 0 20px;
	display: flex;
}

.logo-img {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 110px;
	cursor: pointer;
}

.head-icon {
	color: #666666;
	margin-left: auto;
	display: flex;
	align-items: center;
	.shop_car_span {
		position: relative;
	}
}

.head-icon i {
	font-size: 24px;
}

.head-icon > i {
	margin-right: 25px;
	cursor: pointer;
}

.head-icon > span {
	margin-right: 25px;
	display: flex;
	align-items: center;
	cursor: pointer;
}

.search-block {
	margin-right: 25px;
	display: flex;
	align-items: center;
}

.search-btn {
	color: #fff;
	text-align: center;
	width: 55px;
	height: 32px;
	line-height: 32px;
	background-color: #222;
	cursor: pointer;
	position: relative;
}

.search-btn .icon-chazhao {
	font-size: 22px;
}

.head-shop-logo {
	background-color: #f7f8fa;
}

.head-shop-logo img {
	right: initial;
	left: 40px;
}

.head-shop {
	position: relative;
	height: 60px;
	line-height: 60px;
	padding: 0 20px;
	display: flex;
}

.shop-name {
	position: absolute;
	right: 0;
	left: 0;
	font-size: 24px;
	font-weight: bold;
	width: max-content;
	margin: 0 auto;
}

.shop-search {
	margin-left: auto;
	display: flex;
	align-items: center;
}

.head-class {
	max-width: 1200px;
	text-align: center;
	height: 54px;
	line-height: 54px;
	margin: auto;
	display: flex;
}

.swiper-container {
	width: 100%;
}

.swiper-nav {
	font-family: Montserrat Regular;
	width: auto;
	padding: 0 20px;
	cursor: pointer;
}

.active-nav {
	color: #222222;
}

.active-nav div {
	position: absolute;
	bottom: 0;
	width: calc(100% - 40px);
	height: 2px;
	background-color: #222222;
	transition: all 0.5s;
}

.swiper-arrow {
	width: 100px;
	align-items: center;
	justify-content: space-evenly;
	display: flex;
}

.swiper-arrow i {
	font-size: 20px;
	color: #999999;
	cursor: pointer;
}

/*分类弹框*/
.class-dialog {
	position: absolute;
	width: 100%;
	height: 0;
	background-color: #ffffff;
	// box-shadow: 0 7px 12px 0 rgb(0 0 0 / 10%);
	border-top: 1px solid #f5f5f5;
	z-index: 3;
	opacity: 0;
	transition: all 0.5s;
	overflow: hidden;
}

.class-block {
	padding: 20px;
	margin: auto;
	overflow: hidden;
}

.class-list {
	margin-bottom: 20px;
}

.class-title {
	font-family: Montserrat Regular;
	margin-bottom: 5px;
}

.class-three-title {
	font-size: 12px;
	font-family: Montserrat Light;
	color: #666666;
	padding: 5px 0;
	word-break: break-all;
	cursor: pointer;
}

.class-right {
	padding-left: 20px;
	border-left: 1px solid #f5f5f5;
}

.class-right-only {
	text-align: center;
	padding-left: 0;
	border-left: 0;
}

.class-img-block {
	display: initial;
}

.class-right img {
	width: 100%;
}

.class-single,
.class-img {
	position: relative;
	width: 47%;
	max-width: 262px;
	margin: 0 10px 10px 0;
	display: inline-block;
	cursor: pointer;
}

.class-single span,
.class-img span {
	position: absolute;
	left: 20%;
	bottom: 30px;
	font-size: 12px;
	font-weight: bold;
	font-family: Montserrat Light;
	padding: 4px 0;
	text-align: center;
	width: 60%;
	background-color: #fff;
	opacity: 0;
	transition: all 0.3s;
}

.class-single:hover span,
.class-img:hover span {
	opacity: 1;
}
</style>
