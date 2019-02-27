<template>
    <view>
		<view class="header">
		<!-- #ifdef MP -->
			<view class="icon" @click="showRightDrawer">
				<uni-icon type="bars" color="#666666" :size="22"></uni-icon>
			</view>
			<!-- #endif -->
		</view>
		<uni-drawer :visible="rightDrawerVisible" mode="right" @close="closeRightDrawer">
			<view style="padding:30upx;">
				<view class="uni-title">账本</view>
				<view class="uni-list uni-common-mt">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item, index) in bookList" :key="index">
						<view class="uni-list-cell-navigate uni-navigate-right" @tap="selectBook(item)">
							{{item.title}}
						</view>
					</view>
				</view>
			</view>
		</uni-drawer>
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" v-on:clickItem="onClickItem" styleType="text"
			 activeColor="#007aff"></uni-segmented-control>
		</view>
		<view class="content">
			<view v-show="current === 0">
			</view>
			<view v-show="current === 1">
			</view>
			<view v-show="current === 2">
			</view>
			<form @submit="formSubmit" style="height: 160px;text-align:left;">
				<view class="uni-padding-wrap uni-common-mt">
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">
								{{category.title}}
								<input type="text" name="category_id" :value="category.id" v-show="false" />
								<input type="text" name="book_id" :value="selectBookId" v-show="false" />
							</view>
							<view class="uni-list-cell-db" style="text-align: right;">
								<input class="uni-input" type="number" focus placeholder="0.00" :value="initData.cash" name="cash" />
							</view>
						</view>
					</view>
				</view>
				<view class="uni-padding-wrap uni-common-mt">
					<view class="uni-active">
						<view class="" hover-class="uni-list-cell-hover">
							<navigator @click="gotoCategory" hover-class="navigator-hover">
								<view class="uni-title uni-list-cell-navigate uni-navigate-right">
									<text>常用类别</text>
								</view>
							</navigator>
							
						</view>
					</view>
					<view class="tag-view" v-for="(item, index) in categoryFavorite" :key="index">
						<uni-tag :text="item.title" inverted="true" :type="item.tagType" @click="setType(item)"></uni-tag>
					</view>
				</view>
				<view class="uni-padding-wrap uni-common-mt">
					现金（CNY）
				</view>
				<view class="uni-padding-wrap uni-common-mt">
					<textarea style="height: 45upx;" maxlength="200" name="remark" placeholder="备注" :value="initData.remark" />
				</view>
				<view class="uni-padding-wrap uni-common-mt">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{date}}<input type="text" :value="date" name="record_at" v-show="false" /></view>
					</picker>
				</view>
				<view class="uni-padding-wrap uni-common-mt">
					<view class="uni-flex uni-row" style="justify-content: flex-end;">
						<view class="text">
							<!-- <span class="uni-icon uni-icon-checkmarkempty"></span> -->
							<button class="btn-submit" @click="deleteItem" type="primary">删除</button>
						</view>
						<view class="text">
							<button class="btn-submit" formType="submit" type="primary">编辑</button>
						</view>
					</view>
				</view>
			</form> 
		</view>
		
    </view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import uniDrawer from '@/components/uni-drawer.vue';
	import uniIcon from '@/components/uni-icon.vue';
	
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var  graceChecker = require("@/common/graceChecker.js");
	import uniTag from '@/components/uni-tag.vue'
	
	import {outgo} from '@/common/outgo.js';
	import {category} from '@/common/category.js';
	import {book} from '@/common/book.js';
	
	export default {
	    components: {
	        uniTag,
			uniSegmentedControl,
			uniDrawer,
			uniIcon
	    },
	    data() {
			const currentDate = this.getDate({
				format: true
			});
	        return {
				initData: {date: currentDate,},
				date: currentDate,
				category: {},
				items: [
					'支出',
					'收入',
					'借贷'
				],
				current: 0,
				categoryFavorite: [],
				bookList: [],
				selectBookId: 0,
				//顶部账本选择菜单
				rightDrawerVisible: false,
				options: {},
	        }
	    },
		onNavigationBarButtonTap(e) {
			this.rightDrawerVisible = !this.rightDrawerVisible
		},
		onBackPress() {
			// 返回按钮监听
			if (this.rightDrawerVisible) {
				this.rightDrawerVisible = false;
				return true;
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
		onLoad: function (options) {
			this.options = options;
			if (options.category_id != undefined) {
				this.category = {"id": options.category_id, "title": options.category_title};
			}
			this.getAuthToken(this.init);
		},
	    methods: {
			init() {
				this.initCategory(this.options);
				this.initForm(this.options);
				this.initBook();
			},
			gotoCategory() {
				var qs = this.jsonToQueryStr(this.options);
				 uni.navigateTo({"url":"../category/category?" + qs});
			},
			initCategory(options) {
				var _this = this;
				var types = ['outgo', 'income', 'loan'];
				//初始化常用类别
				category.baseUrl = this.baseUrl;
				category.type = types[this.current];
				category.authToken = this.authToken;
				category.getFavoriteCategory(function(result){
					_this.checkLogin(result);
					if (result.code == 0) {
						var data = result.data;
						_this.categoryFavorite = data;
						//未选择任何类别初始化第一个关注的常用类别
// 						if (options == undefined || options.category_id == undefined) {
// 							// _this.setType(data[0]);
// 						}
					} else {
						uni.showModal({
							content: result.msg,
							showCancel: false
						});
					}
				});
			},
			initBook() {
				var _this = this;
				//初始化账本
				book.baseUrl = this.baseUrl;
				book.authToken = this.authToken;
				book.getBookList(function(result){
					if (result.code == 0) {
						var data = result.data;
						_this.bookList = data;
						_this.selectBook(data[0]);
					} else {
						uni.showModal({
							content: result.msg,
							showCancel: false
						});
					}
				});
			},
			getRouteByType(type) {
				var route = "outgo";
				switch (type) {
					case "out":
						route = "outgo";
					break;
					case "in":
						route = "income";
					break;
					case "loan":
						route = "loan";
					break;
				}
				return route;
			},
			initForm(options) {
				var url = this.baseUrl + "account/" + this.options.id;
				var _this = this;
				switch (options.type) {
					case 'outgo':
						_this.current = 0;
						break;
					case 'income':
						_this.current = 1;
						break;
					case 'loan':
						_this.current = 2;
						break;
				}
				uni.request({
					method: 'GET',
					// dataType: 'json',
					url: url,
					// data: {},
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							uni.showToast({title:"获取成功!"});
							var data = result.data;
							_this.initData = data;
							_this.date = this.formatDate(data.record_at);
							_this.category = {"id":data.category_id, "title":data.category_title};
							_this.setType(_this.category);
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
						this.loading = false;
					}
				});
			},
			closeRightDrawer() {
				this.rightDrawerVisible = false;
			},
			showRightDrawer() {
				this.rightDrawerVisible = true;
			},
			selectBook(item) {
				this.rightDrawerVisible = false;
				this.selectBookId = item.id;
				uni.showToast({
					title: '选中' + item.title
				});
				uni.setNavigationBarTitle({
					title: "编辑   " + item.title,
					success: () => {
						console.log('setNavigationBarTitle success')
					},
					fail: (err) => {
						console.log('setNavigationBarTitle fail, err is', err)
					}
				});
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
				this.initCategory();
			},
			bindDateChange: function(e) {
				this.initData.date = e.target.value;
				this.date = e.target.value;
				console.log(this.date); 
			},
			formatDate(dateStr) {
				const date = new Date(dateStr);
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
							
				return year + '-' + month + '-' + day;
			},
			getDate(type, dateStr) {
				var date = new Date();
				if (dateStr) {
					date = new Date(dateStr);
				}
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
					// uni.showToast({title:"验证通过!", icon:"none"});
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
				var types = ['outgo', 'income', 'loan'];
				formData.type = types[this.current];
				uni.request({
					method: 'PUT',
					dataType: 'json',
					url: this.baseUrl+"account/"+this.options.id,
					data: formData,
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							uni.showToast({title:"编辑成功!"});
							// uni.navigateBack();
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
						this.loading = false;
					}
				});
			},
			setType: function (category) {
				this.category = category;
				for(var i in this.categoryFavorite) {
					//选中
					if (this.categoryFavorite[i]["id"] == category["id"]) {
						this.categoryFavorite[i]["tagType"] = 'warning';
					} else {//取消选择
						this.categoryFavorite[i]["tagType"] = '';
					}
				}
			},
			deleteItem: function() {
				var url = this.baseUrl + "account/" + this.options.id;
				uni.request({
					method: 'DELETE',
					// dataType: 'json',
					url: url,
					// data: {},
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							uni.showToast({title:"删除成功!"});
							uni.navigateBack();
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
