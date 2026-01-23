<template>
	<view class="profile-page">
		<nav-back :title="$t('personal.title')"></nav-back>
		<view class="avatar-section">
			<view class="avatar-wrapper" @tap="onChangeAvatar">
				<image class="avatar-placeholder" :src="userInfo.headImg || '/static/img/icon_photo.webp'" mode="aspectFill"></image>
			</view>
		</view>

		<view class="info-list">
			<!-- 昵称 -->
			<view class="info-item" @tap="openNicknamePopup">
				<view class="label">{{ $t('personal.nickname') }}</view>
				<view class="content">
					<text :class="['value', userInfo.nickName ? '' : 'placeholder']">
						{{ userInfo.nickName || 'Fill in' }}
					</text>
					<image class="icon-arrow" src="/static/img/icon_down.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 性别 -->
			<view class="info-item" @tap="openGenderPopup">
				<view class="label">{{ $t('personal.gender') }}</view>
				<view class="content">
					<text :class="['value', userInfo.sex ? '' : 'placeholder']">
						{{ userInfo.sex == 1 ? $t('personal.male') : userInfo.sex == 2 ? $t('personal.female') : 'Fill in' }}
					</text>
					<image class="icon-arrow" src="/static/img/icon_down.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 年龄 -->
			<view class="info-item" @tap="openAgePopup">
				<view class="label">{{ $t('personal.age') }}</view>
				<view class="content">
					<text :class="['value', userInfo.age ? '' : 'placeholder']">
						{{ userInfo.age || 'Fill in' }}
					</text>
					<image class="icon-arrow" src="/static/img/icon_down.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 身高 -->
			<view class="info-item" @tap="openHeightPopup">
				<view class="label">{{ $t('personal.height') }}</view>
				<view class="content">
					<text :class="['value', userInfo.height ? '' : 'placeholder']">
						{{ userInfo.height ? userInfo.height + $t('personal.unitCm') : 'Fill in' }}
					</text>
					<image class="icon-arrow" src="/static/img/icon_down.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 体重 -->
			<view class="info-item" @tap="openWeightPopup">
				<view class="label">{{ $t('personal.weight') }}</view>
				<view class="content">
					<text :class="['value', userInfo.weight ? '' : 'placeholder']">
						{{ userInfo.weight ? userInfo.weight + $t('personal.unitKg') : 'Fill in' }}
					</text>
					<image class="icon-arrow" src="/static/img/icon_down.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 社交媒体 -->
			<view class="info-item" @tap="openSocialPopup">
				<view class="label">{{ $t('personal.socialMedia') }}</view>
				<view class="content">
					<text :class="['value', hasSocialInfo() ? '' : 'placeholder']">
						{{ hasSocialInfo() ? $t('personal.filled') : 'Fill in' }}
					</text>
					<image class="icon-arrow" src="/static/img/icon_down.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>

		<view class="footer-action">
			<button class="btn-save" @tap="submitSave">{{ $t('personal.save') }}</button>
		</view>

		<!-- 昵称编辑弹窗 -->
		<confirm-popup :visible="showNicknamePopup" :title="$t('personal.enterNickname')" :content="$t('personal.dataSyncTip')" @cancel="showNicknamePopup = false"
			@ok="saveNickname">
			<input class="popup-input" type="text" :placeholder="$t('personal.enterNickname')" v-model="tempNickname" />
		</confirm-popup>

		<!-- 性别选择弹窗 -->
		<confirm-popup :visible="showGenderPopup" :title="$t('personal.selectGender')" :content="$t('personal.dataSyncTip')" @cancel="showGenderPopup = false"
			@ok="saveGender">
			<view class="gender-list">
				<view v-for="(item, index) in localizedGenderOptions" :key="index" class="gender-item" @tap="tempGenderIndex = index">
					<view class="gender-left">
						<image :src="item.icon" class="gender-icon"></image>
						<text :class="['gender-label', tempGenderIndex === index ? 'selected' : '']">
							{{ item.label }}
						</text>
					</view>
					<image
						:src="tempGenderIndex === index ? '/static/personal_img/icon_selectb@2x.webp' : '/static/personal_img/icon_noselectb@2x.webp'"
						class="radio-icon">
					</image>
				</view>
			</view>
		</confirm-popup>

		<!-- 年龄选择弹窗 -->
		<confirm-popup :visible="showAgePopup" :title="$t('personal.selectAge')" :content="$t('personal.dataSyncTip')" @cancel="showAgePopup = false"
			@ok="saveAge">
			<picker-view class="picker-view" :value="[tempAgeIndex]" @change="onAgeChange">
				<picker-view-column>
					<view v-for="(item, index) in ageRange" :key="index" class="picker-item">
						{{ item }}{{ $t('personal.unitAge') }}
					</view>
				</picker-view-column>
			</picker-view>
		</confirm-popup>

		<!-- 身高选择弹窗 -->
		<confirm-popup :visible="showHeightPopup" :title="$t('personal.selectHeight')" :content="$t('personal.dataSyncTip')" @cancel="showHeightPopup = false"
			@ok="saveHeight">
			<picker-view class="picker-view" :value="tempHeightIndex" @change="onHeightChange">
				<picker-view-column>
					<view v-for="(item, index) in heightInteger" :key="index" class="picker-item">
						{{ item }}
					</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(item, index) in heightDecimal" :key="index" class="picker-item">
						{{ item }}
					</view>
				</picker-view-column>
			</picker-view>
		</confirm-popup>

		<!-- 体重选择弹窗 -->
		<confirm-popup :visible="showWeightPopup" :title="$t('personal.selectWeight')" :content="$t('personal.dataSyncTip')" @cancel="showWeightPopup = false"
			@ok="saveWeight">
			<picker-view class="picker-view" :value="tempWeightIndex" @change="onWeightChange">
				<picker-view-column>
					<view v-for="(item, index) in weightInteger" :key="index" class="picker-item">
						{{ item }}
					</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(item, index) in weightDecimal" :key="index" class="picker-item">
						{{ item }}
					</view>
				</picker-view-column>
			</picker-view>
		</confirm-popup>

		<!-- 社交媒体编辑弹窗 -->
		<confirm-popup :visible="showSocialPopup" :title="$t('personal.socialMediaTip')" :content="$t('personal.dataSyncTip')" @cancel="showSocialPopup = false"
			@ok="saveSocial">
			<view class="social-inputs">
				<view class="input-group">
					<view class="input-label">WhatsApp</view>
					<input class="social-input" type="text" :placeholder="$t('personal.enterWhatsapp')" v-model="tempSocialData.whatsapp" />
				</view>
				<view class="input-group">
					<view class="input-label">X (Twitter)</view>
					<input class="social-input" type="text" :placeholder="$t('personal.enterX')" v-model="tempSocialData.x" />
				</view>
				<view class="input-group">
					<view class="input-label">Telegram</view>
					<input class="social-input" type="text" :placeholder="$t('personal.enterTelegram')" v-model="tempSocialData.tg" />
				</view>
			</view>
		</confirm-popup>
	</view>
