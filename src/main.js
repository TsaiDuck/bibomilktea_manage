import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO('wss://www.tsaiduck.cn') //
  })
)
const http = axios.create({
  baseURL: 'https://www.tsaiduck.cn',
  timeout: 5000
})

function showMsg(msg, title) {
  this.$alert(msg || '请刷新重试', title || '数据请求失败', {
    confirmButtonText: '确定'
    // callback: (action) => {
    //   this.$message({
    //     type: 'info',
    //     message: `action: ${action}`
    //   })
    // }
  })
}

Vue.prototype.$http = http
Vue.prototype.$showMsg = showMsg

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
