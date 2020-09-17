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
					@change="changeDepartureCalendar"
					ref="recordCalendar"
					 ></uni-calendar>
					 
			</view>
			<button type="primary" @click="record">打卡</button>
		</view>
		<label>{{recordInfo.extraInfo.custom}}</label>
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
			changeDepartureCalendar(e) {
				console.log(e);
				this.recordInfo = e;
				this.currentDate = new Date(e.fulldate);
			},
			record(){
				var date = this.dateFormat(this.currentDate, 'Y-MM-dd');
				var hm = this.dateFormat(new Date(), 'HH:mm');
				var _this = this;
				
				this.request('PUT', 'workrecord', {"work_date":date,"record_at":hm}, function(data) {
					_this.recordInfo.extraInfo.custom.push(hm);
					_this.curSelected.push({date: date, info: hm, custom:_this.recordInfo.extraInfo.custom});
				});
			},
		},
		onLoad(option) {
			this.currentDate = new Date();
			var _this = this;
			this.request('GET', 'workrecord', {"month":this.dateFormat(this.currentDate, 'Y-MM')}, function(data) {
				var ymd = _this.dateFormat(_this.currentDate, 'Y-MM-dd');
				var len = data.length;
				for(var i = 0; i < len; i++) {
					var item = data[i];
					_this.curSelected.push({date: item['work_date'], info: item['record_info'][0], custom:item['record_info']});
					if (ymd == item['work_date']) {
						_this.recordInfo.extraInfo.custom = item['record_info'];
						console.log(_this.recordInfo);
					}
				}
				// _this.curSelected.push({date: date, info: hm, custom:'after'});
			})
		},
	}
</script>

<style>
	page {
		height: auto;
		min-height: 100%;
	}
</style>
