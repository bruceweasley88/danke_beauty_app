<template>
	<view class="about-page">
		<nav-back :title="$t('about.title')"></nav-back>
		<view class="logo-section">
			<view class="app-logo"></view>
			<view class="app-name">{{ $t('about.appName') }}</view>
			<view class="app-slogan">{{ $t('about.slogan') }}</view>
		</view>

		<view class="content-card">
			<view class="list-item" @tap="checkUpdate">
				<text class="title">{{ $t('about.checkUpdate') }}</text>
				<view class="right-box">
					<text class="version-text">{{ displayVersion }}</text>
					<text class="arrow-icon"></text>
				</view>
			</view>
			<view class="list-item" @tap="toSerivce">
				<text class="title">{{ $t('about.serviceAgreement') }}</text>
				<view class="right-box">
					<text class="arrow-icon"></text>
				</view>
			</view>
		</view>

		<view class="modal-mask" v-if="showModal" @touchmove.stop.prevent>
			<view class="modal-body">
				<view class="modal-header">
					<view class="m-title">{{ $t('about.updateDetected') }}</view>
					<view class="m-tips">{{ $t('about.newVersionTip') }}</view>
				</view>

				<view class="modal-illustration"></view>

				<view class="modal-footer">
					<view class="btn btn-cancel" @tap="showModal = false">{{ $t('common.cancel') }}</view>
					<view class="btn btn-update" @tap="confirmUpdate">{{ $t('about.update') }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import NavBack from '../../components/nav-back.vue'
import { configGetAppVersion } from '../../apis/configApi';

export default {
	components: {
		NavBack,
	},
	data() {
		console.log(uni.getSystemInfoSync());

		return {
			displayVersion: uni.getSystemInfoSync().appWgtVersion,
			showModal: false
		};
	},
	onLoad() {

	},
	methods: {
		checkUpdate() {
			uni.showLoading({ title: this.$t('about.checkingUpdate') });

			const systemInfo = uni.getSystemInfoSync();
			const platformType = systemInfo.platform === 'ios' ? 1 : 2;


			const versionNum = Number(this.displayVersion.replace(/\./g, ''));
			configGetAppVersion({
				type: platformType,
				versionNum: versionNum,
				terminal: 1
			}).then(res => {
				uni.hideLoading();
				if (res.data.state === '1') {
					this.showModal = true;
				} else {
					uni.showToast({ title: this.$t('about.isLatest'), icon: 'success' });
				}
			});
		},
		confirmUpdate() {
			uni.showModal({
				title: this.$t('about.updateTip'),
				content: this.$t('about.manualUpdateTip'),
				showCancel: false,
				confirmText: this.$t('about.gotIt'),
				confirmColor: '#09AB4D'
			});
			this.showModal = false;
		},
		toSerivce() {
			uni.navigateTo({
				url: '/pages/service-agreement/service-agreement'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
/* 设计系统配色变量 */
$green-main: #09AB4D;
$green-light: #2EC96F;
$black-1: #1E211F;
$black-3: #9CA29D;
$black-5: #F8FAF9;
$border-color: #EEEEEE;

.about-page {
	min-height: 100vh;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: column;
	align-items: center;

	/* Logo 区域 */
	.logo-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 80rpx;
		padding-top: 80rpx;

		.app-logo {
			width: 160rpx;
			height: 160rpx;
			border-radius: 40rpx;
			margin-bottom: 30rpx;
			background-image: url('/static/img/icon_logos@2x.png');
			background-size: cover;
		}

		.app-name {
			font-size: 40rpx;
			font-weight: 500;
			color: $black-1;
			margin-bottom: 16rpx;
		}

		.app-slogan {
			font-size: 26rpx;
			color: $black-3;
			letter-spacing: 2rpx;
			padding: 0 40rpx;
			text-align: center;
		}
	}

	/* 功能卡片区 */
	.content-card {
		width: 690rpx;
		background-color: $black-5;
		border-radius: 24rpx;
		padding: 0 32rpx;
		box-sizing: border-box;

		.list-item {
			height: 112rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);

			&:last-child {
				border-bottom: none;
			}

			.title {
				font-size: 30rpx;
				color: $black-1;
			}

			.right-box {
				display: flex;
				align-items: center;

				.version-text {
					font-size: 28rpx;
					color: $green-light;
					margin-right: 12rpx;
				}

				.arrow-icon {
					width: 16rpx;
					height: 16rpx;
					border-top: 3rpx solid #CCCCCC;
					border-right: 3rpx solid #CCCCCC;
					transform: rotate(45deg);
				}
			}
		}
	}

	/* 弹窗样式 */
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;

		.modal-body {
			width: 620rpx;
			background-color: #FFFFFF;
			border-radius: 36rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			overflow: hidden;

			.modal-header {
				padding-top: 50rpx;
				text-align: center;

				.m-title {
					font-size: 36rpx;
					font-weight: 500;
					color: $black-1;
					margin-bottom: 12rpx;
				}

				.m-tips {
					font-size: 26rpx;
					color: $black-3;
				}
			}

			.modal-illustration {
				width: 320rpx;
				height: 240rpx;
				margin: 40rpx 0;
				border-radius: 12rpx;
				background-image: url('/static/img/img_phone@2x.png');
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
			}

			.modal-footer {
				width: 100%;
				height: 100rpx;
				display: flex;
				border-top: 1rpx solid #F2F2F2;

				.btn {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 32rpx;

					&-cancel {
						color: $black-3;
						border-right: 1rpx solid #F2F2F2;
					}

					&-update {
						color: $green-light;
						font-weight: bold;
					}

					&:active {
						background-color: #F9F9F9;
					}
				}
			}
		}
	}
}
</style>