<template>
	<view class="page-container">
		<view class="status-bar"></view>
		<view class="header-section">
			<view class="mining-box">
				<text class="label">{{ $t('index.miningProgress') }}</text>
				<view class="value-row">
					<text class="main-digit">{{ point }}</text>
					<text class="unit">HST</text>
				</view>
			</view>
			<view class="avatar-wrapper" @click="toPersonal">
				<image :src="getUserHeadImg()" class="avatar-image" mode="aspectFill"></image>
			</view>
		</view>

		<view class="swiper-container">
			<swiper class="main-banner" circular :autoplay="bannerList.length > 1" :interval="3000" indicator-dots
				indicator-active-color="#09AB4D">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<image v-if="item.image" :src="item.image" class="banner-image" mode="aspectFill"></image>
					<view v-else class="banner-image-box black-placeholder"></view>
				</swiper-item>
			</swiper>
		</view>

		<view class="grid-layout">
			<view class="device-card bg-mask click-active">
				<view class="card-content" @click="toDevice('mask')">
					<text class="device-name">{{ getDeviceName('mask') }}</text>
					<text class="device-intro">{{ $t('deviceDesc.mask') }}</text>
					<view class="action-btn" style="background-color: #344D6C;">{{ maskDevice ? $t('index.useDevice') :
						$t('index.bindDevice') }}</view>
					<text class="status-indicator" v-if="maskDevice">{{ maskDevice.connected ? $t('device.connected') :
						$t('device.offline') }} | {{ maskDevice.time }}</text>
				</view>
			</view>

			<view class="device-card bg-spray click-activ">
				<view class="card-content" @click="toDevice('spray')">
					<text class="device-name">{{ getDeviceName('spray') }}</text>
					<text class="device-intro">{{ $t('deviceDesc.spray') }}</text>
					<view class="action-btn" style="background-color: #306738;">{{ sprayDevice ? $t('index.useDevice') :
						$t('index.bindDevice') }}</view>
					<text class="status-indicator" v-if="sprayDevice">{{ sprayDevice.connected ? $t('device.connected') :
						$t('device.offline') }} | {{ sprayDevice.time }}</text>
				</view>
			</view>

			<view class="device-card bg-bra click-active">
				<view class="card-content" @click="toDevice('bra')">
					<text class="device-name">{{ getDeviceName('bra') }}</text>
					<text class="device-intro">{{ $t('deviceDesc.bra') }}</text>
					<view class="action-btn" style="background-color: #4E346C;">{{ braDevice ? $t('index.useDevice') :
						$t('index.bindDevice') }}</view>
					<text class="status-indicator muted" v-if="braDevice">{{ braDevice.connected ? $t('device.connected') :
						$t('device.offline') }} | {{ braDevice.time }}</text>
				</view>
			</view>

			<view class="device-card bg-beauty click-active">
				<view class="card-content" @click="toDevice('importer')">
					<text class="device-name">{{ getDeviceName('importer') }}</text>
					<text class="device-intro">{{ $t('deviceDesc.importer') }}</text>
					<view class="action-btn" style="background-color: #673030;">{{ importerDevice ? $t('index.useDevice') :
						$t('index.bindDevice') }}</view>
					<text class="status-indicator" v-if="importerDevice">{{ importerDevice.connected ? $t('device.connected') :
						$t('device.offline') }} | {{ importerDevice.time }}</text>
				</view>
			</view>
		</view>
		<web-view v-if="token" v-show="false" :update-title="false" :fullscreen="false" src="/hybrid/html/index.html"
			@message="handleWebViewMessage" />
		<custom-tab-bar active="index" :key="getLanguage()" />
	</view>
</template>

<script>
import { commonGetIndexBanner } from '@/apis/commonApi.js'
import { userGetInfo } from '@/apis/userApi.js'
import { toDevice } from '../../utils/toDevice';
import { getDevice } from '../../utils/deivceManage';
import { getDeviceName } from '../../utils/getDeviceName';
import CustomTabBar from '@/components/custom-tab-bar.vue';
import { getLanguage } from '../../locale';

