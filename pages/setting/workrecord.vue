<template>
	<view class="page">
	<view class="uni-card">
		<view class="uni-list">
			<view class="uni-list-cell-divider" style="background-color: #EEEEEE;">
				打卡记录
			</view>
			<view class="uni-list-cell" hover-class="uni-list-cell-hover">
				<uni-calendar
					:insert="true"
					:lunar="true" 
					:selected=curSelected
					@change="changeCalendarDay"
					@monthSwitch="monthSwitch"
					ref="recordCalendar"
					 ></uni-calendar>
					 
			</view>
			
			<view class="uni-list-cell-divider" style="background-color: rgb(150,166,188);color: #000000;">
				<view class="uni-list" style="background-color: rgb(150,166,188);">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							选择时间
						</view>
						<view class="uni-list-cell-db">
							<picker mode="time" :value="currentTime" @change="bindTimeChange">
								<view class="uni-input">{{currentTime}}</view>
							</picker>
						</view>
					</view>
				</view>
			</view>
			
			<button type="primary" @click="record">打卡</button>
		</view>
		<label>{{recordInfo.fulldate ? recordInfo.fulldate:recordInfo.extraInfo.date}}:  {{recordInfo.extraInfo.custom}}</label>
	</view>
	</view>
</template>

<script>
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	export default {
		components: {
			uniCalendar
		},
		data() {
			return {
				curSelected: [],//当前选中日历
				currentDate: '',//当前选中日期对象
				currentTime: '',//当前时：分
				recordInfo: {extraInfo:{date:'',info:'',custom:[]}},//日历下方显示
			}
		},
		methods: {
			dateFormat(obj, fmt) {
			    if (!obj) {
			        return obj;
			    }
			    var o = {
			        "Y+" : obj.getFullYear(),                 //年份
			        "M+" : obj.getMonth()+1,                 //月份
			        "d+" : obj.getDate(),                    //日
			        "h+" : obj.getHours()%12 == 0 ? 12 : obj.getHours()%12, //小时
			        "H+" : obj.getHours(), //小时
			        "m+" : obj.getMinutes(),                 //分
			        "s+" : obj.getSeconds(),                 //秒
			        "q+" : Math.floor((obj.getMonth()+3)/3), //季度
			        "S"  : obj.getMilliseconds()             //毫秒
			    };
			    if(/(y+)/.test(fmt))
			        fmt=fmt.replace(RegExp.$1, (obj.getFullYear()+"").substr(4 - RegExp.$1.length));
			    for(var k in o)
			        if(new RegExp("("+ k +")").test(fmt))
			            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
			    return fmt;
			},
			bindTimeChange: function(e) {
				this.currentTime = e.target.value
				var stime = this.currentTime.split(":");
				this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), stime[0], stime[1]);
			},
			//改变选中的天
			changeCalendarDay(e) {
				this.recordInfo = e;
				this.currentDate = new Date(e.fulldate);
			},
			//改变月份
			monthSwitch(monthObj){
				this.currentDate = new Date(monthObj.year, monthObj.month - 1, 1);
				this.initMonthList();
			},
			record(){
				var date = this.dateFormat(this.currentDate, 'Y-MM-dd');
				var hm = this.dateFormat(this.currentDate, 'HH:mm');
				var _this = this;
				this.request('PUT', 'workrecord', {"work_date":date,"record_at":hm}, function(data) {
					_this.recordInfo.extraInfo.custom.push(hm);
					_this.curSelected.push({date: date, info: hm, custom:_this.recordInfo.extraInfo.custom});
				});
			},
			//初始化某月的所有记录
			initMonthList(){
				var _this = this;
				this.request('GET', 'workrecord', {"month":this.dateFormat(this.currentDate, 'Y-MM')}, function(data) {
					var ymd = _this.dateFormat(_this.currentDate, 'Y-MM-dd');
					var len = data.length;
					for(var i = 0; i < len; i++) {
						var item = data[i];
						_this.curSelected.push({date: item['work_date'], info: item['record_info'][0], custom:item['record_info']});
						if (ymd == item['work_date']) {
							_this.recordInfo.extraInfo.custom = item['record_info'];
							_this.recordInfo.extraInfo.date = item['work_date'];
						}
					}
				})
			},
		},
		onLoad(option) {
			this.currentDate = new Date();
			this.currentTime = this.dateFormat(this.currentDate, 'HH:mm');
			this.initMonthList();
		},
	}
</script>

<style>
	page {
		height: auto;
		min-height: 100%;
	}
</style>
