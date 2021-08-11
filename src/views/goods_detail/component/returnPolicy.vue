<template>
    <div>
        <el-dialog :visible.sync="showReturnPolicy.show" width="800px">
            <div class="return-exchanges">
                <div class="return-exchanges-title">Return & Exchanges</div>
                <h3>Returns & Exchanges</h3>
                <ul>
                    <li>We're bummed if you're not 100% satisfied with the items you received, and we gladly accept returns within 45 days of receipt for most items in new condition.</li>
                    <li>1.Please contact Customer Service,indicating the item(s) you would like to return and the reason.</li>
                    <li>2.After receiving return instructions from us, please package the item(s) securely with the original packaging .</li>
                    <li>3.Drop off your package at the local post office.</li>
                    <li>4.Most returns are processed within 5 business days after we receive your package. We'll issue the refund to your payment account. Once your refund has been issued, you will receive a confirmation email.</li>
                </ul>
                <h3>Return Conditions</h3>
                <ul>
                    <li>You have 45 days to decide if an item is right for you. If you would like to return or exchange the item, please contact us within 45 days of delivery.</li>
                    <li>The following items cannot be returned or exchanged: bodysuits, lingerie, swimwear, jewelry, beauty and accessories (except scarves, bags, and mermaid blankets).</li>
                    <li>Returned items must be in unused condition with the original packaging . We do not accept any returned item that has been worn, damaged, washed, or altered in any way.</li>
                    <li>Items with non-returnable marks or free gifts cannot be returned.</li>
                    <li>We do not accept returned items that have been sent back without proper returns requests.</li>
                    <li>We do not offer Freight To Collect (FTC) service for the packages returned to us. The returns will be made at your own cost.</li>
                </ul>
                <h3>Return Address</h3>
                <ul>
                    <li>Please contact our Customer Service, and you will receive a response as soon as possible.</li>
                    <li>Note: Please do not send your return to the address on your package. That is not our return address and will affect the processing of your return.</li>
                </ul>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "returnPolicy-pc",
    props: ['writeReturnPolicy'],
    data() {
        return {
            showReturnPolicy: { show: false } // 退货政策弹框
        }
    },
    mounted() {

    },
    methods: {

    },
    watch: {
        writeReturnPolicy: function (newValue, oldValue) {
            this.showReturnPolicy = newValue
        }
    }
}
</script>

<style scoped>
.return-exchanges {
    padding: 0 30px;
}

.return-exchanges-title {
    font-size: 20px;
    font-weight: bold;
    color: #222222;
    text-align: center;
    margin-bottom: 30px;
}

h3 {
    font-weight: bold;
    color: #222222;
}

ul {
    margin-top: 15px;
    margin-bottom: 20px;
}

ul li {
    margin-bottom: 15px;
}
</style>