<template>
  <div class="sidebar">
    <!-- 大屏幕 -->
    <div class="sidebar-item">
      <span
        title="大屏幕"
        :class="[active == 'screen' ? 'active' : '']"
        @click="navigatorTo('/manage/screen')"
        >大屏幕</span
      >
    </div>
    <!-- 点餐 -->
    <div class="sidebar-item">
      <span
        title="点餐"
        :class="[active == 'purchase' ? 'active' : '']"
        @click="navigatorTo('/manage/purchase')"
        >点餐</span
      >
    </div>
    <!-- 订单 -->
    <div class="sidebar-item">
      <span
        title="订单"
        :class="[active == 'order' ? 'active' : '']"
        @click="navigatorTo('/manage/order')"
        >订单</span
      >
    </div>
    <!-- 商品管理 -->
    <div class="sidebar-item">
      <span
        title="商品管理"
        :class="[active == 'good' ? 'active' : '']"
        @click="navigatorTo('/manage/good')"
        >商品管理</span
      >
    </div>
    <!-- 物料管理 -->
    <div class="sidebar-item">
      <span
        title="物料管理"
        :class="[active == 'material' ? 'active' : '']"
        @click="navigatorTo('/manage/material')"
        >物料管理</span
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: this.$route.path.split('/')[2]
    }
  },
  methods: {
    navigatorTo(path) {
      const charts = path.split('/')
      this.active = charts[2]
      this.$router.push(path)
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar {
  width: 120px;
  height: 100%;
  background-color: #f7b52c;
  .sidebar-item {
    width: 100%;
    height: 60px;
    // background-color: yellow;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #000;
    .active {
      color: #fff;
    }
    span {
      cursor: pointer;
      &:hover {
        color: #fff;
      }
    }
  }
}
</style>
