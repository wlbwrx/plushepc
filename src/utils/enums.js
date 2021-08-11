export const orderTabs = ['ALL', 'Unpaid', 'Processing', 'Shipped']
// { label: 'Returns', value: 5 },
//logisticsStatus 0-已发货 1-运输中 2-已收货
export const getLogistics = ['Shipped', 'Processing', 'Received']
export const tabKeyToValue = {
	ALL: [0, 1, 2, 3, 4, 5, 6],
	Unpaid: [0],
	Processing: [1, 6],
	Shipped: [2, 3, 5],
	// { label: 'Returns', value: 5 },
}
//  订单状态：
//             ALL 4-> 交易关闭、已取消
//             unpaid 0->待支付
//             processing 1->待发货 6-> 支付处理中
//             shipped 2->已发货 3->已收货；5->交易完成
export const orderStatus = ['Unpaid', 'Shipment Pending', 'Shipped', 'Delivered', 'Cancelled', 'Finished', 'Payment Pending']
export const msgTabs = {
	ALL: 'You don’t have any orders',
	Unpaid: 'You don’t have unpaid orders',
	Processing: 'You don’t have processing items',
	Shipped: 'You don’t have shipped items',
	// Review: 'You don’t shopping history',
	// Returns: 'You don’t have returns',
}

//支付方式
export const getPayTypes = ['non-payment', 'paypal', 'visa', 'master', 'stripe'] // 0->未支付；1->paypal；2->visa 3->master; 4->stripe
export const payList = [
	{ label: 'PayPal', value: 1, icon: require('@/assets/images/icons/paypalBtn0.png') },
	{ label: 'Credit/Debit Card/Google Pay/Apple Pay', value: 4, icon: require('@/assets/images/icons/stripeBtn0.png') },
	// {label: 'visa', value:2},
	// {label: 'master', value:3}
]

//快递方式 shippMethod
export const getShippMethod = ['Free shipping', 'Standard Shipping', 'Express shipping'] //Free shipping:1 Standard Shipping:2  Express shipping:3
// 订单状态：0>待支付；1->处理中；2->已发货；3->已收货；4->交易关闭；5->交易完成 6.支付中

// export const orderStatus = ['Unpaid', 'Processing', 'Shipped']
// { label: 'Coupons', value: 'icon-zhekou' },
// { label: 'Invite', value: 'icon-yaoqing' },

export const minMenus = [
	{ label: 'Coupons', value: '', path: '/myCoupon' },
	{ label: 'Support', value: 'Ask for help', path: '/otherInfo?id=12' },
	{ label: 'Shipping Information', value: '', path: '/otherInfo?id=1' },
	{ label: 'Return & Exchanges', value: '', path: '/otherInfo?id=2' },
]

export const minOrders = [
	{ label: 'All', value: 'icon-daifukuan', path: '/order', img: require('@/assets/images/my-order-all.png') },
	{ label: 'Unpaid', value: 'icon-daifukuan', path: '/order?id=Unpaid', img: require('@/assets/images/my-order-unpaid.png') },
	{ label: 'Processing', value: 'icon-yifukuan', path: '/order?id=Processing', img: require('@/assets/images/my-order-processing.png') },
	{ label: 'Shipped', value: 'icon-yifahuo', path: '/order?id=Shipped', img: require('@/assets/images/my-order-shipped.png') },
	// { label: 'Returns', value: 'icon-tuihuan' },
]

// pc my  展示icon
export const minMenusPc = [{ label: 'Conpons', value: 'icon-youhuiquan', link: '/myCoupons' }]

export const minOrdersPc = [
	{ label: 'ALL Order', value: 'icon-suoyoudingdan', link: '' },
	{ label: 'Unpaid', value: 'icon-weifukuan', link: '' },
	{ label: 'Processing', value: 'icon-yifukuan', link: '' },
	{ label: 'Shipped', value: 'icon-yifahuo', link: '' },
]

// 登录参考枚举：
export const loginEnum = {
	AuthTypeEnum: { 0: 'AUTH_EMAIL', 1: 'AUTH_GG', 2: 'AUTH_FB', 3: 'AUTH_APPLE' }, // 登陆方式
	AuthVerifiedEnum: { 0: 'NO_VERIFIED', 1: 'VERIFIED' }, //
	ResetTypeEnum: { 1: 'RESET_PASSWORD', 2: 'MODIFY_PASSWORD' }, // 重置密码、修改密码
	UserGenderEnum: { 0: 'UN', 1: 'MAN', 2: 'WOMAN' }, // 性别
}
// 确认订单错误返回
export const orderErrorStatus = {
	1: 'Sorry! Part of the goods sale out',
	2: 'Sorry! Goods data error',
	3: "Sorry! This coupon can't be used in this order",
	4: 'Sorry! Goods shipping method is invalid',
}

// // 支付状态码
// export const payStatus ={
// 	1: 'Sorry! Part of the goods sale out',
// 	2: 'Sorry! Goods data error',
// 	3: "Your payment failed, order has been cancelled, please place another", 、、
// 	4: 'Sorry! Goods shipping method is invalid'
// }

