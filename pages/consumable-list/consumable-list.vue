<template>
	<view class="consumable-page">
		<nav-back :title="$t('consumable.allConsumables')"></nav-back>

		<view class="section-group">

			<view class="section-header">
				<text class="title"></text>

				<view class="more-btn" style="margin-top: -88rpx;" @click="toAddConsumable">
					<text>{{ $t('consumable.addMore') }}</text>
					<text class="arrow"></text>
				</view>
			</view>

			<view class="summary-card">
				<view class="summary-item">
					<view class="value">{{ summary.type1 }}</view>
					<view class="label">{{ $t('deviceType.mask') }}</view>
				</view>
				<view class="vertical-line"></view>
				<view class="summary-item">
					<view class="value">{{ summary.type2 }}</view>
					<view class="label">{{ $t('deviceType.spray') }}</view>
				</view>
				<view class="vertical-line"></view>
				<view class="summary-item">
					<view class="value">{{ summary.type3 }}</view>
					<view class="label">{{ $t('deviceType.bra') }}</view>
				</view>
				<view class="vertical-line"></view>
				<view class="summary-item">
					<view class="value">{{ summary.type4 }}</view>
					<view class="label">{{ $t('deviceType.importer') }}</view>
				</view>
			</view>
		</view>

		<view class="section-group list-margin">
			<view class="section-header">
				<text class="title">{{ $t('consumable.usageRecord') }}</text>
			</view>

			<view class="record-list">
				<view v-if="recordList.length === 0" class="empty-tip">
					<text class="empty-text">{{ $t('consumable.noRecord') }}</text>
				</view>
				<view class="record-card" v-for="(item, index) in recordList" :key="index">
					<view class="icon-box" :class="`icon-${consumableTypeToType(item.consumableType)}`"></view>

					<view class="content-box">
						<text class="name">{{ item.consumableName }}</text>
					</view>

					<view class="status-box">
						<view class="amount">+1</view>
						<view class="time">{{ formatTime(item.useTime) }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import NavBack from '../../components/nav-back.vue'
import { getUserConsumableRecords } from '../../apis/consumableApi.js'
export default {
	components: {
		NavBack,
	},
	data() {
		return {
			// 统计数据
			summary: {
				type1: 0,  // 面膜数量
				type2: 0,  // 补水喷雾数量
				type3: 0,  // 文胸数量
				type4: 0   // 美容导入仪数量
			},
			// 记录列表
			recordList: []
		};
	},
	async onLoad() {
		await this.fetchConsumableRecords()
	},
	methods: {
		async fetchConsumableRecords() {
			const res = await getUserConsumableRecords({})

			if (res.data && res.data.length > 0) {
				// 统计各类型数量
				this.summary.type1 = res.data.filter(item => item.consumableType === 1).length
				this.summary.type2 = res.data.filter(item => item.consumableType === 2).length
				this.summary.type3 = res.data.filter(item => item.consumableType === 3).length
				this.summary.type4 = res.data.filter(item => item.consumableType === 4).length

				// 转换记录列表数据
				this.recordList = res.data
			}
		},
		formatTime(time) {
			if (!time) return '';
			const date = new Date(time);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hour = String(date.getHours()).padStart(2, '0');
			const minute = String(date.getMinutes()).padStart(2, '0');
			return `${year}-${month}-${day} ${hour}:${minute}`;
		},
		toAddConsumable() {
			uni.navigateTo({
				url: '/pages/sn/sn'
			})
		},
		consumableTypeToType(consumableType) {
			switch (consumableType) {
				case 1: return 'mask';
				case 2: return 'spray';
				case 3: return 'bra';
				case 4: return 'importer';
			}

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
	.empty-tip {
		text-align: center;
		padding: 100rpx 0;

		.empty-text {
			font-size: 28rpx;
			color: $black-3;
		}
	}

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
		}

		.icon-mask {
			background-image: url('/static/device_img/img_aimms@2x.png');
		}

		.icon-spray {
			background-image: url('/static/device_img/img_bspws@2x.png');
		}

		.icon-bra {
			background-image: url('/static/device_img/img_aiwxs@2x.png');
		}

		.icon-importer {
			background-image: url('/static/device_img/img_dry@2x.png');
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