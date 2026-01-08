<template>
	<view class="points-card-box">
		<view class="points-card-main">

			<view class="detail-entry" @tap="onDetailClick">
				积分详情 <text class="arrow">></text>
			</view>

			<view class="card-content">
				<view class="title">我的积分</view>

				<view class="score-section">
					<image class="coin-icon" mode="aspectFit"></image>
					<text class="score-num">{{ score }}</text>
				</view>

				<view class="bottom-bar">
					<view class="tips">绑定钱包地址后，获取的积分可提现到钱包</view>
					<view class="withdraw-btn" @tap="onWithdrawClick">
						立即提取 <text class="arrow-bold">></text>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		name: "PointsCard",
		props: {
			score: {
				type: [Number, String],
				default: 3589
			}
		},
		methods: {
			onDetailClick() {
				this.$emit('detail');
				console.log('点击详情');
			},
			onWithdrawClick() {
				this.$emit('withdraw');
				console.log('点击提取');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.points-card-box {
		display: flex;
		justify-content: center;
	}

	.points-card-main {
		/* 严格遵照你提供的尺寸 */
		width: 692rpx;
		height: 225rpx;

		/* 背景设置：请确保素材图路径正确 */
		background-image: url('/static/img/bg_coin@2x.webp');
		background-size: 100% 100%;
		background-repeat: no-repeat;

		position: relative;
		box-sizing: border-box;
		padding: 28rpx 32rpx;
		padding-top: 62rpx;
	}

	.detail-entry {
		position: absolute;
		top: 62rpx;
		right: 184rpx; // 避开背景图中右上角的大金币位置
		color: #F3FFF7;
		font-size: 22rpx;
		z-index: 10;
		font-weight: 400;

		.arrow {
			margin-left: 4rpx;
			font-size: 20rpx;
		}
	}

	.card-content {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.title {
		color: #FFFFFF;
		font-size: 29rpx;
		font-weight: 500;
		line-height: 1;
	}

	.score-section {
		display: flex;
		align-items: center;
		margin-top: 24rpx;

		.coin-icon {
			width: 46rpx;
			height: 46rpx;
			margin-right: 12rpx;
			background-image: url('/static/me_img/icon_coinb@2x.png');
			background-size: cover;
		}

		.score-num {
			color: #FFED27; // 亮黄色
			font-size: 55rpx;
			font-weight: bold;
			height: 46rpx;
			line-height: 46rpx;
			font-family: 'Helvetica Neue', Arial, sans-serif;
		}
	}

	.bottom-bar {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-top: 14rpx;

		.tips {
			font-size: 22rpx;
			color: #9CA29D;
			width: 400rpx;
			font-weight: 400;
			line-height: 1.2;
		}

		.withdraw-btn {
			color: #000000;
			font-size: 26rpx;
			font-weight: 500;
			display: flex;

			.arrow-bold {
				margin-left: 8rpx;
				font-size: 24rpx;
			}
		}

	}
</style>