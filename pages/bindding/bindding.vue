<template>
	<view class="bindding-page">
		<nav-back :title="title"></nav-back>


		<view v-if="status === 'wait'" class="wait">
			<image src="/static/img/img_search@2x.webp" class="wait-img"></image>
			<text class="wait-text">目前还没有配对的设备 立即去绑定</text>
			<view class="wait-btn" @click="handleBind">绑定设备</view>
		</view>

		<view v-if="status === 'bindding'" class="bindding">
			<text class="bindding-title">请保持蓝牙开启状态</text>
			<text class="bindding-subtitle">正在链接，请耐心等待...</text>
			<image src="/static/img/img_searching@2x.webp" class="searching-icon"></image>
		</view>


		<view v-if="status === 'list'" class="list">
			<!-- 顶部标题 -->
			<text class="list-title">{{ foundDevices.length ? '请绑定搜索到的设备' : '未搜索到设备' }}</text>

			<!-- 连接效果图 -->
			<view class="connection-diagram">
				<!-- 左侧：蓝牙图标 + 文字 -->
				<view class="diagram-item bluetooth-item">
					<view class="icon-container">
						<image src="/static/img/img_bluetooth@2x.webp" class="bluetooth-icon"></image>
					</view>
					<text class="item-label">蓝牙开启</text>
				</view>

				<!-- 中间：三个圆点 -->
				<view class="dots-container">
					<view class="dot dot-1"></view>
					<view class="dot dot-2"></view>
					<view class="dot dot-3"></view>
				</view>

				<!-- 右侧：手机图标 + 文字 -->
				<view class="diagram-item phone-item">
					<view class="icon-container">
						<image src="/static/img/img_phone@2x.webp" class="phone-icon"></image>
					</view>
					<text class="item-label">链接手机</text>
				</view>
			</view>

			<!-- 设备列表区域 -->
			<view class="device-list-section" v-if="foundDevices.length">
				<!-- 列表标题 -->
				<view class="section-title">搜索到以下设备</view>

				<!-- 设备列表 -->
				<view class="device-list">
					<view class="device-item" v-for="(device, index) in foundDevices" :key="index">
						<!-- 左侧设备图标 -->
						<view class="device-icon"></view>

						<!-- 中间设备信息 -->
						<view class="device-info">
							<text class="device-name">{{ device.name }}</text>
							<text class="device-deviceId">设备编号：{{ device.deviceId }}</text>
						</view>

						<!-- 右侧按钮 -->
						<view :class="['connect-btn', 'connected']" @click="handleConnect(device.deviceId)">
							连接
						</view>
					</view>
				</view>
			</view>

			<view class="manual-add-text" @click="openManualAddPopup">
				<text>找不到您的设备？</text>
				<text class="highlight">手动添加</text>
			</view>

		</view>

		<!-- 手动添加弹窗 -->
		<confirm-popup :visible="showManualPopup" title="手动添加设备" content="" @cancel="showManualPopup = false"
			@ok="handleConnect(deviceCode)">
			<input class="popup-input device-input" type="text" placeholder="请输入您的设备串码" v-model="deviceCode" />
		</confirm-popup>


		<!-- 底部按钮 -->
		<view class="list-footer" v-if="status === 'list' && foundDevices.length === 0">
			<view class="use-device-btn" @click="handleBind">
				重新搜索
			</view>
		</view>
	</view>
</template>

<script>
import NavBack from '../../components/nav-back.vue'
import ConfirmPopup from '../../components/confirm-popup.vue'
import { searchAIMASKDevice, setDeviceState, setMassageIntensity, setSkinMode } from '../../utils/aimaskDevice.js'
import { getDeviceName } from '../../utils/getDeviceName.js';
import { connectDevice } from '../../utils/deivceManage.js';

export default {
	components: {
		NavBack,
		ConfirmPopup,
	},
	data() {
		return {
			type: '',
			// wait bindding list 三个状态
			status: 'wait',
			showManualPopup: false,
			deviceCode: '',
			foundDevices: [
				// {
				// 	name: 'AI面膜',
				// 	sn: 'A001042',
				// 	connected: false
				// },
			]
		}
	},
	computed: {
		title() {
			return '绑定设备'
		},

	},
	onLoad(options) {
		this.type = options.type
		console.log('当前搜索设备', this.type)
	},
	methods: {
		async handleBind() {
			this.status = 'bindding'
			console.log('开始搜索设备...')
			const list = await searchAIMASKDevice({ timeout: 5000 });
			console.log('搜索到的设备列表:', list)

			for (const item of list) {
				this.foundDevices.push({
					name: getDeviceName(this.type),
					deviceId: item.deviceId,
					connected: false,
					connect: item
				})
			}

			if (list.length === 0) {
				uni.showToast({
					title: '未找到相关设备',
					duration: 2000,
					icon: 'none'
				});
			}
			console.log('--搜索完成--')
			this.status = 'list'
		},
		openManualAddPopup() {
			this.deviceCode = '';
			this.showManualPopup = true;
		},
		async handleConnect(deviceId) {
			if (!deviceId) {
				uni.showToast({
					title: '设备不正确',
					duration: 2000,
					icon: 'error'
				});
				return;
			}
			uni.showLoading({
				title: '连接中'
			});
			await new Promise(r => setTimeout(() => r(), 300));
			const res = await connectDevice(this.type, deviceId);
			uni.hideLoading();

			if (res === false) {
				uni.showToast({
					title: '连接失败',
					duration: 2000,
					icon: 'error'
				});
			} else {
				uni.navigateBack();
				uni.showToast({
					title: '连接成功',
					duration: 2000,
					icon: 'none'
				});
				console.log('device', res)
			}

		},
	}
}
</script>

