import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户
    user: {
      root: 0
    },
    // 购物车
    cart: []
  },
  getters: {},
  mutations: {
    // 登录
    doLogin(state, user) {
      state.user = user
    },
    // 登出
    doLogout(state) {
      state.user = {
        root: 0
      }
    },
    // 添加商品进购物车
    addCart(state, good) {
      state.cart.push(good)
    },
    // 增加购物车数量
    addCount(state, index) {
      state.cart[index].count++
    },
    // 减少购物车数量
    reduceCount(state, index) {
      if (state.cart[index].count == 1) {
        state.cart.splice(index, 1)
      } else {
        state.cart[index].count--
      }
    },
    // 清空购物车
    clearCart(state) {
      state.cart = []
    }
  },
  actions: {},
  modules: {}
})
