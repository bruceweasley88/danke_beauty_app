<template>
	<view class="nav-back-container">
		<view class="nav-back" :style="{ top: statusBarHeight + 'px' }">
			<view class="nav-left" @tap="goBack">
				<image class="back-icon" src="/static/img/icon_back.png" mode="aspectFit" />
				<text class="nav-title">{{ title }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			statusBarHeight: 0,
			navBarHeight: 44
		}
	},
	created() {
		// 获取系统状态栏高度
		const systemInfo = uni.getSystemInfoSync()
		this.statusBarHeight = systemInfo.statusBarHeight || 0
	},
	methods: {
		goBack() {
			uni.navigateBack({
				delta: 1
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.nav-back-container {
	position: relative;
	width: 100%;
	height: calc(var(--status-bar-height) + 44px);
	background: transparent;
	margin-top: 40rpx;
}

.nav-back {
	position: absolute;
	left: 0;
	right: 0;
	z-index: 999;
	height: 44px;
	display: flex;
	align-items: center;

	.nav-left {
		display: flex;
		align-items: center;
		padding: 0 20rpx;

		.back-icon {
			width: 44rpx;
			height: 44rpx;
			margin-left: 26rpx;
		}

		.nav-title {
			margin-left: 20rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #1E211F;
		}
	}
}
</style>
