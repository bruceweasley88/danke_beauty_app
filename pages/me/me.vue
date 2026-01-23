<template>
	<view class="profile-container">
		<view class="header-section" @click="toPersonal">
			<view class="avatar-box">
				<image class="avatar" :src="userInfo.headImg || '/static/img/icon_photo.webp'" mode="aspectFill">
				</image>
			</view>
			<view class="user-info">
				<text class="user-name">{{ userInfo.nickName || $t('me.noNickname') }}</text>
				<view class="social-link">
					<text v-if="firstSocial">{{ firstSocial }}</text>
					<text v-else>{{ $t('me.addSocialAccount') }}</text>
					<view class="mini-arrow"></view>
				</view>
			</view>
		</view>

		<view style="margin-bottom: 30rpx;">
			<points :point="userInfo.hst || 0" @detail="toPointsDetail" :key="Date.now()"></points>
			<view class="wallet-main">
				<view class="my-wallet" @click="toWallet('wallet')">
					<view class="title">{{ $t('me.myWallet') }}</view>
					<view class="value">
						<text class="unit">$</text>
						<text class="number">{{ balance }}</text>
						<text class="unit">HST</text>
					</view>
					<view class="icon wallet"></view>
				</view>
				<view class="wallet-address" @click="toWallet('address')">
					<view class="title">{{ $t('me.walletAddress') }}</view>
					<view class="bindding">{{ userInfo.walletAddress ? $t('me.bound') + ' >' : $t('me.toBind') + ' >' }}</view>
					<view class="icon address"></view>
				</view>
			</view>
		</view>

		<view class="settings-section">
			<view class="section-title">{{ $t('me.settings') }}</view>

			<view class="list-card">
				<view class="list-item" hover-class="item-hover" @click="toPersonal">
					<view class="item-icon-placeholder" style="background-image: url('/static/me_img/icon_profile.png');"></view>
					<text class="item-label">{{ $t('me.personalProfile') }}</text>
					<view class="arrow-placeholder"></view>
				</view>
				<view class="list-item" hover-class="item-hover" @click="toDevices">
					<view class="item-icon-placeholder" style="background-image: url('/static/me_img/icon_device.png');"></view>
					<text class="item-label">{{ $t('me.myDevices') }}</text>
					<view class="arrow-placeholder"></view>
				</view>
				<view class="list-item" hover-class="item-hover" @tap="toUserManual">
					<view class="item-icon-placeholder" style="background-image: url('/static/me_img/icon_explanation.png');">
					</view>
					<text class="item-label">{{ $t('me.userManual') }}</text>
					<view class="arrow-placeholder"></view>
				</view>
				<view class="list-item" hover-class="item-hover" @click="toLanguage">
					<view class="item-icon-placeholder" style="background-image: url('/static/me_img/icon_language.png');"></view>
					<text class="item-label">{{ $t('me.languageSelection') }}</text>
					<view class="arrow-placeholder"></view>
				</view>
				<view class="list-item" hover-class="item-hover" @click="toAbout">
					<view class="item-icon-placeholder" style="background-image: url('/static/me_img/icon_about.png');"></view>
					<text class="item-label">{{ $t('me.aboutUs') }}</text>
					<view class="arrow-placeholder"></view>
				</view>
			</view>
		</view>

		<view class="logout-wrapper">
			<button class="logout-btn" border="false" @tap="handleLogout">{{ $t('me.logout') }}</button>
		</view>
		<custom-tab-bar active="me" :key="Date.now()" />
	</view>
</template>

<script>
import {
	userGetInfo
} from '@/apis/userApi.js'
import points from '../../components/points.vue';
import { getTokenBalance } from '../../utils/hst';
import CustomTabBar from '@/components/custom-tab-bar.vue';

export default {
	components: {
		points,
		CustomTabBar
	},
	data() {
		return {
			userInfo: {},

			balance: 0
		};
	},
	onShow() {
		uni.hideTabBar()
		this.getUserInfo();
	},
	computed: {
		// 获取第一个已填写的社交账号
		firstSocial() {
			const socialFields = [{
				key: 'whatsapp',
				prefix: 'whatsapp@'
			},
			{
				key: 'x',
				prefix: 'x@'
			},
			{
				key: 'tg',
				prefix: 'telegram@'
			}
			];

			for (const field of socialFields) {
				if (this.userInfo[field.key]) {
					return field.prefix + this.userInfo[field.key];
				}
			}
			return null;
		}
	},
	methods: {
		async getUserInfo() {
			const userInfo = await userGetInfo();
			this.userInfo = userInfo.data;
			this.balance = await getTokenBalance(this.userInfo.walletAddress)
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
		toLanguage() {
			uni.navigateTo({
				url: '/pages/language/language'
			})
		},
		toPointsDetail() {
			uni.navigateTo({
				url: '/pages/my-points/my-points'
			})
		},
		toWallet(type) {
			uni.navigateTo({
				url: `/pages/wallet/wallet?type=${type}`
			})
		},
		toUserManual() {
			uni.navigateTo({
				url: '/pages/user-manual/user-manual'
			})
		},
		handleLogout() {
			uni.showModal({
				title: this.$t('me.tip'),
				content: this.$t('me.logoutConfirm'),
				success: (res) => {
					if (res.confirm) {
						// 用户点击确定
						uni.removeStorageSync('token')
						this.userInfo = {}
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}
					// 用户点击取消，不做任何操作
				}
			})
		}
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
	padding: 0 30rpx 100rpx;
	/* 背景渐变已由全局处理，此处保持透明 */
}

/* 头部样式 */
.header-section {
	display: flex;
	align-items: center;
	padding: 100rpx 10rpx 0rpx;

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


.wallet-main {
	margin: 0 auto;
	width: 692rpx;
	display: flex;
	justify-content: space-between;
	margin-top: 20rpx;

	.my-wallet {
		height: 131rpx;
		width: 382rpx;
		background: #FFFFFF;
		border-radius: 22rpx;
		position: relative;

		.value {
			color: #1E211F;
			padding-left: 30rpx;

			.unit {
				font-weight: 500;
				font-size: 25rpx;
			}

			.number {
				font-weight: 500;
				font-size: 40rpx;
				margin: 0 4rpx;
			}
		}
	}

	.wallet-address {
		height: 131rpx;
		width: 288rpx;
		background: #FFFFFF;
		border-radius: 22rpx;
		position: relative;

		.bindding {
			border-radius: 16rpx;
			width: 102rpx;
			height: 33rpx;
			background: #1E211F;
			color: #FFFFFF;
			font-weight: 400;
			font-size: 22rpx;
			text-align: center;
			margin-left: 30rpx;
			margin-top: 20rpx;
		}
	}

	.icon {
		height: 84rpx;
		width: 84rpx;
		position: absolute;
		top: calc(50% - (84rpx / 2));
		right: 20rpx;
		background-size: cover;
	}

	.wallet {
		background-image: url('/static/me_img/img_wallet@2x.png');
	}

	.address {
		background-image: url('/static/me_img/img_address@2x.png');
	}

	.title {
		color: #1E211F;
		font-size: 25rpx;
		font-weight: 400;
		padding-top: 22rpx;
		padding-left: 30rpx;
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
	margin-bottom: 100rpx;

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