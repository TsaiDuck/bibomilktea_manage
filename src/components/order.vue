<template>
  <div class="order-item">
    <!-- 简略订单 -->
    <div class="order-list">
      <b
        :class="[
          showDetail == true ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
        ]"
        style="cursor: pointer; display: block; width: 20px"
        title="查看详情"
        @click="openDetail"
      ></b>
      <span>{{ orderInfo.order_dayId }}</span>
      <span>{{ orderInfo.order_time.split(' ')[1] }}</span>
      <span>{{ orderInfo.order_state }}</span>
      <span
        :class="[
          orderInfo.order_state == ('已完成' || '已取消') ? '' : 'operate'
        ]"
        :title="operate"
        @click="changeState"
        >{{ operate }}</span
      >
    </div>
    <!-- 详细订单 -->
    <div class="order-info" v-if="showDetail">
      <!-- 订单信息 -->
      <div class="info-left">
        <div class="info-item">
          <span>订单编号：</span>
          <span>{{ orderInfo.order_id }}</span>
        </div>
        <div class="info-item">
          <span>取餐方式：</span>
          <span>{{ orderInfo.order_take_way }}</span>
        </div>
        <div class="info-item">
          <span>商品数量：</span>
          <span>{{ orderInfo.order_count }}</span>
        </div>
        <div class="info-item">
          <span>实付价格：</span>
          <span>{{ orderInfo.order_price.toFixed(2) }}</span>
        </div>
        <div class="info-item">
          <span>订单备注：</span>
          <span>{{ orderInfo.order_info }}</span>
        </div>
      </div>
      <!-- 商品信息 -->
      <div class="info-right">
        <span>订单详情：</span>
        <div class="right-item" v-for="item in cart" :key="item.cart_id">
          <span style="margin-right: 16px"
            >{{ item.good_count }}杯{{ item.good_name }}</span
          >
          <span
            >{{ item.good_size }}/{{ item.good_ice }}/{{ item.good_sugar
            }}<span v-if="item.good_etc !== ''"
              >/{{ item.good_etc }}</span
            ></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderInfo: {
      type: Object
    }
  },
  data() {
    return {
      operate: '开始制作',
      showDetail: false,
      cart: []
    }
  },
  methods: {
    async changeState() {
      if (this.orderInfo.order_state == '已完成') return
      if (this.orderInfo.order_state == '已取消') return
      let state
      switch (this.operate) {
        case '开始制作':
          state = '制作中'
          this.operate = '制作完成'
          break
        case '制作完成':
          state = '待取餐'
          this.operate = '取餐完成'
          break
        case '取餐完成':
          state = '已完成'
          this.operate = '订单已完成'
          break
        default:
          break
      }
      const { data: res } = await this.$http.get(
        `/api/update/order?order_id=${this.orderInfo.order_id}&order_state=${state}`
      )
      this.$emit('stateChange', { order_id: this.orderInfo.order_id, state })
    },
    async openDetail() {
      this.showDetail = !this.showDetail
      if (this.cart.length !== 0) return
      const { data: res } = await this.$http.get(
        `/api/orderid/cart?order_id=${this.orderInfo.order_id}`
      )
      if (res.meta.status !== 200) return this.$showMsg()
      this.cart = res.data
    }
  },
  mounted() {
    switch (this.orderInfo.order_state) {
      case '已下单':
        this.operate = '开始制作'
        break
      case '制作中':
        this.operate = '制作完成'
        break
      case '待取餐':
        this.operate = '取餐完成'
        break
      case '已完成':
        this.operate = '订单已完成'
        break
      case '已取消':
        this.operate = '订单已取消'
        break
    }
  }
}
</script>

<style lang="less" scoped>
.order-item {
  width: 100%;
  &:hover {
    background-color: #eee;
  }
  .order-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #eee;
    span {
      display: block;
      width: 20%;
      margin-top: 5px;
      text-align: center;
      height: 35px;
      line-height: 35px;
      &.operate {
        cursor: pointer;
        color: orange;
        text-decoration: underline;
      }
    }

    .el-icon-arrow-right {
      display: block;
      width: 20px;
      text-align: center;
    }
  }
  .order-info {
    width: 80%;
    margin: 8px 0;
    margin-left: 50px;
    display: flex;
    justify-content: space-around;
    color: #909090;
    .info-left {
      width: 20%;
    }
    .info-right {
      width: 70%;
    }
  }
}
</style>