// PRODUCT_SOLD_OUT(1, "Sorry! Part of the goods sale out"),
// PRODUCT_SKU_NOT_FOUND(2, "Sorry! Goods data error."),
// PRODUCT_COUPON_UNAVAILABLE(3, "Sorry! This coupon can't be used in this order."),
// SHIPPING_METHOD_INVALID(4, "Sorry! Goods shipping method is invalid."),
// 商品筛选页-入口枚举：
export const filterFrom = {
	0: 'beansList', // 首页-分类-商品列表
	1: 'newInsList', // 首页-新品-商品列表
	2: 'flashSaleList', // 首页-秒杀-商品列表
	3: 'floorsList', // 首页-楼层-商品列表
	4: 'search', // 搜索-商品列表
	5: 'categoryGoodsList', // 类目-三级-商品列表
	9: 'recommend', // 首页-推荐
}

// 平台相关数据枚举：
export const platform = {
	1: {
		logo: require('@/assets/images/logo.png'),
		name: 'Plushe',
	},
	2: {
		logo: require('@/assets/images/gee-logo.png'),
		name: 'GeeMart',
	},
}

// 平台配置信息:
export const platformConfig = {
	plushe: {
		platformId: 1,
		fbLoginID: '765470724344188', // facebook 登录ID, 不区分环境
		fbPixelID: process.env.VUE_APP_FBID, // facebook 上报ID, 区分环境
		googleLoginID: '916256788164-0libh0bchvctn3enubr42a2ks1168agq.apps.googleusercontent.com', // google 登录, 不区分环境
		googlePixelId: process.env.VUE_APP_GAID, // google 上报ID, 区分环境
		googlePixelOldId: process.env.VUE_APP_UAID, // google 老版上报id, 区分环境
	},
}

export const provincesList = [
	'Alabama',
	'Alaska',
	'American Samoa',
	'Arizona',
	'Arkansas',
	'California',
	'Colorado',
	'Connecticut',
	'Delaware',
	'Florida',
	'Georgia',
	'Guam',
	'Hawaii',
	'Idaho',
	'Illinois',
	'Indiana',
	'Iowa',
	'Kansas',
	'Kentucky',
	'Louisiana',
	'Maine',
	'Marshall Islands',
	'Maryland',
	'Massachusetts',
	'Michigan',
	'Federated States of Micronesia',
	'Minnesota',
	'Mississippi',
	'Missouri',
	'Montana',
	'Nebraska',
	'Nevada',
	'New Hampshire',
	'New Jersey',
	'New Mexico',
	'New York',
	'North Carolina',
	'North Dakota',
	'Northern Mariana Islands',
	'Ohio',
	'Oklahoma',
	'Oregon',
	'Palau',
	'Pennsylvania',
	'Puerto Rico',
	'Rhode Island',
	'South Carolina',
	'South Dakota',
	'Tennessee',
	'Texas',
	'Virgin Islands',
	'Utah',
	'Vermont',
	'Virginia',
	'Washington',
	'District of Columbia',
	'West Virginia',
	'Wisconsin',
	'Wyoming',
	'Armed Forces Americas',
	'Armed Forces Europe',
	'Armed Forces Pacific',
]

