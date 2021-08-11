<template>
    <div class="shop-home">
        <!--滚动图-->
        <div class="swiper-container swiper-home-banner">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item, index) in bannerList" :key="index">
                    <img class="home-banner" :src="$utils.imageHandler(3, item.picKey)" />
                </div>
            </div>
            <i v-if="bannerList.length > 1" class="iconfont icon-fanhui2"></i>
            <i v-if="bannerList.length > 1" class="iconfont icon-fanhui"></i>
            <div class="swiper-pagination"></div>
        </div>
        <!--New In-->
        <div class="class-block">
            <div class="class-title">
                <span class="class-tag">New In<span>{{ newInTotal }}</span></span>
                <span class="view-more" @click="goodsList('New In')">View More ></span>
            </div>
            <el-row :gutter="20">
                <el-col :span="6" v-for="(item, index) in newInList" :key="index">
                    <div class="product-list" @click="goodsDetail(item)">
                        <el-image :src="$utils.imageHandler(1, item.picKey)" fit="cover"></el-image>
                        <div class="product-title">{{ item.productName }}</div>
                        <div class="product-price" v-if="item.discountPrice == item.price || item.discountPrice == 0">US${{ item.discountPrice == 0 ? (item.price / 100).toFixed(2) : (item.discountPrice / 100).toFixed(2) }}</div>
                        <div class="product-price text-red" v-else>US${{ (item.discountPrice / 100).toFixed(2) }}<span>US${{ (item.price / 100).toFixed(2) }}</span></div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--自定义模块-->
        <div v-for="(item, index) in floorsList" :key="index">
            <div class="class-block" v-if="item.products.length">
                <div class="class-title">
                    <span class="class-tag">{{ item.name }}</span>
                    <span class="view-more" @click="selectClass(item)">View More ></span>
                </div>
                <el-row :gutter="20">
                    <el-col :span="6" v-for="(items, indexs) in item.products" :key="indexs">
                        <div class="product-list" @click="goodsDetail(items)">
                            <div class="product-sign" v-if="items.tags.indexOf('new_in') > -1">New</div>
                            <el-image :src="$utils.imageHandler(1, items.picKey)" fit="cover"></el-image>
                            <div class="product-title">{{ items.productName }}</div>
                            <div class="product-price" v-if="items.discountPrice == items.price || items.discountPrice == 0">US${{ items.discountPrice == 0 ? (items.price / 100).toFixed(2) : (items.discountPrice / 100).toFixed(2) }}</div>
                            <div class="product-price text-red" v-else>US${{ (items.discountPrice / 100).toFixed(2) }}<span>US${{ (items.price / 100).toFixed(2) }}</span></div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!--For You-->
        <div class="class-block" v-if="forYouList.length">
            <div class="class-title">
                <span class="class-tag">For You</span>
            </div>
            <el-row :gutter="20">
                <el-col :span="6" v-for="(item, index) in forYouList" :key="index">
                    <div class="product-list" @click="goodsDetail(item)">
                        <div class="product-sign" v-if="item.tagsMap.indexOf('new_in') > -1">New</div>
                        <el-image :src="$utils.imageHandler(1, item.picKey)" fit="cover"></el-image>
                        <div class="product-title">{{ item.name }}</div>
                        <div class="product-price" v-if="item.discountPrice == item.price || item.discountPrice == 0">US${{ item.discountPrice == 0 ? (item.price / 100).toFixed(2) : (item.discountPrice / 100).toFixed(2) }}</div>
                        <div class="product-price text-red" v-else>US${{ (item.discountPrice / 100).toFixed(2) }}<span>US${{ (item.price / 100).toFixed(2) }}</span></div>
                    </div>
                </el-col>
            </el-row>
            <div class="view-more-btn" v-if="page < total">
                <el-button type="primary" @click="getMoreForYou()">View More</el-button>
            </div>
        </div>
        <!--返回顶部-->
        <el-backtop>
            <div class="scroll-top">
                <i class="el-icon-arrow-up"></i>
            </div>
        </el-backtop>
    </div>
</template>

<script>
import http from '@/api/index.js'

