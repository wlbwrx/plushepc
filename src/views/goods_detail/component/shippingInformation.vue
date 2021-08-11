<template>
    <div>
        <el-dialog :visible.sync="showShippingInformation.show" width="800px">
            <div class="shipping-information">
                <div class="shipping-information-title">Shipping Information</div>
                <p>Items require additional delivery time due to the challenges of COVID-19.</p>
                <p>Shipping from Global（1-3 business days for processing)</p>
                <p><strong>Free Standard Shipping for orders over $59</strong></p>
                <el-table :data="shippingList" border>
                    <el-table-column prop="name" label="Options"></el-table-column>
                    <el-table-column prop="desc" label="Shipping Time"></el-table-column>
                    <el-table-column prop="fee" label="Cost"></el-table-column>
                </el-table>
                <p>* Shipping time is estimated and commences from the date of shipping, rather than the date of order, and can take longer than expected due to invalid address, customs clearance procedures or other causes.</p>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import http from '@/api/index.js'

export default {
    name: "shippingInformation-pc",
    props: ['writeShippingInformation'],
    data() {
        return {
            showShippingInformation: { show: false }, // 物流信息弹框
            shippingList: []
        }
    },
    mounted() {

    },
    methods: {
        // 获取物流信息
        getShipping: function () {
            http.goodsDetail.shipping().then(res => {
                var list = []
                for (const i in res.data) {
                    list.push({
                        name: res.data[i].name,
                        desc: res.data[i].desc,
                        fee: 'US$' + (res.data[i].fee / 100).toFixed(2)
                    })
                }
                this.shippingList = list
            })
        }
    },
    watch: {
        writeShippingInformation: function (newValue, oldValue) {
            this.showShippingInformation = newValue
            // 获取物流信息
            this.getShipping()
        }
    }
}
</script>

<style scoped>
.shipping-information {
    padding: 0 30px;
}

.shipping-information-title {
    font-size: 20px;
    font-weight: bold;
    color: #222222;
    text-align: center;
    margin-bottom: 30px;
}

p {
    color: #595959;
    line-height: 1.5;
    margin-top: 20px;
}

p strong {
    color: #e84646;
}

.el-table {
    margin-top: 20px;
}
</style>