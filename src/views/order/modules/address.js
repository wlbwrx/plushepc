export default {
  data() {
    let cityValidator = (rule, value, callback) => {
      let reg1 = /^.{2,60}$/
      if (!reg1.test(value)) {
        callback(new Error('Please enter a valid city'));
      } else {
        callback();
      }
    };
    let firstNameValidator = (rule, value, callback) => {
      let reg2 = /^[a-z\sA-Z0-9_-]+$/
      if (!reg2.test(value)) {
        callback(new Error('Please enter a valid first name'));
      } else {
        callback();
      }
    };
    let lastNameValidator = (rule, value, callback) => {
      let reg3 = /^[a-z\sA-Z0-9_-]+$/
      if (!reg3.test(value)) {
        callback(new Error('Please enter a valid last name'));
      } else {
        callback();
      }
    };
    let stateValidator = (rule, value, callback) => {
      if (this.provinces.length>0 && value==='') {
        callback(new Error('Please enter a valid state'));
      } else {
        callback();
      }
    };
    let phoneValidator = (rule, value, callback) => {
      let reg4 = /^\d{5,16}$/
      if (!reg4.test(value)) {
        callback(new Error('Please enter a valid phone number'));
      } else {
        callback();
      }
    };
    let postCodeValidator = (rule, value, callback) => {
      let reg5 = /^[0-9a-zA-Z-]{4,10}$/
      if (!reg5.test(value)) {
        callback(new Error('Please enter a valid Post/Zip Code'));
      } else {
        callback();
      }
    };
    return {
      isPress: false,
      active: 0,
      goToNext: '',
      addressId:'',
      selectCountry: {},
      countrys: window.countrys,
      dialogFormVisible: false,
      phoneCode:'',
      provinces: [],
      addressList: [],
      ruleForm: {
        country:'',
        firstName: '',
        lastName:'',
        phoneCode:'',
        phoneNumber:'',
        state:'',
        city:'',
        postCode:'',
        firstAddress:'',
        secondAddress:'',
        isDefaultAddress: 0
      },
      rules: {
        firstName: [
          { required: true, message: 'Please enter a valid first name', trigger: 'blur' },
          { min: 2, max: 30, message: 'Please enter a valid first name', trigger: 'blur' },
          { validator: firstNameValidator, trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: 'Please enter a valid last name', trigger: 'blur' },
          { min: 2, max: 30, message: 'Please enter a valid last name', trigger: 'blur' },
          { validator: lastNameValidator, trigger: 'blur' }
        ],
        phoneNumber: [
          { validator: phoneValidator, trigger: 'blur' }
        ],
        state: [
          { validator: stateValidator, trigger: 'blur' }
        ],
        city: [
          { required: true, message: 'Please enter a valid city', trigger: 'change' },
          { validator: cityValidator, trigger: 'blur' }
        ],
        postCode: [
          { min: 2, max: 50, message: 'Please enter a valid Post/Zip Code', trigger: 'blur' },
          { required: true, message: 'Please enter a valid Post/Zip Code', trigger: 'blur' },
          { validator: postCodeValidator, trigger: 'blur' }
          
        ],
        firstAddress: [
          { min: 2, max: 50, message: 'Please enter a valid first name', trigger: 'blur' },
          { required: true, message: 'Please enter a valid firstAddress', trigger: 'blur' }
        ],
        secondAddress: [
          { max: 50, message: 'Please enter a valid first name', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    if (this.token) this.getUserList();
  },
  methods: {
    show(gotoNext, addressId) {
      this.addressId = addressId && Object.prototype.toString.call(addressId) !== '[object Object]' ? addressId : '';
      this.isPress = false;
      this.getUserList();
      if (addressId && addressId.isPress) this.isPress = true;
      this.dialogFormVisible = true
      this.ruleForm =  {
        country:'',
        firstName: '',
        lastName:'',
        phoneCode:'',
        phoneNumber:'',
        state:'',
        city:'',
        postCode:'',
        firstAddress:'',
        secondAddress:'',
        isDefaultAddress: 0
      }
     
      if(gotoNext==='addreslist'){
        this.goToNext = gotoNext
        if(addressId){
          this.GET_USERADDRESS_DETAIL({ addressId }).then(res => {
            let { data } = res
            this.ruleForm = data
            this.getAddressList(data)
          })
        } else {
          this.selectCountry = {}
          this.getAddressList()
        }
      }else {
        this.ruleForm.isDefaultAddress = addressId.isDefaultAddress
        
        this.getAddressList()
      }
      
    },
    setShowAddress(param, isdrag) {
      this.addressId = '';
      if (isdrag) this.dialogFormVisible = isdrag;
      this.ruleForm = Object.assign(this.ruleForm, param)
      if (this.ruleForm.country) {
        let country = this.ruleForm.country.substr(0, 1)
        this.selectCountry = this.countrys[country].filter(v => v.name == this.ruleForm.country)[0]
        this.getAddressList()
      }
    },
    getShowAddress() {
        let param = null;
        this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
                param = this.ruleForm;
            } else {
                param = null;
            }
        });
        return param;
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields();
      this.dialogFormVisible = false
    },
    seleCountryCLick(){
      let country = this.ruleForm.country.substr(0, 1);
      this.selectCountry = this.countrys[country].filter(v => v.name == this.ruleForm.country)[0];
      this.ruleForm.city = '';
      this.ruleForm.state = '';
      this.ruleForm.postCode = '';
      this.getAddressList()
    },
    getAddressList(data) {
      let country = this.selectCountry
      let countrys = window.countrys
      let defaultCountrys = countrys['U'].filter(v => v.name == 'United States')
      let seleCountry = this.$utils.isEmptyObject(country) ? defaultCountrys[0] : country
      if (data) {
        let index = data.country.substr(0, 1)
        seleCountry = countrys[index].filter(v => v.name == data.country)[0]
      }
      let { code, dial_code, name, provinces } = seleCountry
      // console.log(33333, Object.keys(provinces))
      this.phoneCode = code + ' ' + dial_code
      this.provinces = provinces ? Object.keys(provinces) : []
      this.ruleForm.phoneCode = dial_code
      this.ruleForm.country = name
    },
    getUserList() {
      this.GET_USERADDRESS({pageNum:1,pageSize:30}).then((res)=>{
          let {data} = res
          this.addressList = data.list
      })
    },
    submitForm(formName) {
      if (this.addressList.length >= 20) {
        this.$message({
            message: 'You can only add up to 20 addresses',
            iconClass: ' iconfont icon-guanbi',
        });
        this.dialogFormVisible = false
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addressId) {
            this.UPDATE_ADDRESS(this.ruleForm).then(() => {
               this.dialogFormVisible = false
               this.$emit('click-newaddres', this.goToNext)
            })
          } else {
            this.ADD_ADDRESS(this.ruleForm).then(() => {
              this.dialogFormVisible = false
              this.$emit('click-newaddres', this.goToNext)
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};