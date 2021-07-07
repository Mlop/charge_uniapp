<template>
    <view>
		<book-menu :rightDrawerVisible="rightDrawerVisible" ref="bookMenu"></book-menu>
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" v-on:clickItem="onClickItem" styleType="text"
			 activeColor="#007aff"></uni-segmented-control>
		</view>
		<view class="content">
			<!-- <view v-show="current === 0"></view>
			<view v-show="current === 1"></view>
			<view v-show="current === 2"></view> -->
			<form style="height: 160px;text-align:left;">
				<view class="uni-padding-wrap uni-common-mt">
					<view class="uni-list">
						<view class="uni-list-cell" v-for="item in bookItems">
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
					</view>
				</view>
				<view class="uni-padding-wrap uni-common-mt">
					<view class="uni-active">
						<view hover-class="uni-list-cell-hover">
							<view @click="gotoCategory" class="uni-title uni-list-cell-navigate uni-navigate-right">
								<text style="font-size: 13px;color: #000000;">常用类别   <text style="font-size: 14px;color:#f0ad4e;">({{category.title}})</text></text>
								<input type="text" name="category_id" v-model="formData.category_id" :value="category.id" v-show="false" />
							</view>
						</view>
					</view>
					<view class="tag-view" v-for="(item, index) in categoryFavorite" :key="index">
						<uni-tag :text="item.title" inverted="true" :type="item.tagType" @click="setType(item)"></uni-tag>
					</view>
				</view>
				<view class="uni-padding-wrap uni-common-mt">
					<view class="uni-list-cell-left">
						<textarea style="height: 45upx;" class="uni-input" maxlength="200" v-model="formData.remark" name="remark" placeholder="备注" />
						
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
							<button class="btn-submit" type="primary" name="action" @click="formSubmit('copy')" value="copy" >保存再记</button>
						</view>
						<view class="text">
							<button class="btn-submit" type="primary" name="action" @click="formSubmit('save')" value="save">保存</button>
						</view>
					</view>
				</view>
			</form> 
		</view>
    </view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control.vue';
	import bookMenu from '@/components/book-menu.vue';
	import uniCombox from "@/components/uni-combox/uni-combox"
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var  graceChecker = require("@/common/graceChecker.js");
	import uniTag from '@/components/uni-tag.vue'
	import Store from '@/common/local-store.js'
	import {category} from '@/common/category.js';
	
	export default {
	    components: {
	        uniTag,
			uniSegmentedControl,
			bookMenu,
			uniCombox
	    },
	    data() {
			const currentDate = this.getDate({
				format: true
			});
	        return {
				date: currentDate,
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
				formData: {"category_id":category.id, "cash":"", "remark":"", "record_at":currentDate},
				currentBook: {},
				bookItems: [],
				contacts: [],
				imageList: [],
				picCount: 3,
	        }
	    },
		onNavigationBarButtonTap(e) {
			this.$refs.bookMenu.showRightDrawer();
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
			if (options.category_id != undefined) {
				this.category = {"id": options.category_id, "title": options.category_title};
				this.formData.category_id = this.category.id;
			}
			this.options = options;
			this.getAuthToken(this.init);
		},
		//重新选择账本后回调函数
		provide(){
			return{
				afterSelect:this.init
			}
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
// 							console.log('上传进度' + res.progress);
// 							console.log('已经上传的数据长度' + res.totalBytesSent);
// 							console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
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
				switch (this.options.type) {
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
						this.current = 1;
					break;
				}
				this.initCategory(this.options);
				this.currentBook = uni.getStorageSync('book');
				this.getBookItems();
				this.loadContacts();
			},
			initCategory(options) {
				var _this = this;
				var tp = this.types[this.current];
				//初始化常用类别
				_this.request('GET', 'category/favorites', {type: tp,include_sub: true,}, function(data){
					_this.categoryFavorite = data;
					//未选择任何类别初始化第一个关注的常用类别
					if (options == undefined || options.category_id == undefined) {
						_this.setType(data[0]);
					}
				}, 'default_config', tp);
			},
			getBookItems: function() {
				var _this = this;
				this.request('GET', 'book/' + this.currentBook.id + '/items', {"is_include_uncheck":0}, function(data) {
					_this.bookItems = data;
				}, 'default_config', 'book_items');
			},
			loadContacts: function() {
				var _this = this;
				this.request('GET', 'contacts', {}, function(data) {
					_this.contacts = data;
				});
			},
			gotoCategory() {
				this.options.type = this.types[this.current];
				uni.navigateTo({
					url: '../category/category?'+ this.jsonToQueryStr(this.options)
				});
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
				this.initCategory();
			},
			bindDateChange: function(e) {
				this.date = e.target.value
				this.formData.record_at = this.date;
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
			formSubmit: function (action) {//提交表单
				for (var i = 0; i < this.bookItems.length; i++) {
					var item = this.bookItems[i];
					var type = item['value_type'];
					if (type == 3) {//保存用户名称
						if (item['formValue'] == undefined) {//未输入名称
							item['formValue'] = "";
						}
						this.formData.contact = item['formValue'];
					} else if (type == 1) {//现金金额
						this.formData.cash = item['formValue'];
					}
					//未输入值时，表单值为默认值
					if (item['formValue'] == undefined) {
						this.bookItems[i]['formValue'] = "";
					}
				}
				this.formData.items = this.bookItems;
				this.formData.type = this.types[this.current];
				this.formData.book_id = this.currentBook.id;
				//拍摄的图片
				this.formData.images = this.imageList;
				var _this = this;
				if (Store.isLocal()) {
					var oriList = Store.getData("account");
					oriList = oriList ? oriList : [];
					_this.formData["category_title"] = _this.formData["title"] = this.category.title;
					_this.formData["record_at_date"] = (new Date(_this.formData["record_at"])).getTime() / 1000;
					oriList.push(_this.formData);
					Store.setData("account", oriList);
					uni.showToast({title:"添加成功!"});
					if (action == 'save') {
						uni.navigateBack();
					}
				} else {
					_this.request('POST', 'account', _this.formData, function(result) {
						uni.showToast({title:"添加成功!"});
						if (action == 'save') {
							uni.navigateBack();
						}
						_this.loadContacts();
					});
				}
			},
			setType: function (category) {
				this.category = category;
				this.formData.category_id = this.category.id;
				for(var i in this.categoryFavorite) {
					//选中
					if (this.categoryFavorite[i]["id"] == category["id"]) {
						this.categoryFavorite[i]["tagType"] = 'warning';
					} else {//取消选择
						this.categoryFavorite[i]["tagType"] = '';
					}
				}
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
