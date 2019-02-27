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
				setCategoryCallback(result);
			},
			fail: (err) => {
				uni.showModal({
					content: err.errMsg,
					showCancel: false
				});
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