<template>
	<uni-drawer :visible="visible" mode="right" @close="closeRightDrawer">
		<view style="padding:30upx;">
			<view class="uni-title">账本</view>
			<view class="uni-list uni-common-mt">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item, index) in bookList" :key="index">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge" @tap="selectBook(item)">
						{{item.title}}
						<uni-icon size="30" type="checkbox-filled" color="#007aff" v-if="item.id==selectBookId"></uni-icon>
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
	import uniIcon from '@/components/uni-icon.vue';
	import uniBadge from "@/components/uni-badge.vue";
	import {book} from '@/common/book.js';
	export default {
		components: {
			uniDrawer,
			uniBadge,
			uniIcon
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
					title: '选中' + item.title
				});
// 				uni.setNavigationBarTitle({
// 					title: "帐目   " + item.title,
// 					success: () => {
// 					},
// 					fail: (err) => {
// 					}
// 				});
				uni.setStorageSync('book', item);
			},
			init() {
				//初始化账本
				book.baseUrl = this.baseUrl;
				book.authToken = this.authToken;
				var _this = this;
				book.getBookList(function(result){
					if (result.code == 0) {
						var data = result.data;
						_this.bookList = data;
						var currentBook = uni.getStorageSync('book');
						//没有将默认第一个账本写入本地存储
						if (!currentBook) {
							currentBook = data[0];
							_this.selectBook(currentBook);
							uni.setStorageSync('book', currentBook);
						}
						_this.selectBookId = currentBook.id;
					} else {
						uni.showModal({
							content: result.msg,
							showCancel: false
						});
					}
				});
			}
		}
	}
</script>

<style>

</style>
