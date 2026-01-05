<template>
	<view class="profile-container">
		<view class="header-section">
			<view class="avatar-box">
				<image class="avatar" :src="userInfo.headImg || '/static/img/icon_photo.webp'" mode="aspectFill"></image>
			</view>
			<view class="user-info">
				<text class="user-name">{{ userInfo.nickName || '未设置昵称' }}</text>
				<view class="social-link">
					<text>添加您的社交账号</text>
					<view class="mini-arrow"></view>
				</view>
			</view>
		</view>

		<view class="settings-section">
			<view class="section-title">设置</view>

			<view class="list-card">
				<view class="list-item" v-for="(item, index) in menuList" :key="index" hover-class="item-hover" @click="handleMenuClick(item)">
					<view class="item-icon-placeholder" :style="`background-image: url('${item.icon}');`"></view>
					<text class="item-label">{{ item.title }}</text>
					<view class="arrow-placeholder"></view>
				</view>
			</view>
		</view>

		<view class="logout-wrapper">
			<button class="logout-btn" border="false">退出登录</button>
		</view>
	</view>
</template>

<script>
import { userGetInfo } from '@/apis/userApi.js'

export default {
	data() {
		return {
			userInfo: {},
			menuList: [
				{ title: '个人资料', icon: '/static/me_img/icon_profile@2x.png', action: 'toPersonal' },
				{ title: '我的设备', icon: '/static/me_img/icon_device@2x.png', action: 'toDevices' },
				{ title: '使用说明', icon: '/static/me_img/icon_explanation@2x.png' },
				{ title: '语言选择', icon: '/static/me_img/icon_language@2x.png' },
				{ title: '关于我们', icon: '/static/me_img/icon_about@2x.png', action: 'toAbout' }
			]
		};
	},
	onShow() {
		this.getUserInfo();
	},
	methods: {
		async getUserInfo() {
			const userInfo = await userGetInfo();
			this.userInfo = userInfo.data;
		},
		handleMenuClick(item) {
			if (item.action && typeof this[item.action] === 'function') {
				this[item.action]();
			}
		},
		toPersonal() {
			uni.navigateTo({
				url: '/pages/personal/personal'
			})
		},
		toDevices() {
			uni.navigateTo({
				url: '/pages/devices/devices'
			})
		},
		toAbout() {
			uni.navigateTo({
				url: '/pages/about/about'
			})
		},
	}
};
</script>

<style lang="scss" scoped>
// 颜色变量定义
$green-primary: #09AB4D;
$black-main: #1E211F;
$grey-text: #9CA29D;
$card-bg: #FFFFFF;
$placeholder-color: #888;

.profile-container {
	min-height: 100vh;
	padding: 0 30rpx;
	/* 背景渐变已由全局处理，此处保持透明 */
}

/* 头部样式 */
.header-section {
	display: flex;
	align-items: center;
	padding: 100rpx 10rpx 60rpx;

	.avatar-box {
		width: 130rpx;
		height: 130rpx;
		border-radius: 50%;
		background-color: #E8E8E8; // 头像空位背景
		overflow: hidden;
		border: 4rpx solid #fff;

		.avatar {
			width: 100%;
			height: 100%;
		}
	}

	.user-info {
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;

		.user-name {
			font-size: 48rpx;
			font-weight: 500;
			color: $black-main;
			line-height: 1.2;
		}

		.social-link {
			display: flex;
			align-items: center;
			margin-top: 12rpx;
			font-size: 26rpx;
			color: $green-primary;

			.mini-arrow {
				width: 12rpx;
				height: 12rpx;
				border-top: 3rpx solid $green-primary;
				border-right: 3rpx solid $green-primary;
				transform: rotate(45deg);
				margin-left: 8rpx;
			}
		}
	}
}

/* 设置列表样式 */
.settings-section {
	.section-title {
		font-size: 34rpx;
		font-weight: 500;
		color: $black-main;
		margin-bottom: 30rpx;
		padding-left: 10rpx;
	}

	.list-card {
		background-color: $card-bg;
		border-radius: 32rpx;
		overflow: hidden;
		box-shadow: 0rpx 5rpx 40rpx 0rpx rgba(220, 236, 225, 0.2);

		.list-item {
			display: flex;
			align-items: center;
			padding: 40rpx 30rpx;
			transition: background-color 0.2s;

			&:active {
				background-color: #F8FAF9;
			}

			.item-icon-placeholder {
				width: 48rpx;
				height: 48rpx;
				background-size: cover;
			}

			.item-label {
				flex: 1;
				margin-left: 24rpx;
				font-size: 30rpx;
				color: $black-main;
			}

			.arrow-placeholder {
				width: 16rpx;
				height: 16rpx;
				border-top: 3.5rpx solid $placeholder-color;
				border-right: 3.5rpx solid $placeholder-color;
				transform: rotate(45deg);
			}
		}
	}
}

/* 退出登录按钮 */
.logout-wrapper {
	margin-top: 60rpx;
	padding: 0 10rpx;

	.logout-btn {
		width: 100%;
		height: 106rpx;
		line-height: 110rpx;
		background: #F8FAF9; // 略显透明的浅灰
		color: #C2C9C3;
		font-size: 32rpx;
		border-radius: 30rpx;
		border: none;

		&::after {
			border: none; // 去除uniapp按钮默认边框
		}
	}
}
</style>