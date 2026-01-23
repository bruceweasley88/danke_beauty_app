<template>
	<view class="service-agreement-page">
		<nav-back :title="$t('serviceAgreement.title')"></nav-back>
		<view class="content-container">
			<rich-text v-if="content" :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
import NavBack from '../../components/nav-back.vue'
import { commonGetServiceInfo } from '@/apis/commonApi.js'

export default {
	components: {
		NavBack
	},
	data() {
		return {
			content: '',
		}
	},
	onLoad() {
		this.fetchServiceInfo()
	},
	methods: {
		async fetchServiceInfo() {
			try {
				this.loading = true
				const res = await commonGetServiceInfo()
				this.content = res.data
			} catch (error) {
				console.error('获取服务协议失败', error)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.service-agreement-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #A1FFE5 0%, #DBFFE5 28.37%, #F3FFF6 50.48%, #F1F3F4 72.6%, #F1F3F4 100%);
	display: flex;
	flex-direction: column;
}

.content-container {
	padding: 0 40rpx;
	box-sizing: border-box;
	display: flex;
}

</style>
