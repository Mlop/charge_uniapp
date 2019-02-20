export const category = {
	baseUrl: '',
	type: 'in',
	authToken: '',
	getCategoryList: function(setCategoryCallback) {
		uni.request({
			method: 'GET',
			dataType: 'json',
			url: this.baseUrl+'categories',
			data: {
				type: this.type,
				include_sub: true,
			},
			header: {
				Authorization:this.authToken,
			},
			success: (res) => {
				var result = res.data;
				if (result.code == 0) {
					setCategoryCallback(result.data);
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
			},
			complete: () => {
				this.loading = false;
			}
		});
	},
	getFavoriteCategory: function(setCategoryCallback) {
		uni.request({
			method: 'GET',
			dataType: 'json',
			url: this.baseUrl+'category/favorites',
			data: {
				type: this.type
			},
			header: {
				Authorization:this.authToken,
			},
			success: (res) => {
				var result = res.data;
				setCategoryCallback(result);
				
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