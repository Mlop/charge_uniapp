import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

Vue.prototype.baseUrl = 'http://charge.com/';
Vue.prototype.authToken = '';
Vue.prototype.checkLogin = function(result) {
	// console.log(result);
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
// 	console.log('before');
// 	//异步取auth token，所以延时500ms后执行后续操作
// 	setTimeout(function(){
// 		console.log('in');
// 	},  1000);
// 	console.log('after');
};
// Vue.prototype.getAuthToken();