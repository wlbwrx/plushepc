export default [
	{
		path: '/register_success',
		name: 'registerSuccess',
		meta: {
			title: '注册成功'
		},
		component: () => import('@/views/login/Success'),
	},
	{
		path: '/reset_self',
		name: 'resetSelf',
		component: () => import('@/views/login/reset_self'),
	},
	{
		path: '/reset_password',
		name: 'resetPassword',
		meta: {
			title: '重置密码',
		},
		component: () => import('@/views/login/Reset'),
	}
]
