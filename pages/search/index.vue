<template>
	<view class="content">
		<contact-indexed :rightDrawerVisible="rightDrawerVisible" :showSelect="true" ref="contactIndexed"></contact-indexed>
		<sl-filter :ref="'slFilter'" :topFixed="true" :isTransNav="true" :navHeight="0" :color="titleColor" :themeColor="themeColor" :menuList="menuList"
		 @result="slfilterResult"></sl-filter>
		<view class="uni-list-cell uni-collapse" v-for="(list,index) in dataList" :key="index" :class="index === dataList.length - 1 ? 'uni-list-cell-last' : ''">
		    <view class="uni-list-cell-navigate uni-navigate-bottom" hover-class="uni-list-cell-hover" :class="list.show ? 'uni-active' : ''"
		        @click="trigerCollapse(index)">
				<view class="uni-media-list" style="width: 150upx; height: 80upx;">
					<view class="uni-media-list-logo" style="width: auto;">
						<view class="uni-media-list-text-top" style="width: 220upx;">{{list.contact | formatContact}}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{list.totalTimes}}次，共{{list.cash}}元</view>
					</view>
				</view>
				<view class="uni-media-list" hover-class="uni-list-cell-hover" style="height: 60upx;text-align: right;">
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top" v-for="(row,i) in list.items" :key="i">
							<text v-bind:class="row.type">{{row.title}}：{{row.totalValue}}</text>
						</view>
					</view>
				</view>
		    </view>
		    <view class="uni-list uni-collapse" :class="list.show ? 'uni-active' : ''">
				<view class="uni-list-cell"  v-if="item.id>0" hover-class="uni-list-cell-hover" v-for="(item,key) in detail" :key="key" :class="key === detail.length - 1 ? 'uni-list-cell-last' : ''">
					<view class="uni-media-list-text-body" style="margin-left: 30upx;font-size: 12px;">{{item.bookTitle}}</view>
					<view class="uni-triplex-row" hover-class="uni-list-cell-hover">
					    <view class="uni-triplex-left" style="text-align: center;">
					        <text class="uni-title uni-ellipsis">{{item.remark}}</text>
							<text class="uni-text">{{item.created_date}} 创建</text>
					    </view>
					    <view class="uni-triplex-right" style="width: 50%;text-align: right;">
							<view v-for="(ditem,i) in item.items">
								<text class="uni-h5" v-bind:class="item.type" v-if="ditem.value_type==1">{{ditem.title}}:{{ditem.item_value}}</text>
								<text class="uni-h5" v-bind:class="item.type" v-else>{{ditem.title}}:{{ditem.item_value}}</text>
							</view>
					    </view>
					</view>
				</view>
		    </view>
		</view>
	</view>
</template>

