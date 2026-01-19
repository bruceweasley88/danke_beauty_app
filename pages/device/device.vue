<template>
	<view class="container">
		<nav-back :title="title"></nav-back>

		<view class="content">
			<view class="status-section">
				<view class="device-icon-wrapper" :class="'icon-' + type">
					<view class="icon-placeholder"></view>
				</view>
				<view class="device-info" v-if="device">
					<text class="device-id">{{ device.deviceId }}</text>
					<view class="status-tag">
						<view class="dot" :class="{ offline: !device.connected }"></view>
						<text>{{ device.connected ? '已连接' : '离线' }} | {{ device.time }}</text>
					</view>
				</view>
				<view class="warning-tips">
					<text>扫码/输入SN码，可获得积分，去</text>
					<text class="link" @click="toAddConsumable">添加积分 ></text>
				</view>
			</view>

			<view class="card" v-if="support.models">
				<view class="card-title">设备模式</view>
				<view class="mode-group">
					<view v-for="(item, index) in models" :key="index" class="mode-item"
						:class="{ active: currentMode === index }" @click="setMode(index)">
						{{ item }}
					</view>
				</view>
			</view>

			<view class="card" v-if="support.intensity">
				<view class="card-title">设备强度</view>
				<view class="intensity-control">
					<view class="btn-minus" @click="changeIntensity(-1)"></view>
					<view class="intensity-num">{{ intensity }}</view>
					<view class="btn-plus" @click="changeIntensity(1)"></view>
				</view>
				<view class="slider-box">
					<view class="slider-track" @touchstart="handleDragStart" @touchmove="handleDragMove"
						@touchend="handleDragEnd">
						<view class="slider-bar" :style="{ width: (intensity / 8) * 100 + '%' }"></view>
						<view class="slider-thumb" :style="{ left: (intensity / 8) * 100 + '%' }"></view>
					</view>
					<view class="slider-labels">
						<text>设备强度1</text>
						<text>设备强度8</text>
					</view>
				</view>
			</view>

			<view class="card" v-if="support.showAddConsumable">
				<consumable-modal-card :type="type" :showCancel="false" @add="toSnPage" />
			</view>


		</view>

		<view class="bottom-actions">
			<view class="action-item" @click="toAddConsumable">
				<view class="action-icon-bg add-icon"></view>
				<text>添加耗材</text>
			</view>
			<view class="action-item main" v-if="support.start" @click="start">
				<view class="start-btn" hover-class="hover">
					<view class="power-icon"></view>
				</view>
				<text class="active-text">{{ status === 'stop' ? '开启仪器' : '关闭' }}</text>
			</view>
			<view class="action-item" @click="toConsumableList">
				<view class="action-icon-bg record-icon"></view>
				<text>耗材记录</text>
			</view>
		</view>
	</view>
</template>

<script>
import NavBack from '../../components/nav-back.vue'
import ConsumableModalCard from '../../components/consumable-modal-card.vue'
import { connectDevice, getDevice } from '../../utils/deivceManage.js';
import { getDeviceName } from '../../utils/getDeviceName';
import { setDeviceState, setMassageIntensity, setSkinMode } from '../../utils/aimaskDevice.js';

