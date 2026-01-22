<template>
	<view class="login-container">
		<view class="header-section">
			<view class="title">欢迎新朋友</view>
			<view class="subtitle">淡壳美妆 关注您的皮肤状态</view>
		</view>

		<view class="login-card">
			<view class="tabs-box">
				<view class="tab-item" :class="{ active: currentTab === 0 }" @click="currentTab = 0">手机号登录</view>
				<view class="tab-item" :class="{ active: currentTab === 1 }" @click="currentTab = 1">邮箱登录</view>
			</view>

			<view class="form-content">
				<view class="input-group" v-if="currentTab === 0">
					<view class="country-code" @click="showCountryPicker = true">
						<text>+{{ areaCode }}</text>
						<uni-icons type="bottom" size="14" color="#1E211F"></uni-icons>
					</view>
					<input class="input-field" type="number" placeholder="请输入你的手机号码" placeholder-class="placeholder-style"
						v-model="formData.phone" />
				</view>

				<view class="input-group" v-if="currentTab === 1">
					<input class="input-field" type="text" placeholder="请输入你的邮箱地址" placeholder-class="placeholder-style"
						v-model="formData.email" />
				</view>

				<view class="input-group">
					<input class="input-field code-input" type="number" placeholder="请输入验证码" placeholder-class="placeholder-style"
						v-model="formData.code" />
					<text class="send-code-btn" :class="{ disabled: countdown > 0 }" @click="sendCode">
						{{ countdown > 0 ? countdown + 's' : '发送验证码' }}
					</text>
				</view>

				<view class="input-group">
					<input class="input-field" password placeholder="请输入你的账号密码" placeholder-class="placeholder-style"
						v-model="formData.password" />
				</view>

				<view class="action-links">
					<view class="register-text">
						已有账号？<text class="link-btn" @click="toLogin">去登陆</text>
					</view>
					<view class="forgot-pwd" @click="toForgot">忘记密码</view>
				</view>

				<button class="login-btn" @click="handleLogin">注册新账号</button>

				<view class="agreement-section">
					<radio :checked="isAgreed" @click="isAgreed = !isAgreed" color="#09AB4D" style="transform:scale(0.7)" />
					<view class="agreement-text">
						已阅读同意 <text class="doc">《服务使用协议》</text><text class="doc">《隐私政策》</text>
					</view>
				</view>
			</view>
		</view>

		<country-picker :visible="showCountryPicker" :value="areaCode" @input="areaCode = $event" @cancel="showCountryPicker = false"
			@ok="showCountryPicker = false" />
	</view>
</template>

<script>
import CountryPicker from '@/components/country-picker.vue'
import { userRegister, userEmailRegister } from '@/apis/userApi.js'
import { commonSendSmsCode, commonSendEmailCode } from '@/apis/commonApi.js'

export default {
	components: {
		CountryPicker
	},
	data() {
		return {
			currentTab: 0, // 0: 手机号, 1: 邮箱
			isAgreed: false,
			areaCode: '86',
			showCountryPicker: false,
			countdown: 0, // 倒计时秒数
			timer: null, // 定时器
			formData: {
				phone: '',
				email: '',
				code: '',
				password: ''
			}
		};
	},
	methods: {
		async sendCode() {
			// 如果正在倒计时，不允许再次发送
			if (this.countdown > 0) {
				return;
			}

			// 验证手机号或邮箱
			const contact = this.currentTab === 0 ? this.formData.phone : this.formData.email;
			if (!contact) {
				uni.showToast({
					title: this.currentTab === 0 ? '请输入手机号码' : '请输入邮箱地址',
					icon: 'none'
				});
				return;
			}

			uni.showLoading({ title: '发送中...' })

			if (this.currentTab === 0) {
				// 发送短信验证码
				await commonSendSmsCode({
					phone: this.formData.phone,
					areaCode: this.areaCode
				})
			} else {
				// 发送邮箱验证码
				await commonSendEmailCode({
					email: this.formData.email
				})
			}

			uni.hideLoading()
			uni.showToast({ title: '验证码已发送', icon: 'success' })

			// 开始倒计时
			this.countdown = 60;
			this.timer = setInterval(() => {
				this.countdown--;
				if (this.countdown <= 0) {
					clearInterval(this.timer);
					this.timer = null;
				}
			}, 1000);
		},
		async handleLogin() {
			if (!this.isAgreed) {
				uni.showToast({
					title: '请先同意用户协议',
					icon: 'none'
				});
				return;
			}

			const { phone, email, code, password } = this.formData

			// 验证验证码
			if (!code) {
				uni.showToast({ title: '请输入验证码', icon: 'none' })
				return
			}

			// 验证密码
			if (!password) {
				uni.showToast({ title: '请输入密码', icon: 'none' })
				return
			}

			uni.showLoading({ title: '注册中...' })

			let res
			if (this.currentTab === 0) {
				// 手机号注册
				if (!phone) {
					uni.hideLoading()
					uni.showToast({ title: '请输入手机号码', icon: 'none' })
					return
				}
				res = await userRegister({
					areaCode: this.areaCode,
					email: '',
					emailCode: '',
					password,
					phone,
					smsCode: code
				})
			} else {
				// 邮箱注册
				if (!email) {
					uni.hideLoading()
					uni.showToast({ title: '请输入邮箱地址', icon: 'none' })
					return
				}
				res = await userEmailRegister({
					areaCode: '',
					email,
					emailCode: code,
					password,
					phone: '',
					smsCode: ''
				})
			}

			uni.hideLoading()

			uni.showToast({ title: '注册成功', icon: 'success' })

			setTimeout(() => {
				uni.navigateTo({ url: '/pages/login/login' })
			}, 1500)
		},
		toLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		toForgot() {
			uni.navigateTo({
				url: '/pages/forget/forget'
			})
		}
	},
	// 组件销毁时清除定时器
	onUnload() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}
};
</script>

