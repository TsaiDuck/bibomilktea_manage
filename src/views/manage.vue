<template>
  <div class="manage">
    <navbar></navbar>
    <div class="manage-content">
      <sidebar :style="{ height: windowHeight - 70 + 'px' }"></sidebar>
      <div
        class="manage-box"
        :style="{
          width: windowWidth - 120 + 'px',
          height: windowHeight - 70 + 'px'
        }"
      >
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar'
import sidebar from '@/components/sidebar'
export default {
  components: {
    sidebar,
    navbar
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight - 1
    }
  }
}
</script>

<style lang="less" scoped>
.manage {
  width: 100%;
  height: 100%;
  .manage-content {
    display: flex;
  }
}
</style>
