<template>
	<view class="device-container">

		<nav-back title="关于我们"></nav-back>
		<view class="header-section">
			<text class="title">全部设备</text>
			<text class="manage-btn">
				<!-- 管理 -->
			</text>
		</view>

		<scroll-view scroll-y class="device-list">

			<view v-for="type in typeList" class="device-card" hover-class="card-hover" @click="toDevice(type)">
				<view class="device-icon-placeholder" :class="`icon-${type}`"></view>

				<view class="device-info">
					<view class="name">{{ getDeviceName(type) }}</view>
					<view class="sn">设备编号：{{ getDevice(type) ? getDevice(type).deviceId : '未绑定' }}</view>
				</view>

				<view class="device-status-box" v-if="getDevice(type)">
					<view class="status-dot online">
						<view class="dot" :class="getDevice(type).connected ? '' : 'offline'"></view>
						<text>{{ getDevice(type).connected ? '已连接' : '未连接' }}</text>
					</view>
					<view class="time">{{ getDevice(type).time }}</view>
				</view>

				<view class="delete-icon" @click.stop="delDevice(type)" v-if="getDevice(type)">
					<text class="close-symbol">×</text>
				</view>
			</view>

			<!-- <view class="device-card" hover-class="card-hover" @click="toDevice('spray')">
				<view class="device-icon-placeholder icon-spray"></view>

				<view class="device-info">
					<view class="name">补水喷雾</view>
					<view class="sn">设备编号：A002157</view>
				</view>

				<view class="device-status-box">
					<view class="status-dot offline">
						<view class="dot"></view>
						<text>未连接</text>
					</view>
					<view class="time">2024-05-12 10:12</view>
				</view>
			</view>

			<view class="device-card" hover-class="card-hover" @click="toDevice('bra')">
				<view class="device-icon-placeholder icon-bra"></view>

				<view class="device-info">
					<view class="name">AI文胸</view>
					<view class="sn">设备编号：A002157</view>
				</view>

				<view class="device-status-box">
					<view class="status-dot offline">
						<view class="dot"></view>
						<text>未连接</text>
					</view>
					<view class="time">2024-05-12 10:12</view>
				</view>
			</view>

			<view class="device-card" hover-class="card-hover" @click="toDevice('importer')">
				<view class="device-icon-placeholder icon-importer"></view>

				<view class="device-info">
					<view class="name">美容导入仪</view>
					<view class="sn">设备编号：A001042</view>
				</view>

				<view class="device-status-box">
					<view class="status-dot online">
						<view class="dot"></view>
						<text>已连接</text>
					</view>
					<view class="time">2024-05-12 10:12</view>
				</view>

				<view class="delete-icon" @click.stop="$noSupport()">
					<text class="close-symbol">×</text>
				</view>
			</view> -->
		</scroll-view>

		<!-- <view class="footer-action">
			<button class="add-btn" @click="handleAddDevice">添加设备</button>
		</view> -->
	</view>
</template>

<script>
import NavBack from '../../components/nav-back.vue'
import { delDevice, getDevice } from '../../utils/deivceManage.js';
import { getDeviceName } from '../../utils/getDeviceName';
import { toDevice } from '../../utils/toDevice.js';
export default {
	components: {
		NavBack,
	},
	data() {
		return {
			typeList: ['mask', 'spray', 'bra', 'importer']
		};
	},
	onShow() {
		setTimeout(() => {
			this.$forceUpdate()
		}, 2);
	},
	methods: {
		handleAddDevice() {
			console.log('点击添加设备');
		},
		toDevice: toDevice,
		getDeviceName: getDeviceName,
		getDevice: getDevice,
		async delDevice(type) {
			await delDevice(type, true)
			this.$forceUpdate();
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
		transition: background-color 0.2s;

		&.card-hover {
			background-color: #E8EBEA;
		}

		&:active {
			opacity: 0.8;
		}

		.device-icon-placeholder {
			width: 100rpx;
			height: 100rpx;
			background-size: cover;
			border-radius: 16rpx;
			margin-right: 24rpx;
			border: 1rpx solid #f0f0f0;

			&.icon-mask {
				background-image: url('/static/device_img/img_aimms@2x.png');
			}

			&.icon-spray {
				background-image: url('/static/device_img/img_bspws@2x.png');
			}

			&.icon-bra {
				background-image: url('/static/device_img/img_aiwxs@2x.png');
			}

			&.icon-importer {
				background-image: url('/static/device_img/img_dry@2x.png');
			}
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
			top: 0rpx;
			right: 0rpx;
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