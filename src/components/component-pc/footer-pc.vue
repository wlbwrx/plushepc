<template>
    <div class="nav-foot">
        <div class="foot-block">
            <el-row>
                <el-col :span="7">
                    <div class="foot-content">
                        <div class="foot-title">COMPANY INFO</div>
                        <div class="foot-name" @click="$router.push({ path: '/other_info', query: { type: 'about_us' } })">About Us</div>
                        <div class="foot-name" @click="$router.push({ path: '/other_info', query: { type: 'privacy_policy' } })">Privacy Policy</div>
                        <div class="foot-name" @click="$router.push({ path: '/other_info', query: { type: 'terms_conditions' } })">Terms & Conditions</div>
                        <div class="foot-name" @click="$router.push({ path: '/other_info', query: { type: 'faqs' } })">FAQs</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="foot-content">
                        <div class="foot-title">CUSTOMER SERVICE</div>
                        <div class="foot-name" @click="$router.push({ path: '/other_info', query: { type: 'connect_to_us' } })">Contact Us</div>
                        <div class="foot-name" @click="$router.push({ path: '/other_info', query: { type: 'return_exchanges' } })">Return & Exchanges</div>
                        <div class="foot-name" @click="$router.push({ path: '/other_info', query: { type: 'size_guide' } })">Size Guide</div>
                        <div class="foot-name" @click="$router.push({ path: '/other_info', query: { type: 'payment_methods' } })">Payment Methods</div>
                        <div class="foot-name" @click="$router.push({ path: '/other_info', query: { type: 'shipping_information' } })">Shipping Information</div>
                    </div>
                </el-col>
                <el-col :span="11">
                    <div class="foot-content">
                        <span class="foot-app">
                            <div class="foot-title">FOLLOW US</div>
                            <div class="foot-icon">
                                <a href="https://www.pinterest.com/plusheplushe/_created" target="_blank"><img class="foot-img" src="@/assets/images-pc/foot1.png" /></a>
                                <a href="https://www.facebook.com/Plushe-106370298179108" target="_blank"><img class="foot-img" src="@/assets/images-pc/foot2.png" /></a>
                                <a href="https://twitter.com/Plushe_Plushe" target="_blank"><img class="foot-img" src="@/assets/images-pc/foot3.png" /></a>
                                <a href="https://www.instagram.com/plushe_official" target="_blank"><img class="foot-img" src="@/assets/images-pc/foot4.png" /></a>
                                <a href="https://www.youtube.com/channel/UC1zimeXXIcF7HObrwtvoFFA/featured" target="_blank"><img class="foot-img" src="@/assets/images-pc/foot5.png" /></a>
                            </div>
                        </span>
                        <span class="foot-app">
                            <div class="foot-title">APP</div>
                            <div class="foot-icon">
                                <a href="https://apps.apple.com/ca/app/id1562805836" target="_blank"><img class="foot-img" src="@/assets/images-pc/app1.png" /></a>
                                <a href="https://play.google.com/store/apps/details?id=com.plushe.plushe_app" target="_blank"><img class="foot-img" src="@/assets/images-pc/app2.png" /></a>
                            </div>
                        </span>
                        <!-- <div>SIGN UP FOR PLUSHE STYLE NEWS</div>
                        <div class="email-block">
                            <el-input size="small" placeholder="Enter your email address"></el-input>
                            <el-button type="primary" size="small">SUBSCRIBE</el-button>
                        </div>
                        <div>By clicking the SUBSCRIBE button, you are agreeing to our</div> -->
                        <div class="we-accept">WE ACCEPT</div>
                        <div class="pay-img">
                            <img src="@/assets/images-pc/pay1.png" />
                            <img src="@/assets/images-pc/pay2.png" />
                            <img src="@/assets/images-pc/pay3.png" />
                            <img src="@/assets/images-pc/pay4.png" />
                            <img src="@/assets/images-pc/pay5.png" />
                            <img src="@/assets/images-pc/pay6.png" />
                            <img src="@/assets/images-pc/pay7.png" />
                            <img src="@/assets/images-pc/pay8.png" />
                            <img src="@/assets/images-pc/pay9.png" />
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="copy">© 2020-2021 PLUSHE ALL RIGHTS RESERVED</div>
            <div class="copy-plushe">YOUR SIZE YOUR STYLE</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'footer-pc',
    data() {
        return {

        }
    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style scoped>
.nav-foot {
    overflow: hidden;
}

.foot-block {
    color: #666666;
    max-width: 1800px;
    padding: 50px 0;
    margin: auto;
}

.foot-content {
    padding-left: 130px;
}

.foot-content div {
    font-size: 12px;
    font-family: Montserrat Regular;
    margin-top: 15px;
}

.foot-title {
    font-size: 14px !important;
    font-family: Montserrat Regular;
    color: #222222;
    cursor: initial;
}

.foot-name {
    font-family: Montserrat Light !important;
    cursor: pointer;
}

.foot-app {
    margin-right: 60px;
    display: inline-block;
}

.foot-icon .foot-img {
    width: 24px;
    margin-right: 15px;
    cursor: pointer;
}

.email-block {
	align-items: center;
	display: flex;
}

.email-block .el-input {
    margin-top: 0;
    width: 260px;
}

.we-accept {
    font-size: 14px !important;
    color: #222222;
    margin-top: 35px !important;
}

.pay-img img {
    height: 30px;
    margin-right: 8px;
}

.copy {
    font-size: 14px;
    font-family: Montserrat Light;
    color: #222222;
    padding-left: 130px;
    margin-top: 30px;
}

.copy-plushe {
    font-size: 12px;
    font-family: Montserrat Light;
    padding-left: 130px;
    margin-top: 5px;
    margin-bottom: 80px;
}
</style>
