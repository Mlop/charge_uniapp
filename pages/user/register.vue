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
					<view class="uni-title">名称</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<input class="uni-input" name="name" placeholder="请填写您的登录名称" />
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
					<button class="btn-submit" formType="submit" type="primary">注册</button>
					<button type="default" formType="reset">Reset</button>
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
					{name:"account", checkType : "string", checkRule:"1,30",  errorMsg:"账户应为1-30个字符"},
					{name:"password", checkType : "string", checkRule:"4,10",  errorMsg:"账户应为4-10个字符"}
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					//入库
					this.register(formData);
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			showPasswordToggle: function() {
				this.showPassword = !this.showPassword;
			},
			register: function (formData) {
				this.request('POST', 'register', formData, function(data){
					//成功，保存用户信息
					uni.clearStorage();
					uni.setStorage({
						key:'user', 
						'data':data,
						success: function () {
							uni.switchTab({
								url:'../index/index'
							});
						},
					});
				});
			},
		},
	}
</script>

<style>
</style>
