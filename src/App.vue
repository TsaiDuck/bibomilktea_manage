<template>
  <div id="app" class="app" ref="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      windowWidth: window.innerWidth + 'px',
      windowHeight: window.innerHeight - 1 + 'px'
    }
  },
  mounted() {
    this.$refs.app.style.width = window.innerWidth + 'px'
    this.$refs.app.style.height =
      document.documentElement.clientHeight - 1 + 'px'
    const _this = this
    window.onresize = () => {
      return (() => {
        _this.windowWidth = window.innerWidth + 'px'
        _this.windowHeight = window.innerHeight - 1 + 'px'
      })()
    }
  },
  watch: {
    windowWidth() {
      if (!this.timer) {
        this.timer = true
        let _this = this
        setTimeout(function () {
          _this.$refs.app.style.width = _this.windowWidth
          _this.timer = false
        }, 500)
      }
    },
    windowHeight() {
      if (!this.timer) {
        this.timer = true
        let _this = this
        setTimeout(function () {
          _this.$refs.app.style.height = _this.windowHeight
          _this.timer = false
        }, 500)
      }
    }
  },
  beforeDestroy() {
    if (!this.$socket) return
    this.$socket.close()
  }
}
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
}
</style>
