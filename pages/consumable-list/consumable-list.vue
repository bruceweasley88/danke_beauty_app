<template>
	<view class="consumable-page">
		<nav-back title="全部耗材"></nav-back>

		<view class="section-group">

			<view class="section-header">
				<text class="title"></text>

				<view class="more-btn" style="margin-top: -88rpx;" @click="toAddConsumable">
					<text>添加更多耗材</text>
					<text class="arrow"></text>
				</view>
			</view>

			<view class="summary-card">
				<view class="summary-item">
					<view class="value">50</view>
					<view class="label">AI面膜耗材</view>
				</view>
				<view class="vertical-line"></view>
				<view class="summary-item">
					<view class="value">32</view>
					<view class="label">补水喷雾耗材</view>
				</view>
				<view class="vertical-line"></view>
				<view class="summary-item">
					<view class="value">40</view>
					<view class="label">AI文胸耗材</view>
				</view>
			</view>
		</view>

		<view class="section-group list-margin">
			<view class="section-header">
				<text class="title">使用记录</text>
			</view>

			<view class="record-list">
				<view class="record-card" v-for="(item, index) in recordList" :key="index">
					<view class="icon-box"></view>

					<view class="content-box">
						<text class="name">{{ item.name }}</text>
					</view>

					<view class="status-box">
						<view class="amount">+{{ item.count }}</view>
						<view class="time">{{ item.date }}</view>
					</view>
				</view>
			</view>
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
			// 模拟列表数据
			recordList: [
				{ name: 'AI面膜耗材', count: 1, date: '2025.12.21 22:19' },
				{ name: 'AI面膜耗材', count: 1, date: '2025.12.11 22:19' },
				{ name: 'AI面膜耗材', count: 1, date: '2025.12.09 22:19' },
				{ name: '补水喷雾耗材', count: 1, date: '2025.11.21 22:19' },
				{ name: 'AI文胸耗材', count: 1, date: '2025.11.16 22:19' }
			]
		};
	},
	methods: {
		toAddConsumable() {
			uni.navigateTo({
				url: '/pages/add-consumable/add-consumable'
			})
		}
	}
};
</script>

<style lang="scss" scoped>
// 设计系统配色变量
$green-1: #09AB4D;
$green-2: #2EC96F;
$black-1: #1E211F;
$black-3: #9CA29D;
$black-4: #C2C9C3;

.consumable-page {
	padding: 20rpx 30rpx;
	// 注意：此处不写背景，已由全局page背景处理
}

.section-group {
	&.list-margin {
		margin-top: 50rpx;
	}
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;

	.more-btn {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: $black-3;
		z-index: 9999;
		position: relative;

		.arrow {
			width: 12rpx;
			height: 12rpx;
			border-top: 3rpx solid $black-4;
			border-right: 3rpx solid $black-4;
			transform: rotate(45deg);
			margin-left: 8rpx;
		}
	}
}

/* 顶部绿色卡片 */
.summary-card {
	background: linear-gradient(90deg, $green-2 0%, $green-1 100%);
	border-radius: 24rpx;
	height: 190rpx;
	display: flex;
	align-items: center;
	padding: 0 10rpx;

	.summary-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #ffffff;

		.value {
			font-size: 52rpx;
			font-weight: 500;
			line-height: 1;
			margin-bottom: 12rpx;
		}

		.label {
			font-size: 24rpx;
			opacity: 0.9;
		}
	}

	.vertical-line {
		width: 2rpx;
		height: 80rpx;
		background-color: rgba(255, 255, 255, 0.2);
	}
}

/* 下方记录列表 */
.record-list {
	.record-card {
		background-color: #F8FAF9;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;

		.icon-box {
			width: 100rpx;
			height: 100rpx;
			border-radius: 20rpx;
			margin-right: 24rpx;
			flex-shrink: 0;
			background-size: cover;
			background-image: url('/static/device_img/img_aimms@2x.png');
		}

		.content-box {
			flex: 1;

			.name {
				font-size: 30rpx;
				color: $black-1;
				font-weight: 500;
			}
		}

		.status-box {
			text-align: right;

			.amount {
				font-size: 34rpx;
				font-weight: bold;
				color: $black-1;
				margin-bottom: 6rpx;
			}

			.time {
				font-size: 24rpx;
				color: $black-3;
			}
		}
	}
}
</style>