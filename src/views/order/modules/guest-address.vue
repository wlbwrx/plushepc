
<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="show-two-tables">
            <el-form-item label-width="0" prop="firstName">
                <el-input minlength="2" maxlength="30" placeholder="*First Name" v-model.trim="ruleForm.firstName"></el-input>
            </el-form-item>
            <el-form-item label-width="0" prop="lastName">
                <el-input minlength="2" maxlength="30" placeholder="*Last Name" v-model="ruleForm.lastName"></el-input>
            </el-form-item>
        </div>
        <el-form-item label-width="0" prop="firstAddress">
            <el-input minlength="2" maxlength="50" placeholder="*Address Line 1: Street, Address, Company Name, C/O" v-model="ruleForm.firstAddress"></el-input>
        </el-form-item>
        <el-form-item label-width="0" prop="secondAddress">
            <el-input maxlength="50" placeholder="*Address Line 2: Apartment, Suite, Unit, Building, Floor, etc(Optional)" v-model="ruleForm.secondAddress"></el-input>
        </el-form-item>

        <div class="show-two-tables">
            <el-form-item label-width="0" prop="country">
              <el-select placeholder="Please Choose Your Country/Region"  v-model="ruleForm.country" @change="seleCountryCLick">
                <el-option-group
                  v-for="(arrays,key) in countrys"
                  :key="key"
                  :label="key">
                  <el-option
                    v-for="(item,index) in arrays"
                    :key="index"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-option-group>
              </el-select>
          </el-form-item>
          <el-form-item v-show="provinces.length>0" label-width="0" prop="state">
                <el-select placeholder="State/Province(Optional)" v-model="ruleForm.state" >
                  <el-option
                    v-for="(item,index) in provinces"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="show-two-tables">
            <el-form-item label-width="0" prop="city">
                <el-input minlength="2" maxlength="60" placeholder="*City" v-model="ruleForm.city"></el-input>
            </el-form-item>
            <el-form-item label-width="0" prop="postCode">
                <el-input minlength="4" maxlength="10" placeholder="*Post/Zip Code" v-model="ruleForm.postCode"></el-input>
            </el-form-item>
        </div>
        <div class="show-tables">
            <el-form-item label-width="0" prop="name">
                <el-input disabled v-model="phoneCode"></el-input>
            </el-form-item>
            <el-form-item label-width="0" prop="phoneNumber">
                <el-input minlength="5" maxlength="16" type="tel" placeholder="*Phone Number" v-model="ruleForm.phoneNumber"></el-input>
            </el-form-item>
        </div>
        <!-- <el-form-item label-width="0" prop="isDefaultAddress">
            <el-switch :active-value="1" :inactive-value="0" v-model="ruleForm.isDefaultAddress"></el-switch><span class="make-default">Make As Default</span>
        </el-form-item> -->
        <!-- <el-form-item label-width="0">
            <div class="submit-btn">
                <el-button type="primary" @click="submitForm('ruleForm')">SAVE</el-button>
            </div>
        </el-form-item> -->
    </el-form>
</template>
<script>
import mixin from '@/views/address/shipping';
import address from './address';
export default {
    mixins: [mixin, address],
}
</script>
<style scoped lang="less">
.address-step{padding: 20px 60px 30px;
  /deep/ .el-step__icon.is-text{background: #D3D3D3;color: #fff;border:0 none;
    /deep/ .el-step__icon-inner{font-weight: normal;}
  }
  /deep/ .el-step__title{
    font-size: 14px;
    font-family: Montserrat Light;
  }
  /deep/ .el-step__head.is-process{
    font-weight: normal;
    .el-step__icon.is-text{background: #222;}
  }
}
.submit-btn{width:100%;display: flex;justify-content: center;}
.new-address{color:#222;font-size:24px;font-weight: initial;font-family: Montserrat Regular;margin-bottom:20px;}
/deep/ .el-input__inner{
    height:48px;line-height:48px;
}
.show-tables{
    display: flex;width:100%;
    .el-form-item:first-child{
        width:90px;
        /deep/ .el-input__inner{
            border-right:0 none;padding:0;text-align:center;
        }
    }
    .el-form-item:last-child{
        width:100%;
    }
}
.show-two-tables{
    display: flex;width:100%;
    .el-form-item{
        width:50%;/deep/ .el-select{width:100%;}
    }
    .el-form-item:first-child{
        margin-right: 10px;
        
    }
    .el-form-item:last-child{
        margin-left: 10px;
    }
}
.show-one-tables{width:calc(100% - 20px);
  .el-form-item{
        width: 50%;
        /deep/ .el-select{width:100%;}
    }
}
.make-default{font-size: 16px;font-family: Montserrat Light;color:#222;margin-left:10px;vertical-align: middle;}
</style>