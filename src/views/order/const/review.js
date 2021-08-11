
import {mapState, mapActions} from 'vuex'

export default {
    computed:{
        ...mapState('order', ['reviewDetail'])
    },
    created(){
        let {orderSn} = this.$route.query
        this.getOrderDetail(orderSn)
        console.log(this.$route)
    },
    methods:{
        ...mapActions('order', ['getOrderDetail','UploadImg','createEvaluate']),
        handlePictureCardPreview(file) {
            console.log(file)
        },
        
       
    }
}