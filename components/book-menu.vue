<template>
	<uni-drawer :visible="visible" mode="right" @close="closeRightDrawer">
		<view style="padding:30upx;">
			<view class="uni-title">账本</view>
			<view class="uni-list uni-common-mt">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item, index) in bookList" :key="index">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge" @tap="selectBook(item)">
						{{item.title}}
						<uni-icons size="20" type="location-filled" v-if="item.id==selectBookId"></uni-icons>
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
					<view>
						<view class="uni-list-cell-navigate" @click="goToNewBook">
							<span class="uni-icon uni-icon-plus"></span>
							<text>添加新账本</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</uni-drawer>
</template>

<script>
	import uniDrawer from '@/components/uni-drawer.vue';
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import uniBadge from "@/components/uni-badge.vue";
	export default {
		components: {
			uniDrawer,
			uniBadge,
			uniIcons
		},
		data() {
			return {
				bookList:[],
				selectBookId: 0,
				visible: this.rightDrawerVisible
			};
		},
		props: {
			//父级控制默认显示与否
			rightDrawerVisible: Boolean
		},
		mounted() {
			this.init();
		},
		inject:['afterSelect'],
		methods: {
			closeRightDrawer() {
				this.visible = false;
			},
			showRightDrawer() {
				this.visible = true;
			},
			goToNewBook() {
				uni.navigateTo({
					url: '../setting/book/edit'
				});
			},
			selectBook(item) {
				this.visible = false;
				this.selectBookId = item.id;
				uni.showToast({
					title: '当前使用账本-' + item.title
				});
				uni.setStorageSync('book', item);
				//选择账本后的回调函数
				if (this.afterSelect != undefined) {
					this.afterSelect();
				}
			},
			init() {
				//初始化账本
				var _this = this;
				_this.request('GET', 'books', {}, function(data){
					if (data.length == 0) {
						uni.showToast({
							duration:1500,
							title: "还没创建账本哦"
						});
						setTimeout(function () {
							uni.showActionSheet({
								itemList: ['去创建账本 >', '去创建账本条目 >'],
								success: function (res) {
									if (res.tapIndex == 0) {
										uni.navigateTo({
											url: '/pages/setting/book/edit'
										});
									} else if (res.tapIndex == 1) {
										uni.navigateTo({
											url: '/pages/setting/item'
										});
									}
								},
								fail: function (res) {
								}
							});
						}, 1500);
						return false;
					}
					_this.bookList = data;
					var currentBook = uni.getStorageSync('book');
					//没有将默认第一个账本写入本地存储
					if (!currentBook) {
						currentBook = data[0];
						_this.selectBook(currentBook);
						uni.setStorageSync('book', currentBook);
					}
					_this.selectBookId = currentBook.id;
				}, 'default_config', 'books');
			}
		}
	}
</script>

<style>
.uni-actionsheet__cell {
	font-size: 14px;
}
</style>
