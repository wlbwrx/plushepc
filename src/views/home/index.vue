<template>
	<div class="home">
		<!--提示三栏-->
		<home-tag></home-tag>
		<!--滚动图-->
		<div class="swiper-container swiper-home-banner">
			<div class="swiper-wrapper">
				<div class="swiper-slide" v-for="(item, index) in bannerList" :key="index" @click="internalUrl(item)">
					<img class="home-banner" :src="$utils.imageHandler(3, item.picKey)" />
				</div>
			</div>
			<i v-if="bannerList.length > 1" class="iconfont icon-fanhui2"></i>
			<i v-if="bannerList.length > 1" class="iconfont icon-fanhui"></i>
			<div class="swiper-pagination"></div>
		</div>
		<!--分类-->
		<div class="common-block">
			<div class="class-title">Shop By Category</div>
			<el-row>
				<div class="el-col-5" v-for="(item, index) in categoryList" :key="index">
					<div class="category-list" @click="selectClass(item)">
						<el-image :src="$utils.imageHandler(16, item.picKey)" fit="cover"></el-image>
						<div class="category-title">{{ item.name }}</div>
					</div>
				</div>
			</el-row>
		</div>
		<!--自定义图片-->
		<!-- <div class="common-block" v-if="!this.token">
            <img class="customize-img" src="@/assets/images-pc/home1.png" @click="loginShow()"/>
        </div> -->
		<!--New Arrivals-->
		<div class="common-block" v-if="newInList.length">
			<div class="class-title">New Arrivals</div>
			<div class="class-img">
				<el-row :gutter="20">
					<el-col :span="24"><img v-if="newInList[0]" :src="$utils.imageHandler(3, newInList[0].picKey)" @click="selectClass(newInList[0])" /></el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12"><img v-if="newInList[1]" :src="$utils.imageHandler(3, newInList[1].picKey)" @click="selectClass(newInList[1])" /></el-col>
					<el-col :span="12"><img v-if="newInList[2]" :src="$utils.imageHandler(3, newInList[2].picKey)" @click="selectClass(newInList[2])" /></el-col>
				</el-row>
			</div>
		</div>
		<!--自定义模块子模块-->
		<div v-for="(item, index) in floorSonList" :key="index">
			<div class="common-block" v-if="item.children.length">
				<div class="class-title">{{ item.name }}</div>
				<div class="class-img">
					<el-row :gutter="20">
						<el-col :span="24"><img v-if="item.children[0]" :src="$utils.imageHandler(3, item.children[0].picKey)" @click="selectClass(item.children[0])" /></el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12"><img v-if="item.children[1]" :src="$utils.imageHandler(3, item.children[1].picKey)" @click="selectClass(item.children[1])" /></el-col>
						<el-col :span="12"><img v-if="item.children[2]" :src="$utils.imageHandler(3, item.children[2].picKey)" @click="selectClass(item.children[2])" /></el-col>
					</el-row>
				</div>
			</div>
		</div>
		<!--Flash Sale-->
		<div class="common-block" v-if="flashSaleList.length">
			<div class="class-title">
				Flash Sale
				<span class="flip-down" @click="saleGoodsList()">
					<font>End in</font>
					<FlipDown v-if="endHours < 24" type="3" :endDate="flashSaleTime" theme="2" :timeUnit="[':', ':', ':']"></FlipDown>
					<span v-else>24+</span>
					<i class="iconfont icon-fanhui"></i>
				</span>
			</div>
			<img class="customize-img" :src="$utils.imageHandler(3, flashSalePic)" @click="saleGoodsList()" />
			<el-row class="flash-sale-block" :gutter="18">
				<div class="swiper-container swiper-flash-product swiper-no-swiping">
					<div class="swiper-wrapper">
						<el-col :span="4" class="swiper-slide swiper-slide-4" v-for="(item, index) in flashSaleList" :key="index">
							<div class="product-list" @click="goodsDetail(item)">
								<div class="discount-rate" v-if="item.discountPrice != item.price && item.discountRate > 0">-{{ Math.floor(item.discountRate * 100) }}%</div>
								<el-image :src="$utils.imageHandler(14, item.picKey)" fit="cover">
									<div slot="placeholder" class="image-slot">
										<img src="@/assets/images-pc/default.png" />
									</div>
									<div slot="error" class="image-slot">
										<img src="@/assets/images-pc/default.png" />
									</div>
								</el-image>
								<div class="product-title">{{ item.productName || item.name }}</div>
								<div class="product-price" v-if="item.discountPrice == item.price || item.discountPrice == 0">US${{ item.discountPrice == 0 ? (item.price / 100).toFixed(2) : (item.discountPrice / 100).toFixed(2) }}</div>
								<div class="product-price text-red" v-else>
									US${{ (item.discountPrice / 100).toFixed(2) }}<span>US${{ (item.price / 100).toFixed(2) }}</span>
								</div>
							</div>
						</el-col>
					</div>
					<i v-if="flashSaleList.length > 6" class="iconfont icon-fanhui2"></i>
					<i v-if="flashSaleList.length > 6" class="iconfont icon-fanhui"></i>
				</div>
			</el-row>
		</div>
		<!--自定义模块-->
		<div>
			<div v-for="(item, index) in floorsList" :key="index">
				<div class="common-block" v-if="item.products.length">
					<div class="class-title">{{ item.name }}<span class="class-more" @click="selectClass(item)">View More ></span></div>
					<img class="customize-img" :src="$utils.imageHandler(3, item.coverPicKeyPc)" @click="selectClass(item)" />
					<el-row class="flash-sale-block" :gutter="18">
						<div class="swiper-container swiper-no-swiping" :class="'swiper-floors-' + index">
							<div class="swiper-wrapper">
								<el-col :span="4" class="swiper-slide swiper-slide-4" v-for="(items, indexs) in item.products" :key="indexs">
									<div class="product-list" @click="goodsDetail(items)">
										<blockquote>
											<div v-if="items.tagsMap.indexOf('flash_sale') > -1 && items.tagsMap.indexOf('new_in') > -1 && items.discountRate == 0"></div>
											<div class="discount-rate" v-else-if="items.tagsMap.indexOf('flash_sale') > -1 && items.discountRate > 0">-{{ Math.floor(items.discountRate * 100) }}%</div>
											<div class="product-sign" v-else-if="items.tagsMap.indexOf('new_in') > -1">New</div>
										</blockquote>
										<el-image :src="$utils.imageHandler(14, items.picKey)" fit="cover">
											<div slot="placeholder" class="image-slot">
												<img src="@/assets/images-pc/default.png" />
											</div>
											<div slot="error" class="image-slot">
												<img src="@/assets/images-pc/default.png" />
											</div>
										</el-image>
										<div class="product-title">{{ items.productName || items.name }}</div>
										<div class="product-price" v-if="items.discountPrice == items.price || items.discountPrice == 0">US${{ items.discountPrice == 0 ? (items.price / 100).toFixed(2) : (items.discountPrice / 100).toFixed(2) }}</div>
										<div class="product-price text-red" v-else>
											US${{ (items.discountPrice / 100).toFixed(2) }}<span>US${{ (items.price / 100).toFixed(2) }}</span>
										</div>
									</div>
								</el-col>
							</div>
							<i v-if="item.products.length > 6" class="iconfont icon-fanhui2"></i>
							<i v-if="item.products.length > 6" class="iconfont icon-fanhui"></i>
						</div>
					</el-row>
				</div>
			</div>
		</div>
		<!--Brand Wall-->
		<div class="common-block" v-if="platform != 1">
			<div class="class-title">Brand Wall</div>
			<el-row>
				<div class="el-col-5 shop-list" v-for="(item, index) in brandWallList" :key="index" @click="shopHome(item)">
					<el-image :src="$utils.imageHandler(15, item.logoPicKey)" fit="cover"></el-image>
					<div class="shop-title">{{ item.name }}</div>
					<div class="shop-des">{{ item.desc }}</div>
				</div>
			</el-row>
		</div>
		<!--Find Us on Intagram-->
		<div class="common-block" v-if="findUsList.length">
			<div class="class-title">
				Find Us on Intagram
				<div class="class-info">@plushe_official</div>
			</div>
			<el-row>
				<div class="el-col-5 find-list" v-for="(item, index) in findUsList.slice(0, 5)" :key="index" @click="internalUrl(item)">
					<div class="find-mask">
						<div>
							<i class="iconfont icon-ins1"></i>
							<div class="shop-now">SHOP NOW</div>
						</div>
					</div>
					<!-- <div class="find-title"><p>{{ item.title }}</p></div> -->
					<el-image :src="$utils.imageHandler(14, item.picKey)" fit="cover"></el-image>
				</div>
			</el-row>
		</div>
		<!--about-->
		<div class="common-block">
			<div class="class-title">
				Your Size Your Style
				<div class="class-info">We Are Plushe</div>
			</div>
			<div @click="$router.push({ path: '/other_info', query: { type: 'about_us' } })">
				<img class="customize-img" src="@/assets/images-pc/home3.png" />
				<!-- <div class="about-content about-content-top">
					Plushe is an international fashion brand that focuses on plus-size women’s apparel, accessories and other fashion items. We are passionately dedicated to helping every woman, especially those with curves, create the life and possibilities she wants and deserves.
				</div>
				<div class="about-content">
					Plushe designers and suppliers work together to develop fashionable clothes that follow the trends without sacrificing comfort and inclusivity. We are always open to feedback from our customers because your ideas and suggestions help us improve our products to suit the needs of
					curvy women around the world.
				</div> -->
			</div>
		</div>
		<!--blog-->
		<div class="common-block">
			<!-- <div class="class-title">Plushe Blog</div>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="blog-list">
                        <img src="@/assets/images-pc/blog1.png" />
                        <div class="blog-title">THE MOST VERSATILE CLOTHING YOU CAN WEAR WITH ALMOST ANYTHING</div>
                        <div class="blog-content">Black Lace Sleeveless Mini Dress $29.99 BUY IT NOW We all have our own unique style. We’re one of a kind and our choice of clothing is a ref...</div>
                        <span class="blog-view">VIEW MORE</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="blog-list">
                        <img src="@/assets/images-pc/blog2.png" />
                        <div class="blog-title">HOW TO CHOOSE THE PERFECT FLORAL DRESS</div>
                        <div class="blog-content">Floral dresses are fun and absolutely adorable. Every woman needs at least one flirty and flowy floral dress in their wardrobe right next to your l...</div>
                        <span class="blog-view">VIEW MORE</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="blog-list">
                        <img src="@/assets/images-pc/blog3.png" />
                        <div class="blog-title">HOW TO CHOOSE AN OUTFIT FOR DAY TO NIGHT</div>
                        <div class="blog-content">We are passionately dedicated to helping every woman, especially those with curves, create the life and possibilities you want and deserve.</div>
                        <span class="blog-view">VIEW MORE</span>
                    </div>
                </el-col>
            </el-row> -->
			<el-row class="other-block">
				<el-col :span="8">
					<div class="other-list other-border" @click="$router.push({ path: '/other_info', query: { type: 'shipping_information' } })">
						<span><i class="iconfont icon-yunshu2"></i></span>
						<div class="other-info">
							<div>SHIPPING INFO</div>
							<div>Free Shipping Orders Over $59</div>
						</div>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="other-list other-border" @click="$router.push({ path: '/other_info', query: { type: 'return_exchanges' } })">
						<span><i class="iconfont icon-tuihuan2"></i></span>
						<div class="other-info">
							<div>RETURN POLICY</div>
							<div>Return or exchange within 45 days</div>
						</div>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="other-list" @click="$router.push({ path: '/other_info', query: { type: 'connect_to_us' } })">
						<span><i class="iconfont icon-kefu3"></i></span>
						<div class="other-info">
							<div>ALL DAY ONLINE</div>
							<div>Get in touch with us at anytime</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<!--返回顶部-->
		<el-backtop>
			<div class="scroll-top">
				<i class="el-icon-arrow-up"></i>
			</div>
		</el-backtop>
		<!--侧边浮窗-->
		<slide-coupon v-if="!hideSlideCoupon"></slide-coupon>
	</div>
