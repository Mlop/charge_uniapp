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
				<view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover" v-if="this.list.length>0">
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
				requestUrl: this.baseUrl+'categories',
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
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
			this.sendRequest();
		},
		onBackPress() {
			uni.redirectTo({
				url:"../setting"
			});
		},
		methods: {
			delete: function() {
				uni.request({
					method: 'DELETE',
					dataType: 'json',
					url: this.baseUrl+'category/' + this.id,
					data: {
					},
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						this.showResult(res.data, true, "删除成功!");
						if (result.code == 0) {
							uni.navigateBack();
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
					url: this.baseUrl+'category/' + this.id,
					data: {
						title: this.inputClearValue,
						parent_id: 0,
						type: this.option.type,
					},
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						this.showResult(result);
						if (result.code == 0) {
							uni.navigateBack();
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
				var _this = this;
				uni.request({
					url: this.requestUrl,
					data: {
						type: option.type,
						parent_id: option.parent_id,
					},
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							this.list = result.data;
						}
						this.showResult(result, false);
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
			navigateTo(item) {
				var id = item.id;
				var pid = item.parent_category_id;
				//有子分类
				// if (pid == 0 && item.type == 'out') {
					uni.navigateTo({
						url: 'category?parent_id=' + id + '&title=' + item.title + "&id=" + id + "&type=" + item.type
					});
// 				} else {//无子分类直接编辑
// 					uni.navigateTo({
// 						url: 'edit?parent_id=' + pid + '&id=' + id + '&title=' + item.title + '&type=' + item.type
// 					});
// 				}
			},
			navigateToNew() {
				uni.navigateTo({
					url: 'edit?parent_id=' + this.option.parent_id + '&type=' + this.option.type
				});
			}
		},
		onLoad(option) {
			option.parent_id = (option.parent_id == undefined) ? 0 : option.parent_id;
			option.type = (option.type == undefined) ? 'outgo' : option.type;
			option.show_title = (option.title == undefined) ? '类别管理' : option.title;
			if (option.parent_id == 0) {
				var prefix = '收入';
				if (option.type == 'outgo') {
					prefix = '支出';
				} else if (option.type == 'loan') {
					prefix = '借贷';
				} else {
					prefix = '收入';
				}
				option.show_title = prefix + option.show_title;
			}
			option.id = (option.id == undefined) ? 0 : option.id;
			uni.setNavigationBarTitle({
				title: option.show_title,
			});
			// this.me = option;
			this.option = option;
			this.getAuthToken(this.sendRequest);
		}
	}
</script>

<style>
</style>