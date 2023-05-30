<template>
  <div class="good">
    <div class="good-info">
      <img :src="good.good_img" alt="" />
      <span style="width: 160px">{{ good.good_name }}</span>
      <span>{{ good.good_price.toFixed(2) }}</span>
      <span>{{ good.good_class }}</span>
      <span style="width: 240px">{{ good.good_info }}</span>
      <div class="btn">
        <span @click="changeGood('change')">修改</span>
        <span @click="changeGood('delete')">删除</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    good: {
      type: Object
    }
  },
  methods: {
    changeGood(method) {
      if (this.user.user_root < 2) {
        this.$showMsg('您的权限不足', '抱歉')
      } else {
        this.$emit('changeGood', { method, good: this.good })
      }
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.good {
  .good-info {
    width: 100%;
    min-height: 90px;
    max-height: 120px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid #000;
    &:hover {
      background-color: #eee;
    }
    span {
      display: block;
      width: 80px;
      text-align: center;
    }
    img {
      height: 80px;
      width: 80px;
    }
    .btn {
      width: 80px;
      min-height: 90px;
      max-height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      span {
        display: block;
        width: 80px;
        height: 35px;
        line-height: 35px;
        background: orange;
        color: #fff;
        cursor: pointer;
        border-radius: 8px;
      }
    }
  }
}
</style>
