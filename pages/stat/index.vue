<template>
	<view class="content">
		<sl-filter :ref="'slFilter'" :topFixed="true" :isTransNav="true" :navHeight="0" :color="titleColor" :themeColor="themeColor" :menuList="menuList"
		 @result="slfilterResult"></sl-filter>
		<button style="width: 80px;float: right;font-size: 12px;" @click="openPopup">姓名</button>
		<uni-popup ref="popup" type="top">
			<view class="popup-content" :style="{height: indexListHeight}">
				<uni-indexed-list :options="contactList" :show-select="false" @click="contactClick" />
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import slFilter from '@/components/sl-filter/sl-filter.vue';
	import uniIndexedList from '@/components/uni-indexed-list/uni-indexed-list.vue'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			slFilter,
			uniIndexedList,
			uniPopup
		},
		computed: {
			// 滚动区高度
			// (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
			indexListHeight: function() {
// 				console.log(window.innerHeight);
// 			  return (window.innerHeight - 46 - 50) + 'px';
			  const res = uni.getSystemInfoSync();
			  // this.style.pageHeight = res.windowHeight;
			  console.log(uni.getSystemInfoSync().screenWidth / 750 * 100);
			  var contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * 100; //像素
			  // console.log(res.windowHeight,contentViewHeight);
			  var h = contentViewHeight + 'px';
			  return h;
			}
		},
		data() {
			return {
				themeColor: '#000000',
				titleColor: '#666666',
				selectedResult: {},
				menuList: [{
						'title': '年份',
						'key': 'year',
						'isMutiple': false,
						'reflexTitle': true,
						'detailTitle': '请选择账本年份（单选）',
						'defaultSelectedIndex': 0,
						'detailList': [{
							'title': '年份不限',
							'value': ''
						}],
					},{
						'title': '账本',
						'key': 'book',
						'isMutiple': false,
						'reflexTitle': true,
						'detailTitle': '请选择账本（单选）',
						'defaultSelectedIndex': 0,
						'detailList': [{
							'title': '账本不限',
							'value': ''
						}],
					},{
						'title': '姓名',
						'key': 'contact',
						'isMutiple': false,
						'reflexTitle': true,
						'detailTitle': '请选择姓名（单选）',
						'defaultSelectedIndex': 0,
						'detailList': [{
							'title': '姓名不限',
							'value': ''
						}],
					},{
						'title': '排序',
						'key': 'sort',
						'isSort': true,
						'reflexTitle': true,
						'defaultSelectedIndex': 0,
						'detailList': [{
								'title': '默认排序',
								'value': ''
							},
							{
								'title': '创建时间',
								'value': 'create_desc'
							},
							{
								'title': '现金最多',
								'value': 'cash_desc'
							},
							{
								'title': '现金最少',
								'value': 'cash_asc'
							}
						]
					}],
				contactList: [],
				selectedContact: "",
				dataList: []
			};
		},
		methods: {
			init: function() {
				var _this = this;
				
				/*
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				_self = this;	
				const res = uni.getSystemInfoSync();
				this.style.pageHeight = res.windowHeight;
				this.style.contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100); //像素
				*/
			},
			changeFilterList: function()
			{
				var _this = this;
				this.request('GET', 'stat/filters', {}, function(result){
					_this.menuList[0]['detailList'] = result['book_years'];
					_this.menuList[1]['detailList'] = result['books'];
					_this.contactList = result['contacts'];
					//过滤条件菜单项
					_this.$refs.slFilter.resetMenuList(_this.menuList)
				});
			},
			getList(params){
				var _this = this;
				this.request('GET', 'stat/list', params, function(result){
					_this.dataList = result;
				});
			},
			slfilterResult(val) {
				this.selectedResult = val;//JSON.stringify(val, null, 2)
				//根据选择条件返回结果
				this.getList(this.selectedResult)
			},
			contactClick(e) {
				console.log('点击item，返回数据' + JSON.stringify(e))
				this.selectedContact = e.item.name;
				var contactMenu = this.menuList[2];
				var list = this.menuList[2]['detailList'];
				// contactMenu['detailList'] = [{"title":this.selectedContact,"value":this.selectedContact}];
				list.push({"title":this.selectedContact,"value":this.selectedContact});
				contactMenu.defaultSelectedIndex = list.length - 1;
				console.log(contactMenu);
				this.menuList[2] = contactMenu;
				this.$refs.slFilter.resetMenuList(this.menuList)
				this.$refs.slFilter.sureClick();
				this.$refs.popup.close();
				selectedResult.contact = this.selectedContact;
				this.getList(this.selectedResult);
			},
			openPopup: function(){
				var _this = this;
				this.$nextTick(() => {
					this.$refs.popup.open()
				})
			}
		},
		onLoad: function (options) {
			// console.log(options);
			this.options = options;
			this.getAuthToken(this.init);
			// this.$refs.slFilter.resetMenuList([]);
			
		},
		mounted: function()
		{
			this.changeFilterList();
		}
	}
</script>

<style>
.popup-content {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		background-color: #fff;
		padding: 15px;
		font-size: 14px;
		/* height: 500px; */
	}
</style>
