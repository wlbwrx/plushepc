<template>
    <div class="coupon-item">
        <div class="coupon-item-box">
            <img :src='imgSrc'>
            <!-- <i class="iconfont" :class="{ 'iconpromo': mode==='promo', 'iconcoupon': mode==='coupon' }"></i> -->
            <div class="coupon-item-content">
                <slot></slot>
            </div>
        </div>
        <div class="coupon-item-amount">
            <label v-if="(mode==='promo' && amount > 0) || (mode==='coupon' && couponCode)">-US${{amount | filterPrice}}</label>
            <i class="iconfont icon-fanhui"></i>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        mode: {
            type: [String],
            default: 'promo'
        },
        amount: {
            type: [Number, String],
            default: 0
        },
        couponCode: {
            type: [Number, String],
            default: ''
        },
    },
    data(){
        return {
            imgSrc: this.mode==="promo"?require('@/assets/images/icons/icon-discount.png'):require('@/assets/images/icons/gift-icon.png')
        }
    }
}
</script>
<style lang="less" scoped>
.coupon-item{
    display: flex;border: 1px solid #ccc;justify-content: space-between;align-items: center;padding: 14px;
    .coupon-item-box{
        display: flex;align-items: center;margin-right:20px;img{max-height:25px;};
        .coupon-item-content{margin-left: 10px;
            h2{font-size: 14px;font-family: Montserrat Light;line-height: 1.5;margin-bottom:0px;}
            .coupon-item-code{color:#999;}
        }
    }
    .coupon-item-amount{display: flex;flex-shrink:0;
        label{font-size: 14px;font-family: Montserrat Light;color:#E81027;margin-right:5px;display: block;}
        i{font-size: 6px;color:#ccc;}
    }
}
</style>