<template>
	<view class="login-container">
		<view class="header-section">
			<view class="title">{{ $t('login.title') }}</view>
			<view class="subtitle">{{ $t('auth.appName') }} {{ $t('auth.appSlogan') }}</view>
		</view>

		<view class="login-card">
			<view class="tabs-box">
				<view class="tab-item" :class="{ active: currentTab === 0 }" @click="currentTab = 0">{{ $t('auth.phoneLogin') }}</view>
				<view class="tab-item" :class="{ active: currentTab === 1 }" @click="currentTab = 1">{{ $t('auth.emailLogin') }}</view>
			</view>

			<view class="form-content">
				<view class="input-group" v-if="currentTab === 0">
					<view class="country-code" @click="showCountryPicker = true">
						<text>+{{ areaCode }}</text>
						<uni-icons type="bottom" size="14" color="#1E211F"></uni-icons>
					</view>
					<input class="input-field" type="number" :placeholder="$t('auth.placeholderPhone')" placeholder-class="placeholder-style"
						v-model="formData.phone" />
				</view>

				<view class="input-group" v-if="currentTab === 1">
					<input class="input-field" type="text" :placeholder="$t('auth.placeholderEmail')" placeholder-class="placeholder-style"
						v-model="formData.email" />
				</view>

				<view class="input-group">
					<input class="input-field" password :placeholder="$t('auth.placeholderPassword')" placeholder-class="placeholder-style"
						v-model="formData.password" />
				</view>

				<view class="action-links">
					<view class="register-text">
						{{ $t('login.noAccount') }}<text class="link-btn" @click="toRegister">{{ $t('login.toRegister') }}</text>
					</view>
					<view class="forgot-pwd" @click="toForgot">{{ $t('login.forgotPassword') }}</view>
				</view>

				<button class="login-btn" @click="handleLogin">{{ $t('login.loginBtn') }}</button>

				<view class="agreement-section">
					<radio :checked="isAgreed" @click="isAgreed = !isAgreed" color="#09AB4D" style="transform:scale(0.7)" />
					<view class="agreement-text">
						{{ $t('auth.agreePolicy') }}
						<text class="doc">{{ $t('auth.servicePolicy') }}</text><text class="doc">{{ $t('auth.privacyPolicy') }}</text>
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
import { userPasswordLogin, userEmailLogin } from '@/apis/userApi.js'

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
			formData: {
				phone: '',
				email: '',
				password: ''
			}
		};
	},
	mounted() {
		// 开发模式下自动填充测试账号
		// #ifdef MP-WEIXIN
		// 小程序环境不自动填充
		// #endif
		// #ifdef APP-PLUS || H5
		if (process.env.NODE_ENV === 'development') {
			this.formData.phone = '17876087976';
			this.formData.password = '1234567';
			this.isAgreed = true;
		}
		// #endif
	},
	methods: {
		async handleLogin() {
			if (!this.isAgreed) {
				uni.showToast({
					title: this.$t('auth.pleaseAgreeFirst'),
					icon: 'none'
				});
				return;
			}

			const { phone, email, password } = this.formData

			if (!password) {
				uni.showToast({ title: this.$t('auth.pleaseEnterPassword'), icon: 'none' })
				return
			}

			uni.showLoading({ title: this.$t('auth.logging') })

			let res
			if (this.currentTab === 0) {
				// 手机号登录
				if (!phone) {
					uni.hideLoading()
					uni.showToast({ title: this.$t('auth.pleaseEnterPhone'), icon: 'none' })
					return
				}
				res = await userPasswordLogin({
					phone: this.areaCode + phone,
					password,
					terminal: 1,
					areaCode: this.areaCode,
					deviceToken: 1,
				})
			} else {
				// 邮箱登录
				if (!email) {
					uni.hideLoading()
					uni.showToast({ title: this.$t('auth.pleaseEnterEmail'), icon: 'none' })
					return
				}
				res = await userEmailLogin({
					email,
					password,
					terminal: 1,
					deviceToken: 1,
				})
			}

			uni.hideLoading()

			// 存储 token
			if (res.data?.token) {
				uni.setStorageSync('token', res.data.token)
			}

			uni.showToast({ title: this.$t('auth.loginSuccess'), icon: 'success' })

			setTimeout(() => {
				uni.switchTab({ url: '/pages/index/index' })
			}, 1500)
		},
		toRegister() {
			uni.navigateTo({
				url: '/pages/register/register'
			})
		},
		toForgot() {
			uni.navigateTo({
				url: '/pages/forget/forget'
			})
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
			}

			.placeholder-style {
				color: #C2C9C3; // 黑4
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