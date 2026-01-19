<template>
	<view class="page-container">
		<nav-back title="添加SN码"></nav-back>

		<view class="mask-container">
			<view class="title">请输入SN码</view>

			<view class="input-box">
				<input class="sn-input" type="text" placeholder="请输入设备上的SN码" placeholder-style="color: #C2C9C3"
					v-model="sn" />
			</view>

			<view class="description">
				说明：添加耗材后，可获得对应的积分，获取到的积分可在耗材记录中查看。获得的积分可提取到您的钱包。
			</view>

			<button class="add-btn" @tap="handleAdd">添加耗材</button>
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
			sn: ''
		}
	},
	onLoad(options) {
		if (options.sn) {
			this.sn = options.sn;
		}
	},
	onReady() {

	},
	onUnload() {

	},
	methods: {
		async handleAdd() {
			
		}
	}
}
</script>

<style scoped lang="scss">
page {
	background: #fff;
}

.page-container {
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	background: #fff;
}

.mask-container {
	padding: 40rpx;
	display: flex;
	flex-direction: column;

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}

	.input-box {
		background: #F8FAF9;
		border-radius: 24rpx;
		padding: 60rpx 40rpx; // 增加了高度以匹配图片中的留白
		margin-bottom: 40rpx;

		.sn-input {
			font-size: 32rpx;
			color: #333;
			width: 100%;
		}
	}

	.description {
		font-size: 28rpx;
		color: #999;
		line-height: 1.6;
		margin-bottom: 100rpx; // 为下方按钮留出空间
	}

	.add-btn {
		width: 100%;
		height: 110rpx;
		background-color: #1E211F; // 深黑色背景
		color: #ffffff;
		border-radius: 55rpx; // 圆角为高度的一半，形成胶囊形状
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		font-weight: 500;
		border: none;

		// 去除小程序按钮默认边框
		&::after {
			border: none;
		}

		// 点击反馈效果
		&:active {
			opacity: 0.9;
		}
	}
}
</style>