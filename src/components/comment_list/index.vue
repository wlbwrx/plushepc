<template>
	<!-- 评论列表 -->
	<ul class="comment-list">
		<li class="comment-list__items" v-for="(item, index) of list" :key="item.id">
			<div class="comment-list__title">
				<span class="comment-list__name">{{ item.userEmail | formatEmail }}</span>
				<rate :value="item.evaluateStart" size="12"></rate>
			</div>
			<div class="comment-list__info">
				<span class="comment-list__info-time">{{ item.evaluateTime | formatTime }}</span>
				<span class="comment-list__info-attr" v-if="item.attr1 && item.attrVal1">{{ item.attr1 + ':' + item.attrVal1 }}</span>
				<span class="comment-list__info-attr" v-if="item.attr2 && item.attrVal2">{{ item.attr2 + ':' + item.attrVal2 }}</span>
				<span class="comment-list__info-attr" v-if="item.attr3 && item.attrVal3">{{ item.attr3 + ':' + item.attrVal3 }}</span>
			</div>
			<p class="comment-list__content">{{ item.evaluateContent }}</p>
			<ul class="comment-list__pictures" v-if="item.evaluatePicsOnekey">
				<li class="comment-list__pictures-item">
					<van-image :src="$utils.imageHandler(0, item.evaluatePicsOnekey, 0)" lazy-load class="comment-list__pictures-pic" @click="toPreviewImage(0, index)"></van-image>
				</li>
				<li class="comment-list__pictures-item" v-if="item.evaluatePicsTwokey">
					<van-image :src="$utils.imageHandler(0, item.evaluatePicsTwokey, 0)" lazy-load class="comment-list__pictures-pic" @click="toPreviewImage(0, index)"></van-image>
				</li>
				<li class="comment-list__pictures-item" v-if="item.evaluatePicsThreekey">
					<van-image :src="$utils.imageHandler(0, item.evaluatePicsThreekey, 0)" lazy-load class="comment-list__pictures-pic" @click="toPreviewImage(0, index)"></van-image>
				</li>
			</ul>
		</li>
	</ul>
</template>
<script>
import { ImagePreview, Image } from 'vant'
import Rate from '@/components/rate/index.vue'

export default {
	props: {
		list: {
			type: Array,
		},
	},
	data() {
		return {}
	},
	components: {
		[Image.name]: Image,
		Rate,
	},
	created() {},
	mounted() {},
	filters: {
		formatEmail(val) {
			let name = val.split('@')[0]
			return name.charAt(0) + '***' + name.charAt(name.length - 1)
		},
	},
	methods: {
		// 预览图片：
		toPreviewImage(imgIndex, index) {
			const obj = this.list[index]
			console.log(111, obj)
			let imgList = [this.$utils.imageHandler(1, obj.evaluatePicsOnekey)]
			if (obj.evaluatePicsTwokey) imgList.push(this.$utils.imageHandler(1, obj.evaluatePicsTwokey))
			if (obj.evaluatePicsThreekey) imgList.push(this.$utils.imageHandler(1, obj.evaluatePicsThreekey))
			ImagePreview({
				images: imgList,
				startPosition: imgIndex,
				closeable: true,
			})
		},
	},
}
</script>
<style scoped lang="less">
@import '@/style/variable.less';

.comment-list {
	font-size: 14px;
	border-bottom: 1px solid @color-bg;

	.comment-list__items {
		margin-bottom: 20px;

		.comment-list__title {
			margin-bottom: 10px;

			.comment-list__name {
				color: @color-4D4;
				margin-right: 8px;
			}
		}

		.comment-list__info {
			color: @color-999;
			font-size: 12px;
			margin-bottom: 10px;
			.comment-list__info-attr {
				margin-left: 6px;
			}
		}

		.comment-list__content {
			line-height: 17px;
			color: @color-595;
			margin-bottom: 10px;
			word-wrap: break-word;
		}

		.comment-list__pictures {
			display: flex;

			.comment-list__pictures-item {
				width: 108px;
				height: 108px;
				margin-right: 10px;

				&:last-child {
					margin-right: 0;
				}

				.comment-list__pictures-pic {
					object-fit: cover;
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
</style>
