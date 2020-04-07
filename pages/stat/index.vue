<template>
	<view class="page">
		<view class="uni-card">
			<view class="uni-list">
				<view class="uni-list-cell-divider" style="background-color: #EEEEEE;">
					统计总额
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right" @click="navigateTo('year')">
						按年统计
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right" @click="navigateTo('book')">
						按账本统计
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	// import uniBadge from "@/components/uni-badge.vue";
	export default {
		data() {
			return {
				// title: 'list-with-badges'
			}
		},
		components: {
			// uniBadge
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
