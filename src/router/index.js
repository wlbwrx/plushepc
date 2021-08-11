import Vue from 'vue'
import VueRouter from 'vue-router'
const requireRoutes = require.context('./modules', false, /.js$/)
const routeMap = requireRoutes.keys().map(route => {
	return requireRoutes(route).default
})
// 高版本路由，会有重定向问题，解决如下：
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}

const routes = routeMap.flat()
Vue.use(VueRouter)
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/home',
			redirect: '/',
        }, {
            path: '/',
			name: 'home',
			meta: {
				title: '首页',
				keepAlive: true, // 需要被缓存
				showSlideCoupon: true // 是否需要显示侧边优惠券
			},
			component: () => import('@/views/home/index'),
        }, {
            path: '/product/:productNo',
			name: 'product',
			meta: {
				title: '商品详情',
				showSlideCoupon: true
			},
			component: () => import('@/views/goods_detail/index'),
        }, {
            path: '/category/:categoryTitle',
			name: 'category',
			meta: {
				title: '商品列表'
			},
			component: () => import('@/views/goods_filter/index'),
        }, {
            path: '/shop_home',
			name: 'shop_home',
			meta: {
				title: '店铺主页'
			},
			component: () => import('@/views/home/ShopHome'),
        }, {
			path: '/shopping_car',
			name: 'shoppingCar',
			meta: {
				title: '购物车',
				keepAlive: true,
				showTabbar: true,
			},
			component: () => import('@/views/shopping_car/index'),
		}, {
			path: '/other_info',
			name: 'other_info',
			meta: {
				title: '隐私政策'
			},
			component: () => import('@/views/home/otherInfo'),
		},
		{
			path: '/404',
			name: '404',
			meta: {
				title: '404'
			},
			component: () => import('@/views/404'),
		},
		{
			path: '*',
			redirect: '/home'
		},
		...routes
    ],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else if (to.hash) {
			return {
				selector: to.hash
			}
		} else {
			return { x: 0, y: 0 }
		}
	}
})
export default router