<template>
  <div class="login">
    <div class="login-content">
      <img src="../../public/images/00245-3553923336-.png" />
      <div class="login-box">
        <h1>404 您的页面走丢了</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fef9f6;
  .login-content {
    width: 900px;
    height: 500px;
    display: flex;
    // justify-content: space-around;
    align-items: center;
    .login-box {
      width: 300px;
      height: 300px;
      //   background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }
  }
}
</style>
