<template>
    <view>
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
				<view class="uni-list-cell" v-for="item in initData.items">
					<view class="uni-list-cell-left">
						{{item.name}}
					</view>
					<view class="uni-list-cell-right" v-if="item.value_type==3" style="text-align: right;">
						<uni-combox :candidates="contacts" :placeholder="item.default_value" emptyTips="" v-model="item.formValue"></uni-combox>
					</view>
					<view class="uni-list-cell-db" style="text-align: right;" v-else-if="item.value_type==0">
						<input class="uni-input" v-model="item.formValue" focus :placeholder="item.default_value" />
					</view>
					<view class="uni-list-cell-db" style="text-align: right;" v-else>
						<input class="uni-input" type="number" v-model="item.formValue" focus :placeholder="item.default_value" />
					</view>
				</view>
				<view class="uni-padding-wrap uni-common-mt">
					<view class="uni-active">
						<view class="" hover-class="uni-list-cell-hover">
							<view @click="gotoCategory" class="uni-title uni-list-cell-navigate uni-navigate-right">
								<text>常用类别
									<text style="font-size: 14px;color:#f0ad4e;">({{category.title}})</text>
								</text>
							</view>
						</view>
					</view>
					<view class="tag-view" v-for="(item, index) in categoryFavorite" :key="index">
						<uni-tag :text="item.title" inverted="true" :type="item.tagType" @click="setType(item)"></uni-tag>
					</view>
				</view>
				<view class="uni-padding-wrap uni-common-mt">
					<textarea style="height: 45upx;" maxlength="200" name="remark" placeholder="备注" :value="initData.remark" />
					
					<view class="uni-list list-pd">
						<view class="uni-list-cell cell-pd">
							<view class="uni-uploader">
								<view class="uni-uploader-head">
									<view class="uni-uploader-info">{{imageList.length}}/{{picCount}}</view>
								</view>
								<view class="uni-uploader-body">
									<view class="uni-uploader__files">
										<block v-for="(image,index) in imageList" :key="index">
											<view class="uni-uploader__file">
												<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage(index)"></image>
											</view>
										</block>
										<view class="uni-uploader__input-box" v-if="imageList.length<picCount">
											<view class="uni-uploader__input" @tap="chooseImage"></view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					
				</view>
				<view class="uni-padding-wrap uni-common-mt">
					<picker mode="date" :value="initData.record_at_date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{initData.record_at_date}}<input type="text" :value="initData.record_at_date" name="record_at" v-show="false" /></view>
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
	import uniCombox from "@/components/uni-combox/uni-combox"
	
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var  graceChecker = require("@/common/graceChecker.js");
	import uniTag from '@/components/uni-tag.vue'
	
	import {outgo} from '@/common/outgo.js';
	import {category} from '@/common/category.js';
	
	export default {
	    components: {
	        uniTag,
			uniSegmentedControl,
			uniCombox
	    },
	    data() {
	        return {
				testType: 'error',
				initData: {},
				category: {},
				items: [
					'支出',
					'收入',
					'借贷'
				],
				types: ['outgo', 'income', 'loan'],
				current: 0,
				categoryFavorite: [],
				//顶部账本选择菜单
				rightDrawerVisible: false,
				options: {},
				imageList: [],
				savedFilePath: "",
				bookItems: [],
				contacts: [],
				picCount: 3,
	        }
	    },
// 		onNavigationBarButtonTap(e) {
// 			this.$refs.bookMenu.showRightDrawer();
// 		},
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
			chooseImage: async function() {
				var _this = this;
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					sizeType: ['compressed', 'original'],
					count: this.picCount,
					success: (res) => {
						var img = res.tempFilePaths;
						const uploadTask = uni.uploadFile({
							url: _this.baseUrl + 'img/upload',
							filePath: img[0],
							name: 'file',
							success: (uploadFileRes) => {
								var result = JSON.parse(uploadFileRes.data);
								_this.imageList = _this.imageList.concat(result.data);
							}
						});
						uploadTask.onProgressUpdate((res) => {
							if (res.progress < 100) {
								uni.showToast({
									title: '文件上传失败'
								});
								uploadTask.abort();
							}
						});
					}
				})
			},
			previewImage: function(currentIndex) {
				uni.previewImage({
					urls: this.imageList,
					current: currentIndex,
				});
			},
			init() {
				this.setTabIndex(this.options.type);
				this.initCategory(this.options);
				this.initForm(this.options);
				this.loadContacts();
			},
			loadContacts: function() {
				var _this = this;
				this.request('GET', 'contacts', {}, function(data) {
					_this.contacts = data;
				});
			},
			gotoCategory() {
				this.options.type = this.types[this.current];
				uni.navigateTo({"url":"../category/category?" + this.jsonToQueryStr(this.options)});
			},
			initCategory(options, changeCategory) {
				var _this = this;
				//初始化常用类别
				category.baseUrl = this.baseUrl;
				category.type = this.types[this.current];
				category.authToken = this.authToken;
				category.getFavoriteCategory(function(result){
					_this.checkLogin(result);
					if (result.code == 0) {
						var data = result.data;
						_this.categoryFavorite = data;
						//未选择任何类别初始化第一个关注的常用类别
						if (!_this.category) {
							_this.setType(data[0]);
						} else {
							_this.setType(_this.category);
						}
						if (changeCategory != undefined) {
							_this.setType(data[1]);
						}
					} else {
						uni.showModal({
							content: result.msg,
							showCancel: false
						});
					}
				});
			},
			setTabIndex(type) {
				switch (type) {
					case 'outgo':
						this.current = 0;
						break;
					case 'income':
						this.current = 1;
						break;
					case 'loan':
						this.current = 2;
						break;
					default:
						this.current = 0;
					break;
				}
			},
			initForm(options) {
				var _this = this;
				this.setTabIndex(options.type);
				this.request('GET', "account/" + this.options.id, {}, function(data){
					_this.initData = data;
					if (options.category_id == undefined) {
						_this.category = {"id":data.category_id, "title":data.category_title};
					}
					_this.setType(_this.category);
					_this.imageList = data.images;
				});
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
				this.initCategory('', true);
			},
			bindDateChange: function(e) {
				this.initData.record_at_date = e.target.value;
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
				//进行表单检查
				var formData = e.detail.value;
				formData.type = this.types[this.current];
				formData.items = this.initData.items;
				formData.category_id = this.category.id;
				//拍摄的图片
				formData.images = this.imageList;
				if (this.savedFilePath != "") {
					formData.remark = this.savedFilePath;
				}
				this.request('PUT', "account/"+this.options.id, formData, function(data){
					uni.showToast({title:"编辑成功!"});
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
				this.request('DELETE', "account/"+this.options.id, {}, function(data){
					uni.showToast({title:"删除成功!", success() {
						uni.navigateBack();
					}});
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
