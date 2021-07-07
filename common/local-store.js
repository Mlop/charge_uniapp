//本地存储相关方法
import {common} from '@/common/common.js'

module.exports = {
	setDatasource: function (source) {
		uni.setStorageSync('data_source', source);
		var now = common.now;
		//每2小时检查一次
		uni.setStorageSync('data_source_check', {"time":now, "next":now + (2*60*60*1000)});
	},
	isExists: function(key){
		return uni.getStorageSync(key);
	},
	isLocal: function(){
		var source = uni.getStorageSync('data_source');
		return source == 'local';
	},
	checkDB: function() {
		var checkTime = uni.getStorageSync("data_source_check");
		//定期检查DB连接情况
		if (checkTime) {
			if (checkTime["next"] <= common.now) {
				this.setDatasource("network");
				return true;
			}
		}
		return false;
	},
	//设置默认数据，默认分类，菜单等
	setDefaultData: function(){
		//收入常用类别
		var incomeCat = [{"id":47,"title":"红包","type":"income","parent_category_id":0,"user_id":null,"created_at":"2019-02-2719:43:41","updated_at":"2019-02-2719:43:41","isFav":1},{"id":48,"title":"工资薪水","type":"income","parent_category_id":0,"user_id":null,"created_at":"2019-02-2719:33:47","updated_at":"2019-02-2719:33:47","isFav":1},{"id":49,"title":"营业收入","type":"income","parent_category_id":0,"user_id":null,"created_at":"2019-02-2719:33:47","updated_at":"2019-02-2719:33:47","isFav":1},{"id":50,"title":"奖金","type":"income","parent_category_id":0,"user_id":null,"created_at":"2019-02-2719:33:47","updated_at":"2019-02-2719:33:47","isFav":1}];
		//支出常用类别
		var outgoCat = [{"id":2,"title":"早餐","type":"outgo","parent_category_id":1,"user_id":null,"created_at":"2019-02-2719:33:47","updated_at":"2019-02-2719:33:47","isFav":1},{"id":3,"title":"午餐","type":"outgo","parent_category_id":1,"user_id":null,"created_at":"2019-02-2719:33:47","updated_at":"2019-02-2719:33:47","isFav":1},{"id":4,"title":"晚餐","type":"outgo","parent_category_id":1,"user_id":null,"created_at":"2019-02-2719:33:47","updated_at":"2019-02-2719:33:47","isFav":1},{"id":10,"title":"打车","type":"outgo","parent_category_id":9,"user_id":null,"created_at":"2019-02-2719:33:47","updated_at":"2019-02-2719:33:47","isFav":1}];
		//借贷常用类别
		var loanCat = [{"id":52,"title":"借入","type":"loan","parent_category_id":0,"user_id":null,"created_at":"2020-06-3014:52:26","updated_at":"2020-06-3014:52:26","isFav":1},{"id":53,"title":"借出","type":"loan","parent_category_id":0,"user_id":null,"created_at":"2019-02-1311:52:53","updated_at":"2019-02-1311:52:53","isFav":1},{"id":54,"title":"还款","type":"loan","parent_category_id":0,"user_id":null,"created_at":"2020-09-1510:03:44","updated_at":"2020-09-1510:03:44","isFav":1},{"id":55,"title":"收款","type":"loan","parent_category_id":0,"user_id":null,"created_at":"2019-02-1311:52:53","updated_at":"2019-02-1311:52:53","isFav":1}];
		var books = [{"id":2,"title":"个人账目","user_id":0,"created_at":"2020-04-0910:54:51","updated_at":"2020-04-0910:54:49"}];
		var items = [{"value":"2","name":"现金￥","checked":true,"value_type":1,"default_value":"0.00"}];
		uni.setStorageSync('default_config', {"income":incomeCat,"outgo":outgoCat, "loan":loanCat, "books":books, "book_items": items});
	},
	getData: function (key) {
		return uni.getStorageSync(key);
	},
	setData: function (key, data) {
		uni.setStorageSync(key, data);
	},
	getCategoryTitle: function(type, id){
		var config = uni.getStorageSync("default_config");
		var data = config[type];
		var title = data.forEach(function(row){
			if (row.id == id) {
				return row.title;
			}
		});
	},
	//首页统计列表
	generateLocalReport: function() {
		var data = uni.getStorageSync("account");
		var items = [];
		var config = uni.getStorageSync("default_config");
		data.forEach(function(val, i){
			var row = {cash:val.cash};
			var category = config[val.type];
			var title = "";
			category.forEach(function(row){
				if (row.id == val.category_id) {
					title = row.title;
					return true;
				}
			});
			row["m"] = common.parseTime(val.record_at,'{m}');
			row["days"] = common.parseTime(val.record_at,'{d}');
			row["category_title"] = row["title"] = title;
			row["remark"] = val.remark+" " + val.record_at;
			row["type"] = val.type;
			row["id"] = i;
			switch(val.type) {
				case "income":
				break;
				case "outgo":
				break;
				case "loan":
				break;
			}
			items.push(row);
		});
		return items;
	}
}