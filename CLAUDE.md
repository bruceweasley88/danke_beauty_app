# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 **uni-app 跨平台移动应用**项目。Uni-app 是基于 Vue.js 的框架，可以从单一代码库构建多平台应用：
- 移动应用（iOS/Android）

**技术栈：**
- 框架：uni-app（基于 Vue 2，兼容3）
- 样式：SCSS，使用 rpx 单位实现响应式布局
- 构建：通过 HBuilderX IDE 或 uni-app CLI 管理（无 package.json）

## 开发指南

### 运行项目
本项目不使用 npm/package.json。通常通过以下方式开发：
- **HBuilderX IDE**：导入项目并运行到各个平台
- **uni-app CLI**：如果使用 CLI 初始化，使用标准的 uni-app 构建命令

### 构建
通过以下方式生成平台特定的构建：
- HBuilderX："发行" 菜单 → 选择目标平台
- CLI：使用不同平台的 `uni build` 命令

## 架构说明

### 核心配置文件
- **`manifest.json`**：平台特定设置、权限和模块配置
  - 定义可用的原生模块（已配置蓝牙、相机）
  - iOS/Android/小程序的平台特定构建设置
  - 实际部署时需更新 `appid` 字段

- **`pages.json`**：路由配置和全局样式
  - pages 数组定义所有应用页面
  - 第一个条目是应用启动页
  - `globalStyle` 设置默认导航栏外观

- **`uni.scss`**：全局 SCSS 变量，用于组件间一致的主题

- **`uni.promisify.adaptor.js`**：将 uni-app 回调风格的 API 转换为基于 Promise 的 API

### 应用结构
```
├── App.vue              # 根组件，包含应用生命周期钩子
├── main.js              # 入口文件（处理 Vue 2 和 Vue 3）
├── pages/               # 页面组件
│   └── index/           # 每个页面在各自目录中
│       └── index.vue    # 页面组件
└── static/              # 静态资源（图片、字体等）
```

### 代码模式

**条件编译：**
Uni-app 使用特殊注释进行平台特定代码编写：
```javascript
// #ifndef VUE3  // 仅在 Vue 2 中执行的代码
// #endif

// #ifdef VUE3  // 仅在 Vue 3 中执行的代码
// #endif

// #ifdef APP-PLUS  // 仅在原生应用中执行的代码
// #endif

// #ifdef MP-WEIXIN  // 仅在微信小程序中执行的代码
// #endif
```

**生命周期钩子：**
- 在 `App.vue` 中使用 uni-app 特定的生命周期钩子：`onLaunch`、`onShow`、`onHide`
- 页面生命周期钩子：`onLoad`、`onShow`、`onReady`、`onHide`、`onUnload`

**响应式单位：**
- 使用 `rpx` 单位进行布局（响应式像素：750rpx = 屏幕宽度）
- 自动在不同屏幕尺寸下缩放

**API 调用：**
- 使用 `uni.*` API 而不是浏览器/web API（例如使用 `uni.request` 而不是 `fetch`）
- 回调风格的 API 可以使用 promisify 适配器转换为 promise

### 模块配置
在 `manifest.json` 中配置的原生模块：
- **蓝牙（Bluetooth）**：可用于 iOS/Android 应用
- **相机（Camera）**：可用于 iOS/Android 应用
- 需要在平台特定配置中设置相应权限

### 平台注意事项
- 移动应用配置了带自动关闭的启动屏幕

### 设计系统配色

**主要颜色：**
- 绿色系：#09AB4D（绿1）、#2EC96F（绿2）、#81FD95（导航选中）、#9FF0AE、#F3FFF7
- 黑灰色系：#1E211F（黑1）、#5F7564（黑2）、#9CA29D（黑3）、#C2C9C3（黑4）、#F8FAF9（黑5）

**全局背景渐变：**
```css
background: linear-gradient(180deg, #A1FFE5 0%, #DBFFE5 28.37%, #F3FFF6 50.48%, #F1F3F4 72.6%, #F1F3F4 100%);
```
- 方向：从上到下（180deg）
- 效果：顶部浅青绿色 → 底部白色渐变