export default {
	components: {
		CustomTabBar
	},
	data() {
		return {
			// 仅用来判断是否加载webview
			token: null,

			bannerList: [],
			userInfo: null,

			// hst增加定时器
			hstTimer: null,

			// 设备数据
			maskDevice: null,
			sprayDevice: null,
			braDevice: null,
			importerDevice: null,

			point: 0,
		}
	},
	onShow() {
		uni.hideTabBar()
		const token = uni.getStorageSync('token')
		this.token = token;
		console.log('token', token)
		if (token) {
			this.getIndexBanner();
			this.getUserInfo();
			this.onWebviewReady()
		} else {
			uni.redirectTo({
				url: '/pages/login/login',
			})
		}

		this.maskDevice = getDevice('mask');
		this.sprayDevice = getDevice('spray');
		this.braDevice = getDevice('bra');
		this.importerDevice = getDevice('importer');

		console.log(this.maskDevice)
	},
	methods: {
		getLanguage: getLanguage,
		getDeviceName: getDeviceName,
		async getIndexBanner() {
			if (!this.bannerList.length) {
				const res = await commonGetIndexBanner();
				this.bannerList = res.data || [];
			}
		},
		async getUserInfo() {
			const userInfo = await userGetInfo();
			this.userInfo = userInfo.data;
			console.log('用户信息', this.userInfo);
			this.startHstAdd();
		},
		getUserHeadImg() {
			return this.userInfo?.headImg || '/static/img/icon_photo.webp'
		},
		startHstAdd() {
			clearInterval(this.hstTimer);
			if (!this.userInfo?.totalJumpsNum) {
				return;
			}



			const totalJumpsNum = this.userInfo.totalJumpsNum;
			const hst = Number(this.userInfo.hst || 0);
			const seconds = 86400;
			let sNum = totalJumpsNum / seconds;

			// 获取今天开始的时间
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const todayTime = today.getTime();

			this.hstTimer = setInterval(() => {
				const now = Date.now();
				const passedSeconds = Math.floor((now - todayTime) / 1000);
				// 计算当前应该有的hst
				this.point = Number(hst + (sNum * passedSeconds)).toFixed(6);
			}, 1000);
		},
		toDevice: toDevice,
		toPersonal() {
			uni.navigateTo({
				url: '/pages/personal/personal'
			})
		},
		toLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		handleWebViewMessage(e) {
			const balance = e.detail.data[0].balance;
			uni.$emit('onBalance', balance);
		},
		onWebviewReady() {
			// #ifdef APP-PLUS
			setTimeout(() => {
				const currentWebview = this.$scope.$getAppWebview();
				const webview = currentWebview.children()[0];
				if (webview) {
					getApp().globalData.webview = webview;
				}
			}, 600)
			// #endif
		},
	}
}
</script>

<style lang="scss" scoped>
page {
	background: none;
	background-image: url('/static/img/img_bghome.png');
	background-size: 750rpx 585rpx;
	background-repeat: no-repeat;
}

.page-container {
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 100rpx;

	.status-bar {
		margin-top: 20rpx;
		height: var(--status-bar-height);
		width: 100%;
	}
}


// 头部
.header-section {
	width: 692rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 40rpx 0;

	.mining-box {
		.label {
			font-size: 32rpx;
			font-weight: bold;
			color: #1E211F;
			margin-bottom: 8rpx;
			display: block;
		}

		.value-row {
			display: flex;
			align-items: baseline;

			.main-digit {
				font-size: 52rpx;
				font-weight: 800;
				color: #09AB4D;
			}

			.unit {
				font-size: 32rpx;
				font-weight: bold;
				color: #1E211F;
				margin-left: 12rpx;
			}
		}
	}

	.avatar-wrapper {
		width: 110rpx;
		height: 110rpx;
		border: 4rpx solid #fff;
		border-radius: 50%;
		cursor: pointer;

		&:active {
			opacity: 0.8;
		}

		.black-placeholder {
			width: 100%;
			height: 100%;

			background-image: url('/static/img/icon_photo.webp');
			background-size: cover;

			border-radius: 50%;
		}

		.avatar-image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}


	}
}

// 海报容器
.swiper-container {
	width: 692rpx;
	margin-bottom: 40rpx;

	.main-banner {
		width: 692rpx;
		height: 255rpx;
		border-radius: 30rpx;
		overflow: hidden;

		.banner-image-box {
			width: 100%;
			height: 100%;
		}

		.banner-image {
			width: 100%;
			height: 100%;
		}

		// 占位背景
		.black-placeholder {
			background-image: url('/static/img/img_banner.webp');
			background-size: cover;
		}
	}
}



// 网格布局 (331rpx * 273rpx)
.grid-layout {
	width: 692rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.device-card {
	width: 331rpx;
	height: 273rpx;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover; // 图片作为卡片整体背景
	border-radius: 28rpx;
	padding: 24rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	border: 1px solid rgba(255, 255, 255, 0.3);
	margin-bottom: 30rpx;

	// 背景图配置，替换 url 即可
	&.bg-mask {
		background-image: url('/static/img/img_mask.png');
	}

	&.bg-spray {
		background-image: url('/static/img/img_spray.png');
	}

	&.bg-bra {
		background-image: url('/static/img/img_bra.png');
	}

	&.bg-beauty {
		background-image: url('/static/img/img_beauty.png');
	}

	.card-content {
		position: relative;
		z-index: 5;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.device-name {
		font-size: 30rpx;
		font-weight: bold;
		color: #1E211F;
	}

	.device-intro {
		font-size: 20rpx;
		color: #9CA29D;
		margin: 6rpx 0 16rpx;
	}

	.action-btn {
		padding: 0 20rpx;
		height: 44rpx;
		border-radius: 22rpx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 20rpx;
		color: #FFFFFF;
		white-space: nowrap;
		align-self: flex-start;

		&.btn-blue-grey {
			background-color: #344D6C;
		}

		&.btn-purple {
			background-color: #4E346C;
		}
	}

	.status-indicator {
		margin-top: auto;
		font-size: 18rpx;
		color: #C2C9C3;

		&.muted {
			color: #E0E0E0;
		}
	}
}
</style>