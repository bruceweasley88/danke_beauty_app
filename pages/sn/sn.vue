<template>
	<view class="page-container">
		<!-- 扫描提示文字 -->
		<cover-view class="scan-tip">{{ $t('scan.tip') }}</cover-view>

		<!-- 底部按钮区域 -->
		<cover-view class="action-buttons">
			<cover-view class="action-btn">
				<cover-view class="icon-circle">
					<cover-image src="/static/scan_icon/icon_saomas@2x.webp" class="icon-img"></cover-image>
				</cover-view>
				<cover-view class="btn-title">{{ $t('scan.scan') }}</cover-view>
			</cover-view>
			<cover-view class="action-btn" @tap="handleAlbum">
				<cover-view class="icon-circle">
					<cover-image @tap="handleAlbum" src="/static/scan_icon/icon_photo@2x.webp" class="icon-img"></cover-image>
				</cover-view>
				<cover-view class="btn-title">{{ $t('scan.album') }}</cover-view>
			</cover-view>
			<cover-view class="action-btn" @tap="handleManual">
				<cover-view class="icon-circle">
					<cover-image @tap="handleManual()" src="/static/scan_icon/icon_input@2x.webp" class="icon-img"></cover-image>
				</cover-view>
				<cover-view class="btn-title">{{ $t('scan.manualInput') }}</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
var barcode = null;

export default {
	data() {
		return {}
	},
	onLoad() {
		// #ifdef APP-PLUS
		plus.navigator.setFullscreen(true);

		var pages = getCurrentPages();
		var page = pages[pages.length - 1];
		var currentWebview = page.$getAppWebview();

		// 创建扫码控件
		barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
			position: 'static',
			scanbarColor: '#1DA7FF',
			frameColor: '#1DA7FF'
		});

		// 扫码成功回调
		barcode.onmarked = (_, result) => {
			console.log('扫码结果:', result);
			plus.device.vibrate(50);
			plus.navigator.setFullscreen(false);
			this.handleManual(result);
		};

		// 添加到页面并启动
		currentWebview.append(barcode);
		barcode.start();
		// #endif
	},
	onBackPress() {
		// #ifdef APP-PLUS
		if (barcode) {
			barcode.close();
			barcode = null;
		}
		plus.navigator.setFullscreen(false);
		// #endif
	},
	onUnload() {
		// #ifdef APP-PLUS
		if (barcode) {
			barcode.close();
			barcode = null;
		}
		plus.navigator.setFullscreen(false);
		// #endif
	},
	methods: {
		handleScan() {
			console.log('扫码中...');
		},
		handleAlbum() {
			uni.chooseImage({
				count: 1,
				sourceType: ['album'],
				success: (res) => {
					plus.barcode.scan(res.tempFilePaths[0], (_, result) => {
						console.log('扫码结果:', result);
						this.handleManual(result)
					}, () => {
						uni.showToast({ title: this.$t('scan.qrNotRecognized'), icon: 'none' });
					});
				}
			});
		},

		handleManual(sn) {
			if (sn) {
				uni.redirectTo({
					url: '/pages/sn-input/sn-input?sn=' + sn,
				});
			} else {
				// uni.navigateBack({ animationDuration: 0 });
				uni.navigateTo({ url: '/pages/sn-input/sn-input' });
			}
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
	background: #000;
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
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.8);
	pointer-events: none;
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
