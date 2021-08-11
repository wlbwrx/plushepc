<template>
    <div class="reset-pc">
        <div class="reset__before">
            <h3 class="reset__before-title">RESET PASSWORD</h3>
            <p class="reset__before-tips">
                Please enter your email to receive a reset link
            </p>
            <div class="enter-email">
                <field-input :value.sync="form.userEmail" label="Email Address:" :error="errorEmail" @onblur="blurEmail" :terminal="plushePc" hideIcon></field-input>
            </div>
            <div class="login-submit-box">
                <el-button class="submit-btn-44" @click="submit('sendRestEmail')">SUBMIT</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import FieldInput from './components/FieldInput.vue'
    import login from '@/mixins/login.js'
    export default {
        mixins: [login],
        data() {
            return {
                plushePc: 'plushePc',
                progress: 0  // 判断是否已经发送了邮件
            }
        },
        components: {
            FieldInput
        },
        created() {
            this.form.userEmail = this.$route.query.userEmail
        },
        updated(){
            console.log(this.$route.query.progress)
        },
        methods:{

        }
    }
</script>

<style scoped lang="less">
    @import '@/style/variable.less';
    .reset-pc{
        text-align: center;
        padding:140px 0 100px;
        .reset__before-title{
            font-size:30px;
            color:@color-222;
        }
        .reset__before-tips{
            margin-top:26px;
            font-size:16px;
            margin-bottom:70px;
        }
        .enter-email{
            width:440px;
            margin:0 auto;
        }
        .submit-btn-44{
            height:44px;
            background:@color-222;
            font-size:18px;
            width:183px;
            color:@color-FFF;
            border-radius:0;
            margin-top:70px;
        }
        
    }
</style>