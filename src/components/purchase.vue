<template>
  <div class="purchase-item">
    <!-- 基础信息 -->
    <div class="item-box" @click="showDialog">
      <span>{{ good.good_name }}</span>
      <span>￥{{ Number(good.good_price).toFixed(2) }}</span>
    </div>
    <!-- 选择规格 -->
    <el-dialog
      :title="
        good.good_name +
        `   ￥${(
          (goodSize.size == '中杯' ? good.good_price : good.good_price + 2) +
          goodSize.etc.reduce((a, b) => a + b[1], 0)
        ).toFixed(2)}`
      "
      :visible.sync="dialogVisible"
      width="500px"
      top="5vh"
    >
      <!-- 杯型、冰度、糖度 -->
      <div class="size-item" v-for="(item, i) in sizeValue" :key="i">
        <strong>{{ sizeTitle[i] }}</strong
        ><br />
        <div class="size-item-box">
          <span
            v-for="(item2, i2) in item"
            :key="i2"
            :class="[
              'size-span-item',
              Object.values(goodSize)[i] == item2 ? 'active' : ''
            ]"
            @click="changeSize(i, item2)"
            >{{ item2 }}</span
          >
        </div>
      </div>
      <!-- 加料 -->
      <div class="size-item">
        <strong>加料</strong><br />
        <div class="size-item-box">
          <span
            v-for="(item2, i2) in specification"
            :key="i2"
            :class="[
              'size-span-item',
              goodSize.etc.find((k) => k == item2) ? 'active' : ''
            ]"
            @click="changeGoodSizeETC(item2)"
            >{{ item2[0] }}&nbsp;￥{{ item2[1] }}</span
          >
        </div>
      </div>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addToCart">加入购物车</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    good: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false,
      sizeTitle: ['杯型', '冰度', '糖度'],
      sizeValue: [
        ['中杯', '大杯'],
        ['标准冰', '少冰', '去冰', '常温', '热饮'],
        ['七分糖', '全糖']
      ],
      specification: [
        ['珍珠', 0],
        ['波霸', 0],
        ['野果', 0],
        ['红豆', 0],
        ['燕麦', 1],
        ['咖啡冻', 2],
        ['布丁', 4],
        ['芒果酱', 6],
        ['芋圆', 2],
        ['紫米', 1],
        ['去糖改蜜', 5]
      ],
      goodSize: {
        size: '中杯',
        ice: '标准冰',
        sugar: '七分糖',
        etc: [],
        count: 1
      }
    }
  },
  methods: {
    ...mapMutations(['addCart']),
    // 更改规格
    changeSize(i, size) {
      for (let key in this.goodSize) {
        if (Object.keys(this.goodSize)[i] == key) {
          this.goodSize[key] = size
        }
      }
    },
    changeGoodSizeETC(item) {
      const index = this.goodSize.etc.indexOf(item)
      if (index == -1) {
        this.goodSize.etc.push(item)
      } else {
        this.goodSize.etc.splice(index, 1)
      }
    },
    // 初始化对话框
    showDialog() {
      this.goodSize = {
        size: '中杯',
        ice: '标准冰',
        sugar: '七分糖',
        etc: [],
        count: 1
      }
      this.dialogVisible = true
    },
    // 加入购物车
    addToCart() {
      this.dialogVisible = false
      this.goodSize.good_id = this.good.good_id
      this.goodSize.good_name = this.good.good_name
      this.goodSize.good_img = this.good.good_img
      this.goodSize.good_price =
        this.goodSize.size == '中杯'
          ? this.good.good_price
          : this.good.good_price + 2
      this.addCart(this.goodSize)
    }
  }
}
</script>

<style lang="less" scoped>
.purchase-item {
  //   color: #fff;
  .item-box {
    width: 180px;
    height: 60px;
    margin: 16px 0 0 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    background-color: #eee;
    border: 1px solid #404040;
    border-radius: 20px;
    cursor: pointer;
  }
  .size-item {
    .size-item-box {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
      .size-span-item {
        display: block;
        padding: 8px 18px;
        margin-right: 10px;
        margin-top: 10px;
        background-color: #eee;
        cursor: pointer;
        &.active {
          background-color: orange;
          color: #fff;
        }
      }
    }
  }
}
</style>
