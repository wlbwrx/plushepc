<template>
	<div class="left-menu">
		<div class="menu-detail">
			<div class="menu-detail-img"><i class="iconfont icon-gerenzhongxin" style="font-size: 30px;"></i></div>
			<div class="menu-detail-text">Hi, {{nickName}}</div>
			<i class="iconfont icon-bianji" v-on:click="changeMenu('/personalCenter/myProfile')"></i>
		</div>
		<div v-for="(item, index) in menuList" :key="index">
			<div class="menu-parent-list">
				<div class="menu-parent" v-on:click="changeShow(index, !item.show)" v-bind:class="{'active': active == item.name}">
					{{ item.name }}
					<i v-show="item.child.length" :class="'menu-right-icon' + (item.show ? ' el-icon-arrow-down' : ' el-icon-arrow-up')"></i>
				</div>
				<el-collapse-transition v-if="item.child.length">
					<div class="menu-child-list" v-show="item.show">
						<div v-for="(child, i) in item.child" :key="i">
							<div class="menu-child" v-on:click="changeMenu(child.link)" v-bind:class="{'active': active == child.name}">
								{{ child.title }}
							</div>
						</div>
					</div>
				</el-collapse-transition>
			</div>
		</div>
	</div>
</template>

<script>
import store from 'store'
import { mapActions } from 'vuex'
export default {
	
	data() {
		let userInfo = store.get('userInfo')
		let { nickName } = userInfo || {}
		return {
			active:"",
			nickName: nickName,
			userInfoDetail:store.get('userInfo'),
			menuList: [
				{
					name: 'My Orders',
					link: '/myOrders',
					show: true,
					child: [],
				},
				{
					name: 'My Coupons',
					link: '/myCoupons',
					show: true,
					child: [],
				},
				{
					name: 'My Accout',
					link: 'myAccout',
					show: true,
					child: [
						{title: 'My Profile',
							name: 'My Profile',
							link: '/personalCenter/myProfile',
						},
						{  title: 'My Address',
							name: 'My Address',
							link: '/personalCenter/myAddress',
						},
						{
							title: 'Change Password',
							name: 'Change Password',
							link: '/personalCenter/changePassword',
						},
					],
				},
				{
					name: 'Wishlist',
					link: '/wishlist',
					show: true,
					child: [],
				},
				{
					name: 'SIGN OUT',
					link: '/SignOut',
					show: true,
					child: [],
				},
			],
		}
	},
	methods: {
		...mapActions('user', ['Signout']),
		changeShow(i, bol) {
			if (this.menuList[i].child.length) {
				this.menuList[i].show = bol
			} else {
				if (this.menuList[i].link == '/SignOut') {
					this.$confirm(' Are you sure to Sign out? ', {
						customClass: 'confirm-dialog',
						confirmButtonText: 'SIGN OUT',
						cancelButtonText: 'CANCEL',
						type: 'warning',
						center: true,
					}).then(() => {
						this.Signout().then(() => {
							if(store.get('shipping'))store.remove('shipping')
							if(store.get('billing'))store.remove('billing')
						})
					})
				} else {
					this.changeMenu(this.menuList[i].link)
				}
			}
		},
		changeMenu(link) {
			this.$router.push({ path: link })
		},
	},
	created(){

	},
	watch: {
        $route (to) {
			this.active = to.name
        }
    },
}
</script>

<style lang="less" scoped>
@import '@/style/variable.less';

.left-menu {
	height: 660px;
	width: 280px;
	background-color: @color-FFF;
	padding-left: 20px;
	float: left;
	margin-bottom: 80px;
	/deep/.icon-bianji {
		font-size: 20px;
		line-height: 44px;
		margin-left: 18px;
		cursor: pointer;
	}
	.menu-detail {
		height: 84px;
		padding: 30px 0 10px 0;
		.menu-detail-img {
			width: 44px;
			height: 44px;
			border-radius: 22px;
			text-align: center;
			padding-top:6px;
			background: #f7f8fa;
			float: left;
		}
		.menu-detail-text {
			width: 149px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 20px;
			margin-left: 10px;
			float: left;
			line-height: 44px;
			font-family: Montserrat Semi Bold;
		}
	}
	.menu-title {
		font-size: 18px;
		padding: 30px 0px 10px 0px;
		height: 58px;
		line-height: 18px;
		cursor: pointer;
		font-weight: 500;
	}
	
	.menu-parent {
		height: 36px;
		padding: 20px 20px 0 0px;
		font-family: Montserrat Light;
		font-size: 16px;
		line-height: 16px;
		cursor: pointer;
	}
	.menu-right-icon {
		float: right;
		font-size: 14px;
		color: @color-222;
	}
	.menu-child-list {
		margin-top: 10px;
	}
	.menu-parent-list {
		margin-bottom: 10px;
	}
	.menu-child {
		height: 34px;
		line-height: 14px;
		padding: 10px 0 10px 20px;
		font-size: 14px;
		font-family: Montserrat Light;
		cursor: pointer;
	}
	.active{
		font-family: Montserrat Regular;
	}
}
</style>