<template>
    <view>
		<book-menu :rightDrawerVisible="rightDrawerVisible" ref="bookMenu"></book-menu>
		
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
			<view class="uni-list" v-if="totalItems>0">
				<view class="uni-list-item" v-for="(item,key) in result.items" :key="key">
					<view class="uni-flex uni-row" @click="gotoDetail(item)">
						<view class="text" style="text-align: left;width: 100upx;">{{item.record_at|formatDate}}</view>
						<view class="title">{{item.title}}</view>
						<view class="text uni-ellipsis" style="text-align: left;flex: 1 1 0%;">{{item.remark}}</view>
						<view class="text" v-bind:class="item.type" style="text-align: right;width: 100upx;">￥{{item.cash}}</view>
					</view>	
				</view>
			</view>
			<view class="text" @tap="openAccountList"><span class="uni-icon uni-icon-arrowdown"></span></view>
		</view>
    </view>
</template>

<script>
	import bookMenu from '@/components/book-menu.vue';
	export default {
		components: {
			bookMenu,
		},
		data() {
			return {
				result: {},
				totalItems: 0,
				//顶部账本选择菜单
				rightDrawerVisible: false
			}
		},
		onLoad() {
			this.getAuthToken(this.init);
		},
		onNavigationBarButtonTap() {
			this.$refs.bookMenu.showRightDrawer();
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
		//重新选择账本后回调函数
		provide(){
			return{
				afterSelect:this.init
			}
		},
		methods: {
			openAccountList() {
				uni.navigateTo({url:"../stat/month"});
			},
			gotoDetail(item) {
				uni.navigateTo({url:"../account/edit?type=" + item.type + "&id=" + item.id});
			},
			init() {
				var _this = this;
				_this.request('GET', 'report', {}, function(data){
					_this.result = data;
					_this.totalItems = _this.result.items.length;
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

