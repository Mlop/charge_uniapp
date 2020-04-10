<template>
	<view class="container">
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
				<view class="nav-left-item" @click="categoryClickMain(item,index)" :key="index" :class="index==categoryActive?'active':''"
				    v-for="(item,index) in categoryList">
					{{item.title}}
				</view>
				<view class="nav-left-item">
					<navigator :url="'/pages/setting/category/category?type=' + options.type">
						添加>>
					</navigator>
				</view>
			</scroll-view>
			<scroll-view v-if="subCategoryLength>0" class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
				<view :id="index===0?'first':''" class="nav-right-item" v-for="(item,index) in subCategoryList" :key="index">
					<view @click="categoryClickSub(item)" class="uni-triplex-left" style="text-align: left;">{{item.title}}</view>
					<view class="uni-triplex-right" @click="changeFavorite(item)">
						<span class="uni-icon" :class="item.isFav == 1 ? 'uni-icon-star-filled' : 'uni-icon-star'" style="font-size: 16px;"></span>
					</view>
				</view>
			</scroll-view>
			<view v-else class="uni-triplex-left">
				<navigator :url="'/pages/setting/category/category?type=' + options.type" style="margin: 20px;">
					<button type="primary" style="font-size: 14px;">去添加>></button>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import {category} from '@/common/category.js';
	export default {
		data() {
			return {
				categoryList: [],
				subCategoryList: [],//子类别数组
				subCategoryLength: 0,//子类别数量
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollHeight: 0,
				options: {},
			}
		},
		methods: {
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			categoryClickMain(categroy, index) {
				this.categoryActive = index;
				this.subCategoryList = categroy.sub;
				this.subCategoryLength = this.subCategoryList.length;
				this.scrollTop = -this.scrollHeight * index;
			},
			categoryClickSub(category) {
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				this.options.category_id = category.id;
				this.options.category_title = category.title;
				
				uni.navigateTo({
					url: '/' + prevPage.route + '?' + this.jsonToQueryStr(this.options),
				});
			},
			changeFavorite(item) {
				var method = 'DELETE';
				if (item.isFav == 1) {
					method = 'DELETE';
				} else {
					method = 'POST';
				}
				uni.request({
					method: method,
					dataType: 'json',
					url: this.baseUrl+'category/' + item.id + '/favorite',
					data: {
					},
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						this.showResult(result, true, (method == 'POST') ? '收藏成功' : '取消成功');
						if (result.code == 0) {
							item.isFav = !item.isFav;
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
				category.baseUrl = this.baseUrl;
				category.type = this.options.type;
				category.authToken = this.authToken;
				var _this = this; 
				category.getCategoryList(function(data){
					_this.checkLogin(data);
					if (data.code == 0) {
						_this.categoryList = data.data;
						_this.subCategoryList = data.data[0].sub;
						_this.subCategoryLength = _this.subCategoryList.length;
					} else {
						uni.showModal({
							content: data.msg,
							showCancel: false
						});
					}
					
				});
				this.height = uni.getSystemInfoSync().windowHeight;
			},
		},
		onLoad: function (options) {
			this.options = options;
			this.getAuthToken(this.init);
		}
	}
</script>

<style>
	.page-body {
		display: flex;
	}

	.nav {
		display: flex;
		width: 100%;
	}

	.nav-left {
		width: 30%;
		background-color: #EEEEEE;
		border-right: solid 1px #E0E0E0;
	}

	.nav-left-item {
		height: 80upx;
		/* border-right: solid 1px #E0E0E0; */
		/* border-bottom: solid 1px #E0E0E0; */
		font-size: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-right {
		width: 70%;
	}

	.nav-right-item {
		/* width: 28%; */
		height: 60upx;
		/* float: left; */
		border-bottom: solid 1px #EBEBEB;
		text-align: center;
		padding: 11upx;
		font-size: 28upx;
		display: flex;
	}

	.nav-right-item image {
		width: 100upx;
		height: 100upx;
	}
	
	.active {
		color: #007AFF;
	}
</style>
