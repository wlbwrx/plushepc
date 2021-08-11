export default [
    {
        path: "/orderConfirm",
        name: "orderConfirm",
        meta: {
            title: "Order Confirmation",
            keepAlive: true,
            showHeader: true,
            goBackUrl: 'shoppingCar'
        },
        component: () => import("@/views/order/orderConfirm"),
    },
    {
        path: "/paySuccess",
        name: "paySuccess",
        meta: {
            title: "Payment",
            showHeader: true
        },
        component: () => import("@/views/pay/payment.vue")
    },
    {
        path: "/payment",
        name: "payment",
        meta: {
            title: "Payment",
            showHeader: true
        },
        component: () => import("@/views/pay/index")
    }
]