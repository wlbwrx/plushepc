
<template>
    <div class="reset-pc">
        <div class="reset__after">
            <!-- <van-icon class="reset__after-icon" size="50" name="checked"></van-icon> -->
            <!-- <i class="el-icon-circle-check el-icon-fs"></i> -->
            <el-image class="success-icon" :src="require('../../assets/images/chenggong@2x.png')"></el-image>
            <h3 class="reset__after-tit">The link to reset password has been sent to {{ form.userEmail }}</h3>
            <p class="reset__after-tips">
                Please wait a few minute or check your junk mailbox if you cannot receive the email
            </p>
            <el-button class="submit-btn-44" @click="submit('sendRestEmail')">RESEND</el-button>
        </div>
    </div>
</template>

<script>
    import login from '@/mixins/login.js'
    export default {
        mixins: [login],
        created(){
           this.form.userEmail = this.$route.query.userEmail
        }
    }
</script>

<style lang="less" scoped>
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
                font-size:16px;
                color:@color-222;
                font-weight:bold;
                margin-top:40px;
            }
            .reset__after-tips{
                font-size:12px;
                color:@color-222;
                margin-top:20px;
            }
        }
    }
    
</style>