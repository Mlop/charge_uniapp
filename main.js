import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// Vue.prototype.baseUrl = 'http://charge.api.com/';
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
	} else if (result.code == 1) {
		uni.showModal({
			content: result.msg,
			showCancel: false
		});
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
Vue.prototype.showResult = function(result, showSuccess = true, title = "保存成功!", callback = "") {
	if (result.code == 0) {
		if (showSuccess) {
			uni.showToast({title:title, success() {
				if (callback) {
					callback();
				}
			}});
		}
	} else {
		Vue.prototype.checkLogin(result);
	}
}

Vue.prototype.request = function(method, uri, data, sucCallback) {
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
					Vue.prototype.checkLogin(result);
					// uni.showModal({
					// 	content: result.msg,
					// 	showCancel: false
					// });
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
Vue.prototype.getQueryParams = function(searchKey) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
    var params = [];
    for (var i=0;i<vars.length;i++) {
	    var pair = vars[i].split("=");
	    var key = pair[0];
	    var val = pair[1];
	    params[key] = val;
	    if(key == searchKey) {
		    return val;
		}
	}
   return params;
}