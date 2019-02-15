<template>
	<view class="page">
		<view class="uni-card" :loading="loading">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" :key="index" v-for="(item,index) in list">
					<view class="uni-list-cell-navigate uni-navigate-right" @click="navigateTo(item)">
						{{item.title}}
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate">
						<span class="uni-icon uni-icon-plus"></span>
						<text>添加新类别</text>
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
				title: 'list-with-badges',
				loading: false,
				requestUrl: this.baseUrl+'category/setting',
				list: [],
				// parent_id: 0,
			}
		},
		components: {
			uniBadge
		},
		methods: {
			sendRequest: function(type, parent_id) {
				uni.request({
					url: this.requestUrl,
					data: {
						type: type,
						parent_id: parent_id,
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							this.list = result.data;
							console.log(this.list);
						} else {
							uni.showModal({
								content: result.msg,
								showCancel: false
							});
						}
					},
					fail: (err) => {
						console.log('request fail', err);
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					},
					complete: () => {
						this.loading = false;
					}
				});
			},
			navigateTo(item) {
				var pid = item.parent_id;
				//有子分类
				if (item.total > 0) {
					uni.navigateTo({
						url: 'category?parent_id=' + item.id + '&title=' + item.title
					});
				} else {//无子分类直接编辑
					uni.navigateTo({
						url: '../category/edit?id=' + item.id + '&title=' + item.title
					});
				}
			},
		},
		onLoad(option) {
			var parent_id = (option.parent_id == undefined) ? 0 : option.parent_id;
			var type = (option.type == undefined) ? 'out' : option.type;
			var title = (option.title == undefined) ? '类别管理' : option.title;
			if (parent_id == 0) {
				title = ((type == 'out') ? '支出' : '收入') + title;
			}
			uni.setNavigationBarTitle({
				title: title});
			this.sendRequest(type, parent_id);
		}
	}
</script>

<style>
</style>