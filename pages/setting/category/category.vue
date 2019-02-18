<template>
	<view class="page">
		<view class="uni-card" :loading="loading">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-form-item uni-column" v-show="showTitleInput">
						<view class="with-fun">
							<input class="uni-input" maxlength="10" focus placeholder="请输入类别名称" :value="inputClearValue" @input="clearInput" />
							<view class="uni-icon uni-icon-clear" v-if="showClearIcon" @click="clearIcon"></view>
							<view @click="edit">
								<span class="uni-icon uni-icon-checkmarkempty"></span>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" :key="index" v-for="(item,index) in list">
					<view class="uni-list-cell-navigate uni-navigate-right" @click="navigateTo(item)">
						{{item.title}}
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
					<view>
						<view class="uni-list-cell-navigate" @click="navigateToNew">
							<span class="uni-icon uni-icon-plus"></span>
							<text>添加子分类</text>
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
				title: 'abcc',
				loading: false,
				requestUrl: this.baseUrl+'category/list',
				list: [],
				showClearIcon: false,
				inputClearValue: '',
				showTitleInput: false,
				id: 0,
				// me: {},
				option: {}
			}
		},
		components: {
			uniBadge
		},
		onNavigationBarButtonTap(e) {
			this.delete();
		},
		onPullDownRefresh(e) {
			console.log('refresh');
			// console.log(e);
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
			this.sendRequest();
		},
		methods: {
			delete: function() {
				uni.request({
					// method: 'POST',
					dataType: 'json',
					url: this.baseUrl+'category/' + this.id + '/del',
					data: {
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							uni.showToast({title:"删除成功!"});
							uni.navigateBack();
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
					},
					complete: () => {
						this.loading = false;
					}
				});
			},
			edit: function() {
				uni.request({
					method: 'PUT',
					dataType: 'json',
					url: this.baseUrl+'category/' + this.id + '/edit',
					data: {
						title: this.inputClearValue,
						parent_id: 0,
						type: this.option.type,
					},
					success: (res) => {
						// console.log(res);
						var result = res.data;
						if (result.code == 0) {
							uni.showToast({title:"保存成功!"});
						} else {
							uni.showModal({
								content: result.msg,
								showCancel: false
							});
						}
					},
					fail: (err) => {
						// console.log('request fail', err);
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
			clearInput: function(event) {
				this.inputClearValue = event.target.value;
				if (event.target.value.length > 0) {
					this.showClearIcon = true;
				} else {
					this.showClearIcon = false;
				}
			},
			clearIcon: function() {
				this.inputClearValue = '';
				this.showClearIcon = false;
			},
			sendRequest: function() {
				var option = this.option;
				if (option.id > 0) {
					this.showTitleInput = true;
					this.showClearIcon = true;
					this.inputClearValue = option.title;
					this.id = option.id;
				}
				uni.request({
					url: this.requestUrl,
					data: {
						type: option.type,
						parent_id: option.parent_id,
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							this.list = result.data;
							// console.log(this.list);
						} else {
							uni.showModal({
								content: result.msg,
								showCancel: false
							});
						}
					},
					fail: (err) => {
						// console.log('request fail', err);
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
				var id = item.id;
				var pid = item.parent_category_id;
				//有子分类
				if (pid == 0 && item.type == 'out') {
					uni.navigateTo({
						url: 'category?parent_id=' + id + '&title=' + item.title + "&id=" + id + "&type=" + item.type
					});
				} else {//无子分类直接编辑
					uni.navigateTo({
						url: '../category/edit?parent_id=' + pid + '&id=' + id + '&title=' + item.title + '&type=' + item.type
					});
				}
			},
			navigateToNew() {
				uni.navigateTo({
					url: '../category/edit?parent_id=' + this.option.parent_id + '&type=' + this.option.type
				});
			}
		},
		onLoad(option) {
			console.log('category onload');
			option.parent_id = (option.parent_id == undefined) ? 0 : option.parent_id;
			option.type = (option.type == undefined) ? 'out' : option.type;
			option.show_title = (option.title == undefined) ? '类别管理' : option.title;
			if (option.parent_id == 0) {
				option.show_title = ((option.type == 'out') ? '支出' : '收入') + option.show_title;
			}
			option.id = (option.id == undefined) ? 0 : option.id;
			uni.setNavigationBarTitle({
				title: option.show_title,
			});
			// this.me = option;
			this.option = option;
			this.sendRequest();
		}
	}
</script>

<style>
</style>