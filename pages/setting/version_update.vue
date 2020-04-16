<template>
	<view>
		<web-view :src="download_url" :progress="false"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				download_url: '',
			}
		},
		onLoad: function (options) {
			var _this = this;
			_this.request('GET', 'apk/latest', {}, function(data){
				_this.download_url = data.url;
				uni.navigateBack();
			});
		},
	}
</script>
