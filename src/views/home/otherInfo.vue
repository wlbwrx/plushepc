<template>
    <div class="other-info">

        <!--About Us-->
        <div class="other-info-block" v-if="type == 'about_us'">
            <div class="other-info-title">About Us</div>
            <p>Plushe is an international fashion brand that focuses on plus-size women’s apparel, accessories and other fashion items. We are passionately dedicated to helping every woman, especially those with curves, create the life and possibilities she wants and deserves.</p>
            <p>We pride ourselves on offering our exclusive up-to-date styles catering to those seeking the finest value. Because we believe that every curvy woman belongs to the world of fashion just like everybody else, we are deeply inspired to refine and create fashion that truly fits you. Our hope is that when you discover Plushe, you know a better way to treat yourself preciously.</p>
            <img class="about-us-img" src="https://cdn.shopify.com/s/files/1/0518/0447/1450/files/0001.jpg?v=1617796965" />
            <p>Plushe proudly presents our outstanding creative team that always stays on top of the latest global fashion trends. Our creative team adheres to the belief that “every curvy woman deserves better” and constantly strives to discover a better way to express women’s natural beauty and to emphasize it with self-confidence. The team also aims to add an optimistic core to our clothing and is positively conscious of our quality, fit and attitude.</p>
            <p>Plushe has made its way to most consumer markets in the world including North America, South America, Europe, etc,. We are humble to serve our customers and sincerely hope to hear more of your voice.</p>
            <img class="about-us-img" src="https://cdn.shopify.com/s/files/1/0518/0447/1450/files/0002.jpg?v=1617797803" />
        </div>

        <!--Privacy Policy-->
        <div class="other-info-block" v-if="type == 'privacy_policy'">
            <div class="other-info-title">Privacy Policy</div>
            <p class="other-title">Plushe PRIVACY POLICY</p>
            <p>This Privacy Policy explains how Plushe (collectively, "Plushe," "our," "us," or "we") collect, use,share and process your information as well as you and our legal rights and responsibilities with respect to that information. This Privacy Policy applies to all personal information collected during any written, electronic, and oral communications or collected online or offline, which include: our website, located at PLUSHE.COM as well as any other written, electronic, and oral communications with Plushe and its representative parties (collectively, the “Services”). Plushe takes very seriously its responsibility to protect the safety and security of your Personal Information that we process and is committed to respecting your privacy rights.</p>
            <p class="other-title">1.Personal Information That We Collect</p>
            <p class="other-title">We collect personal information when you register or make a purchase on our website. Personal information generally is any information that relates to you, identifies you personally or could be used to identify you, such as your name, email address, phone number, and address. We may use this personal information to provide our products or services to you.</p>
            <p class="other-title">We collect personal information when you send us message, email or call us. We may use this information to respond to you or reply you.</p>
            <p class="other-title">We collect personal information when you subscribe. We collect your email address information when you subscribe Plushe NEWSLETTER to receive updates, access to exclusive deals, and more.</p>
            <p class="other-title">General Uses. We’ll use your information to process the order. We may also use the Personal Information to optimize our service to you and send you information about our new products, promotion or discount that you may be interested in with your consent where necessary.</p>
            <p class="other-title">Passively Collected Information. We use passively collected information to monitor and control the performance of our Sites, analyze trends, usage and activities in connection with our services, validate users and ensure their technological compatibility with users, and optimize our marketing efforts.</p>
            <p class="other-title">Combination information. We may combine the information we collect to create aggregate data which does not include any Personal Information and which cannot be used to identify you. Such as the general demographics, usage or other characteristics of a website's users. We reserve the legal right to transfer and/or sell aggregate or group data about a Site's users for lawful purposes.</p>
            <p class="other-title">2.Shopify</p>
            <p>Our store is hosted on Shopify Inc. They provide us with the online e-commerce platform that allows us to sell our products and services to you.</p>
            <p>Your data is stored through Shopify’s data storage, databases and the general Shopify application. They store your data on a secure server behind a firewall.</p>
            <p class="other-title">Payment:</p>
            <p>If you choose a direct payment gateway to complete your purchase, then Shopify stores your credit card data. It is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS). Your purchase transaction data is stored only as long as is necessary to complete your purchase transaction. After that is complete, your purchase transaction information is deleted.</p>
            <p>All direct payment gateways adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, MasterCard, American Express and Discover.</p>
            <p>PCI-DSS requirements help ensure the secure handling of credit card information by our store and its service providers.</p>
            <p>For more insight, you may also want to read Shopify’s Terms of Service (https://www.shopify.com/legal/terms) or Privacy Statement (https://www.shopify.com/legal/privacy).</p>
            <p class="other-title">3.The Third-Party Services</p>
            <p>In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us.</p>
            <p>However, certain third-party service providers, such as payment gateways and other payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for your purchase-related transactions.</p>
            <p>For these providers, we recommend that you read their privacy policies so you can understand the manner in which your personal information will be handled by these providers.</p>
            <p>These third parties do not have any independent right to share your Personal Information. We will exercise reasonable measures to have the third parties to whom we disclose your Personal Information respect your Personal Information and comply with applicable data protection laws.</p>
            <p class="other-title">Links to Other Websites. When you click on links on our store, they may direct you away from our site. We are not responsible for the privacy practices or the content of such websites. We suggest that you contact these third parties directly for information regarding their privacy, security and data collection and distribution policies prior to providing them with any information.</p>
            <p class="other-title">Google analytics. To help facilitate the delivery of relevant content, we use Google Analytics and have implemented the following Google Advertising Features: Remarketing, Impression Reporting, and Demographics and Interest Reporting. We use Google Analytics cookies and other Google advertising cookies. You can opt out of the Google Analytics Advertising Features we use by indicating your preference using the interest-based opt-out link here. Google also provides a complete privacy policy, and instructions on opting out of Google Analytics here. Note that Google's opt-out mechanism is specific to Google activities and does not affect the activities of other ad networks or analytics providers that we may use.</p>
            <p class="other-title">4.Security</p>
            <p>To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.</p>
            <p>If you provide us with your credit card information, the information is encrypted using secure socket layer technology (SSL) and stored with a AES-256 encryption. Although no method of transmission over the Internet or electronic storage is 100% secure, we follow all PCI-DSS requirements and implement additional generally accepted industry standards.</p>
            <p class="other-title">5.Cookies</p>
            <p>Our website will use cookies but you can choose if you want to opt-out of cookies or not.</p>
            <p>The way we use:</p>
            <p>- Instructions on how to opt out of receiving targeted advertising or may have Opt-out link.</p>
            <p>- The advertiser needs to include opt-out information or link in the privacy policy section in order to toggle privacy policy to yes.</p>
            <p>PREF, persistent for a very short period, Set by Google and tracks who visits the store and from where.</p>
            <p class="other-title">6.Changes to This Privacy Policy</p>
            <p>Plushe may change this Privacy Policy from time to time to reflect our current practices. So please review it frequently. Any changes to this Privacy Policy will be updated on PLUSHE.COM and will be effective when posted unless another date is referenced in the notice.</p>
            <p class="other-title">7.Complaints and Contact Us</p>
            <p>If you have any complaints concerning your personal information that Plushe collected, you want Plushe to delete your personal information or you just want to know more about our Privacy Policy. Please feel free to contact us at <a href="mailto:VIPsupport@plushe.com">VIPsupport@plushe.com</a></p>
        </div>

        <!--Terms & Conditions-->
        <div class="other-info-block" v-if="type == 'terms_conditions'">
            <div class="other-info-title">Terms & Conditions</div>
            <p class="other-title">These Terms and Conditions May Change</p>
            <p>We reserve the right to update or modify these terms and conditions at any time without prior notice. Your use of www.plushe.com following any such change constitutes your agreement to follow and be bound by the terms and conditions as changed. For this reason, we encourage you to review these terms and conditions whenever you use this website.</p>
            <p class="other-title">Limitations of Liability</p>
            <p>Plushe shall not assume any responsibility, and shall not be liable for any damages or viruses that may infect your computer, telecommunication equipment, or other property caused by or arising from your access to, use of, or browsing this website or your downloading of any materials, from this website. In no event will Plushe nor their respective officers, directors, employees, shareholders, affiliates, agents, successors, assigns, retail partners nor any party involved in the creation, production or transmission of this website be liable to any party for any indirect, special, punitive, incidental or consequential damages (including, without limitation, those resulting from lost profits, lost data or business interruption) arising out of the use, inability to use, or the results of use of this website, any websites linked to this website, or the materials, information or services contained at any or all such sites, whether based on warranty, contract, tort or any other legal theory and whether or not advised of the possibility of such damages. The foregoing limitations of liability do not apply to the extent prohibited by law. Please refer to your local laws for any such prohibitions.</p>
            <p>In the event of any problem with this website or any content, you agree that your sole remedy is to cease using this website. In the event of any problem with the products or services that you have purchased on or through this website, you agree that your remedy, if any, is from the manufacturer of such products or supplier of such services, in accordance with such manufacturer’s or supplier’s warranty, or to seek a return and refund for such product or services in accordance with the returns and refunds policies posted on this website. This site may include inaccuracies, mistakes or typographical errors. It does not warrant that the content will be uninterrupted or error-free.</p>
            <p class="other-title">Copyright and Trademark</p>
            <p>Unless otherwise indicated, the material on this website, including but not limited to texts, images, illustrations, software, audio clips, video clips, animation files, is subject to the copyright and trademark rights of Plushe. Consequently, the material on this website may not be copied, reproduced, modified, posted, transmitted, distributed, in whole or in part in any form whatsoever, without the prior written consent of Plushe. All rights reserved.</p>
            <p class="other-title">Products, Content and Specifications</p>
            <p>All features, content, specifications, products and prices of products and services described or depicted on this website are subject to change at any time without notice. Certain weights, measures and similar descriptions are approximate and are provided for convenience purposes only. We make all reasonable efforts to accurately display the attributes of our products, including the applicable colors; however, the actual color you see will depend on your computer system, and we cannot guarantee that your computer will accurately display such colors. The inclusion of any products or services on this website at a particular time does not imply or warrant that these products or services will be available at any time. It is your responsibility to ascertain and obey all applicable local, state and international laws in regard to the possession, use and sale of any item purchased from this website. By placing an order, you represent that the products ordered will be used only in a lawful manner.</p>
            <p class="other-title">Shipping Limitations</p>
            <p>When an order is placed, it will be shipped to an address designated by the purchaser as long as that shipping address is compliant with the shipping restrictions contained on this website. All purchases from this website are made pursuant to a shipment contract. As a result, risk of loss and title for items purchased from this website pass to you upon delivery of the items to the carrier. You are responsible for filing any claims with carriers for damaged and/or lost shipments.</p>
            <p class="other-title">Duties and Taxes</p>
            <p>You are responsible for duties and taxes. All items entering a foreign country are subject to customs inspection and assessment of the duties and taxes in accordance with that country’s national laws.</p>
            <p class="other-title">Your Account</p>
            <p>You are responsible for maintaining the confidentiality of your account and password information, and you agree to accept responsibility for all activities that occur under your account and password. This website and Plushe reserve the right to refuse service, terminate accounts, remove or edit content or cancel orders.</p>
            <p>By placing an order, you warrant that you are over 18 years old , and that you are providing www.plushe.com with accurate, truthful information and that you have the authority to place the order.</p>
            <p class="other-title">Exchange and Refund Policy</p>
            <p>EXCHANGE AND REFUND POLICY</p>
            <p>Electronic Communications</p>
            <p>When you visit this website and/or send email to us, you consent to receive electronic communications from us. You agree that all agreements, notices, disclosures and other communications that we sent you electronically satisfy any legal requirement that such communications be in writing.</p>
            <p>Exclusions of Warranties</p>
            <p>Plushe makes no representation or warranty regarding the good working order or condition of this website, its suitability for use, or that its use will be uninterrupted or error-free. All information or material provided in this website to you AS IS and without warranties of any kind, expressed or implied, including without limitation, warranties or conditions of merchantability, fitness, quality, durability or suitability for any particular purpose, or non-infringement.</p>
            <p class="other-title">GOVERNING LAW</p>
            <p>These Terms of Service and any separate agreements whereby we provide you shall be governed by and construed in accordance with the laws of the UK.</p>
        </div>

        <!--FAQs-->
        <div class="other-info-block" v-if="type == 'faqs'">
            <div class="other-info-title">FAQ</div>
            <p class="other-title">ACCOUNT</p>
            <el-collapse class="faq-collapse" value="1">
                <el-collapse-item name="1">
                    <template slot="title"><div class="faq-title">How to order?</div></template>
                    <p>Click ‘Buy it now’ and proceed to checkout directly,</p>
                    <p>Or ‘Add to cart’ a few items and then click ‘Checkout’.</p>
                </el-collapse-item>
                <el-collapse-item>
                    <template slot="title"><div class="faq-title">Do I need to create an account to place an order?</div></template>
                    <p>You can checkout directly, and your shipping information can be stored for the future use. To receive information on new offers and your order details, sign up here: </p>
                    <p class="loginSignUp" @click="loginSignUp">Sign Up</p>
                </el-collapse-item>
            </el-collapse>
            <p class="other-title">SHIPPING</p>
            <el-collapse class="faq-collapse">
                <el-collapse-item>
                    <template slot="title"><div class="faq-title">Payment method</div></template>
                    <p>We accept payments via credit and debit cards, and PayPal.</p>
                </el-collapse-item>
                <el-collapse-item>
                    <template slot="title"><div class="faq-title">How long does shipping take?</div></template>
                    <p>Shipping takes about 7 to 19 business days depending on your location and the type of shipping. More details here: </p>
                    <p class="loginSignUp" @click="shippingInfo('/other_info?type=shipping_information')">Shipping Info</p>
                </el-collapse-item>
                <el-collapse-item>
                    <template slot="title"><div class="faq-title">Do you offer free shipping?</div></template>
                    <p>You automatically get free shipping when your order exceeds $59.</p>
                </el-collapse-item>
            </el-collapse>
            <p class="other-title">PRODUCT</p>
            <el-collapse class="faq-collapse">
                <el-collapse-item>
                    <template slot="title"><div class="faq-title">Do you accept returns?</div></template>
                    <p>Yes, we gladly accept returns within 45 days of receipt for most items in new condition (except bodysuits, lingerie, swimwear, jewelry). The items must be unused and in original packaging. For more details on return & exchange policy, please visit: </p>
                    <p class="loginSignUp" @click="shippingInfo('/other_info?type=return_exchanges')">Return & Exchanges</p>
                    <p>You can contact Customer service directly to submit your return application or inquiry: </p>
                    <p class="loginSignUp" @click="shippingInfo('/other_info?type=connect_to_us')">Contact Us</p>
                </el-collapse-item>
                <el-collapse-item>
                    <template slot="title"><div class="faq-title">How to choose my size?</div></template>
                    <p>The size info for each product can be found in the last picture of each product. You can find a detailed size guide here: </p>
                    <p class="loginSignUp" @click="shippingInfo('/other_info?type=size_guide')">How to Choose Your Size</p>
                </el-collapse-item>
                <el-collapse-item>
                    <template slot="title"><div class="faq-title">Do you have any discounts or sales?</div></template>
                    <p>Yes, we provide various offers such as free shipping, discounts and sales.</p>
                </el-collapse-item>
            </el-collapse>
        </div>

        <!--Contact Us-->
        <div class="other-info-block" v-if="type == 'connect_to_us'">
            <div class="other-info-title">Contact Us</div>
            <el-row>
                <el-col :span="24" class="card-list">
                    <el-card shadow="hover">
                        <div class="card-content">
                            <div class="card-left">
                                <div><i class="iconfont iconyouxiang"></i>Email To Us</div>
                                <div>Email:plusheservice@gmail.com</div>
                            </div>
                            <div><a href="mailto:plusheservice@gmail.com"><el-button type="primary">Follow</el-button></a></div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="24" class="card-list" v-for="(item, index) in connectList[platform].list" :key="index">
                    <el-card shadow="hover">
                        <div class="card-content">
                            <div class="card-left">
                                <div><img :src="item.img" /></div>
                                <div><img :src="connectList[platform].logo" />{{ connectList[platform].name }}</div>
                            </div>
                            <div><a :href="item.url" target="_blank"><el-button type="primary">Follow</el-button></a></div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!--Return & Exchanges-->
        <div class="other-info-block" v-if="type == 'return_exchanges'">
            <div class="other-info-title">Return & Exchanges</div>
            <p class="other-title">Return & Exchanges</p>
            <p>We're bummed if you're not 100% satisfied with the items you received, and we gladly accept returns within 45 days of receipt for most items in new condition.</p>
            <p>1.Please contact Customer Service,indicating the item(s) you would like to return and the reason.</p>
            <p>2.After receiving return instructions from us, please package the item(s) securely with the original packaging.</p>
            <p>3.Drop off your package at the local post office.</p>
            <p>4.Most returns are processed within 5 business days after we receive your package. We'll issue the refund to your payment account. Once your refund has been issued, you will receive a confirmation email.</p>
            <p class="other-title">Return Conditions</p>
            <p>You have 45 days to decide if an item is right for you. If you would like to return or exchange the item, please contact us within 45 days of delivery.</p>
            <p>The following items cannot be returned or exchanged: bodysuits, lingerie, swimwear, jewelry, beauty and accessories (except scarves, bags, and mermaid blankets).</p>
            <p>Returned items must be in unused condition with the original packaging . We do not accept any returned item that has been worn, damaged, washed, or altered in any way.</p>
            <p>Items with non-returnable marks or free gifts cannot be returned.</p>
            <p>We do not accept returned items that have been sent back without proper returns requests.</p>
            <p>We do not offer Freight To Collect (FTC) service for the packages returned to us. The returns will be made at your own cost.</p>
            <p class="other-title">Return Address</p>
            <p>Please contact our Customer Service, and you will receive a response as soon as possible.</p>
            <p>Note: Please do not send your return to the address on your package. That is not our return address and will affect the processing of your return.</p>
        </div>

        <!--Size Guide-->
        <div class="other-info-block" v-if="type == 'size_guide'">
            <div class="other-info-title">Size Guide</div>
            <p class="other-title">How To Measure</p>
            <p class="other-title text-red">***Due to the size differences of each product, please check the last picture of each product (size info) before you decide on your size. ***</p>
            <p>This size chart is for reference purposes only. Note that sizing will vary between brands.</p>
            <img class="size-guide-img" src="../../assets/images-pc/size_dx2x.png" />
            <p class="other-title">1 Bust</p>
            <p>Measure from the stitches below the armpits on one side to another.</p>
            <p class="other-title">2 Waist</p>
            <p>Measure straight across the narrowest waist line from edge to edge.</p>
            <p class="other-title">3 Hips</p>
            <p>Measureacross straight across the widest hip line from edge to edge.</p>
            <img class="size-guide-img" src="../../assets/images-pc/size_qz2x.png" />
            <p class="other-title">1 Bust</p>
            <p>Measure from the stitches below the armpits on one side to another.</p>
            <p class="other-title">2 Waist</p>
            <p>Measure straight across the narrowest waist line from edge to edge.</p>
            <p class="other-title">3 Hips</p>
            <p>Measureacross straight across the widest hip line from edge to edge.</p>
            <img class="size-guide-img" src="../../assets/images-pc/size_ck2x.png" />
            <p class="other-title">1 Waist</p>
            <p>Measure straight across the narrowest waist line from edge to edge.</p>
            <p class="other-title">2 Hips</p>
            <p>Measureacross straight across the widest hip line from edge to edge.</p>
        </div>

        <!--Payment Methods-->
        <div class="other-info-block" v-if="type == 'payment_methods'">
            <div class="other-info-title">Payment Methods</div>
            <img class="payment-methods-img" src="../../assets/images-pc/payment.png" />
            <p>The available payment options are listed above. The credit card companies listed above are the most commonly used credit cards on this website. Do not worry if your credit card company is not listed, we encourage you to go ahead and make the purchase. You could also use Apple Pay, Google Pay, Shop Pay or Paypal payment methods listed above.</p>
            <p>Please note that Plushe does not collect your credit/debit card number or personal information when you make a payment. For questions regarding your transactions on our site, please consult your card-issuing bank for information.</p>
            <p>When you place an order with Paypal you will be redirected to the PayPal payment page, where you can confirm your payment by logging in with your PayPal username and password.</p>
            <p>You may still check out even without a PayPal account. To do so, please click on "Pay with Debit/Credit Card" and you’ll be redirected to a secure page where you can enter your credit card information or complete your payment safely via PayPal.</p>
        </div>

        <!--Shipping Information-->
        <div class="other-info-block" v-if="type == 'shipping_information'">
            <div class="other-info-title">Shipping Information</div>
            <p>Items require additional delivery time due to the challenges of COVID-19.</p>
            <p>Shipping from Global（1-3 business days for processing)</p>
            <p class="other-title text-red">Free Standard Shipping for orders over $59</p>
            <el-table :data="shippingList" border>
                <el-table-column prop="name" label="Options"></el-table-column>
                <el-table-column prop="desc" label="Shipping Time"></el-table-column>
                <el-table-column prop="fee" label="Cost"></el-table-column>
            </el-table>
            <p>* Shipping time is estimated and commences from the date of shipping, rather than the date of order, and can take longer than expected due to invalid address, customs clearance procedures or other causes.</p>
        </div>

    </div>
