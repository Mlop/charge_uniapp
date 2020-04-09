<template>
    <view class="page">
        <view class="uni-card">
            <view class="uni-list">
                <view class="uni-list-cell uni-collapse" v-for="(list,index) in lists" :key="index" :class="index === lists.length - 1 ? 'uni-list-cell-last' : ''">
                    <view class="uni-list-cell-navigate uni-navigate-bottom" hover-class="uni-list-cell-hover" :class="list.show ? 'uni-active' : ''"
                        @click="trigerCollapse(index)">
						<view class="uni-media-list" style="width: 150upx;">
							<view class="uni-media-list-logo">
								<view class="uni-media-list-text-top">{{list.ym|formatYear}}</view>
								<view class="uni-media-list-text-bottom uni-ellipsis">{{list.ym|formatMonth}}月</view>
							</view>
						</view>
						<view class="uni-media-list" hover-class="uni-list-cell-hover">
							<view class="uni-media-list-body" style="height: 110upx;">
								<view class="uni-media-list-text-top" v-for="(row,i) in list.item" :key="i">
									<text v-bind:class="row.type">{{row|formatTotal}}</text>
								</view>
							</view>
						</view>
						<view class="text" style="width: 60%;">共{{currency(list.total)}}</view>
                    </view>
                    <view class="uni-list uni-collapse" :class="list.show ? 'uni-active' : ''">
						<view class="uni-list-cell"  v-if="item.id>0" hover-class="uni-list-cell-hover" v-for="(item,key) in detail" :key="key" :class="key === detail.length - 1 ? 'uni-list-cell-last' : ''">
							<view class="uni-media-list-logo">
								<view class="uni-media-list-text-top">{{item.title}}</view>
								<view class="uni-media-list-text-bottom uni-ellipsis">{{item.days}}日</view>
							</view>
							<view class="uni-triplex-row" style="width: 88%;" hover-class="uni-list-cell-hover">
							    <view class="uni-triplex-left" style="width: 60%;" @click="editDetail(item)">
							        <text class="uni-title uni-ellipsis">{{item.remark}}</text>
									<text class="uni-text">{{item.created_at}} 创建</text>
							    </view>
							    <view class="uni-triplex-right" style="width: 35%;text-align: left;">
							        <!-- <text class="uni-h5" v-bind:class="item.type">{{currency(item.cash)}}</text> -->
									<view v-for="(ditem,i) in item.items">
										<text class="uni-h5" v-bind:class="item.type">{{ditem.name}}:{{ditem.formValue}}</text>
									</view>
							    </view>
								<view class="uni-triplex-right" style="width: 5%;">
									<view class="uni-icon uni-icon-trash" style="font-size:18px;" @click="deleteDetail(item)"></view>
								</view>
							</view>
							
						</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
	import uniBadge from "@/components/uni-badge.vue";
    export default {
        data() {
            return {
                type: 'out',
                lists: [],
				detail: []
            }
        },
		components: {
			uniBadge
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
			editDetail(item) {
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
			openMonthly(i) {
				var _this = this;
				var monthData = _this.lists[i];
				this.request('GET', 'report/monthly', {date: monthData['ym']}, function(data){
					_this.detail = data;
				});
			},
            trigerCollapse(e) {
                for (let i = 0, len = this.lists.length; i < len; ++i) {
                    if (e === i) {
                        this.lists[i].show = !this.lists[i].show;
						this.openMonthly(i);
                    } else {
                        this.lists[i].show = false;
                    }
                }

            },
			init() {
				var _this = this;
				_this.request('GET', 'report/summary', {}, function(data){
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
	.uni-media-list-text-bottom {
		line-height: 1.8;
	}
</style>
