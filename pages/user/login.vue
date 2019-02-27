<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit" @reset="formReset">
				<view>
					<view class="uni-title">账户</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<input class="uni-input" name="account" placeholder="请填写您的手机号码/邮箱地址" />
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
	var  graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				showPassword: true,
			}
		},
		methods: {
			formSubmit: function (e) {
				//将下列代码加入到对应的检查位置
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
					success: (res) => {
						var result = res.data;
						console.log(result);
						if (result.code == 0) {
							//登录成功，保存用户信息@todo
							uni.clearStorage();
							uni.setStorage({
								key:'user', 
								'data':result.data,
								success: function (data) {
// 									_this.authToken = data.token;
// 									console.log(_this.authToken);
uni.navigateBack();
									// uni.switchTab({
									// 								url:'../index/index'
									// 							});
								},
							});
							// uni.navigateBack();
// 							uni.switchTab({
// 								url:'../index/index'
// 							});
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