</template>

<script>
import http from '@/api/index.js'
import {mapGetters} from 'vuex'
export default {
    name: 'otherInfo-pc',
    data() {
        return {
            type: this.$route.query.type,
            platform: this.$store.getters.platformId, // 1.Plushe 2.GeeMart
            shippingList: [],
            connectList: { // 目前只有plushe的联系我们
                1: {
                    name: 'Plusheofficial',
                    logo: require('@/assets/logo_p.png'),
                    list: [{
                        img: require('@/assets/images-pc/youtube.png'),
                        url: 'https://www.youtube.com/channel/UC1zimeXXIcF7HObrwtvoFFA/about'
                    }, {
                        img: require('@/assets/images-pc/facebook.png'),
                        url: 'https://www.facebook.com/Plushe-106370298179108'
                    }, {
                        img: require('@/assets/images-pc/twitter.png'),
                        url: 'https://twitter.com/Plushe_Plushe'
                    }, {
                        img: require('@/assets/images-pc/Instagram.png'),
                        url: 'https://www.instagram.com/plushe_official'
                    }, {
                        img: require('@/assets/images-pc/pinterest.png'),
                        url: 'https://www.pinterest.com/plusheplushe/_created'
                    }]
                },
                2: {
                    name: 'GeeMartofficial',
                    logo: require('@/assets/gee-logo.png'),
                    list: [{
                        img: require('@/assets/images-pc/youtube.png'),
                        url: 'https://www.youtube.com/channel/UC1zimeXXIcF7HObrwtvoFFA/about'
                    }, {
                        img: require('@/assets/images-pc/facebook.png'),
                        url: 'https://www.facebook.com/Plushe-106370298179108'
                    }, {
                        img: require('@/assets/images-pc/twitter.png'),
                        url: 'https://twitter.com/Plushe_Plushe'
                    }, {
                        img: require('@/assets/images-pc/Instagram.png'),
                        url: 'https://www.instagram.com/plushe_official'
                    }, {
                        img: require('@/assets/images-pc/pinterest.png'),
                        url: 'https://www.pinterest.com/plusheplushe/_created'
                    }]
                }
            }
        }
    },
    components: {
        
    },
    computed:{
        ...mapGetters(['token']),
    },
    mounted() {
        if (this.type == 'shipping_information') {
            // 获取物流信息
            this.getShipping()
        }
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
        },
        loginSignUp(){
            if(this.token){
                return false
            }else{
                this.$store.commit('user/loginDialogIs', true)
            }
            
        },
        shippingInfo(url){
            this.$router.push({
                path: url
            })
        }
    },
    watch: {
        $route () {
            this.type = this.$route.query.type
            if (this.type == 'shipping_information') {
                // 获取物流信息
                this.getShipping()
            }
        }
    },
}
</script>

