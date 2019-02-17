<template>
	<view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<navigator url="login"><view class="title">请登录</view></navigator>
			</view>
			<view class="uni-form-item uni-column">
				<navigator url="register"><view class="title">请注册</view></navigator>
			</view>
		</view>
		<view class="uni-card">
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
		<view class="uni-btn-v uni-common-mt">
			<button class="btn-submit" type="primary" @click="logout">退出登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {}
			}
		},
		methods:{
			getUser(){
				uni.request({
					url: this.baseUrl+'user',
					data: {
					},
					success: (res) => {
						var result = res.data;
						console.log(result);
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
					},
					complete: () => {
					}
				});
			},
			logout(){
				uni.clearStorage();
				uni.switchTab({
					url: 'user'
				})
			}
		},
		onLoad(option) {
			uni.getStorage({
				key: 'user',
				success: function (res) {
					this.user = res.data;
					console.log(this.user);
				}
			});
			// this.getUser();
		},
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				'url': '../setting/setting'
			});
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
