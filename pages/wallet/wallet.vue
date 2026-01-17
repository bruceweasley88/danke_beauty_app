<template>
	<view class="wallet-page" :class="(!userInfo.walletAddress || type === 'address') ? 'wallet-page-white' : ''">
		<nav-back :title="type === 'wallet' ? '我的钱包' : '钱包地址'"></nav-back>

		<view v-if="!userInfo.walletAddress" class="empty-container">
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
			<view class="balance-section" v-if="type === 'wallet'">
				<view class="label">钱包余额</view>
				<view class="amount-row">
					<text class="symbol">$</text>
					<text class="number">{{ balance }}</text>
					<text class="unit">HST</text>
				</view>
			</view>

			<view class="address-card" :class="type === 'address' ? 'address-card-gray' : ''">
				<view class="address-margin">
					<view class="card-header">绑定钱包地址</view>

					<view class="chain-type">
						<image class="icon-loc" src="/static/img/icon_addresss@2x.webp" mode="aspectFit"></image>
						<text class="type-text">{{ userInfo.walletAddressRemark }}</text>
					</view>

					<view class="address-row">
						<text class="addr-text">{{ userInfo.walletAddress }}</text>
						<image class="icon-edit" src="/static/img/icon_edit@2x.webp" mode="aspectFit" @click="editAddress"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 钱包地址编辑弹窗 -->
		<confirm-popup :visible="showAddressPopup" title="添加钱包地址" @cancel="showAddressPopup = false" @ok="saveAddress">
			<view class="wallet-inputs">
				<view class="wallet-tip">确认你的钱包地址是BSC公链地址，并添加正确，否则你将无法接收代币。</view>
				<input class="wallet-input" type="text" placeholder="填写地址备注" v-model="tempAddressData.walletAddressRemark" />
				<textarea class="wallet-input wallet-textarea" placeholder="填写正确的BSC公链地址"
					v-model="tempAddressData.walletAddress" />
			</view>
		</confirm-popup>
	</view>
</template>

<script>
import NavBack from '../../components/nav-back.vue';
import ConfirmPopup from '../../components/confirm-popup.vue';
import { userGetInfo, userEditInfo } from '@/apis/userApi.js';
import { getTokenBalance } from '../../utils/hst';

export default {
	components: {
		NavBack,
		ConfirmPopup
	},
	data() {
		return {
			type: '',
			showAddressPopup: false,
			tempAddressData: {
				walletAddressRemark: '',
				walletAddress: ''
			},
			userInfo: {},
			balance: 0
		}
	},
	async onLoad(options) {
		if (options.type) {
			this.type = options.type;
		}
		await this.getUserInfo();
	},
	methods: {
		async getUserInfo() {
			const res = await userGetInfo();
			this.userInfo = res.data;
			if (this.type === 'wallet') {
				this.balance = await getTokenBalance(this.userInfo.walletAddress)
			}
		},
		addAddress() {
			this.tempAddressData = {
				walletAddressRemark: '',
				walletAddress: ''
			};
			this.showAddressPopup = true;
		},
		editAddress() {
			this.tempAddressData = {
				walletAddressRemark: this.userInfo.walletAddressRemark || '',
				walletAddress: this.userInfo.walletAddress || ''
			};
			this.showAddressPopup = true;
		},
		async saveAddress() {
			await userEditInfo({
				id: this.userInfo.id,
				walletAddress: this.tempAddressData.walletAddress,
				walletAddressRemark: this.tempAddressData.walletAddressRemark
			});

			await this.getUserInfo();
			this.showAddressPopup = false;

			uni.showToast({
				title: '保存成功',
				icon: 'success'
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

		&.address-card-gray {
			background: #F8FAF9;
			box-shadow: none;
			margin-top: -50rpx;
		}

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
				width: 42rpx;
				height: 42rpx;
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
				font-size: 26rpx;
				color: #999999;
				width: 540rpx;
				word-break: break-all;
				/* 限制行数 */
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}

			.icon-edit {
				width: 46rpx;
				height: 46rpx;
				position: relative;
				top: -4rpx;
				left:  8rpx;
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

/* ================= 钱包弹窗输入框样式 ================= */
.wallet-inputs {
	width: 560rpx;
	margin: 0 auto;

	.wallet-tip {
		color: #5F7564;
		font-size: 29rpx;
		margin-bottom: 44rpx;
	}

	.wallet-input {
		width: 100%;
		background: #F8FAF9;
		border-radius: 22rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #1E211F;
		border: none;

		&::placeholder {
			color: #C2C9C3;
		}
	}

	.wallet-input:not(.wallet-textarea) {
		height: 86rpx;
		line-height: 86rpx;
		margin-bottom: 44rpx;
	}

	.wallet-textarea {
		height: 211rpx;
		line-height: 1.5;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}
}
</style>