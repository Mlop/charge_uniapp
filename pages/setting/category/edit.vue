<template>
	<view class="page">
		<view class="uni-card">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-form-item uni-column">
						<view class="with-fun">
							<input class="uni-input" maxlength="10" focus placeholder="请输入类别名称" :value="inputClearValue" @input="clearInput" />
							<view class="uni-icon uni-icon-clear" v-if="showClearIcon" @click="clearIcon"></view>
							<view @click="edit">
								<span class="uni-icon uni-icon-checkmarkempty"></span>
							</view>
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
				showClearIcon: false,
				inputClearValue: '',
				id: 0,
				me: {},
			}
		},
		components: {
			uniBadge
		},
		methods: {
			edit: function() {
				uni.request({
					// method: 'POST',
					dataType: 'json',
					url: this.baseUrl+'category/' + this.id + '/edit',
					data: {
						title: this.inputClearValue,
						parent_id: this.me.parent_id,
						type: this.me.type,
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
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
		},
		onNavigationBarButtonTap(e) {
			this.delete();
		},
		onLoad(option) {
			this.id = option.id == undefined ? 0 : option.id;
			this.inputClearValue = this.title = (option.title == undefined) ? '' : option.title;
			this.showClearIcon = (this.inputClearValue.length > 0) ? true : false;
			this.me = option; 
			uni.setNavigationBarTitle({
				title: (this.id == 0) ? '添加新类别' : '编辑类别' + this.title
			});
		}
	}
</script>

<style>
</style>