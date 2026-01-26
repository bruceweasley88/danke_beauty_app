<template>
  <view class="custom-tab-bar">
    <view
      v-for="item in list"
      :key="item.pagePath"
      class="tab-item click-active"
      :class="{ active: activePage === item.pagePath }"
      @click="switchTab(item)"
    >
      <image :src="activePage === item.pagePath ? item.selectedIconPath : item.iconPath" />
      <text>{{ $t(item.textKey) }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    active: {
      type: String,
      default: 'index'
    }
  },
  data() {
    return {
      list: [
        {
          pagePath: 'pages/index/index',
          textKey: 'tabBar.home',
          iconPath: '/static/nav_img/icon_homenc.png',
          selectedIconPath: '/static/nav_img/icon_homec.png'
        },
        {
          pagePath: 'pages/me/me',
          textKey: 'tabBar.me',
          iconPath: '/static/nav_img/icon_mync.png',
          selectedIconPath: '/static/nav_img/icon_myc.png'
        }
      ]
    }
  },
  computed: {
    activePage() {
      return 'pages/' + this.active + '/' + this.active
    }
  },
  methods: {
    switchTab(item) {
      if (this.activePage !== item.pagePath) {
        uni.switchTab({ url: '/' + item.pagePath })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-top: 1px solid #F8FAF9;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 999;
  // 安全区域适配
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // 最小高度确保视觉一致性
    min-height: 50px;
    padding: 16px 0;

    image {
      width: 24px;
      height: 24px;
      margin-bottom: 4px;
    }

    text {
      font-size: 12px;
      color: #1E211F;
    }

    &.active text {
      color: #09AB4D;
    }
  }
}
</style>
