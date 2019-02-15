<template>
	<view class="container">
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
				<view class="nav-left-item" @click="categoryClickMain(item,index)" :key="index" :class="index==categoryActive?'active':''"
				    v-for="(item,index) in categoryList">
					{{item.NAME}}
				</view>
			</scroll-view>
			<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
				<view :id="index===0?'first':''" class="nav-right-item" v-for="(item,index) in subCategoryList" :key="index">
					<!-- <image :src="item.LOGO" /> -->
					<view>{{item.NAME}}</view>
					<view style="float: right;"><span class="uni-icon uni-icon-star"></span></view>
				</view>
				<page-foot :name="name" v-if="subCategoryList.length > 1"></page-foot>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categoryList: [],
				subCategoryList: [],
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollHeight: 0,
				name: "七月_"
			}
		},
		methods: {
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			categoryClickMain(categroy, index) {
				this.categoryActive = index;
				this.subCategoryList = categroy.subCategoryList;
				this.scrollTop = -this.scrollHeight * index;
			},
			getCategory() {
				for (var i = 1; i < 5; i++) {
					var subList = [];
					for (var j = 1; j < 15; j++) {
						subList.push({
							"NAME": "分类" + i + ":商品" + j,
							"LOGO": "http://placehold.it/50x50"
						})
					}
					this.categoryList.push({
						"NAME": "分类" + i,
						"subCategoryList": subList
					})
				}
				this.subCategoryList = this.categoryList[0].subCategoryList;
			}
		},
		onLoad: function () {
			this.getCategory();
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
