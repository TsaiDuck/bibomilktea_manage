<template>
  <div class="materialManage">
    <!-- 标题区 -->
    <div class="materialManage-title">
      <span style="width: 80px" class="addMaterial" @click="addMaterial"
        >添加物料</span
      >
      <span style="width: 160px">名称</span>
      <span>数量</span>
      <span>保质期</span>
      <!-- <span style="width: 240px">信息</span> -->
      <span style="width: 80px">操作</span>
    </div>
    <!-- 内容 -->
    <div class="materialManage-content">
      <material
        v-for="item in materialList"
        :key="item.material_id"
        :material="item"
        @changeMaterial="changeMaterial"
      ></material>
    </div>
    <!-- 弹框 -->
    <el-dialog
      title="物料管理"
      :visible.sync="showDialog"
      width="30%"
      :before-close="handleClose"
      top="8vh"
    >
      <!-- 内容 -->
      <div class="dialog-content">
        <!-- 商品名 -->
        <div class="dialog-content-item">
          <span class="dialog-content-item-name">物料名：</span>
          <div class="dialog-content-item-input">
            <el-input
              size="small"
              v-model="material.material_name"
              placeholder="请输入物料名："
            ></el-input>
          </div>
        </div>
        <!-- 商品类别 -->
        <div class="dialog-content-item">
          <span class="dialog-content-item-name">物料数量：</span>
          <div class="dialog-content-item-input">
            <el-input
              size="small"
              v-model="material.material_count"
              placeholder="请输入物料名："
            ></el-input>
          </div>
        </div>
        <!-- 商品价格 -->
        <div class="dialog-content-item">
          <span class="dialog-content-item-name">保质期：</span>
          <div class="dialog-content-item-input">
            <el-input
              size="small"
              v-model="material.material_date"
              placeholder="请输入保质期（年/月）："
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="warning" @click="materialUpLoad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import material from '@/components/material.vue'
export default {
  components: {
    material
  },
  data() {
    return {
      materialList: [],
      showDialog: false,
      material: {}
    }
  },
  methods: {
    // 添加物料
    addMaterial() {
      this.initMaterial()
      this.showDialog = true
    },
    // 获取物料列表
    async getMaterialList() {
      const { data: res } = await this.$http.get(
        'https://www.tsaiduck.cn/api/materialList'
      )
      if (res.meta.status !== 200) return this.$showMsg()
      this.materialList = res.data
    },
    // 修改物料
    changeMaterial(e) {
      if (e.method == 'change') {
        this.material = {
          material_name: e.material.material_name,
          material_id: e.material.material_id,
          material_count: e.material.material_count,
          material_date: e.material.material_date
        }
        this.showDialog = true
      } else {
        this.$alert('确定要删除该物料吗？', '删除', {
          confirmButtonText: '确定',
          callback: (action) => {
            if (action == 'confirm') {
              this.goodDelete(e.good.good_id)
            } else {
              this.$message({
                type: 'error',
                message: `取消删除`
              })
            }
          }
        })
      }
    },
    // 初始化物料对象
    initMaterial() {
      this.material = {
        material_name: '',
        material_count: '',
        material_date: ''
      }
    },
    // 关闭对话框前的函数
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
    // 更新物料信息
    async materialUpLoad() {
      this.showDialog = false
      let material = {}
      if (this.material.material_id) {
        material = {
          material_id: this.material.material_id,
          material_name: this.material.material_name,
          material_count: this.material.material_count,
          material_date: this.material.material_date
        }
        const { data: res } = await this.$http.post(
          '/api/updatematerial',
          material
        )
        if (res.meta.status !== 200) {
          return this.$showMsg()
        } else {
          this.getMaterialList()
        }
      } else {
        material = {
          material_name: this.material.material_name,
          material_count: this.material.material_count,
          material_date: this.material.material_date
        }
        const { data: res } = await this.$http.post(
          '/api/addmaterial',
          material
        )
        if (res.meta.status !== 200) {
          return this.$showMsg()
        } else {
          this.getMaterialList()
        }
      }
    }
  },
  mounted() {
    this.getMaterialList()
  }
}
</script>

<style lang="less" scoped>
.materialManage {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .materialManage-title {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid #000;
    position: sticky;
    top: 0;
    background-color: #fff;
    span {
      display: block;
      height: 60px;
      width: 80px;
      line-height: 60px;
      text-align: center;
      font-size: 20px;
      font-weight: 500;
      &.addMaterial {
        background-color: orange;
        color: #fff;
        font-size: 14px;
        height: 35px;
        line-height: 35px;
        border-radius: 8px;
        cursor: pointer;
      }
    }
  }
  .dialog-content {
    height: 180px;
    position: relative;
    .dialog-content-item {
      display: flex;
      // align-items: center;
      margin-bottom: 18px;
      .dialog-content-item-name {
        display: block;
        width: 90px;
        height: 32px;
        line-height: 32px;
      }
      .dialog-content-item-input {
        width: 220px;
      }
      .dialog-content-item-textarea {
        width: 300px;
      }
    }
    .dialog-content-image {
      position: absolute;
      right: 50px;
      top: 0px;
      width: 100px;
      height: 100px;
      border: 1px dotted gray;
      cursor: pointer;
      .image-fake {
        font-size: 60px;
        display: block;
        height: 100px;
        width: 100px;
        text-align: center;
        line-height: 100px;
        color: #a0a0a0;
      }
      .image-true {
        height: 100px;
        width: 100px;
        .image-true-item {
          height: 100px;
          width: 100px;
        }
      }
      .input-img {
        width: 100px;
        height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;
        opacity: 0;
      }
    }
  }
}
</style>
