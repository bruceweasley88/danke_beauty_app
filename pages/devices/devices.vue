<template>
	<view class="device-container">

		<nav-back title="关于我们"></nav-back>
		<view class="header-section">
			<text class="title">全部设备</text>
			<text class="manage-btn">管理</text>
		</view>

		<scroll-view scroll-y class="device-list">
			<view class="device-card" v-for="(item, index) in deviceList" :key="index">
				<view class="device-icon-placeholder"></view>

				<view class="device-info">
					<view class="name">{{ item.name }}</view>
					<view class="sn">设备编号：{{ item.sn }}</view>
				</view>

				<view class="device-status-box">
					<view :class="['status-dot', item.connected ? 'online' : 'offline']">
						<view class="dot"></view>
						<text>{{ item.connected ? '已连接' : '未连接' }}</text>
					</view>
					<view class="time">{{ item.time }}</view>
				</view>

				<view v-if="item.showDelete" class="delete-icon">
					<text class="close-symbol">×</text>
				</view>
			</view>
		</scroll-view>

		<view class="footer-action">
			<button class="add-btn" @click="handleAddDevice">添加设备</button>
		</view>
	</view>
</template>

<script>
import NavBack from '../../components/nav-back.vue'
export default {
	components: {
		NavBack,
	},
	data() {
		return {
			deviceList: [
				{
					name: 'AI面膜',
					sn: 'A001042',
					connected: true,
					time: '2024-05-12 10:12',
					showDelete: false
				},
				{
					name: '补水喷雾',
					sn: 'A002157',
					connected: false,
					time: '2024-05-12 10:12',
					showDelete: false
				},
				{
					name: 'AI文胸',
					sn: 'A002157',
					connected: false,
					time: '2024-05-12 10:12',
					showDelete: true // 截图中有个关闭按钮
				},
				{
					name: '美容导入仪',
					sn: 'A001042',
					connected: true,
					time: '2024-05-12 10:12',
					showDelete: false
				}
			]
		};
	},
	methods: {
		handleAddDevice() {
			console.log('点击添加设备');
		}
	}
};
</script>

<style lang="scss" scoped>
// 颜色变量定义
$green-1: #09ab4d;
$green-2: #2ec96f;
$black-1: #1e211f;
$black-2: #5f7564;
$black-3: #9ca29d;
$black-4: #c2c9c3;
$black-5: #f8faf9;
$red-status: #ff4d4f; // 未连接状态颜色

page {
	background: #fff;
}

.device-container {
	padding: 0 32rpx;
	min-height: 100vh;
	display: flex;
	flex-direction: column;

	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40rpx 0 30rpx 0;

		.title {
			font-size: 34rpx;
			font-weight: 500;
			color: $black-1;
		}

		.manage-btn {
			font-size: 28rpx;
			color: $black-3;
		}
	}

	.device-list {
		flex: 1;
		padding-bottom: 200rpx; // 为底部按钮留出空间
	}

	.device-card {
		position: relative;
		background-color: #F8FAF9;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 24rpx;
		display: flex;
		align-items: center;

		.device-icon-placeholder {
			width: 100rpx;
			height: 100rpx;
			background-size: cover;
			background-image: url('/static/device_img/img_aimms@2x.png');
			border-radius: 16rpx;
			margin-right: 24rpx;
			// 模拟截图中的简易图标边框（如有需要）
			border: 1rpx solid #f0f0f0;
		}

		.device-info {
			flex: 1;

			.name {
				font-size: 32rpx;
				font-weight: 500;
				color: $black-1;
				margin-bottom: 8rpx;
			}

			.sn {
				font-size: 24rpx;
				color: $black-3;
			}
		}

		.device-status-box {
			text-align: right;

			.status-dot {
				display: inline-flex;
				align-items: center;
				font-size: 24rpx;
				margin-bottom: 12rpx;

				.dot {
					width: 20rpx;
					height: 20rpx;
					border-radius: 50%;
					margin-right: 8rpx;
				}

				&.online {
					color: $green-1;

					.dot {
						background-color: $green-1;
					}
				}

				&.offline {
					color: $red-status;

					.dot {
						background-color: $red-status;
					}
				}
			}

			.time {
				font-size: 22rpx;
				color: $black-4;
			}
		}

		.delete-icon {
			position: absolute;
			top: -10rpx;
			right: -10rpx;
			width: 36rpx;
			height: 36rpx;
			background-color: #ccc;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 4rpx solid #fff;

			.close-symbol {
				color: #fff;
				font-size: 24rpx;
				line-height: 1;
				margin-top: -2rpx;
			}
		}
	}

	.footer-action {
		position: fixed;
		bottom: 60rpx;
		left: 0;
		right: 0;
		padding: 0 40rpx;

		.add-btn {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			background-color: $black-1;
			color: #ffffff;
			border-radius: 50rpx;
			font-size: 32rpx;
			font-weight: 500;
			border: none;

			&:active {
				opacity: 0.8;
			}
		}
	}
}
</style>