<style scoped>
.other-info {
    margin: auto;
}
.loginSignUp{
    cursor:pointer;
    text-decoration: underline;
}
.other-info-block {
    width: 800px;
    margin: 80px auto;
}

.other-info-title {
    font-size: 30px;
    font-family: Montserrat Regular;
    text-align: center;
    margin-bottom: 50px;
}

p {
    font-size: 14px;
    font-family: Montserrat Regular;
    color: #595959;
    line-height: 1.5;
    margin-top: 20px;
}

.other-title {
    font-size: 18px;
    font-family: Montserrat Medium;
    color: #222222;
}

.el-table {
    margin-top: 20px;
}

.text-red {
    color: #ff2a00;
}

.about-us-img {
    width: 100%;
    margin: 50px auto;
    display: block;
}

.faq-collapse {
    margin-top: 20px;
    margin-bottom: 50px;
}

.faq-collapse .faq-title {
    font-size: 14px;
    font-family: Montserrat Regular;
    color: #222222;
    padding-left: 20px;
}

.size-guide-img {
    width: 160px;
    margin: 50px auto;
    display: block;
}

.card-list {
    margin-top: 15px;
}

.card-content {
    color: #222222;
    align-items: center;
    justify-content: space-between;
    display: flex;
}

.card-left div:nth-child(1) {
    font-size: 18px;
    align-items: center;
    display: flex;
}

.card-left div:nth-child(1) i {
    font-size: 26px;
    margin-right: 5px;
}

.card-left div:nth-child(1) img {
    width: 100px;
}

.card-left div:nth-child(2) {
    color: #595959;
    margin-top: 15px;
    align-items: center;
    display: flex;
}

.card-left div:nth-child(2) img {
    height: 14px;
    margin-right: 5px;
}

.payment-methods-img {
    margin: auto;
    display: block;
}
</style>