export const paypalAdd = {
	AL: 'Albania',
	DZ: 'Algeria',
	AD: 'Andorra',
	AO: 'Angola',
	AI: 'Anguilla',
	AG: 'Antigua & Barbuda',
	AR: 'Argentina',
	AM: 'Armenia',
	AW: 'Aruba',
	AU: 'Australia',
	AT: 'Austria',
	AZ: 'Azerbaijan',
	BS: 'Bahamas',
	BH: 'Bahrain',
	BB: 'Barbados',
	BY: 'Belarus',
	BE: 'Belgium',
	BZ: 'Belize',
	BJ: 'Benin',
	BM: 'Bermuda',
	BT: 'Bhutan',
	BO: 'Bolivia',
	BA: 'Bosnia & Herzegovina',
	BW: 'Botswana',
	BR: 'Brazil',
	VG: 'British Virgin Islands',
	BN: 'Brunei',
	BG: 'Bulgaria',
	BF: 'Burkina Faso',
	BI: 'Burundi',
	KH: 'Cambodia',
	CM: 'Cameroon',
	CA: 'Canada',
	CV: 'Cape Verde',
	KY: 'Cayman Islands',
	TD: 'Chad',
	CL: 'Chile',
	C2: 'China',
	CO: 'Colombia',
	KM: 'Comoros',
	CG: 'Congo - Brazzaville',
	CD: 'Congo - Kinshasa',
	CK: 'Cook Islands',
	CR: 'Costa Rica',
	CI: 'Côte D’ivoire',
	HR: 'Croatia',
	CY: 'Cyprus',
	CZ: 'Czech Republic',
	DK: 'Denmark',
	DJ: 'Djibouti',
	DM: 'Dominica',
	DO: 'Dominican Republic',
	EC: 'Ecuador',
	EG: 'Egypt',
	SV: 'El Salvador',
	ER: 'Eritrea',
	EE: 'Estonia',
	ET: 'Ethiopia',
	FK: 'Falkland Islands',
	FO: 'Faroe Islands',
	FJ: 'Fiji',
	FI: 'Finland',
	FR: 'France',
	GF: 'French Guiana',
	PF: 'French Polynesia',
	GA: 'Gabon',
	GM: 'Gambia',
	GE: 'Georgia',
	DE: 'Germany',
	GI: 'Gibraltar',
	GR: 'Greece',
	GL: 'Greenland',
	GD: 'Grenada',
	GP: 'Guadeloupe',
	GT: 'Guatemala',
	GN: 'Guinea',
	GW: 'Guinea-bissau',
	GY: 'Guyana',
	HN: 'Honduras',
	HK: 'Hong Kong Sar China',
	HU: 'Hungary',
	IS: 'Iceland',
	IN: 'India',
	ID: 'Indonesia',
	IE: 'Ireland',
	IL: 'Israel',
	IT: 'Italy',
	JM: 'Jamaica',
	JP: 'Japan',
	JO: 'Jordan',
	KZ: 'Kazakhstan',
	KE: 'Kenya',
	KI: 'Kiribati',
	KW: 'Kuwait',
	KG: 'Kyrgyzstan',
	LA: 'Laos',
	LV: 'Latvia',
	LS: 'Lesotho',
	LI: 'Liechtenstein',
	LT: 'Lithuania',
	LU: 'Luxembourg',
	MK: 'Macedonia',
	MG: 'Madagascar',
	MW: 'Malawi',
	MY: 'Malaysia',
	MV: 'Maldives',
	ML: 'Mali',
	MT: 'Malta',
	MH: 'Marshall Islands',
	MQ: 'Martinique',
	MR: 'Mauritania',
	MU: 'Mauritius',
	YT: 'Mayotte',
	MX: 'Mexico',
	FM: 'Micronesia',
	MD: 'Moldova',
	MC: 'Monaco',
	MN: 'Mongolia',
	ME: 'Montenegro',
	MS: 'Montserrat',
	MA: 'Morocco',
	MZ: 'Mozambique',
	NA: 'Namibia',
	NR: 'Nauru',
	NP: 'Nepal',
	NL: 'Netherlands',
	NC: 'New Caledonia',
	NZ: 'New Zealand',
	NI: 'Nicaragua',
	NE: 'Niger',
	NG: 'Nigeria',
	NU: 'Niue',
	NF: 'Norfolk Island',
	NO: 'Norway',
	OM: 'Oman',
	PW: 'Palau',
	PA: 'Panama',
	PG: 'Papua New Guinea',
	PY: 'Paraguay',
	PE: 'Peru',
	PH: 'Philippines',
	PN: 'Pitcairn Islands',
	PL: 'Poland',
	PT: 'Portugal',
	QA: 'Qatar',
	RE: 'Réunion',
	RO: 'Romania',
	RU: 'Russia',
	RW: 'Rwanda',
	WS: 'Samoa',
	SM: 'San Marino',
	ST: 'São Tomé & Príncipe',
	SA: 'Saudi Arabia',
	SN: 'Senegal',
	RS: 'Serbia',
	SC: 'Seychelles',
	SL: 'Sierra Leone',
	SG: 'Singapore',
	SK: 'Slovakia',
	SI: 'Slovenia',
	SB: 'Solomon Islands',
	SO: 'Somalia',
	ZA: 'South Africa',
	KR: 'South Korea',
	ES: 'Spain',
	LK: 'Sri Lanka',
	SH: 'St. Helena',
	KN: 'St. Kitts & Nevis',
	LC: 'St. Lucia',
	PM: 'St. Pierre & Miquelon',
	VC: 'St. Vincent & Grenadines',
	SR: 'Suriname',
	SJ: 'Svalbard & Jan Mayen',
	SZ: 'Swaziland',
	SE: 'Sweden',
	CH: 'Switzerland',
	TW: 'Taiwan',
	TJ: 'Tajikistan',
	TZ: 'Tanzania',
	TH: 'Thailand',
	TG: 'Togo',
	TO: 'Tonga',
	TT: 'Trinidad & Tobago',
	TN: 'Tunisia',
	TM: 'Turkmenistan',
	TC: 'Turks & Caicos Islands',
	TV: 'Tuvalu',
	UG: 'Uganda',
	UA: 'Ukraine',
	AE: 'United Arab Emirates',
	GB: 'United Kingdom',
	US: 'United States',
	UY: 'Uruguay',
	VU: 'Vanuatu',
	VA: 'Vatican City',
	VE: 'Venezuela',
	VN: 'Vietnam',
	WF: 'Wallis & Futuna',
	YE: 'Yemen',
	ZM: 'Zambia',
	ZW: 'Zimbabwe',
}
