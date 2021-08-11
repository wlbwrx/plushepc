const getters = {
	platformId: state => state.app.platformId, // 平台ID
	shopsId: state => state.app.shopsId, // 店铺id
	token: state => state.user.token, // token
	nickName: state => state.user.nickName, // 用户昵称
	newPeopleCouponVal: state => state.user.newPeopleCouponVal,
}
export default getters
