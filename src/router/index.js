import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import Login from '@/views/Login'
import manage from '@/views/manage'
import screen from '@/views/screenView'
import order from '@/views/orderView'
import good from '@/views/goodView'
import purchase from '@/views/purchaseView'
import material from '@/views/materialView'
import notFound from '@/views/NotFound'

Vue.use(VueRouter)

// 解决重复点击跳转路由报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const routes = [
  { path: '/', component: Login, redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/manage',
    component: manage,
    meta: { requireAuth: true },
    redirect: '/manage/screen',
    children: [
      { path: 'screen', component: screen, meta: { requireAuth: true } },
      { path: 'order', component: order, meta: { requireAuth: true } },
      { path: 'good', component: good, meta: { requireAuth: true } },
      { path: 'purchase', component: purchase, meta: { requireAuth: true } },
      { path: 'material', component: material, meta: { requireAuth: true } }
    ]
  },
  { path: '*', component: notFound }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user.root < 1) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
