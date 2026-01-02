<template>
	<view class="profile-page">
		<nav-back title="个人资料"></nav-back>
		<view class="avatar-section">
			<view class="avatar-wrapper">
				<view class="avatar-placeholder"></view>
			</view>
		</view>

		<view class="info-list">
			<view class="info-item" v-for="(item, index) in profileData" :key="index" @tap="handleEdit(item.key)">
				<view class="label">{{ item.label }}</view>
				<view class="content">
					<text :class="['value', item.value ? '' : 'placeholder']">
						{{ item.value || 'Fill in' }}
					</text>
					<image class="icon-arrow" src="/static/img/icon_down.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>

		<view class="footer-action">
			<button class="btn-save" @tap="submitSave">保存</button>
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
				profileData: [{
						label: '昵称',
						value: 'Sheryl',
						key: 'nickname'
					},
					{
						label: '性别',
						value: '女',
						key: 'gender'
					},
					{
						label: '年龄',
						value: '28',
						key: 'age'
					},
					{
						label: '身高',
						value: '178cm',
						key: 'height'
					},
					{
						label: '体重',
						value: '69kg',
						key: 'weight'
					},
					{
						label: '社交媒体',
						value: '',
						key: 'social'
					}
				]
			};
		},
		methods: {
			handleEdit(key) {
				console.log('点击编辑:', key);
			},
			submitSave() {
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	// 颜色变量映射
	$green-1: #09ab4d;
	$black-1: #1e211f;
	$black-2: #5f7564;
	$black-3: #9ca29d;
	$black-4: #c2c9c3;
	$black-5: #f8faf9;

	.profile-page {
		min-height: 100vh;
		background-color: #ffffff;
		padding: 0 40rpx;
		display: flex;
		flex-direction: column;

		// 头像区域样式
		.avatar-section {
			display: flex;
			justify-content: center;
			padding: 60rpx 0 80rpx;

			.avatar-wrapper {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				border: 2rpx solid $black-5; // 模拟外圈线
				display: flex;
				align-items: center;
				justify-content: center;

				.avatar-placeholder {
					width: 140rpx;
					height: 140rpx;
					background-image: url('/static/img/icon_photo.webp');
					background-size: cover;
					border-radius: 50%;
				}
			}
		}

		// 列表区域样式
		.info-list {
			.info-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 110rpx;
				border-bottom: 1rpx solid #f0f0f0;

				.label {
					font-size: 32rpx;
					color: $black-3; // 使用黑3色系
				}

				.content {
					display: flex;
					align-items: center;

					.value {
						font-size: 32rpx;
						color: $black-1;
						margin-right: 12rpx;

						&.placeholder {
							color: $black-4; // 未填写颜色
						}
					}

					.icon-arrow {
						width: 32rpx;
						height: 32rpx;
						// 如果图片是向下箭头但此处需要侧向，建议旋转或直接使用
						// transform: rotate(-90deg); 
					}
				}

				&:last-child {
					border-bottom: none;
				}
			}
		}

		// 底部按钮区域
		.footer-action {
			margin-top: auto; // 推到底部
			padding: 60rpx 0 100rpx;

			.btn-save {
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				background-color: $black-1; // 黑色背景
				color: #ffffff;
				border-radius: 50rpx;
				font-size: 32rpx;
				font-weight: 500;
				border: none;

				&:active {
					opacity: 0.8;
				}
			}
		}
	}
</style>