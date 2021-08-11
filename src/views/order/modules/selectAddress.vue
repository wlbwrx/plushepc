<template>
    <el-dialog title="" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <div class="address-title">My Addresses</div>
        <div class="address-box">
            <div v-for="item in addressList" :key="item.id" class="address-list">
                <div class="address-item">
                    <div class="address-contact">
                        <div class="autoprefixer-one-clamp">{{ item.firstName + ' ' + item.lastName }}</div>
                        <span>{{ item.phoneCode + ' ' + item.phoneNumber }}</span>
                    </div>
                    <span class="set-default-address" @click.stop="setAddress('set',item)">Use this address</span>
                </div>
                <div class="address-detail text-hidden-row-2">
                    <span class="text-hidden-row-2"><i v-if="item.isDefaultAddress===1" class="default">Default</i>{{ item.firstAddress + ' ' + item.secondAddress + ' ' + item.city + ' ' + item.state + ' ' + item.country + ' ' + item.postCode }}</span><a @click.stop="setAddress('edit', item.addressId)">Edit</a>
                </div>
            </div> 
        </div> 
        <div class="new-address-btn">
            <el-button type="primary" @click.stop="setAddress('new')">Add New Address</el-button>
        </div>
        
    </el-dialog>
    
</template>
<script>

import mixin from '@/views/address/mixin'
export default {
    props: ['addressType'],
    mixins: [mixin],
    data() {
      return {
        dialogFormVisible: false,
      }
    },
    methods:{
        // setAddress(type, item){
        //     this.dialogFormVisible = false
        //     souceType
        //     // 'SET_shippingAddress', 'SET_billingAddress'
        //     // this.$emit('click-addres', type, item )
        // },
        showDialogs(type){
            this.souceType = type
            this.dialogFormVisible = true
            this.getUserAddresList()
        }
    }
}
</script>
<style scoped lang="less">
.address-title{
    font-size:24px;color:#222;font-family: Montserrat Regular;
}
.address-box{
    height:400px;padding-right: 20px;overflow-y: scroll;
}
.address-list{
    margin-top:40px;
    .address-item{
        display: flex;justify-content: space-between;
        .address-contact{align-items: center;display: flex;
            .autoprefixer-one-clamp{display:block;white-space:nowrap;width:320px;font-size:22px;color:#222;font-family: Montserrat Regular;}
            span{font-size:20px;color:#595959;font-family: Montserrat Light;margin-left:20px;}
        }
        .set-default-address{
            font-size: 14px;font-family: Montserrat Light;
            display: block;flex-shrink: 0;cursor: pointer;
            padding:6px 10px;border:1px solid #222;
        }
    }
    .address-detail{font-family: Montserrat Light;padding:8px 0 20px;align-items: center;display: flex;justify-content: space-between;
        .default{font-size: 14px;color:#E84646;background:#F6D5D5;padding:2px 6px;font-style:normal;margin-right:5px;}
        span{font-size: 20px;display: block;flex: 10;}
        a{display:block;cursor: pointer;color:#5689C6;font-size:14px;text-align: right;flex: 1;}
    }
}
.new-address-btn{width:100%;margin:40px 0 20px;text-align: center;}
</style>