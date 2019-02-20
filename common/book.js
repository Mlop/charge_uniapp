export const book = {
	baseUrl: '',
	authToken: '',
	getBookList: function(setBookCallback) {
		uni.request({
			method: 'GET',
			dataType: 'json',
			url: this.baseUrl+'books',
			data: {
				type: this.type,
				include_sub: true,
			},
			header: {
				Authorization:this.authToken,
			},
			success: (res) => {
				var result = res.data;
				setBookCallback(result);
			},
			fail: (err) => {
				uni.showModal({
					content: err.errMsg,
					showCancel: false
				});
			}
		});
	},
}