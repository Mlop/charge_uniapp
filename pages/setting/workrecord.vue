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
					:selected=buySelected
					@change="changeDepartureCalendar"
					ref="recordCalendar"
					 ></uni-calendar>
					 
			</view>
			<button type="primary" @click="record">打卡</button>
		</view>
		<label>{{recordInfo.extraInfo.info}} {{recordInfo.extraInfo.custom}}</label>
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
				buySelected: [{date:'2020-09-03',info:'red',custom:'自定义信息'}],
				currentDate: '',
				recordInfo: {extraInfo:{date:'',info:'',custom:''}},
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
				this.buySelected.push({date: date, info: hm, custom:'after'});
			},
			//首次进入默认当天开始1月后可买日期
			setCalendar() {
				var today = new Date();
				var latestTime = today.setDate(today.getDate() + 29);
				var buyDate = new Date(latestTime);
				var y = buyDate.getFullYear();
				var m = (buyDate.getMonth() + 1);
				var buyDateStr = y + '-' + m + '-' + buyDate.getDate();
				this.buyDate = buyDateStr;
				this.buySelected.push({
    				date: buyDateStr,
					// info: '买此之前票'
				});
			},
		},
		onLoad(option) {
			this.currentDate = new Date();
			// this.setCalendar();
		},
	}
</script>

<style>
	page {
		height: auto;
		min-height: 100%;
	}
</style>
