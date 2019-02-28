<template>
    <view>
		<uni-drawer :visible="rightDrawerVisible" mode="right" @close="closeRightDrawer">
			<view style="padding:30upx;">
				<view class="uni-title">账本</view>
				<view class="uni-list uni-common-mt">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item, index) in bookList" :key="index">
						<view class="uni-list-cell-navigate uni-navigate-right" @tap="selectBook(item)">
							{{item.title}}
						</view>
					</view>
					
				</view>
			</view>
		</uni-drawer>
		
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">本月支出</view>
				<view class="uni-input uni-bold outgo">￥{{result.totalOut}}</view>
			</view>
		</view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">本月收入<label class="uni-input uni-bold income">￥{{result.totalIn}}</label></view>
			</view>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<navigator url="../account/add" hover-class="navigator-hover">
				<button type="primary" >记一笔</button>
			</navigator>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-list" v-for="(item,key) in result.items" :key="key">
				
				<view class="uni-flex uni-row" @click="gotoDetail(item)">
					<view class="text" style="text-align: left;width: 100upx;">{{item.record_at|formatDate}}</view>
					<view class="title">{{item.title}}</view>
					<view class="text" style="text-align: left;flex: 1 1 0%;">{{item.remark}}</view>
					<view class="text" v-bind:class="item.type" style="text-align: right;width: 100upx;">￥{{item.cash}}</view>
				</view>	
			</view>
			<view class="text" @tap="openAccountList"><span class="uni-icon uni-icon-arrowdown"></span></view>
		</view>
    </view>
</template>

<script>
	import uniDrawer from '@/components/uni-drawer.vue';
	import uniIcon from '@/components/uni-icon.vue';
	import {book} from '@/common/book.js';
	export default {
		components: {
			uniDrawer,
			uniIcon
		},
		data() {
			return {
				result: {},
// 				showPopupTop:false,
// 				popType: 'top',
// 				msg:'',
				bookList:[],
				selectBookId: 0,
				//顶部账本选择菜单
				rightDrawerVisible: false
			}
		},
		onLoad() {
			this.getAuthToken(this.init);
		},
		onNavigationBarButtonTap() {
			this.rightDrawerVisible = !this.rightDrawerVisible
		},
		filters:{
			formatDate:function (val) {
				var padDate = function(va){
					 va=va<10?'0'+va:va;
					 return va;
				}
				var value = new Date(val);
				var month = padDate(value.getMonth()+1);
				var day = padDate(value.getDate());
				return month+'-'+day;
			}
		},
		onPullDownRefresh(e) {
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
			this.init();
		},
		methods: {
			openAccountList() {
				uni.switchTab({
					url: '../account/list'
				});
			},
			gotoDetail(item) {
				uni.navigateTo({url:"../account/edit?type=" + item.type + "&id=" + item.id});
			},
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
			init() {
				uni.request({
					method: 'GET',
					url: this.baseUrl+'report',
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						this.checkLogin(result);
						if (result.code == 0) {
							this.result = result.data;
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
				//初始化账本
				book.baseUrl = this.baseUrl;
				book.authToken = this.authToken;
				var _this = this;
				book.getBookList(function(result){
					if (result.code == 0) {
						var data = result.data;
						_this.bookList = data;
						_this.selectBook(data[0]);
					} else {
						uni.showModal({
							content: result.msg,
							showCancel: false
						});
					}
				});
			},
		}
	}
</script>

<style>
	.flex-item {
		width: 33.3%;
		/* height: 200upx; */
		text-align: center;
		line-height: 200upx;
	}

	.flex-item-V {
		width: 100%;
		/* height: 150upx; */
		text-align: center;
		line-height: 150upx;
	}
	.text{
		margin:15upx 10upx;
		padding: 0 20upx;
		background-color: #ebebeb;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		color: #777;
		font-size: 26upx;
	}
	.desc{
		/* text-indent: 40upx; */
	}
	.title {
		padding: 10upx 25upx;
	}
</style>
