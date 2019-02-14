<template>
    <view>
		<uni-popup :show="showPopupMiddle" :type="popType" v-on:hidePopup="hidePopup">
			<view class="uni-center" style="font-size:0;">
				
			</view>
			<view class="uni-common-mt uni-helllo-text uni-center">
				消息内容使用 slot 形式定义
			</view>
		</uni-popup>
		
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" v-on:clickItem="onClickItem" styleType="text"
			 activeColor="#007aff"></uni-segmented-control>
		</view>
		<view class="content">
			<view v-show="current === 0" style="height: 160px; text-align:left;">
				<form @submit="formSubmit">
					<view class="uni-padding-wrap uni-common-mt">
						<view class="uni-list">
							<view class="uni-list-cell">
								<view class="uni-list-cell-left">
									{{category}}
								</view>
								<view class="uni-list-cell-db" style="text-align: right;">
									<input class="uni-input" focus placeholder="0.00" name="cash" />
								</view>
							</view>
						</view>
					</view>
					<view class="uni-padding-wrap uni-common-mt">
						<view class="uni-active">
							<view class="" hover-class="uni-list-cell-hover">
								<navigator url="../category" hover-class="navigator-hover">
									<view class="uni-title uni-list-cell-navigate uni-navigate-right">
										<text>常用类别</text>
									</view>
								</navigator>
								
							</view>
						</view>
						<view class="tag-view">
							<uni-tag text="标签" type="warning" :inverted="inverted" @click="setType('abd')"></uni-tag>
						</view>
						<view class="tag-view">
							<uni-tag text="标签2" type="warning" :inverted="inverted" @click="setType('标签sfsd')"></uni-tag>
						</view>
					</view>
					<view class="uni-padding-wrap uni-common-mt">
						现金（CNY）
					</view>
					<view class="uni-padding-wrap uni-common-mt">
						<textarea style="height: 35upx;" maxlength="3" placeholder="备注" />
					</view>
					<view class="uni-padding-wrap uni-common-mt">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{date}}</view>
						</picker>
					</view>
					<view class="uni-padding-wrap uni-common-mt">
						<view class="uni-flex uni-row" style="justify-content: flex-end;">
							<view class="text">
								<!-- <span class="uni-icon uni-icon-checkmarkempty"></span> -->
								<button class="btn-submit" formType="submit" type="primary">保存再记</button>
							</view>
							<view class="text">
								<button class="btn-submit" formType="submit" type="primary">保存</button>
							</view>
						</view>
					</view>
				</form> 
			</view>
			<view v-show="current === 1">
				选项卡2的内容
			</view>
			<view v-show="current === 2">
				选项卡3的内容
			</view>
		</view>
		
    </view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control.vue';
	import uniPopup from '@/components/uni-popup.vue';
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var  graceChecker = require("@/common/graceChecker.js");
	import uniTag from '@/components/uni-tag.vue'
	
	// import {outgo} from '@/common/outgo.js';
	
	export default {
	    components: {
	        uniTag,
			uniSegmentedControl,
			uniPopup
	    },
	    data() {
			const currentDate = this.getDate({
				format: true
			});
	        return {
				
				popType: 'middle',
				// title: 'popup',
				showPopupMiddle: false,
				showPopupTop: false,
				showPopupBottom: false,
				msg: '',
				date: currentDate,
	            type: 'default',
	            inverted: false,
				category: 'wan',
				items: [
					'支出',
					'收入',
					'借贷'
				],
				current: 0,
				categoryList: [],
				subCategoryList: [],
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollHeight: 0,
				name: "七月_",
	        }
	    },
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad: function () {
			this.getCategory();
			this.height = uni.getSystemInfoSync().windowHeight;
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
				for (var i = 1; i < 21; i++) {
					var subList = [];
					for (var j = 1; j < 31; j++) {
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
			},
			
			//统一的关闭popup方法
			hidePopup: function() {
				this.showPopupMiddle = false;
				this.showPopupTop = false;
				this.showPopupBottom = false;
			},
			//展示居中 popup
			showMiddlePopup: function() {
				this.hidePopup();
				this.popType = 'middle';
				this.showPopupMiddle = true;
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			getDate(type) {
				const date = new Date();
			
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
			
				return `${year}-${month}-${day}`;
			},
			formSubmit: function (e) {
				//将下列代码加入到对应的检查位置
				//定义表单规则
				var rule = [
					{name:"cash", checkType : "notnull", checkRule:"",  errorMsg:"请输入金额"},
// 					{name:"gender", checkType : "in", checkRule:"男,女",  errorMsg:"请选择性别"},
// 					{name:"loves", checkType : "notnull", checkRule:"",  errorMsg:"请选择爱好"}
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					uni.showToast({title:"验证通过!", icon:"none"});
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			setType: function (categoryName) {
				this.category = categoryName;
				this.inverted = !this.inverted;
			},
	    }
	}
</script>

<style>
.tag-view {
	margin: 10upx 20upx;
	display: inline-block;
}
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
	/* .text{
		margin:15upx 10upx;
		padding: 0 20upx;
		background-color: #ebebeb;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		color: #777;
		font-size: 26upx;
	} */
	.title {
		padding: 10upx 25upx;
	}
	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 300upx;
		text-align: center;
	}
	page {
		height: auto;
	}
	.page-body {
		display: flex;
	}
	
	.nav {
		display: flex;
		width: 100%;
	}
	
	.nav-left {
		width: 30%;
	}
	
	.nav-left-item {
		height: 100upx;
		border-right: solid 1px #E0E0E0;
		border-bottom: solid 1px #E0E0E0;
		font-size: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.nav-right {
		width: 70%;
	}
	
	.nav-right-item {
		width: 28%;
		height: 220upx;
		float: left;
		text-align: center;
		padding: 11upx;
		font-size: 28upx;
	}
	
	.nav-right-item image {
		width: 100upx;
		height: 100upx;
	}
	
	.active {
		color: #007AFF;
	}
</style>
