import { get, post } from '@/utils/request.js'
export default {
	home: {
		notices: data => get('/opt/getNotices', data), // 首页通知模块
		banner: data => get('/opt/getShopBanners', data), // 首页-banner模块
		beans: data => get('/opt/getShopBeans', data), // 首页-类别模块
		beansList: data => post('/opt/getBeanProducts', data), //首页-类别商品列表
		flashSaleList: data => get('/opt/getShopCurrentFlashSale', data), // 首页-闪购商品列表
		newIns: data => get('/opt/getShopNewIns', data), // 首页-新品模块
		newInsList: data => post('/opt/getNewInProducts', data), // 新品模块的商品
		// floors: data => get('/opt/getShopFloors', data), // 首页-楼层配置
		floors1: data => get('/opt/getShopFloor1s', data), // 首页-自定义模块1
		floors2: data => get('/opt/getShopFloor2s', data), // 首页-自定义模块2
		floorsList: data => get('/opt/getFloorProducts', data), // 首页-楼层商品列表
		// index: data => get('/opt/getShopOpt', data), // 首页-全部配置信息
		findUs: data => get('/opt/getShopFindUs', data), // 首页--获取商店findUs 配置

		search: data => post('/product/pageCond', data), // 搜索-商品列表
		recommend: data => post('/product/recommendList', data), // 商品推荐
		shipping: data => get('/shipping/getPostThresholdAmount', data), // 获取免邮费购物金额

		adList: data => post('/opt/getAdvertisingProducts', data), // 获取广告列表


		queryByTopic: data => post('/product/pageQueryByTopic', data), //目前首页和列表页的数据全部改为关联专题的这个接口 7.29 更改
		getTopicConfig: data => get('/topic/getTopicConfig', data), // 请求专题页面信息
		getAdvertisingProducts: data => post('opt/getAdvertisingProducts', data) // 广告商品请求
	},
	category: {
		categoryLeft: data => get('/opt/getShopTopCategories', data), // 类目-左侧栏
		categoryRight: data => get('/opt/getShopCategoryRecurse', data), // 类目-右侧内容
		categoryGoodsList: data => get('/opt/getShopCategoryProducts', data), // 类目-三级商品列表（点击右侧内容）
		categoryShopsList: data => get('/opt/getShops', data), // 单独获取店铺列表
	},
	car: {
		carList: data => get('/cart/getUserCart', data), // 购物车列表
		carDeletes: data => post('/cart/deleteCartItems', data), // 删除商品
		carAdd: data => get('/cart/addCartItem', data), // 添加商品
		carAddItems: data => post('/cart/addCartItems', data), // 批量添加商品
		carChangeCount: data => get('/cart/changeCartItemNum', data), //修改数量
		carCheckAll: data => get('/cart/checkAll', data), // 全选
		carCheckSingle: data => get('/cart/checkSingle', data), // 单选
		carUnCheckAll: data => get('/cart/unCheckAll', data), // 取消-全选
		carUnCheckSingle: data => get('/cart/unCheckSingle', data), // 取消-单选

		carChangeSku: data => get('/cart/changeCartItemSku', data), // 修改购物车里的sku(即删除、添加)
		carCheckout: data => post('/cart/checkout', data), // 结账台
	},
	goodsDetail: {
		detail: data => post('/product/detail', data), // 商品详情
		size: data => get('/product/getProductSize', data), // 商品sizes信息
		shipping: data => get('/shipping/getShippings', data), // 快递方式
	},
	review: {
		evaluateList: data => post('/order/getUserEvaluateList', data), // 评论信息列表
		evaluateStatistics: data => post('/order/evaluateStatistics', data), // 评论统计
	},
	coupon: {
		newPeople: data => get('/userCoupon/getNewComerDiscountAmount', data),
		covert: data => post('/userCoupon/convertCoupon', data), // 兑换优惠券
		newCoupon: data => get('/userCoupon/getNewComerCampaignId', data), // 新用户活动
	},
}
