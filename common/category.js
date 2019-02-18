export const category = {
	baseUrl: '',
	categoryList: [],
	getCategoryList: function(list) {
		uni.request({
			method: 'GET',
			dataType: 'json',
			url: this.baseUrl+'categories',
			data: {
			},
			success: (res) => {
				var result = res.data;
				if (result.code == 0) {
					this.categoryList = list = result.data;
				} else {
					uni.showModal({
						content: result.msg,
						showCancel: false
					});
				}
			},
			fail: (err) => {
				// console.log('request fail', err);
				uni.showModal({
					content: err.errMsg,
					showCancel: false
				});
			},
			complete: () => {
				this.loading = false;
			}
		});
	}
}