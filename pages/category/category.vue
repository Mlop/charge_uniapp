<template>
	<view class="container">
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
				<view class="nav-left-item" @click="categoryClickMain(item,index)" :key="index" :class="index==categoryActive?'active':''"
				    v-for="(item,index) in categoryList">
					{{item.title}}
				</view>
			</scroll-view>
			<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
				<view :id="index===0?'first':''" class="nav-right-item" v-for="(item,index) in subCategoryList" :key="index" @click="categoryClickSub(item)">
					<!-- <image :src="item.LOGO" /> -->
					<view>{{item.title}}</view>
					<view style="float: right;"><span class="uni-icon uni-icon-star"></span></view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {category} from '@/common/category.js';
	export default {
		data() {
			return {
				categoryList: [],
				subCategoryList: [],
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollHeight: 0,
				name: "abdd",
				// type: 'in',
			}
		},
		methods: {
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			categoryClickMain(categroy, index) {
				this.categoryActive = index;
				this.subCategoryList = categroy.sub;
				this.scrollTop = -this.scrollHeight * index;
			},
			categoryClickSub(category) {
				// console.log(category.title);
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				// console.log(prevPage);
				uni.navigateTo({
					url: '/' + prevPage.route + '?category_id=' + category.id + '&category_title=' + category.title,
				});
			},
		},
		onLoad: function (option) {
			category.baseUrl = this.baseUrl;
			category.type = option.type;
			var _this = this; 
			category.getCategoryList(function(data){
				_this.categoryList = data;
				_this.subCategoryList = data[0].sub;
			});
			this.height = uni.getSystemInfoSync().windowHeight;
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
