<template>
	<view class="page-container">
		<nav-back :title="$t('snInput.title')"></nav-back>

		<view class="mask-container">
			<view class="title">{{ $t('snInput.enterSN') }}</view>

			<view class="input-box">
				<input class="sn-input" type="text" :placeholder="$t('snInput.placeholder')" placeholder-style="color: #C2C9C3" v-model="sn" />
			</view>

			<view class="description">
				{{ $t('snInput.description') }}
			</view>

			<button class="add-btn" @tap="handleAdd">{{ $t('snInput.addConsumable') }}</button>
		</view>

		<!-- 拟态弹窗 -->
		<template v-for="(popup, index) in popups">
			<view v-if="popup.visible" :key="index" class="popup-overlay" :class="{ show: popup.animating }"
				:style="{ bottom: (400 + index * 120) + 'rpx' }">
				<view class="popup-content">
					<image :src="popup.icon" class="popup-icon"></image>
					<view class="popup-text">{{ popup.text }}</view>
				</view>
			</view>
		</template>

	</view>
</template>

<script>
import NavBack from '../../components/nav-back.vue'
import { getMaterialConsumables, useMaterialConsumable } from '../../apis/consumableApi.js'

export default {
	components: {
		NavBack,
	},
	data() {
		return {
			sn: '',
			popups: []
		}
	},
	onLoad(options) {
		if (options.sn) {
			this.sn = options.sn;
		}
	},
	methods: {
		showPopup(iconOrItems, text) {
			const icons = {
				success: '/static/sn-img/icon_success@2x.webp',
				fail: '/static/sn-img/icon_fail@2x.webp',
				coins: '/static/sn-img/icon_coins@2x.webp'
			}

			if (typeof iconOrItems === 'string') {
				this.popups = [{
					visible: true,
					animating: false,
					icon: icons[iconOrItems],
					text: text
				}]
			} else {
				this.popups = iconOrItems.map(item => ({
					visible: true,
					animating: false,
					icon: icons[item.icon],
					text: item.text
				}))
			}

			setTimeout(() => {
				this.popups.forEach(p => p.animating = true)
			}, 50)

			setTimeout(() => {
				this.hidePopup()
			}, 2000)
		},

		hidePopup() {
			this.popups.forEach(p => p.animating = false)
			setTimeout(() => {
				this.popups = []
			}, 300)
		},

		async handleAdd() {
			if (!this.sn) {
				this.showPopup('fail', this.$t('snInput.enterSNFirst'))
				return
			}

			const infoRes = await getMaterialConsumables({ code: this.sn })

			if (!infoRes.data || infoRes.data.length === 0) {
				this.showPopup('fail', this.$t('snInput.snNotExist'))
				return
			}

			const consumable = infoRes.data[0]
			if (consumable.isUsed === 1) {
				this.showPopup('fail', this.$t('snInput.alreadyUsed'))
				return
			}

			await useMaterialConsumable({ consumableCode: this.sn })

			this.showPopup([
				{ icon: 'success', text: this.$t('snInput.success') },
				{ icon: 'coins', text: this.$t('snInput.congratulations').replace('{points}', consumable.points) }
			]);

			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/consumable-list/consumable-list'
				})
			}, 800);
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
		padding: 60rpx 40rpx;
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
		margin-bottom: 100rpx;
	}

	.add-btn {
		width: 100%;
		height: 110rpx;
		background-color: #1E211F;
		color: #ffffff;
		border-radius: 55rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		font-weight: 500;
		border: none;

		&::after {
			border: none;
		}

		&:active {
			opacity: 0.9;
		}
	}
}

.popup-overlay {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 400rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	pointer-events: none;

	.popup-content {
		height: 106rpx;
		padding: 0 40rpx;
		background: rgba(30, 33, 31, 0.7);
		border-radius: 22rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		transform: scale(0.8);
		transition: all 0.3s ease;

		.popup-icon {
			width: 40rpx;
			height: 40rpx;
		}

		.popup-text {
			color: #FFFFFF;
			font-weight: 500;
			font-size: 29rpx;
			text-align: center;
		}
	}

	&.show {
		.popup-content {
			transform: scale(1);
		}
	}
}
</style>