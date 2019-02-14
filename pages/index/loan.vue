<template>
    <view>
		<form @submit="formSubmit">
			<view class="uni-padding-wrap uni-common-mt">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							{{category}}
						</view>
						<view class="uni-list-cell-db" style="text-align: right;">
							<input class="uni-input" focus placeholder="0.00" name="cash" />
						</view>
					</view>
				</view>
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<view class="uni-active">
					<view class="" hover-class="uni-list-cell-hover">
						<view class="uni-title uni-list-cell-navigate uni-navigate-right"><text>常用类别</text></view>
					</view>
				</view>
				<view class="tag-view">
					<uni-tag text="标签" type="warning" :inverted="inverted" @click="setType('abd')"></uni-tag>
				</view>
				<view class="tag-view">
					<uni-tag text="标签2" type="warning" :inverted="inverted" @click="setType('标签sfsd')"></uni-tag>
				</view>
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				现金（CNY）
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<textarea style="height: 35upx;" maxlength="3" placeholder="备注" />
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{date}}</view>
				</picker>
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<view class="uni-flex uni-row" style="justify-content: flex-end;">
					<view class="text" style="text-align: right;">
						<!-- <span class="uni-icon uni-icon-checkmarkempty"></span> -->
						<button class="btn-submit" formType="submit" type="primary">提交</button>
					</view>
				</view>
			</view>
		</form>
    </view>
</template>

<script>
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var  graceChecker = require("@/common/graceChecker.js");
	import uniTag from '@/components/uni-tag.vue'
	export default {
	    components: {
	        uniTag
	    },
	    data() {
			const currentDate = this.getDate({
				format: true
			});
	        return {
	            title: 'tag',
				date: currentDate,
	            type: 'default',
	            inverted: false,
				category: 'wan',
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
	    methods: {
			bindDateChange: function(e) {
				this.date = e.target.value
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
					uni.showToast({title:"验证通过!", icon:"none"});
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			setType: function (categoryName) {
				this.category = categoryName;
				this.inverted = !this.inverted;
// 			    let types = ['default', 'primary', 'success', 'warning', 'danger', 'royal'];
// 			    let index = types.indexOf(this.type);
// 			    types.splice(index, 1)
// 			    let randomIndex = Math.ceil(Math.random() * 5);
// 				this.category = types[randomIndex];
// 			    this.type = types[randomIndex];
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
	.text{
		margin:15upx 10upx;
		padding: 0 20upx;
		background-color: #ebebeb;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		color: #777;
		font-size: 26upx;
	}
	.desc{
		/* text-indent: 40upx; */
	}
	.title {
		padding: 10upx 25upx;
	}
</style>
