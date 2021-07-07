export const common = {
	baseUrl: '',
	authToken: '',
	request: function(method, uri, data, sucCallback) {
		uni.request({
			method: method,
			dataType: 'json',
			url: this.baseUrl + uri,
			data: data,
			header: {
				Authorization:this.authToken,
			},
			success: (res) => {
				var result = res.data;
				if (result.code == 0) {
					sucCallback((result.data == undefined) ? result.msg : result.data);
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
	now: (new Date()).getTime(),
	parseTime: function(time, cFormat) {
	  if (arguments.length === 0) {
		return null
	  }
	  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	  let date
	  if (typeof time === 'object') {
		date = time
	  } else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
		  time = parseInt(time)
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
		  time = time * 1000
		}
		date = new Date(time)
	  }
	  
	  const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	  }
	  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
		if (result.length > 0 && value < 10) {
		  value = '0' + value
		}
		return value || 0
	  })
	  return time_str
	}
}