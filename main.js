import Vue from 'vue'
import App from './App'
import global from './common/global.js'
import Store from './common/local-store.js'
import {common} from '@/common/common.js'
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// Vue.prototype.baseUrl = 'http://charge.api.com/';
Vue.prototype.baseUrl = 'http://119.27.163.89:8082/';
Vue.prototype.authToken = '';
import CryptoJS from './node_modules/crypto-js/crypto-js.js' 
Vue.prototype.checkLogin = function(result) {
	switch(result.code) {
		case 401:
			if (Vue.prototype.isExistsLogin()) {
				return true;
			}
			//如果本地已经登录过，再次调用登录接口获取token
			var userLogin = uni.getStorageSync('user_login');
			if (userLogin) {
				let base64 = CryptoJS.enc.Base64.parse(userLogin);   //base64解密
				let loginInfo = JSON.parse(CryptoJS.enc.Utf8.stringify(base64)); 
				uni.request({
					method: 'POST',
					dataType: 'json',
					url: this.baseUrl + 'login',
					data: loginInfo,
					success: (res) => {
						var result = res.data;
						if (result.code == 0) {
							//登录成功，保存用户信息
							uni.clearStorageSync();
							uni.setStorageSync('user', result.data);
							let words = CryptoJS.enc.Utf8.parse(JSON.stringify(loginInfo));   //  加密
							let base64 = CryptoJS.enc.Base64.stringify(words);   //base64加密
							uni.setStorageSync('user_login', base64);
						}
					},
				});
			} else {
				uni.navigateTo({
					url:'/pages/user/login'
				});
			}
			break;
		case 402:
			Vue.prototype.authToken = "Bearer " + result.data;
			//保存token信息
			var user = uni.getStorageSync('user');
			user.token = result.data;
			uni.setStorageSync('user', user);
			break;
		case 405://连接DB失败
			Store.setDatasource('local');
		break;
		case 1:
			uni.showModal({
				content: result.msg,
				showCancel: false
			});
			break;
	}
};
//local storage中存在user对象则已经登录
Vue.prototype.isExistsLogin = function(){
	const user = uni.getStorageSync('user');
	if (user != "" && user.token && user.token.length > 0) {
		let loginBase64 = user.token.split(".");
		let base64 = CryptoJS.enc.Base64.parse(loginBase64[1]);   //base64解密
		let loginInfo = JSON.parse(CryptoJS.enc.Utf8.stringify(base64)); 
		let timestamp = Date.parse(new Date()) / 1000;
		if (timestamp > loginInfo.exp) {
			return false;
		}
		return true;
	}
	return false;
}
Vue.prototype.getAuthToken = function(afterLogin) {
	const user = uni.getStorageSync('user');
	if (user != "" && user.token && user.token.length > 0) {
		Vue.prototype.authToken = "Bearer " + user.token;
		if (afterLogin != undefined) {
			afterLogin();
		}
	} else {
		uni.navigateTo({
			url:'/pages/user/login'
		});
	}
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
Vue.prototype.requestLocal = async function(method, uri, data, sucCallback, localKey, valueKey) {
	// var checkTime = Store.getData("data_source_check");
	//定期检查DB连接情况
	if (Store.checkDB()) {
		// if (checkTime["next"] <= common.now) {
			// Store.setDatasource("network");
		return await this.request(method, uri, data, sucCallback, localKey, valueKey);
		// }
	}
	//进入首页准备默认数据
	if (!Store.isExists("default_config")) {
		Store.setDefaultData();
	}
	var result = [];
	if (localKey != undefined) {
		switch (method.toUpperCase()) {
			case 'GET':
			result = Store.getData(localKey);
			break;
			case 'POST':
			if (valueKey != undefined) {
				var obj = {};
				obj[valueKey] = data;
				result = Store.setData(localKey, obj);
			} else {
				result = Store.setData(localKey, data);
			}
			break;
		}
		if (result != undefined) {
			if (valueKey != undefined) {
				result = result[valueKey];
			}
			sucCallback(result);
		}
	}
}
/**
 * @param {string} method GET/POST
 * @param {string} uri 接口相对路径
 * @param {Object} data 条件
 * @param {fun} sucCallback 处理数据的回调函数
 * @param {string} localKey 本地key
 * @param {string} valueKey 值中的key
 */
Vue.prototype.request = async function(method, uri, data, sucCallback, localKey, valueKey) {
	// var pages = getCurrentPages();
	// var currPage = pages[pages.length - 1].route; //当前页面
	//从本地读取数据
	if (Store.isLocal()) {
		this.requestLocal(method, uri, data, sucCallback, localKey, valueKey);
		return true;
	}
	
	await this.getAuthToken();
	await uni.request({
		method: method,
		dataType: 'json',
		url: this.baseUrl + uri,
		data: data,
		header: {
			Authorization:this.authToken,
		},
		success: (res) => {
			var result = res.data;
			switch(result.code) {
				case 0://成功
					sucCallback((result.data == undefined) ? result.msg : result.data);
				break;
				case 1://接口返回错误
					uni.showModal({
						content: result.msg,
						showCancel: false
					});
				break;
				case 401://登录token过期(跳转到登录界面)
					if (Vue.prototype.isExistsLogin()) {
						sucCallback(result.data);
						return true;
					}
					//如果本地已经登录过，再次调用登录接口获取token
					var userLogin = uni.getStorageSync('user_login');
					if (userLogin) {
						let base64 = CryptoJS.enc.Base64.parse(userLogin);   //base64解密
						let loginInfo = JSON.parse(CryptoJS.enc.Utf8.stringify(base64)); 
						uni.request({
							method: 'POST',
							dataType: 'json',
							url: this.baseUrl + 'login',
							data: loginInfo,
							success: (res) => {
								var logResult = res.data;
								if (logResult.code == 0) {
									//登录成功，保存用户信息
									uni.clearStorageSync();
									uni.setStorageSync('user', logResult.data);
									let words = CryptoJS.enc.Utf8.parse(JSON.stringify(loginInfo));   //  加密
									let base64 = CryptoJS.enc.Base64.stringify(words);   //base64加密
									uni.setStorageSync('user_login', base64);
									sucCallback(result.data);
								}
							},
						});
					} else {//登录token过期(跳转到登录界面)
						uni.navigateTo({
							url:'/pages/user/login'
						});
					}
				break;
				case 402://登录token失效，需要交换token（重新保存登录token到storage,使用新token再次调用接口）
					Vue.prototype.authToken = "Bearer " + result.data;
					//保存token信息
					var user = uni.getStorageSync('user');
					user.token = result.data;
					uni.setStorageSync('user', user);
					Vue.prototype.request(method, uri, data, sucCallback);
				break;
				case 405://DB未连接
					Store.setDatasource('local');
					sucCallback(result.data);
				break;
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