<template>
  <view class="modal-card">
    <view class="qr-icon-placeholder">
      <view class="inner-icon"></view>
    </view>

    <view class="content-box">
      <view class="main-title">请扫码添加{{ typeName }}SN码</view>
      <view class="sub-description">
        <view>添加{{ typeName }}SN码后，可获得对应的积分</view>
        <view>获取到的积分信息可以在耗材记录中查看</view>
      </view>
    </view>

    <view class="action-group">
      <button v-if="showCancel" class="btn btn-secondary" @tap="onCancel">暂不添加</button>
      <button class="btn btn-primary" @tap="onAdd">扫描添加</button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['mask', 'spray', 'bra', 'importer'].includes(value)
    },
    showCancel: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    typeName() {
      const typeMap = {
        mask: '面膜',
        spray: '喷雾器',
        bra: '文胸',
        importer: '美容导入仪'
      };
      return typeMap[this.type] || '面膜';
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    onAdd() {
      this.$emit('add');
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

.modal-card {
  display: flex;
  flex-direction: column;
  align-items: center;

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
