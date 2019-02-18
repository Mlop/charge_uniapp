<template>
    <view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">本月支出</view>
				<view class="uni-input uni-bold">{{outgo}}</view>
			</view>
		</view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">本月收入<label class="uni-input">{{income}}</label></view>
			</view>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<navigator url="../outgo/outgo" hover-class="navigator-hover">
				<button type="primary" >记一笔</button>
			</navigator>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-list" v-for="(item,key) in lists" :key="key">
				<view class="title" >{{item.category}}</view>
				<view class="uni-flex uni-row">
					<view class="text" style="text-align: left;width: 100upx;">{{item.date}}</view>
					<view class="text" style="text-align: left;flex: 1 1 0%;">{{item.remark}}</view>
					<view class="text" style="text-align: right;width: 100upx;color:#09BB07">{{item.cash}}</view>
				</view>	
			</view>
			<view class="text"><span class="uni-icon uni-icon-arrowdown"></span></view>
		</view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello vera 7d',
				outgo: '0.00',
				income: '0.00',
				lists: [{
						category: '红包',
						date: '02-04',
						remark: '给的礼金',
						cash: '￥1000',
					},{
						category: '红包',
						date: '02-05',
						remark: 'sfs给的礼金',
						cash: '￥5000',
					}],
			}
		},
		onLoad() {

		},
		methods: {

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
