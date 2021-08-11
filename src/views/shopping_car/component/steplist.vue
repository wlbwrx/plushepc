<template>
    <div class="step-list">
        <!-- 购物车到下单step步骤条 -->
        <div class="car-step-list">
            <div class="car-step-list_li" v-for="(item,index) of stepList" :key="index" :class="[{'activeStep': item.index == actived}]">
                {{item.name}}
                <i class="el-icon-arrow-right" v-if="item.next"></i>
            </div>
        </div>
    </div>
</template>

<script>
import shopcar from '@/mixins/shopCar.js'
export default {
    mixins: [shopcar],
    data() {
        return {

        }
    }
}
</script>

<style scoped lang="less">
    @import '@/style/variable.less';
    .step-list{
        .car-step-list{
            display:-webkit-flex;
            display:flex;
            width:600px;
            margin:0 auto;
            .car-step-list_li{
                margin-left:24px;
                color:@color-999;
                font-size:16px;
                font-family: Montserrat Light;
                &:first-child{
                    margin-left:0;
                }
                .el-icon-arrow-right{
                    font-size: 12px;
                    margin-left:30px;
                    display:inline-block;
                }
                &.activeStep{
                    font-family: Montserrat Regular;
                    color:@color-222;
                }
            }
        }
    }
</style>