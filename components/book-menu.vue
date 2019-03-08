<template>
	<uni-drawer :visible="rightDrawerVisible" mode="right" @close="closeRightDrawer">
		<view style="padding:30upx;">
			<view class="uni-title">账本</view>
			<view class="uni-list uni-common-mt">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item, index) in bookList" :key="index">
					<view class="uni-list-cell-navigate uni-navigate-right" @tap="selectBook(item)">
						{{item.title}}
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
					<view>
						<view class="uni-list-cell-navigate" @click="goToNewBook">
							<span class="uni-icon uni-icon-plus"></span>
							<text>添加新账本</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</uni-drawer>
</template>

<script>
	import uniDrawer from '@/components/uni-drawer.vue';
	export default {
		components: {
			uniDrawer
		},
		data() {
			return {
				//顶部账本选择菜单
				rightDrawerVisible: false
			};
		},
		onNavigationBarButtonTap() {
			this.rightDrawerVisible = !this.rightDrawerVisible
		},
		methods: {
			closeRightDrawer() {
				this.rightDrawerVisible = false;
			},
			showRightDrawer() {
				this.rightDrawerVisible = true;
			},
			selectBook(item) {
				this.rightDrawerVisible = false;
				this.selectBookId = item.id;
				uni.showToast({
					title: '选中' + item.title
				});
				uni.setNavigationBarTitle({
					title: "帐目   " + item.title,
					success: () => {
						console.log('setNavigationBarTitle success')
					},
					fail: (err) => {
						console.log('setNavigationBarTitle fail, err is', err)
					}
				})
			},
		}
	}
</script>

<style>

</style>