<style lang="scss" scoped>
// 基础变量对应您提供的设计系统
$green-primary: #09AB4D;
$green-active-tab: #81FD95;
$black-main: #1E211F;
$gray-text: #9CA29D;
$bg-input: #F8FAF9;

.login-container {
	min-height: 100vh;
	width: 100%;
	// 使用您提供的渐变背景
	background: linear-gradient(180deg, #A1FFE5 0%, #DBFFE5 28.37%, #F3FFF6 50.48%, #FFFFFF 72.6%, #FFFFFF 100%);
	padding: 0 44rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.header-section {
	margin-top: 160rpx;
	margin-bottom: 80rpx;

	.title {
		font-size: 56rpx;
		font-weight: bold;
		color: $black-main;
		margin-bottom: 16rpx;
	}

	.subtitle {
		font-size: 28rpx;
		color: #5F7564; // 使用黑2
	}
}

.login-card {
	background-color: #FFFFFF;
	border-radius: 40rpx;
	overflow: hidden;
	box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.05);

	.tabs-box {
		display: flex;
		height: 100rpx;
		background-color: #F3FFF7; // 未选中状态背景

		.tab-item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30rpx;
			color: $gray-text;
			transition: all 0.3s;

			&.active {
				background-color: #FFFFFF;
				color: $black-main;
				font-weight: 500;
				border-radius: 40rpx 40rpx 0 0;
			}
		}
	}

	.form-content {
		padding: 60rpx 40rpx;

		.input-group {
			background-color: $bg-input;
			height: 100rpx;
			border-radius: 15rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			margin-bottom: 30rpx;

			.country-code {
				display: flex;
				align-items: center;
				padding-right: 20rpx;
				margin-right: 20rpx;
				border-right: 1rpx solid #E0E0E0;
				font-size: 28rpx;
				font-weight: 500;

				text {
					margin-right: 8rpx;
				}
			}

			.input-field {
				flex: 1;
				font-size: 28rpx;

				&.code-input {
					flex: 1;
					margin-right: 20rpx;
				}
			}

			.placeholder-style {
				color: #C2C9C3; // 黑4
			}

			.send-code-btn {
				font-size: 26rpx;
				color: $green-primary;
				font-weight: 500;
				white-space: nowrap;
				padding-left: 20rpx;
				border-left: 1rpx solid #E0E0E0;

				&.disabled {
					color: $gray-text;
				}

				&:active:not(.disabled) {
					opacity: 0.7;
				}
			}
		}

		.action-links {
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			color: $gray-text;
			margin-bottom: 60rpx;

			.link-btn {
				color: $green-primary;
				margin-left: 10rpx;
				font-weight: 500;
			}
		}

		.login-btn {
			background-color: $black-main;
			color: #FFFFFF;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 50rpx;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 40rpx;

			&:active {
				opacity: 0.8;
			}
		}

		.agreement-section {
			display: flex;
			align-items: center;
			justify-content: center;

			.agreement-text {
				font-size: 22rpx;
				color: $gray-text;

				.doc {
					color: $black-main;
					margin-left: 4rpx;
				}
			}
		}
	}
}
</style>