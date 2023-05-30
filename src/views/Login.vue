<template>
  <div class="login">
    <div class="login-content">
      <img src="../../public/images/00245-3553923336-.png" />
      <div class="login-box">
        <h3>碧波奶茶管理系统</h3>
        <div>
          <span>账户：</span>
          <el-input
            style="width: 240px"
            label="账户"
            v-model="account.user_phone"
            placeholder="请输入账户"
          ></el-input>
        </div>
        <div>
          <span>密码：</span>
          <el-input
            style="width: 240px"
            type="password"
            v-model="account.user_pwd"
            placeholder="请输入密码"
            @keyup.native.enter="login"
          ></el-input>
        </div>
        <el-button type="warning" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      account: {
        user_phone: '',
        user_pwd: ''
      }
    }
  },
  methods: {
    ...mapMutations(['doLogin']),
    async login() {
      const { data: res } = await this.$http.post(
        '/api/user/login',
        this.account
      )
      if (res.meta.status == 201)
        return this.$showMsg('账号或密码错误，请重新输入', '登陆失败')
      if (res.meta.status == 500) return this.$showMsg()
      if (res.data.user.user_root < 1)
        return this.$showMsg('很抱歉，您的权限不足', '登陆失败')
      this.doLogin(res.data.user)
      this.$router.push('/manage')
    }
  },
  mounted() {}
}
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
