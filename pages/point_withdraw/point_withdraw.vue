<template>
  <view class="page">
    <nav-back :title="$t('pointWithdraw.title')"></nav-back>

    <view class="body">
      <view class="balance-section">
        <text class="label">{{ $t('pointWithdraw.exchangePoints') }}</text>
        <view class="points-display">
          <image class="coin-icon" src="/static/me_img/icon_coinb@2x.png" mode="aspectFit"></image>
          <text class="points-num">{{ userInfo.hst || 0 }}</text>
        </view>
      </view>

      <view class="withdraw-card">
        <view class="card-item">
          <text class="card-label">{{ $t('pointWithdraw.withdrawPoints') }}</text>
          <view class="input-row">
            <view class="input-left">
              <image class="coin-icon-sm" src="/static/me_img/icon_coinb@2x.png" mode="aspectFit"></image>
              <input class="points-input" type="digit" v-model="inputPoints" @blur="validatePoints" />
            </view>
            <text class="withdraw-all" @tap="inputPoints = userInfo.hst">{{ $t('pointWithdraw.withdrawAll') }}</text>
          </view>
        </view>

        <view class="divider"></view>

        <view class="card-item wallet-row" @tap="goToBindWallet">
          <text class="card-label">{{ $t('pointWithdraw.wallet') }}</text>
          <view class="wallet-right">
            <text class="bind-text" v-if="!userInfo.walletAddress">{{ $t('pointWithdraw.bindWalletAddress') }}</text>
            <text class="bind-text address-text" v-else>{{ userInfo.walletAddress }}</text>
            <text class="arrow">></text>
          </view>
        </view>
      </view>

      <view class="action-section">
        <button class="withdraw-btn" @tap="doWithdraw">{{ $t('pointWithdraw.goToWithdraw') }}</button>
        <text class="tips">{{ $t('pointWithdraw.tips') }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import NavBack from '../../components/nav-back.vue';

import { userGetInfo } from '../../apis/userApi.js';
import { coinRecordWithdraw } from '../../apis/coinRecordApi.js';

export default {
  components: {
    NavBack
  },
  data() {
    return {
      userInfo: {},
      inputPoints: ''
    };
  },
  onShow() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      const res = await userGetInfo();
      this.userInfo = res.data;
      this.inputPoints = this.userInfo.hst || 0;
    },
    validatePoints() {
      const points = Number(this.inputPoints);
      if (points > this.userInfo.hst) {
        this.inputPoints = this.userInfo.hst;
        uni.showToast({ title: this.$t('pointWithdraw.insufficientPoints'), icon: 'none' });
      }
    },
    goToBindWallet() {
      uni.navigateTo({ url: '/pages/wallet/wallet?type=address' });
    },
    doWithdraw() {
      if (!this.userInfo.walletAddress) {
        uni.navigateTo({ url: '/pages/wallet/wallet?type=address' });
        return;
      }

      const points = Number(this.inputPoints);
      if (!points || points <= 0) {
        uni.showToast({ title: this.$t('pointWithdraw.enterValidPoints'), icon: 'none' });
        return;
      }

      if (points > this.userInfo.hst) {
        uni.showToast({ title: this.$t('pointWithdraw.insufficientPoints'), icon: 'none' });
        return;
      }

      coinRecordWithdraw({ coinNum: points }).then(res => {
        uni.navigateTo({ url: '/pages/success/success' });
        this.getUserInfo();
      });
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  width: 100vw;
  min-height: 100vh;
  background-image: url('/static/img/bg_point.webp');
  background-size: contain;
}

.body {
  display: flex;
  flex-direction: column;
  padding: 40rpx 30rpx;

}

// 余额部分
.balance-section {
  margin-top: 20rpx;
  margin-bottom: 40rpx;

  .label {
    font-size: 28rpx;
    color: #222222;
    display: block;
    margin-bottom: 20rpx;
    font-weight: 500;
  }

  .points-display {
    display: flex;
    align-items: center;

    .coin-icon {
      width: 60rpx;
      height: 60rpx;
      margin-right: 20rpx;
    }

    .points-num {
      font-size: 72rpx;
      font-weight: bold;
      font-family: 'Alibaba Sans'; // 建议使用加粗字体
      color: #1E211F;
    }
  }
}

// 提现卡片
.withdraw-card {
  background-color: #fff;
  border-radius: 29rpx;
  padding: 30rpx;
  margin-bottom: 60rpx;

  .card-item {
    display: flex;
    flex-direction: column;
  }

  .card-label {
    font-size: 26rpx;
    color: #222222;
    margin-bottom: 24rpx;
    font-weight: 500;
  }

  .input-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .input-left {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .coin-icon-sm {
      width: 44rpx;
      height: 44rpx;
      margin-right: 12rpx;
    }

    .points-input {
      font-size: 48rpx;
      font-weight: bold;
      width: 300rpx;
      color: #FF7818; // 原图中500的颜色
    }

    .withdraw-all {
      font-size: 28rpx;
      font-weight: 500;
      color: #09AB4D;
    }
  }


  .wallet-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 18rpx;

    .card-label {
      margin-bottom: 0;
    }

    .wallet-right {
      display: flex;
      align-items: center;

      .bind-text {
        font-size: 28rpx;
        color: #8E8F94;

        &.address-text {
          max-width: 470rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .arrow {
        color: #8E8F94;
        margin-left: 10rpx;
        font-size: 32rpx;
      }
    }
  }
}

// 底部按钮与提示
.action-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40rpx;

  .withdraw-btn {
    // 应用你提供的样式
    color: #1C1F2A;
    font-size: 22px;
    font-weight: bold;
    height: 117rpx;
    line-height: 117rpx;
    width: 663rpx;
    border-radius: 16px;
    background: linear-gradient(90deg, #38FFA7 0%, #45F6FF 100%);
    text-align: center;
    font-family: 'Alibaba Medium';
    margin-bottom: 30rpx;
    border: none;

    // 去除button默认边框
    &::after {
      border: none;
    }
  }

  .tips {
    font-size: 24rpx;
    color: #535459;
    text-align: center;
  }
}
</style>