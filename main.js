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
	}
};
// uni.getStorage({
// 		key: 'user',
// 		success: function (res) {
// 			Vue.prototype.authToken = "Bearer " + res.data.token;
// 			Vue.prototype.afterLogin();
// 		}
// 	});
	// console.log('before');
	
	// console.log('after');
	
Vue.prototype.getAuthToken = function(afterLogin) {
	uni.getStorage({
		key: 'user',
		success: function (res) {
			Vue.prototype.authToken = "Bearer " + res.data.token;
			afterLogin();
		}
	});
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