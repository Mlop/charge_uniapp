<template>
	<view class="page">
	<view class="uni-card">
		<view class="uni-list">
			
			<view class="uni-list-cell-divider" style="background-color: #EEEEEE;">
				出行日期
			</view>
			<view class="uni-list-cell" hover-class="uni-list-cell-hover">
				<uni-calendar
					:insert="true"
					:lunar="true" 
					:start-date=departureStart
					@change="changeDepartureCalendar"
					 ></uni-calendar>
			</view>
			<view class="uni-list-cell-divider" style="background-color: #EEEEEE;">
				可购票日期
			</view>
			<view class="uni-list-cell" hover-class="uni-list-cell-hover">
				<uni-calendar 
					:insert="true"
					:lunar="true" 
					:endDate=buyEnd
					:selected=buySelected
					:date="buyDate"
					ref="buyCalendar"
					 ></uni-calendar>
			</view>
		</view>
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
				//出行开始和截止日期
				departureStart: '2019-3-2',
				departureEnd: '2021-2-28',
				//可购买票的开始和截止日期标记可买票的第一天
// 				buyStart: '2020-02-05',
				buyEnd: '2020-03-03',
				buySelected: [],
				buyDate: '',
			}
		},
		methods: {
			changeDepartureCalendar(e) {
				var clickDate = new Date(e.fulldate);
				clickDate.setDate(e.date - 29);
				var y = clickDate.getFullYear();
				var m = (clickDate.getMonth() + 1);
				var buyDate = y + '-' + m + '-' + clickDate.getDate();
				var buyCalendar = this.$refs.buyCalendar;
				this.buySelected = [{date: buyDate, info: '在此之后买票'}];
				this.buyEnd = buyDate;
				console.log(buyDate);
				// buyCalendar.endDate = buyDate;
				buyCalendar.setDate(buyDate);
				buyCalendar.monthSwitch();
				buyCalendar.change();
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
			this.setCalendar();
		},
	}
</script>

<style>
	page {
		height: auto;
		min-height: 100%;
	}
</style>
