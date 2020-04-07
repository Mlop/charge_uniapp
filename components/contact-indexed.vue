<template>
	<uni-drawer :visible="visible" mode="right" @close="closeRightDrawer">
		<!-- <view> -->
			<view class="uni-title" style="padding-left:30upx;">选择要搜索的联系人：</view>
			<view class="uni-list uni-common-mt">
				<view :style="{height: indexListHeight}">
					<uni-indexed-list :options="contactList" :showSelect="showSelect" @click="selectContact" ref="myIndexed" />
				</view>
			</view>
			<view class="uni-list uni-common-mt">
				<view class="uni-list-cell uni-list-cell-last">
					<view class="text">
						<button class="btn-submit" type="default" name="action" @click="clearSelected">清除</button>
					</view>
					<view class="text">
						<button class="btn-submit" type="primary" name="action" @click="confirmSelected">搜索</button>
					</view>
				</view>
			</view>
		<!-- </view> -->
	</uni-drawer>
</template>

<script>
	import uniDrawer from '@/components/uni-drawer.vue';
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import uniBadge from "@/components/uni-badge.vue";
	import uniIndexedList from '@/components/uni-indexed-list/uni-indexed-list.vue'
	export default {
		components: {
			uniDrawer,
			uniBadge,
			uniIcons,
			uniIndexedList
		},
		computed: {
			// 滚动区高度
			// (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
			indexListHeight: function() {
			  const res = uni.getSystemInfoSync();
			  var contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * 100; //像素
			  var h = contentViewHeight + 'px';
			  return h;
			}
		},
		data() {
			return {
				contactList: [],
				selected: [],
				visible: this.rightDrawerVisible
			};
		},
		props: {
			//父级控制默认显示与否
			rightDrawerVisible: Boolean,
			showSelect: Boolean
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
			init() {
				var _this = this;
				_this.request('GET', 'stat/filters', {'field':'contacts'}, function(data){
					_this.contactList = data;
				});
			},
			//清空所有选中
			clearSelected() {
				var sourceList = this.$refs.myIndexed.lists;
				let items = sourceList.map(indexed => {
					indexed.items.map(item => {
						item.checked = false;
						return item;
					});
					return indexed;
				});
			},
			//确认选择
			confirmSelected() {
				this.visible = false;
				this.afterSelect(this.selected);
			},
			//选中其中一个
			selectContact(e) {
				if (e.select.length > 2) {
					uni.showToast({
						title: '最多可选择5人',
						duration: 2000
					});
					this.cancelSelected(e.select.pop());
				}
				this.selected = e.select;
			},
			cancelSelected(cancelItem) {//取消单个选择
				var sourceList = this.$refs.myIndexed.lists;
				let items = sourceList.map(indexed => {
					if (cancelItem.key == indexed.key) {
						indexed.items.map(item => {
							if (item.itemIndex == cancelItem.itemIndex) {
								item.checked = false;
								return item;
							}
						});
						return indexed;
					}
				});
			}
		}
	}
</script>
