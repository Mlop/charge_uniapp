import Vue from 'vue'
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