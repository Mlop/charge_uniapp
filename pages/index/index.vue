<template>
    <view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">本月支出</view>
				<view class="uni-input uni-bold out">￥{{result.totalOut}}</view>
			</view>
		</view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">本月收入<label class="uni-input in">￥{{result.totalIn}}</label></view>
			</view>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<navigator url="../outgo/outgo" hover-class="navigator-hover">
				<button type="primary" >记一笔</button>
			</navigator>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-list" v-for="(item,key) in result.items" :key="key">
				<view class="title" >{{item.category}}</view>
				<view class="uni-flex uni-row">
					<view class="text" style="text-align: left;width: 100upx;">{{item.date}}</view>
					<view class="text" style="text-align: left;flex: 1 1 0%;">{{item.remark}}</view>
					<view class="text" v-bind:class="item.type" style="text-align: right;width: 100upx;">￥{{item.cash}}</view>
				</view>	
			</view>
			<navigator url="list"><view class="text"><span class="uni-icon uni-icon-arrowdown"></span></view></navigator>
		</view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				result: {},
			}
		},
		onLoad() {
			var _this = this;
			this.getAuthToken(this.init);
			//异步取auth token，所以延时500ms后执行后续操作
// 			setTimeout(function(){
// 				_this.init();
// 			},  500);
			
		},
		methods: {
			init() {
				// console.log(this.authToken);
				uni.request({
					method: 'GET',
					dataType: 'json',
					url: this.baseUrl+'report',
					data: {
// 						type: this.type,
// 						include_sub: true,
					},
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							this.result = result.data;
							// setCategoryCallback(result.data);
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
			}
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
	.out {
		color: #dd524d;
	}
	.in {
		color: #4cd964;
	}
	.loan {
		color: #f0ad4e;
	}
</style>
