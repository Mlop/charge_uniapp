<template>
	<view class="uni-padding-wrap uni-common-pb">
		<view class="uni-header-logo">
			<view class="version">
				当前版本：{{versionObj.version}}
			</view>
		</view>
		<view class="uni-hello-text uni-common-pb">
			提供随时随地支出、收入、借贷记账与报表，了解收支去向，掌握资产配置。
		</view>
		<view class="uni-card" v-for="(list,index) in lists" :key="index">
			<view class="uni-list">
				<view class="uni-list-cell uni-collapse">
					<view class="uni-list-cell-navigate" hover-class="uni-list-cell-hover" :class="[list.open ? 'uni-active' : '',list.pages ? 'uni-navigate-bottom' : 'uni-navigate-right']">
						{{list.name}}
						<view :class="(list.url=='version_update' && versionObj.badge == true) ? 'version-hint' : ''" @click="goDetailPage(list)"></view>
					</view>
					<view class="uni-list uni-collapse" v-if="list.pages" :class="list.open ? 'uni-active' : ''">
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,key) in list.pages" :key="key">
							<view class="uni-list-cell-navigate uni-navigate-right"> {{item.name ? item.name : item}} </view>
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
				versionObj: {version: "1.0.1", badge: false},
				lists: [{
						name: '联系方式',
						url: 'badge',
					}, {
						name: '平台协议',
						url: 'number-box',
					}, {
						name: '新版本',
						url: 'version_update',
					},
				]
			}
		},
		onLoad: function (options) {
			var _this = this;
			_this.request('GET', 'apk/latest', {}, function(data){
				_this.versionObj = data;
				_this.versionObj.badge = true;
			});
		},
		methods: {
			goDetailPage(item) {
				uni.navigateTo({
					url: item.url
				});
			}
		}
	}
</script>

<style>
	page {
		height: auto;
		min-height: 100%;
	}

	.uni-card {
		box-shadow: none;
	}

	.uni-list:after {
		height: 0;
	}

	.uni-list:before {
		height: 0;
	}

	.uni-hello-text {
		word-break: break-all;
	}
	.uni-header-logo uni-image {
		width: 79px;
		height: 79px;
	}
	.version-hint {
		width:5px;
		height:5px;
		margin-right: 10px;
		border: 2px solid #DD524D;
		text-align: center;
		line-height: 5px;
		font-weight: bold;
		font-size: 24px;
		background: #DD524D;
		border-radius: 50%;
	}
</style>
