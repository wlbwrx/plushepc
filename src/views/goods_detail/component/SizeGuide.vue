<template>
    <div>
        <el-dialog :visible.sync="showSizeGuide.show" width="800px" :modal="false">
            <div class="size-guide">
                <div class="size-guide-title">SIZE GUIDE</div>
                <div class="size-guide-head">
                    <span>Switch to</span>
                    <el-radio-group v-model="radioValue" size="small">
                        <el-radio-button label="CM">CM</el-radio-button>
                        <el-radio-button label="IN">IN</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="product-measurements">Product Measurements</div>
                <el-table class="size-guide-table" :data="sizeGuideList[radioValue].datas" border>
                    <template slot="empty">
                        No data
                    </template>
                    <el-table-column :class="index == 0 ? 'bgc-gery' : ''" v-for="(item, index) in sizeGuideList[radioValue].xTitle" :key="index" :label="item" :fixed="index == 0 ? 'left' : false" align="center">
                        <template slot-scope="scope">
                            {{ scope.row[index] || '/' }}
                        </template>
                    </el-table-column>
                </el-table>
                <div class="manually" v-if="radioValue == 'CM'">*This data was obtained from manually measuring the product; it may be off by 1-2 CM.</div>
                <div class="manually" v-else-if="radioValue == 'IN'">*This data was obtained from manually measuring the product; it may be off by half an inch.</div>
                <div class="size-guide-collapse">
                    <el-collapse v-model="activeNames">
                        <el-collapse-item v-for="(item, index) in contents" :key="index" :title="item.title" :name="index">
                            <p class="tips">{{ item.tips }}</p>
                            <div class="size-guide-contents">
                                <ul>
                                    <li v-for="(items, indexs) in item.list" :key="indexs">
                                        <h6>{{ items.tit }}</h6>
                                        <p>{{ items.text }}</p>
                                    </li>
                                </ul>
                                <div class="size-guide-img"><el-image :src="item.picUrl" fit="cover"></el-image></div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import http from '@/api/index.js'

export default {
    name: "SizeGuide-pc",
    props: ['writeSizeGuide'],
    data() {
        return {
            showSizeGuide: { show: false, productNo: '' }, // 商品尺码弹框
            radioValue: 'IN',
            sizeGuideList: { 'CM': { datas: [] }, 'IN': { datas: [] } },
            activeNames: [0, 1],
            contents: [{
                title: "How to measure the product's size?",
                picUrl: require('@/assets/images-pc/yifu1_2x.png'),
                list: [{
                    tit: '1. Shoulder',
                    text: 'Measure from where the shoulder seam meets the sleeve on one side to another side.'
                }, {
                    tit: '2. Bust',
                    text: 'Measure from the stitches below the armpits on one side to another.'
                }, {
                    tit: '3. Waist',
                    text: 'Measure straight across the narrowest waist line from edge to edge.'
                }, {
                    tit: '4. Hips',
                    text: 'Measure straight across the widest hip line from edge to edge.'
                }, {
                    tit: '5. Length',
                    text: 'Measure from where the shoulder seam meets the collar to the hem.'
                }, {
                    tit: '6. Sleeves',
                    text: 'Measure from where the shoulder seam meets armhole to the cuff.'
                }]
            }, {
                title: 'How to measure your body?',
                picUrl: require('@/assets/images-pc/yifu2_2x.png'),
                tips: '*To choose the correct size for you, measure your body as follows*',
                list: [{
                    tit: '1. Bust',
                    text: 'Measure from the stitches below the armpits on one side to another.'
                }, {
                    tit: '2. Waist',
                    text: 'Measure straight across the narrowest waist line from edge to edge.'
                }, {
                    tit: '3. Hips',
                    text: 'Measureacross straight across the widest hip line from edge to edge.'
                }]
            }]
        }
    },
    mounted() {

    },
    methods: {
        // 获取商品尺码
        getGoodsSize: function () {
            http.goodsDetail.size({
                productNo: this.showSizeGuide.productNo
            }).then(res => {
                this.sizeGuideList['CM'] = JSON.parse(res.data.sizeCm)
                this.sizeGuideList['IN'] = JSON.parse(res.data.sizcInch)
            })
        }
    },
    watch: {
        writeSizeGuide: function (newValue, oldValue) {
            this.showSizeGuide = newValue
            // 获取商品尺码
            this.getGoodsSize()
        }
    }
}
</script>

<style scoped>
.size-guide {
    padding: 0 30px;
    height:550px;
    overflow: auto;
}

.size-guide-title {
    font-size: 24px;
    font-family: Montserrat Regular;
    color: #222;
    text-align: center;
    margin-bottom: 30px;
}

.size-guide-head {
    font-family: Montserrat Regular;
    color: #222;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.size-guide-head .el-radio-group {
    font-family: Montserrat Light;
}

.product-measurements {
    color: #222222;
    font-weight: bold;
    margin: 20px 0 10px;
}

.manually {
    font-size: 12px;
    font-family: Montserrat Light;
    color: #999999;
    margin: 10px 0 30px;
}

.tips {
    font-size: 14px;
    font-family: Montserrat Regular;
    color: #E84646;
    margin-bottom: 15px;
}

.size-guide-contents {
    display: flex;
}

.size-guide-contents ul {
    flex: 2;
}

.size-guide-contents li {
    margin-bottom: 20px;
}

.size-guide-contents li h6 {
    font-size: 14px;
    font-weight: initial;
    font-family: Montserrat Regular;
    color: #222222;
}

.size-guide-contents li p {
    font-size: 14px;
    font-family: Montserrat Light;
    color: #595959;
}

.size-guide-img.size-guide-img {
    flex: 1;
}

.size-guide-contents .el-image {
    width: 140px;
    margin: auto;
    display: block;
}
</style>