import router from './router/index.js'
import store from './store/index.js'
import { getToken } from '@/utils/auth.js'
import { platformConfig } from '@/utils/enums.js'

router.beforeEach((to, from, next) => {
	if (getToken()) {
		if (to.path == '/login') {
			next('/home')
		} else {
			if (to.matched.length === 0) {
				next('/404')
			}
			next()
		}
	} else {
		// 需要登录权限的页面
		if (!to.meta.auth) {
			if (to.matched.length === 0) {
				next('/404')
			}
			next()
		} else {
			// pc显示登录框
			store.state.user.loginDialogIs = true
		}
	}
})

router.afterEach(to => {
	if (!window.gtag) return
	const { googlePixelId, googlePixelOldId } = platformConfig.plushe
	window.gtag('config', googlePixelId, { page_path: to.fullPath, terminal: 'PC' })
	window.gtag('config', googlePixelOldId, { page_path: to.fullPath, terminal: 'PC' })
})
