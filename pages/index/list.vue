<template>
    <view class="page">
        <view class="uni-card">
            <view class="uni-list">
                <view class="uni-list-cell uni-collapse" v-for="(list,index) in lists" :key="index" :class="index === lists.length - 1 ? 'uni-list-cell-last' : ''">
                    <view class="uni-list-cell-navigate uni-navigate-bottom" hover-class="uni-list-cell-hover" :class="list.show ? 'uni-active' : ''"
                        @click="trigerCollapse(index)">
                        {{list.ym}}
						<!-- ￥<uni-badge :text="list.total" type="success"></uni-badge> -->
						<view class="uni-triplex-row" hover-class="uni-list-cell-hover" v-for="(row,i) in list.item" :key="i">
							<view class="uni-triplex-left">
								<text class="uni-title uni-ellipsis">{{row.total}}</text>
								<!-- <text class="uni-text-small uni-ellipsis">{{row.remark}}</text>
								<text class="uni-text">{{row.total}}</text> -->
							</view>
						</view>
						<view class="text" style="text-align: right;width: 100upx;">￥{{list.total}}</view>
						
                    </view>
                    <view class="uni-list uni-collapse" :class="list.show ? 'uni-active' : ''">
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,key) in detail" :key="key" :class="key === detail.length - 1 ? 'uni-list-cell-last' : ''">
							<view class="uni-triplex-row" hover-class="uni-list-cell-hover" >
							    <view class="uni-triplex-left">
							        <text class="uni-title uni-ellipsis">{{item.title}}</text>
									<text class="uni-text-small uni-ellipsis">{{item.remark}}</text>
							        <text class="uni-text">{{item.created_at}}</text>
							        
							    </view>
							    <view class="uni-triplex-right">
							        <text class="uni-h5">￥{{item.cash}}</text>
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
                lists: [{
                        title: "产品",
                        show: false,
                        item: ["iOS", "Android", "HTML5"]
                    },
                    {
                        title: "方案",
                        show: false,
                        item: ["PC方案", "手机方案", "TV方案"]
                    },
                    {
                        title: "新闻",
                        show: false,
                        item: ["公司新闻", "行业新闻"]
                    }
                ],
				detail: []
            }
        },
		components: {
			uniBadge
		},
        methods: {
			openMonthly(i) {
				var _this = this;
				var monthData = _this.lists[i];
				uni.request({
					method: 'GET',
					dataType: 'json',
					url: this.baseUrl+'monthly',
					data: {
						date: monthData['ym']
					},
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							// _this.lists[i]['detail'] = result.data;
							_this.detail = result.data;
							console.log(_this.detail);
							// this.lists = result.data;
							// setCategoryCallback(result.data);
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
				uni.request({
					method: 'GET',
					dataType: 'json',
					url: this.baseUrl+'summary',
					data: {
					},
					header: {
						Authorization:this.authToken,
					},
					success: (res) => {
						var result = res.data;
						_this.checkLogin(result);
						if (result.code == 0) {
							this.lists = result.data;
							console.log(this.lists);
							// this.lists[0]['show'] = true;
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
        },
		onLoad(options) {
			this.getAuthToken(this.init);
		}
    }
</script>

<style>
	.out {
		color: #dd524d;
	}
	.in {
		color: #4cd964;
	}
	.loan {
		color: #f0ad4e;
	}
</style>
