<template>
	<view class="page">
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column" v-show="authToken==''">
				<navigator url="login"><view class="title">请登录</view></navigator>
			</view>
			<view class="uni-form-item uni-column">
				<navigator url="register"><view class="title">去注册</view></navigator>
			</view>
		</view>
		<view class="uni-card" v-show="authToken!=''">
			<view class="uni-card-header uni-card-media">
				<image class="uni-card-media-logo" src="https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png"></image>
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
		        <block v-for="(row, i) in list" :key="i">
		            <view class="uni-list-cell uni-collapse">
		                <view class="uni-list-cell-navigate uni-navigate-bottom" :class="currentShow == i ? 'uni-active' : ''" @click="trigerCollapse(i)">
		                    {{row.year}}年度总账单
		                </view>
		                <view class="uni-collapse-content" :class="currentShow == i ? 'uni-active' : ''">
		                    <view v-for="(item,index) in row.items" :key="index">
								<view class="uni-list">
									<label class="uni-list-cell uni-list-cell-pd">
										<view v-if="item.type == 'outgo'">总支出</view>
										<view v-if="item.type == 'income'" >总收入</view>
										<view v-if="item.type == 'balance'">净收入</view>
										<view v-if="item.type == 'loan'">总借贷</view>
										<view :class="item.type + ' ' + (item.type == 'balance' ? 'text-bold' : '')">￥{{item.total}}</view>
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
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-card">
				<view class="uni-card-content">
					<button class="btn-submit" type="primary" @click="logout" v-if="user">退出登录</button>
				</view>
			</view>
		</view>
		<view class="uni-card">
			<view class="uni-card-footer">
				<navigator url="login"><view class="uni-card-link">登录</view></navigator>
				<navigator url="register"><view class="uni-card-link">去注册</view></navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
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
				currentShow: -1
			}
		},
		methods:{
			trigerCollapse(index) {
				this.currentShow = index;
			},
			getUser(){
				uni.request({
					url: this.baseUrl+'user',
					data: {
					},
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							this.user = result.data;
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
			},
			getYearSummary() {
				uni.request({
					url: this.baseUrl+'yearly',
					data: {
					},
					header: {
						Authorization:this.authToken,
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
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					}
				});
			},
			init() {
				this.getUser();
				this.getYearSummary();
			},
			logout(){
				uni.clearStorage();
				uni.navigateTo({
					url: 'login'
				});
			}
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
</style>
