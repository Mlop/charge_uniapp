import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

// Vue.prototype.baseUrl = 'http://charge.com/';
Vue.prototype.baseUrl = 'http://119.27.163.89:8082/';
Vue.prototype.authToken = '';
Vue.prototype.checkLogin = function(result) {
	if (result.code == 401) {
		uni.navigateTo({
			url:'/pages/user/login'
		});
	} else if (result.code == 402) {
		Vue.prototype.authToken = "Bearer " + result.data;
		//保存token信息
		var user = uni.getStorageSync('user');
		user.token = result.data;
		uni.setStorageSync('user', user);
	}
};
Vue.prototype.getAuthToken = function(afterLogin) {
	const user = uni.getStorageSync('user');
	if (user != "" && user.token.length > 0) {
		Vue.prototype.authToken = "Bearer " + user.token;
		if (afterLogin != undefined) {
			afterLogin();
		}
	} else {
		uni.navigateTo({
			url:'/pages/user/login'
		});
	}
	
	/*uni.getStorage({
		key: 'user',
		success: function (res) {console.log(res);
			Vue.prototype.authToken = "Bearer " + res.data.token;
			console.log('get auth token ' +Vue.prototype.authToken);
			afterLogin();
		},fail: function(res) {
			console.log("fail",res);
		}
	});*/
}
Vue.prototype.currency = function(price) {
	return '￥' + price;
}
Vue.prototype.jsonToQueryStr = function(options) {
	var tmps = [];
	for (var key in options) {
		tmps.push(key + '=' + options[key]);
	}
	return tmps.join('&');
}
Vue.prototype.showResult = function(result, showSuccess = true, title = "保存成功!") {
	if (result.code == 0) {
		if (showSuccess) {
			uni.showToast({title:title});
		}
	} else if (result.code == 401) {
		uni.navigateTo({
			url:'/pages/user/login'
		});
	} else {
		uni.showModal({
			content: result.msg,
			showCancel: false
		});
	}
}