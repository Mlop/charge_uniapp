<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" v-on:clickItem="onClickItem" :styleType="styleType"
			 :activeColor="activeColor"></uni-segmented-control>
		</view>
		<view class="content">
			<view v-show="current === 0">
				import 
			</view>
			<view v-show="current === 1">
				选项卡2的内容
			</view>
			<view v-show="current === 2">
				选项卡3的内容
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control.vue';

	export default {
		data() {
			return {
				items: [
					'支出',
					'收入',
					'借贷'
				],
				styles: [{
					value: 'button',
					text: '按钮'
				}, {
					value: 'text',
					text: '文字'
				}],
				current: 1,
				activeColor: '#007aff',
				styleType: 'text',
				styleIndex: 0,
				colorIndex: 0,
			}
		},
		components: {
			uniSegmentedControl
		},
		methods: {
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
			},
		}
	}
</script>

<style>
	page {
		height: auto;
	}

	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 300upx;
		text-align: center;
	}

	.color-tag {
		width: 50upx;
		height: 50upx;
	}
</style>
