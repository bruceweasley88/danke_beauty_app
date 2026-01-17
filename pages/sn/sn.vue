<template>
	<view class="page-container">
		<!-- 相机预览 -->
		<live-pusher id="livePusher" ref="livePusher" class="live-pusher" url="" mode="FHD" :autoplay="true"
			:camera="cameraPosition"></live-pusher>

		<!-- 扫描动画 -->
		<cover-view class="scan-line-container">
			<cover-image src="/static/scan_icon/img_light@2x.webp" class="scan-line"
				:style="{ top: scanLineTop + 'rpx' }"></cover-image>
		</cover-view>

		<!-- 扫描结果提示 -->
		<cover-view v-if="scanResult" class="scan-result-overlay">
			<cover-view class="result-text">{{ scanResult }}</cover-view>
		</cover-view>

		<!-- 扫描提示文字 -->
		<cover-view class="scan-tip">请对准设备二维码，即可自动扫描</cover-view>

		<!-- 底部按钮区域 -->
		<cover-view class="action-buttons">
			<cover-view class="action-btn" @tap="handleScan">
				<cover-view class="icon-circle">
					<cover-image src="/static/scan_icon/icon_saomas@2x.webp" class="icon-img"></cover-image>
				</cover-view>
				<cover-view class="btn-title">扫码</cover-view>
			</cover-view>
			<cover-view class="action-btn" @tap="handleAlbum">
				<cover-view class="icon-circle" @tap="handleAlbum">
					<cover-image src="/static/scan_icon/icon_photo@2x.webp" class="icon-img" @tap="handleAlbum"></cover-image>
				</cover-view>
				<cover-view class="btn-title" @tap="handleAlbum">相册</cover-view>
			</cover-view>
			<cover-view class="action-btn" @tap="handleManual">
				<cover-view class="icon-circle" @tap="handleManual">
					<cover-image src="/static/scan_icon/icon_input@2x.webp" class="icon-img" @tap="handleManual"></cover-image>
				</cover-view>
				<cover-view class="btn-title" @tap="handleManual">手动输入</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			scanResult: '',
			cameraPosition: 'back',
			scanLineTop: -218,
			scanTimer: null
		}
	},
	onReady() {
		// 创建 live-pusher 上下文
		this.livePusherContext = uni.createLivePusherContext('livePusher', this);
		// 启动相机预览
		this.startPreview();
		// 启动扫描动画
		this.startScanAnimation();
	},
	onUnload() {
		// 清理定时器
		if (this.scanTimer) {
			clearInterval(this.scanTimer);
		}
	},
	methods: {
		startPreview() {
			this.livePusherContext.startPreview({
				success: () => {
					console.log('相机预览启动成功');
				},
				fail: (err) => {
					console.error('相机预览启动失败:', err);
				}
			});
		},
		startScanAnimation() {
			const screenHeight = uni.getSystemInfoSync().screenHeight;
			const maxHeight = screenHeight * 2; // 转换为 rpx

			this.scanTimer = setInterval(() => {
				this.scanLineTop += 10;
				if (this.scanLineTop > maxHeight) {
					this.scanLineTop = -218;
				}
			}, 20);
		},
		handleScan() {
			// TODO: 扫码功能待实现
			this.$noSupport()
		},
		handleAlbum() {
			// TODO: 相册功能待实现
			this.$noSupport()
		},
		handleManual() {
			console.log(111)
			uni.navigateTo({
				url: '/pages/sn-input/sn-input'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.page-container {
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}

.live-pusher {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
}

.scan-line-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 50;
	overflow: hidden;
}

.scan-line {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	width: 750rpx;
	height: 218rpx;
	animation: scanMove 2s linear infinite;
}

@keyframes scanMove {
	0% {
		top: -218rpx;
	}

	100% {
		top: 100%;
	}
}

.scan-result-overlay {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 100;
	background: rgba(0, 0, 0, 0.7);
	padding: 30rpx 50rpx;
	border-radius: 20rpx;

	.result-text {
		color: #fff;
		font-size: 32rpx;
	}
}

.scan-tip {
	position: absolute;
	bottom: 380rpx;
	left: 0;
	right: 0;
	z-index: 100;
	text-align: center;
	color: #FFFFFF;
	font-size: 29rpx;
	font-weight: 500;
}

.action-buttons {
	position: absolute;
	bottom: 100rpx;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-around;
	width: 100%;
	padding: 60rpx 0 80rpx;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
	z-index: 100;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
	width: 200rpx;
	height: 200rpx;
	justify-content: center;
	pointer-events: auto;

	.icon-circle {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100%;
		background: rgba(0, 0, 0, 0.5);
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.icon-img {
		width: 60rpx;
		height: 60rpx;
		pointer-events: none;
	}

	.btn-title {
		font-size: 28rpx;
		color: #fff;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
		pointer-events: none;
	}

	&:first-child .btn-title {
		color: #2EC96F;
	}
}
</style>