</template>

<script>
import FlipDown from 'vue-flip-down'
import homeTag from '@/components/homeTag.vue'
import SlideCoupon from '@/components/SlideCoupon.vue'
import http from '@/api/index.js'
import { mapState, mapGetters } from 'vuex'

export default {
	name: 'home',
	data() {
		return {
			platform: this.$store.getters.platformId, // 1.Plushe 2.GeeMart
			bannerList: [], // Banner
			categoryList: [], // 分类
			newInList: [], // New Arrivals
			floorSonList: [], // 自定义模块子模块
			endHours: 0, // 倒计时小时
			flashSaleTime: '', // 倒计时
			flashSaleTopicId: '', // 闪购专题id
			flashSalePic: '', // 闪购图片
			flashSaleList: [], // 闪列列表
			floorsList: [], // 自定义模块商品
			forYouList: [], // For You
			brandWallList: [], // Brand Wall
			findUsList: [], // Find Us
		}
	},
	components: {
		FlipDown,
		homeTag,
		SlideCoupon,
	},
	computed: {
		...mapGetters({
			token: 'token', // 判断是否登录
		}),
		...mapState('user', ['loginMethod', 'slideCouponHide']),
		hideSlideCoupon() {
			return this.token || !this.$route.meta.showSlideCoupon || this.slideCouponHide
		},
	},
	beforeRouteEnter(to, from, next) {
		// 回到之前滚动条位置
		next((vm) => {
			setTimeout(() => {
				document.documentElement.scrollTop = vm.rememberScroll
			}, 0)
		})
	},
	beforeRouteLeave(to, from, next) {
		// 保存跳转路由后滚动条的位置
		this.rememberScroll = document.documentElement.scrollTop
		next()
	},
	mounted() {
		// 获取banner
		this.getBanner()

		// 获取分类
		this.getCategory()

		// 获取New Arrivals
		this.getNewArrival()

		// 获取自定义模块的子模块
		this.getFloorSon()

		// 获取Flash Sale
		this.getFlashSale()

		// 获取自定义模块的商品
		this.getFloorList()

		// 获取for you数据
		// this.getForYou()

		// 获取店铺列表
		this.getShop()

		// 获取Find Us
		this.getFindUs()
	},
	methods: {
		// 获取banner
		getBanner: function () {
			http.home.banner().then((res) => {
				this.bannerList = res.data
				this.$nextTick(() => {
					new Swiper('.swiper-home-banner', {
						loop: res.data.length > 1 ? true : false, // 循环
						autoplay: 5000, // 自动滑动
						speed: 1000, // 滚动时间
						autoplayDisableOnInteraction: false,
						prevButton: '.swiper-home-banner .icon-fanhui2',
						nextButton: '.swiper-home-banner .icon-fanhui',
						pagination: res.data.length > 1 ? '.swiper-home-banner .swiper-pagination' : '',
					})
				})
			})
		},

		// 获取分类
		getCategory: function () {
			http.home.beans().then((res) => {
				var list = res.data.splice(0, 10)
				this.categoryList = list
			})
		},

		// 获取New Arrivals
		getNewArrival: function () {
			http.home.newIns().then((res) => {
				this.newInList = res.data
			})
		},

		// 获取自定义模块的子模块
		getFloorSon: function () {
			http.home.floors1().then((res) => {
				this.floorSonList = res.data
			})
		},

		// 获取Flash Sale
		getFlashSale: function () {
			http.home
				.flashSaleList({
					// pageNum: 1,
					// pageSize: 4
				})
				.then((res) => {
					// 处理倒计时
					if (res.data && res.data.endTime) {
						var now = this.moment(new Date())
						var end = this.moment(res.data.endTime)
						this.endHours = end.diff(now, 'hours')
						this.flashSaleTime = new Date(res.data.endTime)
					}
					this.flashSaleTopicId = res.data ? res.data.topicId : ''
					this.flashSalePic = res.data ? res.data.coverPicKeyPc : ''
					this.flashSaleList = res.data ? res.data.products.list : []
					this.$nextTick(() => {
						this.initFlashSwiper() // 初始化Flash Sale滚动商品
					})
				})
		},

		// 初始化Flash Sale滚动商品
		initFlashSwiper: function () {
			new Swiper('.swiper-flash-product', {
				autoplay: false, // 禁止自动滑动
				prevButton: '.swiper-flash-product .icon-fanhui2',
				nextButton: '.swiper-flash-product .icon-fanhui',
				slidesPerView: 'auto', // 同时显示的slides数量
				slidesPerGroup: 6, // slides的数量6个为一组
			})
		},

		// 获取自定义模块的商品
		getFloorList: function () {
			http.home.floors2().then((res) => {
				this.floorsList = res.data
				this.$nextTick(() => {
					this.initFloorSwiper() // 初始化自定义模块滚动商品
				})
			})
		},

		// 初始化自定义模块滚动商品
		initFloorSwiper: function () {
			for (let i = 0; i < this.floorsList.length; i++) {
				if (this.floorsList[i].products.length) {
					new Swiper(`.swiper-floors-${i}`, {
						autoplay: false, // 禁止自动滑动
						prevButton: `.swiper-floors-${i} .icon-fanhui2`,
						nextButton: `.swiper-floors-${i} .icon-fanhui`,
						slidesPerView: 'auto', // 同时显示的slides数量
						slidesPerGroup: 6, // slides的数量6个为一组
					})
				}
			}
		},

		// 获取for you数据
		getForYou: function () {
			http.home
				.recommend({
					type: 1,
					pageNum: 1,
					pageSize: 20,
				})
				.then((res) => {
					this.forYouList = res.data
				})
		},

		// 获取店铺列表
		getShop: function () {
			http.category.categoryShopsList().then((res) => {
				this.brandWallList = res.data
			})
		},

		// 获取Find Us
		getFindUs: function () {
			http.home.findUs().then((res) => {
				this.findUsList = res.data
			})
		},

		// 商品详情
		goodsDetail: function (e) {
			this.$router.push({
				path: this.formatUrl(`/product/`, `${e.productName || e.name}-${e.productNo}`),
			})
		},

		// 闪购商品列表
		saleGoodsList: function () {
			this.$router.push({
				path: this.formatUrl(`/category/`, `Flash Sale-${this.flashSaleTopicId}`),
			})
		},

		// 自定义模块跳转商品列表
		selectClass: function (e) {
			this.$router.push({
				path: this.formatUrl(`/category/`, `${e.name}-${e.topicId}`),
			})
		},

		// 店铺主页
		shopHome: function (e) {
			var routeUrl = this.$router.resolve({
				path: '/shop_home',
				query: {
					shopsId: e.id,
					shopName: e.name,
				},
			})
			window.open(routeUrl.href, '_blank')
		},

		// 跳转链接
		internalUrl: function (e) {
			if (e.relType == 1) {
				if (e.internalUrl) {
					window.location.href = e.internalUrl
				}
			} else if (e.relType == 2) {
				this.$router.push({
					path: this.formatUrl(`/category/`, `${e.title}-${e.topicId}`),
				})
			}
		},

		// 点击banner
		loginShow: function () {
			this.$store.state.user.loginDialogIs = true
		},
	},
}
</script>

