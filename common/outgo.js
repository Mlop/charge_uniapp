/**
支出公用函数 
作者 Vera
*/
module.exports = {
	//统一的关闭popup方法
	hidePopup: function() {
		this.showPopupMiddle = false;
		this.showPopupTop = false;
		this.showPopupBottom = false;
	},
	//展示居中 popup
	showMiddlePopup: function() {
		this.hidePopup();
		this.popType = 'middle';
		this.showPopupMiddle = true;
	}
}