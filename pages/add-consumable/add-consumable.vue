<template>
  <view class="page-container">
    <nav-back title="AI面膜"></nav-back>
    <view class="modal-wrapper">
      <view class="modal-card">

        <view class="qr-icon-placeholder">
          <view class="inner-icon"></view>
        </view>

        <view class="content-box">
          <view class="main-title">请扫码添加面膜</view>
          <view class="sub-description">
            <view>添加面膜后，才可开启使用仪器。</view>
            <view>每使用一次耗材可以获得对应的积分，直到耗材使用完毕。</view>
          </view>
        </view>

        <view class="action-group">
          <button class="btn btn-secondary" @tap="onCancel">暂不添加</button>
          <button class="btn btn-primary" @tap="onAdd">添加面膜</button>
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
    return {};
  },
  methods: {
    onCancel() {
      // 处理暂不添加逻辑
      uni.navigateBack();
    },
    onAdd() {
      // 处理扫码逻辑
      console.log('触发扫码添加');
    }
  }
};
</script>

<style lang="scss" scoped>
/* 颜色变量定义 */
$black-1: #1E211F; // 主文字/主按钮
$black-3: #9CA29D; // 辅助描述文字
$black-4: #C2C9C3; // 浅色按钮文字
$black-5: #F8FAF9; // 浅色按钮背景

.page-container {
  /* 容器撑满全屏，确保内容能居中 */
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.modal-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 64rpx;
  /* 略微上移，符合视觉重心平衡 */
  padding-bottom: 120rpx;
}

.modal-card {
  width: 100%;
  background-color: #ffffff;
  border-radius: 60rpx;
  padding: 80rpx 48rpx 64rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 12rpx 48rpx rgba(0, 0, 0, 0.04);

  .qr-icon-placeholder {
    width: 130rpx;
    height: 130rpx;
    border-radius: 20rpx;
    margin-bottom: 48rpx;
    position: relative;
    background-image: url('/static/device_img/icon_saoma.png');
    background-size: cover;
  }

  .content-box {
    text-align: center;
    margin-bottom: 64rpx;

    .main-title {
      font-size: 42rpx;
      font-weight: bold;
      color: $black-1;
      margin-bottom: 24rpx;
      letter-spacing: 2rpx;
    }

    .sub-description {
      font-size: 28rpx;
      color: $black-3;
      line-height: 1.6;

      view {
        margin-bottom: 4rpx;
      }
    }
  }

  .action-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 28rpx;

    .btn {
      flex: 1;
      height: 104rpx;
      line-height: 104rpx;
      border-radius: 52rpx;
      font-size: 32rpx;
      font-weight: 500;
      transition: opacity 0.2s;

      // 消除uniapp默认边框
      &::after {
        border: none;
      }

      &:active {
        opacity: 0.8;
      }

      &.btn-secondary {
        background-color: $black-5;
        color: $black-4;
      }

      &.btn-primary {
        background-color: $black-1;
        color: #ffffff;
      }
    }
  }
}
</style>