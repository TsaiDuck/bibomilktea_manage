<template>
  <div class="screen">
    <div class="screen-item">
      <h1>排队中</h1>
      <br />
      <span
        v-for="item in orderList.filter((i) => i.order_state == '已下单')"
        :key="item.order_id"
        >{{ item.order_dayId }}</span
      >
    </div>
    <div class="screen-item">
      <h1>制作中</h1>
      <br />
      <span
        v-for="item in orderList.filter((i) => i.order_state == '制作中')"
        :key="item.order_id"
        >{{ item.order_dayId }}</span
      >
    </div>
    <div class="screen-item" style="border-right: 0">
      <h1>待取餐</h1>
      <br />
      <span
        v-for="item in orderList.filter((i) => i.order_state == '待取餐')"
        :key="item.order_id"
        >{{ item.order_dayId }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderList: []
    }
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('/api/today/order')
      this.orderList = res.data
    }
  },
  mounted() {
    this.getOrderList()
  },
  sockets: {
    newOrder() {
      this.getOrderList()
    }
  }
}
</script>

<style lang="less" scoped>
.screen {
  width: 100%;
  height: 100%;
  background-color: #404040;
  display: flex;
  .screen-item {
    width: 33.33%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #eee;
    font-size: 30px;
    overflow: hidden;
    box-sizing: border-box;
    border-right: 1px solid #fff;
  }
}
</style>