<style scoped lang="less">
/*滚动图*/
.swiper-home-banner {
	position: relative;
	max-width: 1800px;
}

.swiper-home-banner i {
	position: absolute;
	top: calc(50% - 25px);
	font-size: 22px;
	color: #ffffff;
	text-align: center;
	width: 50px;
	height: 50px;
	line-height: 50px;
	background-color: rgba(31, 45, 61, 0.11);
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.3s;
	z-index: 1;
}

.swiper-home-banner i:hover {
	background-color: rgba(31, 45, 61, 0.23);
}

.swiper-home-banner .icon-fanhui2 {
	left: 50px;
}

.swiper-home-banner .icon-fanhui {
	right: 50px;
}

.home-banner {
	width: 100%;
	cursor: pointer;
}

/*分类*/
.common-block {
	// min-
	max-width: 1800px;
	padding: 20px 0;
	margin: auto;
	overflow: hidden;
}

.category-list {
	padding: 10px 20px;
	background-color: #f2f2f2;
	align-items: center;
	display: flex;
	cursor: pointer;
}

.category-list .el-image {
	width: 30%;
}

.category-title {
	font-size: 20px;
	font-family: Montserrat Regular;
	margin-left: 10px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	word-break: break-all;
	flex: 1;
}

/*New Arrivals*/
.class-img .el-row:nth-child(1) {
	padding-bottom: 20px;
}

