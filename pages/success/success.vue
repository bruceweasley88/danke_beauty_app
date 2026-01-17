<template>
	<view class="page-container">
		<nav-back title="提取成功"></nav-back>
		
		<view class="status-box">
			<image 
				src="/static/img/img_sussee@2x.webp" 
				class="success-icon" 
				mode="aspectFit"
			></image>
			<text class="title">提取成功</text>
			<text class="subtitle">已提取到钱包，请去钱包查看金额是否已收到</text>
		</view>

		<view class="footer">
			<view class="btn-wallet" @tap="handleGoWallet">去钱包</view>
		</view>
	</view>
</template>

<script>
	import NavBack from '../../components/nav-back.vue';
	export default {
		components: {
			NavBack,
		},
		data() {
			return {
				
			}
		},
		methods: {
			handleGoWallet() {
				// 跳转到钱包页面的逻辑
				console.log('跳转至钱包');
				uni.redirectTo({ url: '/pages/wallet/wallet?type=wallet' });
			}
		}
	}
</script>

<style scoped lang="scss">
.page-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 100vh;
	background-color: #FFFFFF;
}

.status-box {
	margin-top: 250rpx; // 根据原型图调整上方间距
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 40rpx;

	.success-icon {
		width: 163rpx;
		height: 163rpx;
		margin-bottom: 46rpx;
	}

	.title {
		color: #1E211F;
		font-size: 40rpx;
		font-weight: 500;
		margin-bottom: 24rpx;
	}

	.subtitle {
		font-size: 27rpx;
		color: #5F7564;
		text-align: center;
		line-height: 1.5;
	}
}

.footer {
	margin-top: 150rpx; // 调整副标题与按钮之间的距离
	
	.btn-wallet {
		width: 663rpx;
		height: 106rpx;
		background: #1E211F;
		border-radius: 58rpx;
		
		// 按钮文字样式
		color: #FFFFFF;
		font-size: 33rpx;
		font-weight: 500;
		
		// 居中显示
		display: flex;
		align-items: center;
		justify-content: center;
		
		// 点击反馈
		&:active {
			opacity: 0.8;
		}
	}
}
</style>