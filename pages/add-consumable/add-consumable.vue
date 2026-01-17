<template>
  <view class="page-container">
    <nav-back :title="title"></nav-back>
    <view class="modal-wrapper">
      <view class="modal-card-container">
        <consumable-modal-card :type="type" @cancel="onCancel" @add="onAdd" />
      </view>
    </view>
  </view>
</template>

<script>
import NavBack from '../../components/nav-back.vue'
import ConsumableModalCard from '../../components/consumable-modal-card.vue'

export default {
  components: {
    NavBack,
    ConsumableModalCard,
  },
  data() {
    return {
      type: 'mask'
    };
  },
  computed: {
    title() {
      const titleMap = {
        mask: 'AI面膜',
        spray: '补水喷雾器',
        importer: '美容导入仪',
        bra: 'AI文胸'
      };
      return titleMap[this.type] || 'AI面膜';
    }
  },
  onLoad(options) {
    if (options.type) {
      this.type = options.type;
    }
  },
  methods: {
    onCancel() {
      uni.navigateBack();
    },
    onAdd() {
      uni.navigateTo({
        url: '/pages/sn/sn'
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.page-container {
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
  padding-bottom: 120rpx;
}

.modal-card-container {
  width: 100%;
  background-color: #ffffff;
  border-radius: 60rpx;
  padding: 80rpx 48rpx 64rpx;
  box-shadow: 0 12rpx 48rpx rgba(0, 0, 0, 0.04);
}
</style>