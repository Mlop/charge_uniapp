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
	}		
}