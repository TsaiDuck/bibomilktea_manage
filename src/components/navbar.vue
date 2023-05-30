<template>
  <div class="navbar">
    <div class="left">
      <img
        src="../../public/images/00245-3553923336--removebg-preview.png"
        class="navbar-img"
      />
      <i>碧波奶茶管理</i>
    </div>
    <b class="el-icon-switch-button" title="退出" @click="logout"></b>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['doLogout']),
    logout() {
      this.doLogout()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  width: 100%;
  height: 70px;
  background-color: #f7b52c;
  font-size: 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;
  box-sizing: border-box;
  padding: 0 30px;
  .left {
    display: flex;
    align-items: center;
    .navbar-img {
      width: 60px;
      height: 60px;
      margin-right: 30px;
    }
  }
  .el-icon-switch-button {
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }
}
</style>
