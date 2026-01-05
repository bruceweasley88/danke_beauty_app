<template>
	<confirm-popup :visible="visible" :title="$t('common.selectCountry')" :content="$t('common.selectCountryTip')" @cancel="handleCancel" @ok="handleOk">
		<view class="list">
			<scroll-view scroll-y class="scroll">
				<view v-for="item in countryList" :key="item.code" :class="`item click-active ${selectedCode === item.code ? 'selected' : ''}`" @click="onSelect(item)">
					<view class="text">
						<text :class="`name ${selectedCode === item.code ? 'name-selected' : ''}`">{{ item.destinationCn }}</text>
					</view>
					<view class="operate" v-if="selectedCode === item.code">
						<image src="/static/img/icon_selected.webp" class="selected_icon" />
					</view>
				</view>
			</scroll-view>
		</view>
	</confirm-popup>
</template>

<script>
import ConfirmPopup from './confirm-popup.vue'
import { commonGetCountry } from '@/apis/commonApi.js'

export default {
	name: 'CountryPicker',
	components: {
		ConfirmPopup
	},
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		value: {
			type: String,
			default: '86'
		}
	},
	data() {
		return {
			countryList: [],
			selectedCode: '86'
		}
	},
	watch: {
		visible(val) {
			if (val && this.countryList.length === 0) {
				this.loadCountryList()
			}
			if (val && this.selectedCode !== this.value) {
				this.selectedCode = this.value
			}
		},
		value: {
			handler(val) {
				this.selectedCode = val
			},
			immediate: true
		}
	},
	methods: {
		async loadCountryList() {
			const res = await commonGetCountry()
			this.countryList = [
				{ code: '86', destinationCn: '中国' },
				...res.data.filter(item => item.code.length < 4)
			]
		},
		onSelect(item) {
			this.selectedCode = item.code
		},
		handleCancel() {
			this.$emit('cancel')
		},
		handleOk() {
			this.$emit('change', this.selectedCode)
			this.$emit('input', this.selectedCode)
			this.$emit('ok')
		}
	}
}
</script>

<style scoped lang="scss">
.list {
	width: 100%;
}

.scroll {
	height: 560rpx;
}

.item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 106rpx;
	border-bottom: 1px solid #EAEAEA;
	margin: 0 44rpx;

	.text {
		display: flex;
		align-items: center;

		.name {
			font-family: 'Alibaba Medium';
			font-weight: bold;
			font-size: 33rpx;
			color: #7D7E83;
		}

		.name-selected {
			color: #1C1F2A;
		}
	}

	.operate {
		.selected_icon {
			width: 44rpx;
			height: 44rpx;
		}
	}
}
</style>