</template>

<script>
import NavBack from '../../components/nav-back.vue'
import ConfirmPopup from '../../components/confirm-popup.vue'
import { userGetInfo, userEditInfo } from '../../apis/userApi.js'
import { commonUploadImage } from '../../apis/commonApi.js'
export default {
	components: {
		NavBack,
		ConfirmPopup,
	},
	data() {
		return {
			// 用户数据（对接接口字段）
			userInfo: {
				nickName: 'Sheryl',
				sex: 2, // 性别：1-男, 2-女
				age: '28',
				height: '178',
				weight: '69',
				headImg: '', // 头像URL
				whatsapp: '', // WhatsApp 账号
				x: '', // X (Twitter) 账号
				tg: '' // Telegram 账号
			},

			// 弹窗显示控制
			showNicknamePopup: false,
			showGenderPopup: false,
			showAgePopup: false,
			showHeightPopup: false,
			showWeightPopup: false,
			showSocialPopup: false,

			// 临时编辑数据
			tempNickname: '',
			tempGenderIndex: 0, // 临时选择的性别（0: 女, 1: 男）
			tempAgeIndex: 0,
			tempHeightIndex: [0, 0], // [整数索引, 小数索引]
			tempWeightIndex: [0, 0],
			tempSocialData: {
				whatsapp: '',
				x: '',
				tg: ''
			},

			// Picker 数据源
			// 性别选项数据（注意：接口字段 sex 存储数字：1-男, 2-女）
			genderOptions: [
				{ label: '女', value: 2, icon: '/static/personal_img/icon_woman@2x.webp' }, // 2-女
				{ label: '男', value: 1, icon: '/static/personal_img/icon_man@2x.webp' } // 1-男
			],
			ageRange: Array.from({ length: 100 }, (_, i) => i + 1), // 1-100岁
			heightInteger: Array.from({ length: 151 }, (_, i) => i + 100), // 100-250cm
			heightDecimal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // 小数部分
			weightInteger: Array.from({ length: 171 }, (_, i) => i + 30), // 30-200kg
			weightDecimal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] // 小数部分
		};
	},
	computed: {
		// 国际化的性别选项
		localizedGenderOptions() {
			return this.genderOptions.map(option => ({
				...option,
				label: option.value === 2
					? this.$t('personal.female')
					: this.$t('personal.male')
			}));
		}
	},
	onLoad() {
		this.getUserInfo();
	},
	methods: {
		// 获取用户信息
		async getUserInfo() {
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.showToast({
					title: this.$t('personal.pleaseLogin'),
					icon: 'none'
				});
				return;
			}

			const res = await userGetInfo({ token });
			if (res.data) {
				this.userInfo = res.data;
			}
		},

		// 上传头像
		async onChangeAvatar() {
			const res = await uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera']
			})

			const filePath = res.tempFilePaths[0]
			uni.showLoading({ title: this.$t('personal.uploading') })

			const data = await commonUploadImage(filePath)
			this.userInfo.headImg = data.data.url

			uni.hideLoading()
			uni.showToast({ title: this.$t('personal.uploadSuccess'), icon: 'success' })
		},

		// 打开昵称弹窗
		openNicknamePopup() {
			this.tempNickname = this.userInfo.nickName;
			this.showNicknamePopup = true;
		},

		// 保存昵称
		saveNickname() {
			if (this.tempNickname.trim()) {
				this.userInfo.nickName = this.tempNickname.trim();
			}
			this.showNicknamePopup = false;
		},

		// 打开性别弹窗
		openGenderPopup() {
			// 根据当前性别值设置索引（0: 女, 1: 男）
			// 注意：sex 字段存储数字：1-男, 2-女
			this.tempGenderIndex = this.userInfo.sex === 1 ? 1 : 0;
			this.showGenderPopup = true;
		},

		// 保存性别
		saveGender() {
			// 存储数字：1-男, 2-女
			this.userInfo.sex = this.genderOptions[this.tempGenderIndex].value;
			this.showGenderPopup = false;
		},

		// 打开年龄弹窗
		openAgePopup() {
			const age = parseInt(this.userInfo.age) || 28;
			this.tempAgeIndex = this.ageRange.indexOf(age);
			if (this.tempAgeIndex === -1) this.tempAgeIndex = 27; // 默认28岁
			this.showAgePopup = true;
		},

		// 年龄改变
		onAgeChange(e) {
			this.tempAgeIndex = e.detail.value[0];
		},

		// 保存年龄
		saveAge() {
			this.userInfo.age = this.ageRange[this.tempAgeIndex].toString();
			this.showAgePopup = false;
		},

		// 打开身高弹窗
		openHeightPopup() {
			const height = parseFloat(this.userInfo.height) || 170.0;
			const integer = Math.floor(height);
			const decimal = Math.round((height - integer) * 10);

			const integerIndex = this.heightInteger.indexOf(integer);
			const decimalIndex = this.heightDecimal.indexOf(decimal);

			this.tempHeightIndex = [
				integerIndex !== -1 ? integerIndex : 70,
				decimalIndex !== -1 ? decimalIndex : 0
			];
			this.showHeightPopup = true;
		},

		// 身高改变
		onHeightChange(e) {
			this.tempHeightIndex = e.detail.value;
		},

		// 保存身高
		saveHeight() {
			const integer = this.heightInteger[this.tempHeightIndex[0]];
			const decimal = this.heightDecimal[this.tempHeightIndex[1]];
			this.userInfo.height = decimal === 0 ? `${integer}` : `${integer}.${decimal}`;
			this.showHeightPopup = false;
		},

		// 打开体重弹窗
		openWeightPopup() {
			const weight = parseFloat(this.userInfo.weight) || 65.0;
			const integer = Math.floor(weight);
			const decimal = Math.round((weight - integer) * 10);

			const integerIndex = this.weightInteger.indexOf(integer);
			const decimalIndex = this.weightDecimal.indexOf(decimal);

			this.tempWeightIndex = [
				integerIndex !== -1 ? integerIndex : 35,
				decimalIndex !== -1 ? decimalIndex : 0
			];
			this.showWeightPopup = true;
		},

		// 体重改变
		onWeightChange(e) {
			this.tempWeightIndex = e.detail.value;
		},

		// 保存体重
		saveWeight() {
			const integer = this.weightInteger[this.tempWeightIndex[0]];
			const decimal = this.weightDecimal[this.tempWeightIndex[1]];
			this.userInfo.weight = decimal === 0 ? `${integer}` : `${integer}.${decimal}`;
			this.showWeightPopup = false;
		},

		// 判断是否已填写社交媒体信息
		hasSocialInfo() {
			return !!(this.userInfo.whatsapp || this.userInfo.x || this.userInfo.tg);
		},

		// 打开社交媒体弹窗
		openSocialPopup() {
			this.tempSocialData = {
				whatsapp: this.userInfo.whatsapp || '',
				x: this.userInfo.x || '',
				tg: this.userInfo.tg || ''
			};
			this.showSocialPopup = true;
		},

		// 保存社交媒体信息
		saveSocial() {
			this.userInfo.whatsapp = this.tempSocialData.whatsapp.trim();
			this.userInfo.x = this.tempSocialData.x.trim();
			this.userInfo.tg = this.tempSocialData.tg.trim();
			this.showSocialPopup = false;
		},

		// 保存所有数据
		async submitSave() {
			uni.showLoading({
				title: this.$t('personal.saving')
			});

			console.log("保存数据", this.userInfo)
			const res = await userEditInfo(this.userInfo);

			uni.hideLoading();

			if (res.code === 200 || res.success) {
				uni.showToast({
					title: this.$t('personal.saveSuccess'),
					icon: 'success'
				});
			} else {
				uni.showToast({
					title: res.message || this.$t('personal.saveFailed'),
					icon: 'none'
				});
			}
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

// 弹窗输入框样式
.popup-input {
	width: 560rpx;
	height: 87rpx;
	border-radius: 8rpx;
	padding: 0 20rpx;
	font-size: 32rpx;
	color: $black-1;
	margin: 0 auto;
	background-color: #F8FAF9;
}

// Picker view 样式
.picker-view {
	width: 100%;
	height: 400rpx;
}

.picker-item {
	line-height: 72rpx;
	text-align: center;
}

// 性别选择列表
.gender-list {
	width: 100%;
	padding: 20rpx 0;

	.gender-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 106rpx;
		border-bottom: 1rpx solid #EAEAEA;
		margin: 0 44rpx;

		&:last-child {
			border-bottom: none;
		}

		.gender-left {
			display: flex;
			align-items: center;

			.gender-icon {
				width: 50rpx;
				height: 50rpx;
				margin-right: 26rpx;
			}

			.gender-label {
				font-size: 33rpx;
				font-weight: 500;
				color: #9CA29D; // 非选中颜色

				&.selected {
					color: #1E211F; // 选中颜色
				}
			}
		}

		.radio-icon {
			width: 44rpx;
			height: 44rpx;
		}
	}
}

// 社交媒体输入框
.social-inputs {
	width: 90%;

	.input-group {
		margin-bottom: 30rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.input-label {
			font-size: 28rpx;
			color: #1E211F;
			margin-bottom: 16rpx;
			font-weight: 500;
		}

		.social-input {
			width: 100%;
			height: 87rpx;
			border-radius: 8rpx;
			padding: 0 20rpx;
			font-size: 32rpx;
			color: #1E211F;
			background: #F8FAF9;
			box-sizing: border-box;
		}
	}
}
</style>