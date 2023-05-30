<template>
  <div class="purchase">
    <!-- 选餐 -->
    <div class="order">
      <purchase
        v-for="item in goodList"
        :key="item.good_id"
        :good="item"
      ></purchase>
    </div>
    <!-- 购物车 -->
    <div class="cart" ref="cart">
      <!-- 主标题 -->
      <div class="cart-title" ref="cartTitle">已选商品</div>
      <!-- 商品项 -->
      <div class="cart-item-box" :style="{ height: cartItemBoxHeight + 'px' }">
        <div class="cart-item" v-for="(item, i) in cart" :key="i">
          <!-- 商品基础信息 -->
          <div class="cart-item-title">
            <span>{{ i + 1 }}. {{ item.good_name }}</span>
            <span
              >&nbsp;&nbsp;￥{{
                (
                  (Number(item.good_price) +
                    item.etc.reduce((a, b) => a + b[1], 0)) *
                  Number(item.count)
                ).toFixed(2)
              }}</span
            >
          </div>
          <!-- 商品规格 -->
          <div class="cart-item-size">
            <span class="choice-info"
              >{{ item.size }}/{{ item.ice }}/{{ item.sugar }}
              <span v-for="(item2, i2) in item.etc" :key="i2"
                >/{{ item2[0] }}</span
              >
            </span>
          </div>
          <!-- 数量选择器 -->
          <div class="count-selector">
            <span class="counter" @click="reduceCount(i)">-</span>
            <span style="margin: 0 6px">{{ item.count }}</span>
            <span class="counter" @click="addCount(i)">+</span>
          </div>
        </div>
      </div>
      <!-- 结算 -->
      <div class="cart-order" ref="cartOrder">
        <!-- 价格总计 -->
        <div class="countAll">
          <span
            >共{{ cart.reduce((a, b) => a + b.count, 0) }}件商品，总计￥<span
              style="font-size: 21px"
              >{{
                cart
                  .reduce(
                    (lastVal, currentVal) =>
                      lastVal +
                      currentVal.good_price * currentVal.count +
                      currentVal.etc.reduce((a, b) => a + b[1], 0) *
                        currentVal.count,
                    0
                  )
                  .toFixed(2)
              }}</span
            ></span
          >
        </div>
        <!-- 创建订单 -->
        <div class="craterOrder">
          <el-button type="warning" @click="createOrder">创建订单</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import purchase from '@/components/purchase.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    purchase
  },
  data() {
    return {
      goodList: [],
      cartItemBoxHeight: 0
    }
  },
  methods: {
    ...mapMutations(['addCount', 'reduceCount', 'clearCart']),
    // 获取商品列表
    async getGoodList() {
      const { data: res } = await this.$http.get('/api/goodlist')
      if (res.meta.status !== 200) return this.$showMsg()
      this.goodList = res.data
    },
    // 创建订单
    async createOrder() {
      // 封装订单对象
      const order = {
        order_user_id: this.user.user_id,
        order_price: this.cart
          .reduce(
            (lastVal, currentVal) =>
              lastVal +
              currentVal.good_price * currentVal.count +
              currentVal.etc.reduce((a, b) => a + b[1], 0) * currentVal.count,
            0
          )
          .toFixed(2),
        order_info: '无',
        order_state: '已下单',
        order_take_way: '自取',
        order_count: this.cart.reduce((a, b) => a + b.count, 0),
        cart: this.cart
      }
      const { data: res } = await this.$http.post('/api/addorder', order)
      if (res.meta.status !== 200) {
        return this.$showMsg('服务器发生错误', '创建订单失败')
      } else {
        this.clearCart()
        return this.$showMsg('创建订单完成', '成功')
      }
    }
  },
  computed: {
    ...mapState(['cart', 'user'])
  },
  mounted() {
    this.getGoodList()
    this.cartItemBoxHeight =
      this.$refs.cart.offsetHeight -
      this.$refs.cartTitle.offsetHeight -
      this.$refs.cartOrder.offsetHeight
  }
}
</script>

<style lang="less" scoped>
.purchase {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .order {
    height: 100%;
    overflow-y: scroll;
    width: 70%;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    display: flex;
    flex-wrap: wrap;
  }
  .cart {
    height: 100%;
    width: 25%;
    display: flex;
    flex-direction: column;
    // align-items: center;
    position: relative;
    .cart-title {
      font-size: 24px;
      font-weight: 500;
      // margin-top: 10px;
      z-index: 10;
      background-color: #fff;
      margin-bottom: 20px;
      width: 100%;
      // height: 120px;
      text-align: center;
      position: sticky;
      top: 0;
      left: 0;
    }
    .cart-item-box {
      overflow-y: scroll;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
      .cart-item {
        margin-bottom: 24px;
        position: relative;
        // border: 1px solid #a0a0a0;
        .cart-item-title {
          margin-bottom: 5px;
        }
        .count-selector {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          .counter {
            display: block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            font-size: 18px;
            text-align: center;
            background-color: #eee;
            cursor: pointer;
          }
        }
      }
    }
    .cart-order {
      width: 100%;
      height: 80px;
      position: absolute;
      bottom: 0;
      left: 0;
      background: #fff;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .countAll {
        color: orange;
      }
      .craterOrder {
        height: 50px;
        margin-right: 20px;
      }
    }
  }
}
</style>