.class-img img {
	width: 100%;
	display: block;
	cursor: pointer;
}

/*模块*/
.flash-sale-block {
	padding-top: 18px;
}

.customize-img {
	width: 100%;
	display: block;
	cursor: pointer;
}

.class-title {
	position: relative;
	font-size: 30px;
	font-family: Montserrat Medium;
	text-align: center;
	padding: 40px 0 20px;
}

.class-more {
	position: absolute;
	top: 48px;
	right: 0;
	font-size: 14px;
	font-family: Montserrat Regular;
	cursor: pointer;
}

.class-info {
	font-size: 20px;
	font-family: Montserrat Medium;
	font-weight: 500;
	margin-top: 10px;
}

.flip-down {
	position: absolute;
	top: 44px;
	right: 0;
	font-size: initial;
	font-weight: initial;
	align-items: center;
	display: flex;
	cursor: pointer;
}

.flip-down font {
	font-size: 18px;
	font-family: Montserrat Regular;
	color: #333;
	margin-right: 15px;
}

.flip-down i {
	margin-left: 10px;
}

.flash-sale-block i {
	position: absolute;
	top: calc(50% - 44px);
	font-size: 20px;
	color: #222222;
	text-align: center;
	width: 37px;
	height: 37px;
	line-height: 37px;
	background-color: #ffffff;
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.3s;
	z-index: 1;
}

