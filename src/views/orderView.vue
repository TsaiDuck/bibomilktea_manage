<template>
  <div class="order" ref="order">
    <!-- 订单筛选 -->
    <div class="order-selector">
      <div
        :class="['selector-item', active == 'underway' ? 'active' : '']"
        @click="changeActive('underway')"
      >
        进行中订单
      </div>
      <div
        :class="['selector-item', active == 'finished' ? 'active' : '']"
        @click="changeActive('finished')"
      >
        已完成订单
      </div>
      <div
        :class="['selector-item', active == 'history' ? 'active' : '']"
        @click="changeActive('history')"
      >
        历史订单
      </div>
    </div>
    <!-- 订单展示 -->
    <div class="order-box">
      <!-- 标题 -->
      <div class="order-title">
        <span class="order-space"></span>
        <div class="order-title-item">订单号</div>
        <div class="order-title-item">下单时间</div>
        <div class="order-title-item">订单状态</div>
        <div class="order-title-item">操作</div>
        <!-- 查找器 -->
        <div class="search" v-if="active == 'history'">
          <el-input
            v-model="searchOrderVal"
            size="small"
            placeholder="请输入订单号"
            @input="getSearchOrder"
          ></el-input>
        </div>
      </div>
      <!-- 内容 -->
      <div
        class="order-content"
        :style="{
          height: active == 'history' ? boxHeight - 45 + 'px' : boxHeight + 'px'
        }"
      >
        <!-- 进行中订单 -->
        <order
          v-if="active == 'underway'"
          v-for="item in orderListToday.filter(
            (i) =>
              i.order_state == '已下单' ||
              i.order_state == '制作中' ||
              i.order_state == '待取餐'
          )"
          :key="item.order_id"
          :orderInfo="item"
          @stateChange="stateChange($event)"
        ></order>
        <!-- 已完成订单 -->
        <order
          v-if="active == 'finished'"
          v-for="item in orderListToday.filter(
            (i) => i.order_state == '已完成' || i.order_state == '已取消'
          )"
          :key="item.order_id"
          :orderInfo="item"
          @stateChange="stateChange($event)"
        ></order>
        <!-- 历史订单 -->
        <historyOrder
          v-if="active == 'history'"
          v-for="item in orderListHistory"
          :key="item.order_id"
          :orderInfo="item"
        ></historyOrder>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="page-selector" v-if="active == 'history'">
      <span
        class="el-icon-arrow-left"
        @click="deletePage"
        style="cursor: pointer"
      ></span>
      <span>{{ getAllOrderVal.page }}</span>
      <span
        class="el-icon-arrow-right"
        @click="addPage"
        style="cursor: pointer"
      ></span>
    </div>
  </div>
</template>

<script>
import order from '@/components/order.vue'
import historyOrder from '@/components/historyOrder.vue'
export default {
  components: {
    order,
    historyOrder
  },
  data() {
    return {
      active: 'underway',
      orderListToday: [],
      orderListHistory: [],
      getAllOrderVal: {
        limit: 12,
        page: 1
      },
      boxHeight: 0,
      searchOrderVal: '',
      timeout: null,
      webSock: null
    }
  },
  methods: {
    changeActive(val) {
      this.active = val
    },
    // 获取今日订单
    async getTodayOrder() {
      const { data: res } = await this.$http.get('/api/today/order')
      this.orderListToday = res.data
    },

    // 获取历史订单列表
    async getOrderList() {
      const { data: res } = await this.$http({
        method: 'post',
        url: '/api/get/allOrder',
        data: this.getAllOrderVal
      })
      this.orderListHistory = res.data
      // console.log(JSON.stringify(this.getAllOrderVal))
    },
    // 修改订单状态
    stateChange(value) {
      const index = this.orderListToday.findIndex(
        (item) => item.order_id == value.order_id
      )
      this.orderListToday[index].order_state = value.state
    },
    // 下一页
    addPage() {
      if (this.orderListHistory.length < this.getAllOrderVal.limit) {
        return
      } else {
        this.getAllOrderVal.page++
        this.getOrderList()
      }
    },
    // 上一页
    deletePage() {
      if (this.getAllOrderVal.page == 1) {
        return
      } else {
        this.getAllOrderVal.page--
        this.getOrderList()
      }
    },
    // 搜索订单
    getSearchOrder() {
      // let time
      if (this.searchOrderVal == '') {
        this.getOrderList()
      } else {
        if (this.timeout !== null) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.getSearchOrderList.apply(this)
        }, 800)
      }
    },
    // 获取搜索订单列表
    async getSearchOrderList() {
      const { data: res } = await this.$http.get(
        `/api/get/order/orderid?order_id=${this.searchOrderVal}`
      )
      if (res.meta.status !== 200) return this.$showMsg()
      this.orderListHistory = res.data
    },
    // 初始化 webSocket
    initWebSocket() {
      if (this.webSock) {
        this.webSock.close()
      }
      const url = 'wss://www.tsaiduck.cn/ws'
      this.webSock = new WebSocket(url)
      this.webSock.onopen = function () {
        console.log('connected to ' + url)
      }
      this.webSock.onmessage = function (event) {
        console.log(event)
      }
      this.webSock.onclose = function () {
        console.log('close connect to' + url)
      }
      this.webSock.addEventListener('error', function (event) {
        console.log('WebSocket error: ', event)
      })
    }
  },
  mounted() {
    this.getTodayOrder()
    this.boxHeight = this.$refs.order.offsetHeight - 95
    // this.initWebSocket()
    this.$socket.emit('hello', 'hello')
  },
  watch: {
    active(newVal) {
      if (newVal == 'history') {
        this.getAllOrderVal.page = 1
        this.getOrderList()
      } else {
        return
      }
    }
  },
  sockets: {
    newOrder(data) {
      this.getTodayOrder()
    }
  }
}
</script>

<style lang="less" scoped>
.order {
  width: 100%;
  height: 100%;
  position: relative;
  .page-selector {
    font-size: 18px;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .order-selector {
    display: flex;
    .selector-item {
      width: 33.33%;
      box-sizing: border-box;
      border-right: 2px solid #fff;
      color: #404040;
      background-color: #eee;
      text-align: center;
      height: 50px;
      line-height: 50px;
      cursor: pointer;
      font-size: 24px;
      &.active {
        color: orange;
        background-color: #fff;
      }
    }
  }
  .order-box {
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;
    .order-title {
      color: #606060;
      font-size: 18px;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      position: relative;
      .order-title-item {
        width: 20%;
        text-align: center;
      }
      .order-space {
        display: block;
        width: 20px;
      }
      .search {
        position: absolute;
        left: 20px;
        top: 40%;
        transform: translateY(-50%);
        width: 140px;
      }
    }
    .order-content {
      overflow-y: scroll;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }
  }
}
</style>
