export default [  
    {
        path: '/personalCenter',
        name: 'PersonalCenter',
        redirect: '/myOrders',
        component: () => import('@/views/my/index-pc'),
        children: [
            // {
            //     path: 'personalCenterIndex',
            //     name: 'PersonalCenterIndex',
            //     meta:{
            //         auth: true
            //     },
            //     component: () => import('@/views/my/personalCenter'),
            // },
            {
                path: 'myprofile',
                name: 'My Profile',
                component: () => import('@/views/my/profile'),
            },
            {
                path: 'changePassword',
                name: 'Change Password',
                component: () => import('@/views/my/changePassword'),
            },
            {
                path: 'myAddress',
                name: 'My Address',
                component: () => import('@/views/my/address'),
            },
            {
                path: '/myOrders',
                name: 'My Orders',
                meta:{
                    auth: true
                },
                component: () => import('@/views/my/order'),
            },
            {
                path: '/wishlist',
                name: 'Wishlist',
                meta:{
                    auth: true
                },
                component: () => import('@/views/my/wish'),
            },
            {
                path: '/myCoupons',
                name: 'My Coupons',
                meta:{
                    auth: true
                },
                component: () => import('@/views/coupon/coupon'),
            },
           
        ],
    },
    {
        path: '/orderDetail/:orderSn',
        name: 'orderDetail',
        component: () => import('@/views/my/orderDetail'),
    },
    {
        path: '/orderReview',
        name: 'orderReview',
        component: () => import('@/views/order/review'),
    },
    
]