export default {
    name: 'shop-home',
    data() {
        return {
            bannerList: [], // Banner
            newInList: [], // New In
            newInTotal: '',
            floorsList: [], // 自定义模块
            forYouList: [], // For You
            forYouListAll: [], // For You所有数据
            page: 1, // For You当前页码
            total: 0 // For You总页码
        }
    },
    components: {

    },
    mounted() {
        // 广播更新头部分类
        this.$root.Bus.$emit('shopClass')

        // 获取店铺首页数据
        this.getShopHomeData()

        // 获取for you数据
        this.getForYou()
    },
    methods: {
        // 获取店铺首页数据
        getShopHomeData: function () {
            http.home.index({
                shopsId: this.$route.query.shopsId
            }).then(res => {
                this.bannerList = res.data.banners
                this.newInList = res.data.newIns.list
                this.newInTotal = res.data.newIns.total + '+'
                this.floorsList = res.data.floors.slice(0, 10)
                this.$nextTick(() => {
                    this.initBanner() // 初始化滚动图
                })
            })
        },

        // 初始化滚动图
        initBanner: function () {
            var list = this.bannerList
            new Swiper('.swiper-home-banner', {
                loop: list.length > 1 ? true : false, // 循环
                autoplay: 5000, // 自动滑动
                speed: 1000, // 滚动时间
                autoplayDisableOnInteraction: false,
                prevButton: '.swiper-home-banner .icon-fanhui2',
                nextButton: '.swiper-home-banner .icon-fanhui',
                pagination: list.length > 1 ? '.swiper-home-banner .swiper-pagination' : ''
            })
        },

        // 获取for you数据
        getForYou: function () {
            http.home.recommend({
                shopsId: this.$route.query.shopsId,
                pageNum: 1,
                pageSize: 100
            }).then(res => {
                this.forYouListAll = res.data
                this.forYouList = res.data.slice(0, 20)
                this.total = Math.ceil(res.data.length / 20)
            })
        },

        // 获取更多for you数据
        getMoreForYou: function () {
            var list = this.forYouListAll
            this.page++
            this.forYouList = this.forYouList.concat(list.slice((this.page - 1) * 20, this.page * 20))
        },
        
        // 商品详情
        goodsDetail: function (e) {
            this.$router.push({
                path: this.formatUrl(`/product/`, `${e.productName || e.name}-${e.productNo}`)
            })
        },

        // 固定模块跳转商品列表
        goodsList: function (name) {
            // 暂时不加
            // this.$router.push({
            //     path: '/category',
            //     query: {
            //         shopsId: this.$route.query.shopsId,
            //         shopName: this.$route.query.shopName,
            //         title: name
            //     }
            // })
        },

        // 自定义模块跳转商品列表
        selectClass: function (e) {
            // 暂时不加
            // this.$router.push({
            //     path: '/category',
            //     query: {
            //         shopsId: this.$route.query.shopsId,
            //         shopName: this.$route.query.shopName,
            //         categoryId: e.id,
            //         title: e.name
            //     }
            // })
        },

        // 店铺主页
        shopHome: function (e) {
            var routeUrl = this.$router.resolve({
                path: '/shop_home',
                query: {
                    shopsId: e.id,
                    shopName: e.name
                }
            })
            window.open(routeUrl.href, '_blank')
        }
    }
}
</script>

<style scoped>
.swiper-home-banner {
    position: relative;
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
}

.class-block {
    padding: 50px 0;
    margin: auto;
    overflow: hidden;
}

.class-title {
    padding: 30px 0;
    justify-content: space-between;
    display: flex;
}

.class-tag {
    font-size: 26px;
    font-weight: 500;
}

.class-tag span {
    font-size: 16px;
    color: #666666;
    margin-left: 20px;
}

.view-more {
    color: #666666;
    align-items: flex-end;
    cursor: pointer;
    display: flex;
}

.flip-down {
    align-items: center;
    display: flex;
    cursor: pointer;
}

.flip-down font:nth-child(1) {
    font-size: 16px;
    color: #333333;
    margin-right: 10px;
}

.flip-down font:nth-child(3) {
    margin-left: 10px;
}

/*商品列表*/
.product-list {
    position: relative;
    cursor: pointer;
}

.product-sign {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #ffffff;
    padding: 3px 6px;
    background-color: #87c6a1;
    z-index: 1;
}

.product-list .el-image {
    width: 100%;
    height: 427.5px;
}

.product-title {
    height: 19px;
    margin: 10px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
}

.product-title span {
    font-weight: bold;
}

.product-price {
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 30px;
}

.text-red {
    color: #E84646;
}

.product-price span {
    font-size: 12px;
    color: #999999;
    text-decoration: line-through;
    margin-left: 10px;
}

.view-more-btn {
    text-align: center;
    margin: 20px 0;
}

.view-more-btn .el-button {
    width: 140px;
}
</style>
