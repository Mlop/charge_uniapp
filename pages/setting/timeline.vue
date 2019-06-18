<template>
	<view class="uni-padding-wrap uni-common-pb">
		<view class="uni-header-logo">
			<view name="tlchart" id="tchart" style="width: 400px;height: 550px;"></view>
		</view>
		<view class="uni-hello-text uni-common-pb">
			时间安排，合理分配空余时间。
		</view>
	</view>
</template>

<script>
	import echarts from 'echarts';
	// import * as echarts from 'echarts';
	export default {
		data() {
			return {
			}
		},
		methods: {
			drawChart() {
				var startTime = 23;
				var startAngle = 90 - 360 / (24 / startTime);
				// 基于准备好的dom，初始化echarts实例
				console.log('draw chart', this.$refs.tlchart, document.getElementById('tchart'));
				var myChart = echarts.init(document.getElementById('tchart'));
				var option = {
					title : {
						text: '24小时安排计划',
						x:'center'
					},
					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					color: ['rgba(87,138,10)','rgba(38,241,244)', 'rgba(38,152,24)', 'rgba(244,38,141)', 'rgba(244,207,38)', 'rgba(100,37,244)'],
					// startAngle: startAngle,
					legend: {
						orient: 'vertical',
						left: 'left',
						data: ['23:00-7:00','7:00-8:00','8:00-9:30','9:30-19:00','19:00-20:00','20:00-23:00']
					},
					center: ['50%', '70%'],
					series : [
						{
							name: '实际时间',
							type: 'pie',
							radius : [0, '30%'],
							startAngle: 90,
							label: {
								normal: {
									position: 'inner'
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data:[
								{value:3, name:'00'},
								{value:3, name:'03'},
								{value:3, name:'06'},
								{value:3, name:'15'},
								{value:3, name:'18'},
								{value:3, name:'21'}
							],
						},
						{
							name: '时间安排',
							type: 'pie',
							radius : ['35%', '60%'],
							startAngle: startAngle,
							// center: ['50%', '60%'],
							data:[
								{value:8, name:'23:00-7:00'},
								{value:1, name:'7:00-8:00'},
								{value:1.5, name:'8:00-9:30'},
								{value:9.5, name:'9:30-19:00'},
								{value:1, name:'19:00-20:00'},
								{value:3, name:'20:00-23:00'}
							],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}
					]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
				return myChart;
			}
		},
		mounted: function() {
			this.drawChart();
		}
	}
</script>

<style>
	page {
		height: auto;
		min-height: 100%;
	}
</style>
