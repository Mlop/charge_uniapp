<template>
	<view class="page">
		<view class="uni-card">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-form-item uni-column">
						<view class="with-fun" v-for="(item,index) in list">
							<input class="uni-input" maxlength="10" focus placeholder="输入条目名称" :value="item.name" v-model="item.name" />
							<view class="uni-list-cell-db">
								<picker @change="pickerChange" :value="item.value_type" :data-seq="index" :range="valueTypeList">
									<view class="uni-input">{{valueTypeList[item.value_type]}}</view>
								</picker>
							</view>
							<view @click="editItem(index)">
								<icon type="success_no_circle" size="20"/>
							</view>
							<view @click="deleteItem(index)">
								<icon type="cancel" size="20"/>
							</view>
						</view>
						<view class="with-fun">
							<input class="uni-input" maxlength="10" focus placeholder="输入条目名称" :value="itemValue" data-type="item" @input="showClearInput" />
							<view class="uni-icon uni-icon-clear" v-if="showClearItem" @click="clearInput()"></view>
							<view class="uni-list-cell-db">
								<picker @change="pickerChange" :value="valueTypeIndex" :range="valueTypeList">
									<view class="uni-input">{{valueTypeList[valueTypeIndex]}}</view>
								</picker>
							</view>
							<view style="margin-right: 20px;" @click="editItem()">
								<icon type="success_no_circle" size="20"/>
								<!-- <span class="uni-icon uni-icon-checkmarkempty"></span> -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showClearItem: false,
				itemValue: '',
				list: [],
				valueTypeList: ['string', 'decimal', 'int', 'combox'],
				valueTypeIndex: 0
			}
		},
		onPullDownRefresh(e) {
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
			this.getItems();
		},
		methods: {
			getItems: function() {
				var _this = this;
				_this.request(
				'GET', 
				'items', 
				{}, 
				function(result){
					_this.list = result;
				});
			},
			editItem: function(index) {
				var _this = this;
				var params = {title: this.itemValue, "value_type": this.valueTypeIndex};
				var id = 0;
				// var title = this.itemValue;
				//新增
				if (index == undefined) {
					
				} else {//编辑
					var item = this.list[index];
					id = (item.value == undefined) ? 0 : item.value;
					// title = (item.name == undefined) ? title : item.name;
					params.title = (item.name == undefined) ? title : item.name;
					params.value_type = (item.value_type == undefined) ? 0 : item.value_type;
				}
				this.request(
				'PUT', 
				'item/' + id, 
				params, 
				function(result){
					uni.showToast({title:"操作成功", icon:"none", duration: 1500});
				});
			},
			deleteItem: function(index) {
				var _this = this;
				var item = _this.list[index];
				var id = item.value;
				_this.request(
				'DELETE', 
				'item/' + id, 
				{}, 
				function(result){
					_this.list.splice(index, 1);
					uni.showToast({title:"删除成功", icon:"success", duration: 1500});
				});
			},
			showClearInput: function(event) {
				this.itemValue = event.target.value;
				if (event.target.value.length > 0) {
					this.showClearItem = true;
				} else {
					this.showClearItem = false;
				}
			},
			clearInput: function(event) {
				this.itemValue = '';
				this.showClearItem = false;
			},
			pickerChange: function(e) {
				if (e.target.dataset.seq == undefined) {//新增
					this.valueTypeIndex = e.target.value;
				} else {//编辑
					this.list[e.target.dataset.seq]["value_type"] = e.target.value;
				}
			},
		},
		onLoad(option) {
			this.getItems();
		}
	}
</script>
