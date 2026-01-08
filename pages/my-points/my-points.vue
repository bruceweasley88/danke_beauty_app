<template>
	<view class="my-points-page">
		<nav-back title="我的积分"></nav-back>
		<points></points>

		<view class="detail-container">
			<view class="detail-title">积分详情</view>

			<view class="list-card">
				<view class="tabs">
					<view v-for="(item, index) in tabList" :key="index" class="tab-item"
						:class="{ active: currentTab === index }" @click="currentTab = index">
						<text class="tab-text">{{ item }}</text>
						<view class="active-line" v-if="currentTab === index"></view>
					</view>
				</view>

				<scroll-view scroll-y="true" class="list-scroll-view">
					<view class="list-content">
						<view class="list-item" v-for="(item, index) in filteredList" :key="index">
							<view class="left-box">
								<image class="coin-icon" src="/static/me_img/icon_coinb@2x.png" mode="aspectFit">
								</image>
								<text class="amount">{{ item.amount }}</text>
							</view>
							<view class="right-box">
								<view class="status">{{ item.status === 1 ? '已提取' : '已获得' }}</view>
								<view class="time">{{ item.time }}</view>
							</view>
						</view>

						<view class="no-more">- 暂无更多记录 -</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<view class="footer-btn-box">
			<button class="withdraw-btn">提取积分到钱包</button>
		</view>
	</view>
</template>

<script>
	import NavBack from '../../components/nav-back.vue';
	import points from '../../components/points.vue';

	export default {
		components: {
			NavBack,
			points
		},
		data() {
			return {
				currentTab: 0,
				tabList: ['全部记录', '提取记录', '获得记录'],
				// 模拟较多数据以测试滚动
				allData: [{
						amount: 50,
						status: 1,
						time: '2024-05-12 10:12:53'
					},
					{
						amount: 120,
						status: 2,
						time: '2024-05-12 10:12:53'
					},
					{
						amount: 280,
						status: 2,
						time: '2024-05-12 10:12:53'
					},
					{
						amount: 88,
						status: 2,
						time: '2024-05-12 10:12:53'
					},
					{
						amount: 1000,
						status: 1,
						time: '2024-05-12 10:12:53'
					},
					{
						amount: 666,
						status: 2,
						time: '2024-05-12 10:12:53'
					},
					{
						amount: 999,
						status: 1,
						time: '2024-05-12 10:12:53'
					},
					{
						amount: 123,
						status: 2,
						time: '2024-05-12 10:12:53'
					},
				]
			}
		},
		computed: {
			filteredList() {
				if (this.currentTab === 1) return this.allData.filter(i => i.status === 1);
				if (this.currentTab === 2) return this.allData.filter(i => i.status === 2);
				return this.allData;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my-points-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
	}

	.detail-container {
		width: 692rpx;
		margin-top: 40rpx;

		.detail-title {
			color: #222222;
			font-weight: 500;
			font-size: 29rpx;
			margin-bottom: 25rpx;
		}

		.list-card {
			width: 692rpx;
			height: 772rpx; // 强制卡片高度
			background: #FFFFFF;
			border-radius: 29rpx;
			box-shadow: 0rpx 5rpx 40rpx 0rpx rgba(220, 236, 225, 0.5);
			display: flex;
			flex-direction: column; // 垂直布局以便 scroll-view 撑开
			overflow: hidden;

			.tabs {
				display: flex;
				padding: 40rpx 40rpx 20rpx;
				gap: 45rpx;

				.tab-item {
					position: relative;
					display: flex;
					flex-direction: column;
					align-items: center;

					.tab-text {
						font-size: 29rpx;
						font-weight: 400;
						color: #5F7564;
						z-index: 2; // 文字在上
					}

					&.active .tab-text {
						color: #1E211F;
						font-weight: 500;
					}

					// 修复：Tab 选中颜色块
					.active-line {
						position: absolute;
						bottom: 0;
						width: 100%;
						height: 11rpx;
						background: #81FD95;
						z-index: 1; // 颜色块在文字稍微靠下的位置
						border-radius: 2rpx;
					}
				}
			}

			// 修复：列表滚动的关键样式
			.list-scroll-view {
				flex: 1;
				height: 0; // 必须设为0，由flex:1撑开，scroll-view才能滚动

				.list-content {
					padding: 0 40rpx 40rpx;
				}

				.list-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 35rpx 0;
					border-bottom: 1rpx solid #F8FBF9;

					.left-box {
						display: flex;
						align-items: center;

						.coin-icon {
							width: 44rpx;
							height: 44rpx;
							margin-right: 14rpx;
						}

						.amount {
							font-weight: 500;
							color: #1E211F;
							font-size: 44rpx;
						}
					}

					.right-box {
						text-align: right;

						.status {
							font-weight: 400;
							font-size: 25rpx;
							color: #5F7564;
						}

						.time {
							font-weight: 400;
							font-size: 22rpx;
							color: #C2C9C3;
							margin-top: 4rpx;
						}
					}
				}

				.no-more {
					text-align: center;
					padding: 40rpx 0;
					color: #C2C9C3;
					font-size: 24rpx;
				}
			}
		}
	}

	.footer-btn-box {
		margin-top: 60rpx;
		padding-bottom: 50rpx;

		.withdraw-btn {
			width: 663rpx;
			height: 106rpx;
			background: #1E211F;
			border-radius: 58rpx;
			color: #ffffff;
			font-weight: 500;
			font-size: 33rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border: none;
			line-height: normal;

			&::after {
				border: none;
			}
		}
	}
</style>