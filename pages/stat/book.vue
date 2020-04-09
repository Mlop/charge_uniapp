<template>
    <view class="page">
        <view class="uni-card">
            <view class="uni-list">
                <view class="uni-list-cell uni-collapse" v-for="(list,index) in lists" :key="index" :class="index === lists.length - 1 ? 'uni-list-cell-last' : ''">
                    <view class="uni-list-cell-navigate uni-navigate-bottom" hover-class="uni-list-cell-hover" :class="list.show ? 'uni-active' : ''"
                        @click="trigerCollapse(index)">
						<view class="text">{{list.title}}</view>
						<view class="text" style="width: 35%;">共{{currency(list.total)}}</view>
                    </view>
                    <view class="uni-list uni-collapse" :class="list.show ? 'uni-active' : ''">
						<view class="uni-list-cell"  v-if="item.id>0" hover-class="uni-list-cell-hover" v-for="(item,key) in detail" :key="key" :class="key === detail.length - 1 ? 'uni-list-cell-last' : ''">
							<view class="uni-media-list-logo" @click="gotoDetail(item)">
								<view class="uni-media-list-text-top">{{item.contact}} [{{item.cattitle}}]</view>
								<view class="uni-media-list-text-bottom uni-ellipsis row-remark">{{item.remark}}</view>
								<view class="uni-media-list-text-bottom" style="font-size: 12px;">{{item.created_date}}</view>
							</view>
							<view class="uni-triplex-row" hover-class="uni-list-cell-hover">
								<view class="uni-triplex-right" style="width: 100%;text-align: left;">
									<view v-for="(ditem,i) in item.items">
										<text class="uni-h5" v-bind:class="item.type" v-if="ditem.value_type!=3">{{ditem.name}}:{{ditem.formValue}}</text>
									</view>
								</view>
								<view class="uni-triplex-right" style="width: 8%;">
									<view class="uni-icon uni-icon-trash" style="font-size:18px;" @click="deleteDetail(item)"></view>
								</view>
							</view>
						</view>
						<uni-load-more :status="loadmore_status" />
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
	import uniBadge from "@/components/uni-badge.vue";
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
    export default {
        data() {
            return {
                type: 'out',
                lists: [],
				detail: [],
				current_book_id: 0,
				current_page: 1,
				page_size: 1,
				last_page: 1,
				loadmore_status: 'more'
            }
        },
		components: {
			uniBadge,
			uniLoadMore
		},
		filters: {
			formatYear(ym) {
				if (ym == undefined) {
					return ym;
				}
				var date = ym.split('-');
				return date[0];
			},
			formatMonth(ym) {
				if (ym == undefined) {
					return ym;
				}
				var date = ym.split('-');
				return date[1];
			},
			formatTotal(item) {
				var type = "";
				switch (item.type) {
					case "income":type = "收入";break;
					case "outgo":type = "支出";break;
					case "loan":type = "借贷";break;
				}
				return type + " ￥" + item.total;
			}
		},
        methods: {
			gotoDetail(item) {
				uni.navigateTo({
					url:'../account/edit?type=' + item.type + '&id=' + item.id
				})
			},
			deleteDetail: function(item) {
				this.request('DELETE', "account/" + item.id, {}, function(result){
					uni.showToast({title:"删除成功!", success() {
						item.id=-1;
					}});
				});
			},
			openBook(i) {
				var _this = this;
				var bookData = _this.lists[i];
				this.request('GET', 'report/book/' + bookData.id, {page:_this.current_page, page_size: _this.page_size}, function(result){
					_this.detail.push.apply(_this.detail, result.data);
					_this.last_page = result.last_page;
					if (result.current_page < result.last_page) {
						_this.loadmore_status = 'more';
					} else {
						_this.loadmore_status = 'noMore';
					}
				});
			},
            trigerCollapse(e) {
                for (let i = 0, len = this.lists.length; i < len; ++i) {
                    if (e === i) {
                        this.lists[i].show = !this.lists[i].show;
						this.current_book_id = i;
						this.resetPage();
						this.openBook(i);
                    } else {
                        this.lists[i].show = false;
                    }
                }
            },
			resetPage() {//重置分页配置
				this.detail = [];
				this.current_page = 1;
				this.last_page = 1;
			},
			clickLoadMore(e) {//加载更多
				uni.showToast({
					icon: 'none',
					title: "当前状态：" + e.detail.status
				});
			},
			init() {
				var _this = this;
				_this.request('GET', 'report/book', {}, function(data){
					_this.lists = data;
				});
			}
        },
		onPullDownRefresh(e) {
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
			this.init();
		},
		// 上拉加载
		onReachBottom: function() {
			//可以加载更多
			if (this.current_page < this.last_page) {
				this.current_page++;
				this.loadmore_status = 'loading';
				this.openBook(this.current_book_id);
			} else {
				uni.showToast({
					icon: 'none',
					title: "没有更多了"
				});
			}
		},
		onLoad(options) {
			this.getAuthToken(this.init);
		}
    }
</script>

<style>
	.outgo {
		color: #dd524d;
	}
	.income {
		color: #4cd964;
	}
	.loan {
		color: #f0ad4e;
	}
	.uni-collapse .uni-list-cell::after {
		left: 10px;
	}
	.row-remark {
		line-height: 20px;
		height: 20px;
	}
	.uni-media-list-logo {
		width: 50%;
		height: auto;
		padding: 10px 0 10px 0;
	}
</style>
