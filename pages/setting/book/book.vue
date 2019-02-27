<template>
	<view class="page">
		<view class="uni-card">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(book, index) in list" :key="index">
					<view @tap="gotoEdit(book)" class="uni-list-cell-navigate uni-navigate-right">
						{{book.title}}
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
					<view>
						<view class="uni-list-cell-navigate" @click="goToNew">
							<span class="uni-icon uni-icon-plus"></span>
							<text>添加新账本</text>
						</view>
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
				list: [],
			}
		},
		components: {
			uniBadge
		},
		onPullDownRefresh(e) {
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
			this.init();
		},
		methods:{
			gotoEdit(book) {
				uni.navigateTo({
					url: "edit?id=" + book.id + "&title=" + book.title
				});
			},
			goToNew() {
				uni.navigateTo({
					url: 'edit'
				});
			},
			init(){
				uni.request({
					method: 'GET',
					dataType: 'json',
					url: this.baseUrl+'books',
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							this.list = result.data;
						} else {
							uni.showModal({
								content: result.msg,
								showCancel: false
							});
						}
					},
					fail: (err) => {
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					}
				});
			}
		},
		onLoad(options) {
			this.getAuthToken(this.init);
		}
	}
</script>

<style>
</style>