<script>
	import slFilter from '@/components/sl-filter/sl-filter.vue';
	import uniIndexedList from '@/components/uni-indexed-list/uni-indexed-list.vue'
	import contactIndexed from '@/components/contact-indexed.vue';
	export default {
		components: {
			slFilter,
			uniIndexedList,
			contactIndexed
		},
		onNavigationBarButtonTap(e) {
			this.$refs.contactIndexed.showRightDrawer();
		},
		onBackPress() {
			// 返回按钮监听
			if (this.rightDrawerVisible) {
				this.rightDrawerVisible = false;
				return true;
			}
		},
		//重新选择账本后回调函数
		provide(){
			return{
				afterSelect:this.selectContact
			}
		},
		filters: {
			formatContact(value) {//格式化名称的显示
				if (value == '') {
					return '自己';
				}
				return value;
			}
		},
		data() {
			return {
				//顶部账本选择菜单
				rightDrawerVisible: false,
				themeColor: '#000000',
				titleColor: '#666666',
				selectedResult: {},
				menuList: [{
						'title': '年份',
						'key': 'year',
						'isMutiple': false,
						'reflexTitle': true,
						'detailTitle': '请选择账目年份（单选）',
						'defaultSelectedIndex': 0,
						'detailList': [{
							'title': '年份不限',
							'value': ''
						}],
					},{
						'title': '账本',
						'key': 'book',
						'isMutiple': false,
						'reflexTitle': true,
						'detailTitle': '请选择账本（单选）',
						'defaultSelectedIndex': 0,
						'detailList': [{
							'title': '账本不限',
							'value': ''
						}],
					},{
						'title': '排序',
						'key': 'sort',
						'isSort': true,
						'reflexTitle': true,
						'defaultSelectedIndex': 0,
						'detailList': [{
								'title': '默认排序',
								'value': ''
							},
							{
								'title': '次数最多',
								'value': 'totalTimes#desc'
							},
							{
								'title': '现金最多',
								'value': 'cash#desc'
							},
							{
								'title': '现金最少',
								'value': 'cash#asc'
							}
						]
					}],
				// contactList: [],
				selectedContact: "",
				dataList: [],
				listItems: [],
				detail: []
			};
		},
		methods: {
			contactClick: function(item) {
				console.log('select user',item);
			},
			init: function() {
				var _this = this;
			},
			trigerCollapse(e) {
				console.log(e);
			    for (let i = 0, len = this.dataList.length; i < len; ++i) {
			        if (e === i) {
			            this.dataList[i].show = !this.dataList[i].show;
						this.openDetail(this.dataList[i]);
			        } else {
			            this.dataList[i].show = false;
			        }
			    }
			},
			openDetail(list) {
				var _this = this;
				// var monthData = _this.lists[i];
				_this.selectedResult['contact'] = list['contact'];
				this.request('GET', 'stat/list/detail', _this.selectedResult, function(data){
					_this.detail = data;
				});
			},
			changeFilterList: function()
			{
				var _this = this;
				this.request('GET', 'stat/filters', {}, function(result){
					_this.menuList[0]['detailList'] = result['years'];
					_this.menuList[1]['detailList'] = result['books'];
					// _this.contactList = result['contacts'];
					//过滤条件菜单项
					_this.$refs.slFilter.resetMenuList(_this.menuList)
				});
			},
			getList(params){
				var _this = this;
				this.request('GET', 'stat/list', params, function(result){
					_this.dataList = result;
				});
			},
			slfilterResult(val) {
				this.selectedResult = val;//JSON.stringify(val, null, 2)
				//根据选择条件返回结果
				this.getList(this.selectedResult)
			},
			selectContact(items){
				let names = items.map(item => {
					return item.name;
				});
				this.selectedResult.contact = names;
				this.getList(this.selectedResult);
			},
			contactClick(e) {
				console.log('点击item，返回数据' + JSON.stringify(e))
				this.selectedContact = e.item.name;
				var contactMenu = this.menuList[2];
				var list = this.menuList[2]['detailList'];
				// contactMenu['detailList'] = [{"title":this.selectedContact,"value":this.selectedContact}];
				list.push({"title":this.selectedContact,"value":this.selectedContact});
				contactMenu.defaultSelectedIndex = list.length - 1;
				console.log(contactMenu);
				this.menuList[2] = contactMenu;
				this.$refs.slFilter.resetMenuList(this.menuList)
				// this.$refs.slFilter.sureClick();
				this.$refs.popup.close();
				this.selectedResult.contact = this.selectedContact;
				this.getList(this.selectedResult);
			}
		},
		onLoad: function (options) {
			// console.log(options);
			this.options = options;
			this.getAuthToken(this.init);
			this.getList({});
			
		},
		mounted: function()
		{
			this.changeFilterList();
		}
	}
</script>

<style>
.popup-content {
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
	background-color: #fff;
	padding: 15px;
	font-size: 14px;
	/* height: 500px; */
}
text{
	font-size: 12px;
}
.outgo {
	color: #dd524d;
}
.income {
	color: #4cd964;
}
.loan {
	color: #f0ad4e;
}
</style>
