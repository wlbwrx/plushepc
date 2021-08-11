// import store from 'store'
import {mapActions, mapMutations} from 'vuex'
// import { RadioGroup, Toast, Radio, Cell, CellGroup, Button, Empty, Popup } from 'vant';
let mixin = {
    data(){
        let {souceType} = this.$route.query
        return {
            address: require('@/assets/images/address-empty.png'),
            souceType,
            addressList: [],
            defaultAddress: ''
        }
    },
    // components:{
    //     [RadioGroup.name]:RadioGroup,
    //     [Radio.name]:Radio,
    //     [Cell.name]:Cell,
    //     [CellGroup.name]:CellGroup,
    //     [Button.name]:Button,
    //     [Empty.name]: Empty,
    //     [Popup.name]: Popup,
    //     [Toast.name]: Toast
    // },
    created(){
       this.getUserAddresList() 
    },
    methods:{
        ...mapActions('address', ['GET_USERADDRESS', 'DEL_ADDRESS', 'SET_DEFAULTARRESSADD_ADDRESS']),
        ...mapMutations('address', ['SET_shippingAddress', 'SET_billingAddress']),
        delAddress(addressId){
            this.DEL_ADDRESS({addressId}).then(()=>{
                this.getUserAddresList()
            })
        },
        getUserAddresList(){
            this.GET_USERADDRESS({pageNum:1,pageSize:30}).then((res)=>{
                let {data} = res
                this.addressList = data.list
                this.addressList.forEach(item => {
                    if(item.isDefaultAddress) {
                        this.defaultAddress= item.addressId
                    }
                });
            })
        },
        view(addressId){
          //   let addressId = encodeURIComponent(JSON.stringify(item))
            this.$router.push({name:'shippingAddress',query:{addressId}})
        },
        setAddress(id, item) {
            if(id == 'new' && this.addressList.length>=20) {
                this.$message({
                    message: 'You can only add up to 20 addresses',
                    iconClass: ' iconfont icon-guanbi',
                });
                return
            }
            // let addressId = this.defaultAddress
            if(id=="set"){
                console.log(`SET_${this.souceType}Address`, { ...item })
                this[`SET_${this.souceType}Address`](item)
                this[`SET_${this.souceType}Address`](item)
                this.dialogFormVisible = false
                // this.$router.go(-1)
                // this.$emit('click-addres', id, item)
                this.$message({
                    message: 'Change address successfully',
                    iconClass: ' iconfont iconsuccess_no_circle',
                }); 
                // this.SET_DEFAULTARRESSADD_ADDRESS({addressId}).then(()=>{
                //     this.$message({
                //         message: 'Set As Default Address successfully',
                //         iconClass: ' iconfont iconsuccess_no_circle',
                //     }); 
                // })
            }
            this.$emit('click-addres', id, item);
			// } 
            // if() {
			// 	this.$notify({
			// 		title: 'warning',
			// 		message: 'You can only add up to 20 addresses',
			// 		type: 'warning',
			// 	})
			// }
        },
        gotoNext(){
            if(this.addressList.length>=20) {
                this.$message({
                    message: 'You can only add up to 20 addresses',
                    iconClass: ' iconfont icon-guanbi',
                });
                return
            }
            let param = {}
            if(this.addressList.length===0){
                param['isDefaultAddress'] = 1
            }
            this.$router.push({name:'shippingAddress',query:param})
        }
    }
  }
  export default mixin