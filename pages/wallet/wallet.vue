<template>
	<view class="wallet-page" :class="info.address ? `` : 'wallet-page-white'">
		<nav-back :title="info.address ? '我的钱包' : '添加钱包地址'"></nav-back>

		<view v-if="!info.address" class="empty-container">
			<view class="illustration-box">
				<image class="empty-img" src="/static/img/img_noadress@2x.webp" mode="aspectFit"></image>
				<view class="empty-text">
					目前还没有添加钱包地址，
					<br />
					现在就去添加它
				</view>
			</view>

			<view class="bottom-action">
				<view class="btn-add" @click="addAddress">添加钱包地址</view>
			</view>
		</view>

		<view v-else class="wallet-container">
			<view class="balance-section">
				<view class="label">钱包余额</view>
				<view class="amount-row">
					<text class="symbol">$</text>
					<text class="number">200.00</text>
					<text class="unit">HST</text>
				</view>
			</view>

			<view class="address-card">
				<view class="address-margin">
					<view class="card-header">绑定钱包地址</view>

					<view class="chain-type">
						<image class="icon-loc" src="/static/img/icon_addresss@2x.webp" mode="aspectFit"></image>
						<text class="type-text">TRC-20</text>
					</view>

					<view class="address-row">
						<text class="addr-text">{{ info.address }}</text>
						<image class="icon-edit" src="/static/img/icon_edit@2x.webp" mode="aspectFit"
							@click="editAddress"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import NavBack from '../../components/nav-back.vue';

	export default {
		components: {
			NavBack
		},
		data() {
			return {
				type: 'wallet',
				info: {
					// 调试提示：
					// 1. 设置为空字符串 '' 查看【空状态】 (图1)
					// 2. 设置为具体字符串查看【钱包详情】 (图2)
					address: '',
					address: 'Y9h7s4aQ2hX4N8b4C1Jv2L3pW4ZpR7sT1',
					label: '2222'
				}
			}
		},
		onLoad(options) {
			if (options.type) {
				this.type = options.type;
			}
			// 实际业务中这里会请求API获取是否有地址
		},
		methods: {
			addAddress() {
				// 模拟添加地址
				uni.showToast({
					title: '去添加地址',
					icon: 'none'
				});
				// 测试用：点击后模拟填充数据
				// this.info.address = 'Y9h7s4aQ2hX4N8b4C1Jv2L3pW4ZpR7sT1';
			},
			editAddress() {
				uni.showToast({
					title: '编辑地址',
					icon: 'none'
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	/* 通用颜色定义 */
	$black-basic: #1C1F2A;
	$text-gray: #999999;
	$btn-bg: #1E211F;

	page {
		background: #ffffff;
	}

	.wallet-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: url('/static/img/bg_mywallet@2x.webp') no-repeat top center;
		background-size: 100% auto;
		background-color: #f5f7f6;
		/* 兜底背景色 */
	}

	.wallet-page-white {
		background: #fff;
	}


	/* ================= 空状态样式 ================= */
	.empty-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 200rpx;
		/* 根据图1调整插画位置 */

		.illustration-box {
			display: flex;
			flex-direction: column;
			align-items: center;

			.empty-img {
				width: 300rpx;
				/* 根据素材实际大小调整 */
				height: 300rpx;
				margin-bottom: 40rpx;
			}

			.empty-text {
				width: 628rpx;
				color: #5F7564;
				font-size: 27rpx;
				text-align: center;
				line-height: 1.6;
			}
		}

		.bottom-action {
			margin-top: 150rpx;
			/* 拉开按钮与文字的距离 */
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}

	/* ================= 有地址状态样式 ================= */
	.wallet-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 88rpx;

		/* 余额区域 */
		.balance-section {
			margin-bottom: 40rpx;
			padding-left: 48rpx;
			width: 692rpx;

			.label {
				font-size: 28rpx;
				color: $black-basic;
				font-weight: 500;
				margin-bottom: 10rpx;
			}

			.amount-row {
				display: flex;
				align-items: baseline;
				color: $black-basic;

				.symbol {
					font-size: 32rpx;
					font-weight: 600;
					margin-right: 4rpx;
				}

				.number {
					font-size: 60rpx;
					font-weight: bold;
					font-family: Arial, Helvetica, sans-serif;
				}

				.unit {
					font-size: 28rpx;
					margin-left: 10rpx;
					font-weight: 500;
				}
			}
		}

		/* 地址卡片 */
		.address-card {
			height: 226rpx;
			width: 692rpx;
			background: #ffffff;
			border-radius: 29rpx;
			box-shadow: 0rpx 5rpx 40rpx 0rpx rgba(220, 236, 225, 0.5);
			display: flex;
			align-items: center;

			.address-margin {
				padding: 0 34rpx;
			}

			.card-header {
				font-size: 29rpx;
				color: #222222;
				font-weight: 500;
				margin-bottom: 20rpx;
			}

			.chain-type {
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;

				.icon-loc {
					width: 36rpx;
					height: 36rpx;
					margin-right: 12rpx;
				}

				.type-text {
					font-weight: 500;
					font-size: 33rpx;
					font-size: 33rpx;
					color: #222222;
				}
			}

			.address-row {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.addr-text {
					font-size: 25rpx;
					color: #999999;
					width: 540rpx;
					word-break: break-all;
					/* 限制行数 */
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.icon-edit {
					width: 32rpx;
					height: 32rpx;
					padding: 10rpx;
					/* 增加点击区域 */
				}
			}
		}
	}

	/* ================= 通用按钮样式 (需求点3) ================= */
	.btn-add {
		width: 663rpx;
		height: 106rpx;
		background: $btn-bg;
		border-radius: 58rpx;
		color: #ffffff;
		font-size: 33rpx;
		font-weight: 500;
		/* Flex居中 */
		display: flex;
		align-items: center;
		justify-content: center;

		/* 点击效果 */
		&:active {
			opacity: 0.9;
		}
	}
</style>