export default {
	components: {
		NavBack,
		ConsumableModalCard,
	},
	data() {
		return {
			type: '', // mask: 面膜 spray: 喷雾 bra: 文胸 importer: 导入仪
			models: ['净化排毒', '脉冲导入', '紧致提升'],
			currentMode: 0,
			intensity: 7,
			isDragging: false,

			// 设备对象
			device: null,

			//
			status: 'stop', // stop starting
		}
	},
	onLoad(options) {
		this.type = options.type;
		this.connect();
	},
	onShow() {
	},
	computed: {
		title() {
			return getDeviceName(this.type)
		},
		support() {

			const models = true;
			const intensity = true;
			const showAddConsumable = true;
			const start = true;

			switch (this.type) {
				case 'mask': return { models, intensity, start };
				case 'bra': return { models, intensity, start };
				case 'spray': return { showAddConsumable };
				case 'importer': return { showAddConsumable };
			}
		}
	},
	methods: {
		// 启动
		async start() {
			// 更新下状态,有时候会有异步问题
			this.device = getDevice(this.type);

			// 校验
			if (!this.device.connected) {
				uni.showToast({
					title: '请连接设备',
					icon: 'error'
				});
				return;
			}

			// 开始处理
			const connect = this.device.connect;
			if (this.status === 'starting') {
				uni.showLoading({
					title: '停止中...'
				});
				setDeviceState(connect, 0);
				await new Promise(r => setTimeout(r, 500));
				this.status = 'stop'
			} else {
				uni.showLoading({
					title: '开启中...'
				});
				setMassageIntensity(connect, this.intensity);
				await new Promise(r => setTimeout(r, 500));
				setSkinMode(connect, this.currentMode + 1);
				await new Promise(r => setTimeout(r, 500));
				setDeviceState(connect, 1);
				this.status = 'starting'
			}
			uni.hideLoading();
		},
		// 设置强度
		async changeIntensity(val) {
			let res = this.intensity + val;
			if (res >= 1 && res <= 8) {
				this.intensity = res;
			}
			this.updateIntensityStatus();
		},
		async updateIntensityStatus() {
			if (this.status === 'starting') {
				uni.showLoading();
				setMassageIntensity(this.device.connect, this.intensity);
				await new Promise(r => setTimeout(r, 500));
				uni.hideLoading();
			}
		},
		// 设置模式
		async setMode(index) {
			this.currentMode = index;
			if (this.status === 'starting') {
				uni.showLoading();
				setSkinMode(this.device.connect, this.currentMode);
				await new Promise(r => setTimeout(r, 500));
				uni.hideLoading();
			}
		},
		handleDragStart(e) {
			this.isDragging = true;
			this.updateIntensityFromTouch(e);
		},
		handleDragMove(e) {
			if (!this.isDragging) return;
			this.updateIntensityFromTouch(e);
		},
		handleDragEnd() {
			this.isDragging = false;
			this.updateIntensityStatus();
		},
		updateIntensityFromTouch(e) {
			const touch = e.touches[0];
			const query = uni.createSelectorQuery().in(this);
			query.select('.slider-track').boundingClientRect();
			query.exec((res) => {
				if (res && res[0]) {
					const track = res[0];
					const touchX = touch.clientX - track.left;
					const percent = Math.max(0, Math.min(1, touchX / track.width));
					this.intensity = Math.round(percent * 8) || 1;
				}
			});
		},
		async connect() {
			let device = getDevice(this.type);
			if (!device) {
				this.toBinding();
				return;
			}
			this.device = device;


			if (!device.connected) {
				const _device = await connectDevice(this.type, device.deviceId);
				if (_device) {
					this.device = _device;
				}
			}

		},
		toBinding() {
			uni.redirectTo({
				url: '/pages/bindding/bindding?type=' + this.type
			})
		},
		toConsumableList() {
			uni.navigateTo({
				url: '/pages/consumable-list/consumable-list'
			})
		},
		toAddConsumable() {
			uni.navigateTo({
				url: '/pages/add-consumable/add-consumable?type=' + this.type
			})
		},
		toSnPage() {
			uni.navigateTo({
				url: '/pages/sn/sn'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
// 颜色变量
$green-1: #09AB4D;
$green-2: #2EC96F;
$green-nav: #81FD95;
$green-light: #9FF0AE;
$green-bg: #F3FFF7;

$black-1: #1E211F;
$black-2: #5F7564;
$black-3: #9CA29D;
$black-4: #C2C9C3;
$black-5: #F8FAF9;

page {
	background: #fff;
}

.hover {
	opacity: 0.8;
}

.container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background: linear-gradient(180deg, #A1FFE5 0%, #DBFFE5 28.37%, #F3FFF6 50.48%, #F1F3F4 72.6%, #F1F3F4 100%);

	.content {
		padding: 0 40rpx;
		flex: 1;
		margin-bottom: 290rpx;
	}
}

/* 状态区域 */
.status-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0;

	.device-icon-wrapper {
		width: 160rpx;
		height: 160rpx;
		margin-bottom: 20rpx;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;

		&.icon-mask {
			background-image: url('/static/device_img/img_mmb.png');
		}

		&.icon-spray {
			background-image: url('/static/device_img/img_bspwb@2x.webp');
		}

		&.icon-bra {
			background-image: url('/static/device_img/img_aiwxb@2x.webp');
		}

		&.icon-importer {
			background-image: url('/static/device_img/img_mrdryb@2x.webp');
		}
	}

	.device-info {
		text-align: center;

		.device-id {
			font-size: 44rpx;
			font-weight: 500;
			color: $black-1;
		}

		.status-tag {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 8rpx;
			color: $black-4;
			font-size: 24rpx;

			.dot {
				width: 16rpx;
				height: 16rpx;
				background-color: $green-2;
				border-radius: 50%;
				margin-right: 12rpx;

				&.offline {
					background-color: #FF4444;
				}
			}
		}
	}

	.warning-tips {
		margin-top: 30rpx;
		font-size: 28rpx;
		color: $black-2;

		.link {
			color: $green-1;
			margin-left: 8rpx;
		}
	}
}

/* 卡片通用样式 */
.card {
	background: #FFFFFF;
	border-radius: 60rpx;
	padding: 40rpx 48rpx 64rpx;
	margin-bottom: 30rpx;

	.card-title {
		font-size: 32rpx;
		font-weight: bold;
		color: $black-1;
		margin-bottom: 30rpx;
	}
}

/* 模式选择 */
.mode-group {
	display: flex;
	justify-content: space-between;

	.mode-item {
		width: 190rpx;
		height: 88rpx;
		background: $black-5;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: $black-1;
		transition: all 0.3s;

		&.active {
			background: $green-2;
			color: #FFFFFF;
		}
	}
}

/* 强度控制 */
.intensity-control {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 40rpx;

	.btn-minus,
	.btn-plus {
		font-size: 60rpx;
		color: $black-1;
		width: 73rpx;
		height: 73rpx;
		text-align: center;
		background-size: cover;

	}

	.btn-minus {
		background-image: url('/static/device_img/icon_reduce.png');
	}

	.btn-plus {
		background-image: url('/static/device_img/icon_add.png');
	}

	.intensity-num {
		font-size: 80rpx;
		font-weight: 800;
		color: $black-1;
	}
}

.slider-box {
	margin-top: 40rpx;

	.slider-track {
		height: 36rpx;
		background: $black-5;
		border-radius: 12rpx;
		position: relative;

		.slider-bar {
			height: 100%;
			background: $green-2;
			border-radius: 40rpx;
		}

		.slider-thumb {
			width: 36rpx;
			height: 36rpx;
			background: #FFFFFF;
			border: 4rpx solid $green-2;
			border-radius: 50%;
			position: absolute;
			top: 50%;

			transform: translate(-50%, -50%);
		}
	}

	.slider-labels {
		display: flex;
		justify-content: space-between;
		margin-top: 16rpx;
		font-size: 24rpx;
		color: $black-4;
	}
}

/* 底部操作 */
.bottom-actions {
	position: fixed;
	bottom: -40rpx;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-around;
	height: 338.59rpx;
	background-image: url('/static/device_img/img_bottom.png');
	background-size: cover;
	background-repeat: no-repeat;
	padding: 0 40rpx;
	z-index: 10;

	.action-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 24rpx;
		color: $black-1;

		.action-icon-bg {
			width: 96rpx;
			height: 96rpx;
			background-size: cover;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 20rpx;
			margin-bottom: 16rpx;
			font-size: 40rpx;
			font-weight: bold;
		}

		&.main {
			.start-btn {
				width: 130rpx;
				height: 130rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 16rpx;
				background-image: url('/static/device_img/icon_start.png');
				background-size: cover;
				box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
			}

			.active-text {
				color: $green-1;
				font-weight: bold;
			}
		}

		.add-icon {
			background-image: url('/static/device_img/icon_addhaocai.png');
			box-shadow: -1rpx -4rpx 8rpx 0rpx rgba(0, 0, 0, 0.05);
		}

		.record-icon {
			background-image: url('/static/device_img/icon_haocairecord.png');
			box-shadow: 1rpx -4rpx 8rpx 0rpx rgba(0, 0, 0, 0.05);
		}
	}
}
</style>