<template>
  <div class="material">
    <div class="material-info">
      <span>{{ material.material_id }}</span>
      <span style="width: 160px">{{ material.material_name }}</span>
      <span>{{ material.material_count }}</span>
      <span>{{ material.material_date }}</span>
      <!-- <span style="width: 240px">{{ material.material_info }}</span> -->
      <div class="btn">
        <span @click="changeMaterial('change')">修改</span>
        <span @click="changeMaterial('delete')">删除</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    material: {
      type: Object
    }
  },
  methods: {
    changeMaterial(method) {
      if (this.user.user_root < 2) {
        this.$showMsg('您的权限不足', '抱歉')
      } else {
        this.$emit('changeMaterial', { method, material: this.material })
      }
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.material {
  .material-info {
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
