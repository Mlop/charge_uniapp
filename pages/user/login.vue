<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit" @reset="formReset">
				<view>
					<view class="uni-title">账户</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<input class="uni-input" name="account" placeholder="请填写您的名称/手机号码/邮箱地址" />
						</view>
					</view>
				</view>
				<view>
					<view class="uni-title">密码</view>
					<view class="uni-list">
						<view class="with-fun" style="display: flex;">
							<input class="uni-input" placeholder="请输入密码" name="password" :password="showPassword" />
							<view class="uni-icon uni-icon-eye" :class="[!showPassword ? 'uni-active' : '']" @click="showPasswordToggle"></view>
						</view>
					</view>
				</view>
				<view class="uni-btn-v uni-common-mt">
					<button class="btn-submit" formType="submit" type="primary">登录</button>
					<navigator url="register"><button type="default">注册</button></navigator>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import CryptoJS from '../../node_modules/crypto-js/crypto-js.js' 
	var  graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				showPassword: true,
			}
		},
		methods: {
			formSubmit: function (e) {
				//定义表单规则
				var rule = [
					{name:"account", checkType : "notnull", checkRule:"",  errorMsg:"请输入账号名称"},
					{name:"password", checkType : "notnull", checkRule:"",  errorMsg:"请输入密码"}
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				//验证通过
				if(checkRes){
					//登录
					this.login(formData);
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			login: function (formData) {
				var _this = this;
				uni.request({
					method: 'POST',
					dataType: 'json',
					url: this.baseUrl+'login',
					data: formData,
					success: (res, statusCode, header) => {
						var result = res.data;
						if (result.code == 0) {
							//登录成功，保存用户信息
							uni.clearStorageSync();
							uni.setStorageSync('user', result.data);
							let words = CryptoJS.enc.Utf8.parse(JSON.stringify(formData));   //  加密
							let base64 = CryptoJS.enc.Base64.stringify(words);   //base64加密
							uni.setStorageSync('user_login', base64);
							// uni.navigateBack();
							//跳转到首页后调用init初始化页面数据
							uni.switchTab({
								url:'../index/index',
								success: function(e) {
									var page = getCurrentPages()[0];
									if (page == undefined || page == null) return;
									page.init();
								}
							});
						} else {
							uni.showModal({
								content: result.msg,
								showCancel: false
							});
						}
					},
					fail: (err) => {
						console.log('request fail', err);
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
			showPasswordToggle: function() {
				this.showPassword = !this.showPassword;
			}
		},
	}
</script>

<style>
</style>
