<template>
	<div class="color-size">
		<div v-for="(item, pIndex) of list" :key="item.attrName">
			<!-- showPicOrText: 1为图片，2为文字 -->
			<div v-if="item.showPicOrText == 1" class="color-size__box">
				<div class="color-size__label">
					<span>{{ item.attrName }}</span> : <span class="color-size__name">{{ item.attrValList | filterAttrVal }}</span>
				</div>
				<ul class="color-size__colors">
					<li :class="['colors-item', { 'is-active': obj.isDefault }]" v-for="(obj, index) of item.attrValList" :key="obj.val" @click="changeAttr(pIndex, index, obj)">
						<!-- <img class="colors-item__pic" :src="obj.valPic" alt="" /> -->
						<img class="colors-item__pic" :src="$utils.imageHandler(2, obj.valKey)" alt="" />
					</li>
				</ul>
			</div>
			<div v-else class="color-size__box">
				<div class="color-size__label">{{ item.attrName }}</div>
				<ul class="color-size__sizes">
					<li :class="['sizes-item', { disabled: obj.disabled, 'is-active': obj.isDefault }]" v-for="(obj, index) of item.attrValList" :key="obj.val" @click="changeAttr(pIndex, index, obj)">{{ obj.val }}</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		// 属性列表
		list: {
			type: Array,
		},
		// skuNo 核心信息
		skus: {
			type: Array,
		},
	},
	data() {
		return {}
	},
	components: {},
	filters: {
		// 选中的属性的值:
		filterAttrVal(list) {
			let obj = list.find(item => item.isDefault)
			console.log('zenemle ::', obj)
			return obj ? obj.val : ''
		},
	},
	methods: {
		// 更改属性:
		changeAttr(pIndex, index, obj) {
			if (obj.isDefault || obj.disabled) return
			let swipList = []
			// 属性列表
			this.list.forEach((item, i) => {
				if (i == pIndex) {
					item.attrValList.forEach((attr, j) => {
						attr.isDefault = false
						if (j == index) {
							attr.isDefault = true
							if (item.isValHavePics) {
								swipList = attr.picList
							}
						}
					})
				}
			})
			// 是否全部选中,如果都选中, 能得到新的sku信息,并将选中的属性值返回
			let isAll = true,
				attrValObj = {}
			for (let i = 0; i < this.list.length; i++) {
				let item = this.list[i]
				attrValObj['attrVal' + (i + 1)] = ''
				isAll = item.attrValList.some(obj => {
					if (obj.isDefault) attrValObj['attrVal' + (i + 1)] = obj.val
					return obj.isDefault
				})
				if (!isAll) break
			}
			let info = {}
			if (isAll) {
				let skus = this.skus
				skus.forEach(item => {
					let bool = this.dealObj(attrValObj, item)
					if (bool) info = item
				})
				info.attrValObj = attrValObj
			}
			console.log(info)
			let params = {
				swipe: swipList,
				...info,
			}

			this.$emit('change', params)
		},
		// 判断属性值是否都相等:
		dealObj(o, o2) {
			for (let key in o) {
				if (o2[key] != o[key]) {
					return false
				}
			}
			return true
		},
	},
}
</script>
<style scoped lang="less">
@import '@/style/variable.less';

.color-size {
	.color-size__label {
		font-size: 14px;
		line-height: 14px;
		color: @color-222;
		margin-bottom: 12px;
		font-weight: 500;

		.color-size__name {
			color: @color-666;
			font-weight: normal;
		}
	}

	.color-size__colors {
		display: flex;
		flex-wrap: wrap;
		padding: 0 4px;
		margin-bottom: 10px;

		.colors-item {
			width: 32px;
			height: 32px;
			border-radius: 50%;
			position: relative;
			margin-right: 10px;
			margin-bottom: 10px;
			font-size: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			&.is-active {
				border: 1px solid @color-222;
			}
			&:last-child {
				margin-right: 0;
			}
			.colors-item__pic {
				width: 26px;
				height: 26px;
				border-radius: 50%;
				object-fit: cover;
			}
		}
	}

	.color-size__sizes {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 10px;

		.sizes-item {
			margin-right: 10px;
			padding: 0 20px;
			line-height: 28px;
			height: 30px;
			border-radius: 4px;
			border: 1px solid @color-D1D;
			font-size: 14px;
			margin-bottom: 10px;

			&.is-active {
				border-color: @color-222;
				font-weight: 700;
			}

			&.disabled {
				border-style: dashed;
				color: @color-999;
			}
		}
	}
}
</style>
