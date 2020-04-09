<template>
	<view class="page">
		<view class="uni-card">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-form-item uni-column">
						<view class="with-fun">
							<input class="uni-input" maxlength="10" focus placeholder="请输入账本名称" ref="ipBook" :value="inputClearValue" data-type="book" @input="clearInput" />
							<view class="uni-icon uni-icon-clear" v-if="showClearIcon" @click="clearIcon('book')"></view>
							<view @click="edit()">
								<span class="uni-icon uni-icon-checkmarkempty"></span>
							</view>
						</view>
						<uni-section title="选择包含条目" type="line"></uni-section>
						<view >
							<checkbox-group @change="checkboxChange">
								<label v-for="item in bookItems" :key="item.value">
									<checkbox :value="item.value" :checked="item.checked" @click="checkBox($event, item)" />
									{{item.name}}
								</label>
							</checkbox-group>
						</view>						
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import uniBadge from "@/components/uni-badge.vue";
	import uniSection from '@/components/uni-section/uni-section.vue'
	import {common} from '@/common/common.js';
	export default {
		data() {
			return {
				showClearIcon: false,
				inputClearValue: '',
				id: 0,
				me: {},
				bookItems: [],				
			}
		},
		components: {
			uniBadge,
			uniSection
		},
		methods: {
			edit: function() {
				this.request('PUT', 'book/' + this.id, 
				{
					title: this.inputClearValue,
					book_id: this.id
				},
				function(result){
					uni.navigateBack();
				});
			},
			delete: function() {
				this.request('DELETE', 'book/' + this.id, {},
				function(result){
					uni.showToast({title:"删除成功!"});
					uni.navigateBack();
				});
			},
			clearInput: function(event) {
				if (event.target.dataset.type == "book") {
					this.inputClearValue = event.target.value;
					if (event.target.value.length > 0) {
						this.showClearIcon = true;
					} else {
						this.showClearIcon = false;
					}
				} else {
					this.itemValue = event.target.value;
					if (event.target.value.length > 0) {
						this.showClearItem = true;
					} else {
						this.showClearItem = false;
					}
				}
			},
			clearIcon: function(type) {
				if (type == 'book') {
					this.inputClearValue = '';
					this.showClearIcon = false;
				} else {
					this.itemValue = '';
					this.showClearItem = false;
				}
			},
			checkboxChange: function (e) {
				var items = this.bookItems,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.value)){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
			},
			checkBox: function(e, item) {
				if (this.id == 0) {
					uni.showToast({title:"请先创建账本", icon:"none"});
					return false;
				}
				common.request(
					'PUT', 
					'book/' + this.id + '/checkitem', 
					{"item_id":item.value, "is_check":item.checked}, 
					function(data) {
						if (typeof(data) == 'string') {
							uni.showToast({title:data, icon:"none"});
						} else {
							uni.showToast({title:"选择成功", icon:"none"});
						}
					});
			},
			getBookItems: function() {
				// if (this.id != 0) {
					var _this = this;
					common.request('GET', 'book/' + this.id + '/items', {}, function(data) {console.log('bookitem',data);
						_this.bookItems = data;
					});
				// }
			}
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
				title: (this.id == 0) ? '添加新账本' : '编辑账本-' + this.title
			});
			this.getAuthToken();
			common.baseUrl = this.baseUrl;
			common.authToken = this.authToken;
			this.getBookItems();
		}
	}
</script>

<style>
</style>