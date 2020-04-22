<template>
	<view class="page">
		<view class="uni-card" v-show="user">
			<view class="uni-card-header uni-card-media">
				<image class="uni-card-media-logo" mode="aspectFit" style="width: 30px;" src="/static/contact.png"></image>
				<view class="uni-card-media-body">
					<text class="uni-card-media-text-top">{{user.phone}} {{user.email}}</text>
					<text class="uni-card-media-text-bottom">{{user.name}}</text>
				</view>
			</view>
			<view class="uni-card-header uni-card-media">
				<view class="uni-card-media-text-bottom">
					<text>{{user.created_at}} 注册</text>
				</view>
			</view>
		</view>
		<view class="uni-card" style="margin-top:50px;">
		    <view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						<navigator url="../setting/setting" hover-class="navigator-hover" style="width: 100%;">
							设置
						</navigator>
					</view>
				</view>
		        <block v-for="(row, i) in list" :key="i">
		            <view class="uni-list-cell uni-collapse">
		                <view class="uni-list-cell-navigate uni-navigate-bottom" :class="currentShow == i ? 'uni-active' : ''" @click="trigerCollapse(i)">
		                    {{row.year}}年度总账单
		                </view>
		                <view class="uni-collapse-content" :class="currentShow == i ? 'uni-active' : ''">
		                    <view v-for="(item,index) in row.items" :key="index">
								<view class="uni-list">
									<label class="uni-list-cell uni-list-cell-pd">
										<view v-if="item.type == 'outgo'" :class="item.type">总支出</view>
										<view v-if="item.type == 'income'" :class="item.type">总收入</view>
										<view v-if="item.type == 'balance'" :class="item.type">净收入</view>
										<view v-if="item.type == 'loan'">总借贷</view>
										<view :class="item.total>0 ? 'income' : 'outgo'">￥{{item.total}}</view>
									</label>
								</view>
								<view v-if="item.type == 'balance'" class="uni-list" style="color: #C0C0C0;padding-left: 50upx;">
									净收入 = 总收入 - 总支出
								</view>
		                    </view>
		                </view>
		            </view>
		        </block>
		    </view>
		</view>
		<view class="uni-card" v-if="!user">
			<view class="uni-card-footer">
				<navigator url="login"><view class="uni-card-link">登录</view></navigator>
				<navigator url="register"><view class="uni-card-link">去注册</view></navigator>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				yearlyConf: {
					"outgo": "总支出",
					"income": "总收入",
					"balance": "净收入",
					"loan": "总借贷"
				},
				user: {},
				// show: false,
				list: [],
				currentShow: -1,
			}
		},
		methods:{
			getClass(item) {
				var c = item.type;
				if (item.type == 'balance') {
					if (item.total > 0) {
						c += ' ' + 'income';
					} else {
						c += ' ' + 'outgo';
					}
				}
				return c;
			},
			trigerCollapse(index) {
				this.currentShow = index;
			},
			getUser(){
				var _this = this;
				this.request('GET', 'user', {}, function(data){
					_this.user = data;
				});
			},
			getYearSummary() {
				var _this = this;
				_this.request('GET', 'report/yearly', {}, function(data){
					_this.list = data;
				});
			},
			init() {
				this.getUser();
				this.getYearSummary();
			},
		},
		onLoad(option) {
			this.getAuthToken(this.init);
		},
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				'url': '../setting/setting'
			});
		},
		onPullDownRefresh(e) {
			var _this = this;
			setTimeout(function () {
				_this.init();
				uni.stopPullDownRefresh();
			}, 1000);
		},
	};
</script>
<style>
	.uni-card{
		margin-top:50upx;
	}
	
    .page {
        padding-top: 60upx; background: #efeff4;
    }
	
    .image-view {
        height: 480upx;
        overflow: hidden;
    }

    .image {
        width: 100%;
    }
	.balance {
		font-weight: bold;
	}
</style>
