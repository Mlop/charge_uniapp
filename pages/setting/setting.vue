<template>
	<view class="page">
		<view class="uni-card">
			<view class="uni-list">
				<view class="uni-list-cell-divider" style="background-color: #EEEEEE;">
					记账设置
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right" @click="navigateTo('book/book')">
						账本设置
						
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right" @click="navigateTo('category/category?type=out')">
						支出类别管理
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right" @click="navigateTo('category/category?type=in')">
						收入类别管理
					</view>
				</view>
				<view class="uni-list-cell-divider" style="background-color: #EEEEEE;">
					关于
				</view>
				<view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right" @click="navigateTo('about')">
						关于版本
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import uniBadge from "@/components/uni-badge.vue";
	export default {
		data() {
			return {
				title: 'list-with-badges'
			}
		},
		components: {
			uniBadge
		},
		methods:{
			navigateTo(page) {
				uni.navigateTo({
					url: page
				})
			},
		}
	}
</script>

<style>
</style>