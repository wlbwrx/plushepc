<template>
    <div class="reset-pc">
        <div class="reset__after">
            <!-- <van-icon class="reset__after-icon" size="50" name="checked"></van-icon> -->
            <!-- <i class="el-icon-circle-check el-icon-fs"></i> -->
            <el-image class="success-icon" :src="require('../../assets/images/chenggong@2x.png')"></el-image>
            <h3 class="reset__after-tit">CONGRATULATIONS！</h3>
            <p class="reset__after-tips">
                Registration Success！
            </p>
            <p class="receive-title" v-if="receiveList.length > 0">You have received the following coupons!Check "My Coupons" for coupons you just received!</p>
            <div class="receive-list-list" v-if="receiveList.length">
                <div class="coupon-list" v-for="(item, index) in receiveList" :key="index">
                    <div class="coupon-border"></div>
                    <div class="coupon-item">
                        <h2 class="coupon-title">
                            <label>{{ $utils.creditAmount(item) }}</label
                            ><span>{{ item.couponCode }}</span>
                        </h2>
                        <p class="coupon-msg" v-if="item.couponType == 4">For orders over {{item.thresholdNumber}} {{item.thresholdNumber > 1 ? 'items' : 'item'}}</p>
                        <p class="coupon-msg" v-else>For orders over US${{ item.thresholdAmount > 0 ? (item.thresholdAmount / 100).toFixed(2) : 0 }}</p>
                        <div class="coupon-dived">
                            <!-- <p class="coupon-limited">For all users</p> -->
                            <p class="coupon-limited">{{ $utils.creditDays(item, 'cop') }}</p>
                        </div>
                        <div class="coupon-state autoprefixer-one-clamp">{{ item.comment |  productNameFilter(20)}}</div>
                        
                    </div>
                    <div class="coupon-border"></div>
                </div>
            </div>
             <el-button class="submit-btn-44" @click="returnBack()">SHOP NOW</el-button>
        </div>
    </div>
</template>

<script>
    import store from 'store'
    import { Toast } from 'vant'
    import { mapState, mapActions, mapMutations } from 'vuex'
    import http from '@/api/index.js'
    export default {
        props: {
            btnTitle: {
                type: String,
                default: 'OK',
            },
        },
        data() {
            return {
              isReceive: true,  
                receiveList: [],
            }
        },
        filters: {
            // 过滤过长的商品描述
            productNameFilter(obj,num){
                return obj.length > num ?(obj.substring(0,num) + '...') : obj
            },
        },
        computed:{
            // ...mapState('coupon', ['receiveList']),
        },
        components: {
            
        },
        created() {
            this.getCouponList()
        },
        methods:{
            ...mapActions('coupon', ['CONVERTCOUPON', 'getNewComerCoupon', 'getUserEnableSpecialCoupon']),
            ...mapMutations('coupon', ['SET_COUPON_LIST']),
            // receiveBtn() {
            //     let [{ campaignId }] = this.receiveList
            //     this.receiveList
            //     this.CONVERTCOUPON({ campaignId }).then(res => {
            //         if (res.code === 0) {
            //             Toast({
            //                 message: 'Check "My Coupons" for coupons you just received!',
            //                 icon: ' iconfont iconsuccess_no_circle',
            //             });
            //             let userInfo = store.get('userInfo')
            //             userInfo.newPerson = false
            //             store.set('userInfo', userInfo)
            //         }
            //     })
            // },
            returnBack() {
                console.log(this.$store.state.user.backPath)
                this.$router.push({
                    path: this.$store.state.user.backPath,
                })
            },
            loginClose() {
                // this.couponShowed = false
            },
            // H2106101034201263327
            async getCouponList(){
                let result = await http.coupon.newCoupon()
                if (result.data) {
                    http.coupon.covert({ campaignId: result.data }).then(res => {
                        this.receiveList = res.data
                    })
                }
            }
        },
        
        mounted() {
            // setTimeout(() => {
            //     // 直接领取优惠券到账户里
            //     console.log(this.receiveList)
            //     this.receiveBtn()
            // },2000)
        },
        updated() {
            // console.log(this.receiveList)
           // 判断优惠券是否已经领取
            // let userInfoNew = store.get('userInfo').newPerson
            // !userInfoNew ? this.couponShowed = false : this.couponShowed = true
        }
    }
</script>

<style scoped lang="less">
    @import '@/style/variable.less';
    .reset-pc{
        text-align: center;
        padding:140px 0 100px;
        .submit-btn-44{
            height:44px;
            background:@color-222;
            font-size:18px;
            width:183px;
            color:@color-FFF;
            border-radius:0;
            margin-top:50px;
        }
        .reset__after{
            .success-icon{
                width:64px;
                height:64px;
                margin:0 auto;
            }
            .el-icon-fs{
                font-size:64px;
                color:#62b886;
            }
            .reset__after-tit{
                font-size:28px;
                color:@color-222;
                font-weight:bold;
                margin-top:40px;
            }
            .reset__after-tips{
                font-size:16px;
                color:@color-222;
                margin-top:20px;
            }
            .receive-list-list{
                width:400px;
                margin:0 auto;
                .receive-title {
                    width: 100%;
                    text-align: center;
                    color: #666;
                    font-size: 15px;
                    margin-top: 15px;
                }
                .coupon-list {
                    display: flex;
                    margin: 0 40px;
                    padding-top: 10px;
                    text-align:left;
                    .coupon-border {
                        height: 100px;
                        width: 18px;
                        flex-grow: 0;
                        background: url('../../assets/images/coupon_bd.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    .coupon-border:last-child {
                        transform: scaleX(-1);
                    }
                    .coupon-item {
                        color: #fff;
                        width: auto;
                        flex-grow: 1;
                        min-height: 87px;
                        font-size: 12px;
                        background: url('../../assets/images/coupon_bj.png') repeat-x;
                        background-size: 100% 100%;
                        padding:0 5px;
                        .coupon-title {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 6px;
                            label {
                                font-size: 16px;
                            }
                            span {
                                font-size: 14px;
                            }
                        }
                        .coupon-msg {
                            font-size: 12px;
                            margin-top:3px;
                        }
                        .coupon-state {
                            margin-top:5px;
                            color: #4d4d4d;
                        }
                        .coupon-dived{
                            margin-top:10px;
                            .coupon-limited {
                                color: #666;
                                margin-top:3px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>