.flash-sale-block .icon-fanhui2 {
	left: 20px;
}

.flash-sale-block .icon-fanhui {
	right: 20px;
}

/*商品列表*/
.swiper-slide-4 {
	width: 16.66667% !important;
}

.product-list {
	position: relative;
	cursor: pointer;
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

.discount-rate {
	position: absolute;
	top: 0;
	left: 0;
	font-size: 18px;
	padding: 4px 8px;
	background-color: #ffb84e;
	z-index: 1;
}

.product-list .el-image {
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
	font-weight: 400;
	font-family: Montserrat Light;
	color: #999999;
	text-decoration: line-through;
	margin-left: 10px;
}

/*店铺列表*/
.el-col-5 {
	width: 20%;
	padding: 5px;
}

.shop-list {
	padding: 10px;
	cursor: pointer;
}

.shop-list .el-image {
	width: 100%;
	display: block;
}

.shop-title {
	font-size: 20px;
	font-weight: bold;
	text-align: center;
	margin: 10px 0 5px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	word-break: break-all;
}

.shop-des {
	font-size: 14px;
	color: #666666;
	text-align: center;
	height: 19px;
}

/*Find Us on Intagram*/
.find-list {
	position: relative;
	padding: 5px;
	cursor: pointer;
}

.find-list:hover .find-mask {
	opacity: 1;
}

.find-mask {
	position: absolute;
	top: 5px;
	right: 5px;
	bottom: 5px;
	left: 5px;
	text-align: center;
	background-color: rgba(255, 255, 255, 0.6);
	align-items: center;
	justify-content: center;
	display: flex;
	transition: 0.3s all;
	opacity: 0;
	z-index: 2;
}

.find-mask i {
	font-size: 40px;
}

.shop-now {
	font-size: 18px;
	color: #fff;
	padding: 10px 25px;
	margin-top: 20px;
	background-color: #222;
	transition: 0.3s all;
}

.shop-now:hover {
	background-color: #474747;
}

.find-title {
	position: absolute;
	left: 5px;
	right: 5px;
	bottom: 40px;
	font-size: 12px;
	color: #fff;
	text-align: center;
	padding: 18px 10px;
	background-color: rgba(0, 0, 0, 0.2);
	z-index: 1;
}

.find-title p {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	word-break: break-all;
}

.find-list .el-image {
	width: 100%;
	display: block;
}

/*about*/
.about-content {
	font-size: 16px;
	font-family: Montserrat Regular;
	margin-top: 10px;
	cursor: pointer;
}

.about-content-top {
	margin-top: 25px;
}

/*blog*/
.blog-list img {
	width: 100%;
	display: block;
}

.blog-title {
	margin-top: 20px;
	font-weight: bold;
	min-height: 38px;
}

.blog-content {
	font-size: 12px;
	margin-top: 20px;
	min-height: 48px;
}

.blog-view {
	font-size: 12px;
	padding: 10px 20px;
	margin-top: 20px;
	border: 1px solid;
	cursor: pointer;
	display: inline-block;
	transition: 0.3s all;
}

.blog-view:hover {
	background-color: #f5f5f5;
}

.other-block {
	padding: 50px 0 70px;
	margin-left: 1px;
}

.other-list {
	margin-left: -1px;
	align-items: center;
    justify-content: center;
    display: flex;
	cursor: pointer;
}

.other-border {
	border-right: 1px solid #999;
}

.other-list span {
	width: 28px;
    height: 28px;
    border: 1px solid #222;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    display: flex;
}

.other-list i {
	font-size: 15px;
    font-weight: bold;
}

.other-info {
	padding-left: 20px;
}

.other-info div:nth-child(1) {
	font-size: 14px;
	font-family: Montserrat Regular;
	color: #666;
}

.other-info div:nth-child(2) {
	font-size: 12px;
	font-family: Montserrat Light;
	color: #666;
}
</style>
