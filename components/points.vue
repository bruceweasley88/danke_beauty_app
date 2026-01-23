<template>
	<view class="points-card-box">
		<view class="points-card-main">

			<view class="detail-entry" v-if="showDetail" @tap="onDetailClick">
				{{ $t('myPoints.detailTitle') }} <text class="arrow">></text>
			</view>

			<view class="card-content">
				<view class="title">{{ $t('myPoints.title') }}</view>

				<view class="score-section">
					<image class="coin-icon" mode="aspectFit"></image>
					<text class="score-num">{{ point }}</text>
				</view>

				<view class="bottom-bar">
					<view class="tips">{{ $t('points.withdrawTip') }}</view>
					<view class="withdraw-btn" @tap="onWithdrawClick">
						{{ $t('myPoints.withdrawToWallet') }} <text class="arrow-bold">></text>
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
		point: {
			type: [Number, String],
			default: 3589
		},
		showDetail: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		onDetailClick() {
			this.$emit('detail');
			console.log('点击详情');
		},
		onWithdrawClick() {
			uni.navigateTo({
				url: '/pages/point_withdraw/point_withdraw'
			})
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
	padding: 28rpx 28rpx;
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
	margin-top: 12rpx;

	.tips {
		font-size: 22rpx;
		color: #9CA29D;
		width: 480rpx;
		font-weight: 400;
		line-height: 1.2;
		white-space: nowrap;
	}

	.withdraw-btn {
		color: #000000;
		font-size: 24rpx;
		font-weight: 500;
		display: flex;

		.arrow-bold {
			margin-left: 6rpx;
			font-size: 24rpx;
		}
	}

}
</style>