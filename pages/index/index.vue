<template>
	<view class="page-container">
		<view class="status-bar"></view>
		<view class="header-section">
			<view class="mining-box" @click="toLogin">
				<text class="label">挖矿进度</text>
				<view class="value-row">
					<text class="main-digit">8888.00011</text>
					<text class="unit">HST</text>
				</view>
			</view>
			<view class="avatar-wrapper">
				<image :src="getUserHeadImg()" class="avatar-image" mode="aspectFill"></image>
			</view>
		</view>

		<view class="swiper-container">
			<swiper class="main-banner" circular :autoplay="bannerList.length > 1" :interval="3000" indicator-dots indicator-active-color="#09AB4D">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<image v-if="item.image" :src="item.image" class="banner-image" mode="aspectFill"></image>
					<view v-else class="banner-image-box black-placeholder"></view>
				</swiper-item>
			</swiper>
		</view>

		<view class="grid-layout">
			<view class="device-card bg-mask">
				<view class="card-content" @click="toDevice">
					<text class="device-name">AI面膜</text>
					<text class="device-intro">臻享胶原水光细胞</text>
					<view class="action-btn" style="background-color: #344D6C;">绑定设备</view>
				</view>
			</view>

			<view class="device-card bg-spray">
				<view class="card-content">
					<text class="device-name">补水喷雾器</text>
					<text class="device-intro">纳米喷雾保湿美容</text>
					<view class="action-btn" style="background-color: #306738;">去使用</view>
					<text class="status-indicator">已连接 | 21:45</text>
				</view>
			</view>

			<view class="device-card bg-bra">
				<view class="card-content">
					<text class="device-name">AI文胸</text>
					<text class="device-intro">EMS脉冲技术养护</text>
					<view class="action-btn" style="background-color: #4E346C;">去使用</view>
					<text class="status-indicator muted">未链接</text>
				</view>
			</view>

			<view class="device-card bg-beauty">
				<view class="card-content">
					<text class="device-name">美容导入仪</text>
					<text class="device-intro">微晶提拉水光肌</text>
					<view class="action-btn" style="background-color: #673030;">去使用</view>
					<text class="status-indicator">已连接 | 21:45</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { commonGetIndexBanner } from '@/apis/commonApi.js'
import { userGetInfo } from '@/apis/userApi.js'

export default {
	components: {

	},
	onShow() {
		this.getIndexBanner();
		this.getUserInfo();
	},
	data() {
		return {
			bannerList: [],
			userInfo: null
		}
	},
	methods: {
		async getIndexBanner() {
			if (!this.bannerList.length) {
				const res = await commonGetIndexBanner();
				this.bannerList = res.data || [];
			}
		},
		async getUserInfo() {
			const userInfo = await userGetInfo();
			this.userInfo = userInfo.data;
		},
		getUserHeadImg() {
			return this.userInfo?.headImg || '/static/img/icon_photo.webp'
		},
		toDevice() {
			uni.navigateTo({
				url: '/pages/device/device'
			})
		},
		toLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}
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
		width: 111rpx;
		height: 44rpx;
		border-radius: 22rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20rpx;
		color: #FFFFFF;

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