<style lang="scss" scoped>
page {
	background: #fff;

	.bindding-page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

}


.wait {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: calc(100vh - 230rpx);
	width: 100%;

	&-img {
		width: 290rpx;
		height: 218rpx;
	}

	&-text {
		color: #5F7564;
		font-size: 33rpx;
		font-weight: 400;
		margin-top: 40rpx;
		width: 324rpx;
		text-align: center;
	}

	&-btn {
		height: 106rpx;
		width: 663rpx;
		background: #1E211F;
		border-radius: 58rpx;
		font-weight: 500;
		font-size: 33rpx;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 80rpx;
	}
}

.bindding {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: calc(100vh - 230rpx);
	width: 100%;
	padding: 0 40rpx;
	box-sizing: border-box;

	&-title {
		font-weight: 500;
		font-size: 36rpx;
		color: #1E211F;
		margin-bottom: 20rpx;
	}

	&-subtitle {
		color: #9CA29D;
		font-size: 33rpx;
		font-weight: 400;
		margin-bottom: 120rpx;
	}

	.searching-icon {
		width: 582rpx;
		height: 582rpx;
		animation: breathing 2s ease-in-out infinite;
		margin-bottom: 120rpx;
	}


}

@keyframes breathing {

	0%,
	100% {
		transform: scale(0.9);
		opacity: 1;
	}

	50% {
		transform: scale(1.1);
		opacity: 0.8;
	}
}

.device-input {
	width: 560rpx;
	height: 98rpx;
	background: #F8FAF9;
	border-radius: 22rpx;
	padding: 0 30rpx;
	font-size: 32rpx;
	color: #1E211F;
	margin: 0 auto;
	box-sizing: border-box;
}

.list {
	padding: 60rpx 40rpx;
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;

	&-title {
		font-weight: 500;
		font-size: 36rpx;
		color: #1E211F;
		text-align: center;
		margin-bottom: 208rpx;
	}

	.connection-diagram {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		gap: 58rpx;
	}

	.diagram-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.icon-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 156rpx;
		margin-bottom: 38rpx;
	}

	.bluetooth-icon {
		width: 116.5rpx;
		height: 116.5rpx;
	}

	.phone-icon {
		width: 102rpx;
		height: 156rpx;
	}

	.item-label {
		font-size: 29rpx;
		color: #C2C9C3;
		font-weight: 400;
	}

	.dots-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14rpx;
		height: 156rpx;
		align-self: center;
		padding-bottom: 76rpx;
		box-sizing: content-box;
	}

	.dot {
		width: 9rpx;
		height: 9rpx;
		background: #09AB4D;
		border-radius: 50%;

		&.dot-1 {
			opacity: 0.3;
		}

		&.dot-2 {
			opacity: 0.6;
		}

		&.dot-3 {
			opacity: 0.9;
		}
	}

	.device-list-section {
		margin-top: 200rpx;
	}

	.section-title {
		color: #1E211F;
		font-size: 29rpx;
		font-weight: 500;
		margin-bottom: 22rpx;
	}

	.device-list {
		padding-bottom: 200rpx;
	}

	.device-item {
		background-color: #F8FAF9;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 24rpx;
		display: flex;
		align-items: center;
	}

	.device-icon {
		width: 100rpx;
		height: 100rpx;
		background-image: url('/static/device_img/img_aimms@2x.png');
		background-size: cover;
		border-radius: 16rpx;
		margin-right: 24rpx;
	}

	.device-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.device-name {
		font-size: 32rpx;
		font-weight: 500;
		color: #1E211F;
		margin-bottom: 8rpx;
	}

	.device-deviceId {
		font-size: 24rpx;
		color: #9CA29D;
	}

	.connect-btn {
		height: 51rpx;
		width: 109rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 11rpx;
		font-size: 25rpx;
		font-weight: 500;
		flex-shrink: 0;

		&.available {
			background: #2EC96F;
			color: #FFFFFF;
		}

		&.connected {
			background: #E1FEE1;
			color: #09AB4D;
		}
	}

	.manual-add-text {
		font-size: 33rpx;
		font-weight: 400;
		color: #C2C9C3;
		text-align: center;
		margin-top: 400rpx;

		.highlight {
			color: #09AB4D;
			margin-left: 8rpx;
		}
	}

}

.list-footer {
	position: fixed;
	bottom: 160rpx;
	left: 0;
	right: 0;
	padding: 0 43rpx;
	z-index: 10;

	.use-device-btn {
		height: 106rpx;
		width: 663rpx;
		background: #1E211F;
		border-radius: 58rpx;
		font-weight: 500;
		font-size: 33rpx;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
	}
}
</style>