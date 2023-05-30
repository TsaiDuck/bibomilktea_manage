<template>
  <div class="goodManage">
    <!-- 标题区 -->
    <div class="goodManage-title">
      <span style="width: 80px" class="addGood" @click="addGood">添加商品</span>
      <span style="width: 160px">名称</span>
      <span>价格</span>
      <span>类别</span>
      <span style="width: 240px">信息</span>
      <span style="width: 80px">操作</span>
    </div>
    <!-- 内容 -->
    <div class="goodManage-content">
      <good
        v-for="item in goodList"
        :key="item.good_id"
        :good="item"
        @changeGood="changeGood"
      ></good>
    </div>
    <!-- 弹框 -->
    <el-dialog
      title="商品管理"
      :visible.sync="showDialog"
      width="40%"
      :before-close="handleClose"
      top="8vh"
    >
      <!-- 内容 -->
      <div class="dialog-content">
        <!-- 商品名 -->
        <div class="dialog-content-item">
          <span class="dialog-content-item-name">商品名：</span>
          <div class="dialog-content-item-input">
            <el-input
              size="small"
              v-model="good.good_name"
              placeholder="请输入商品名："
            ></el-input>
          </div>
        </div>
        <!-- 商品类别 -->
        <div class="dialog-content-item">
          <span class="dialog-content-item-name">商品类别：</span>
          <div class="dialog-content-item-input">
            <el-select
              v-model="good.good_class"
              placeholder="请选择类别"
              size="small"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 商品价格 -->
        <div class="dialog-content-item">
          <span class="dialog-content-item-name">商品价格：</span>
          <div class="dialog-content-item-input">
            <el-input
              size="small"
              v-model="good.good_price"
              placeholder="请输入价格："
            ></el-input>
          </div>
        </div>
        <!-- 商品信息 -->
        <div class="dialog-content-item">
          <span class="dialog-content-item-name">商品信息：</span>
          <div class="dialog-content-item-textarea">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6 }"
              placeholder="请输入商品信息"
              v-model="good.good_info"
            >
            </el-input>
          </div>
        </div>
        <!-- 图片 -->
        <div class="dialog-content-image">
          <!-- 无图片时 -->
          <div class="image-fake" v-if="good.good_img_preview == ''">
            <span class="el-icon-plus"></span>
          </div>
          <!-- 有图片时 -->
          <div class="image-true" v-else>
            <img class="image-true-item" :src="good.good_img_preview" alt="" />
          </div>
          <!-- 图片上传器 -->
          <input
            type="file"
            class="input-img"
            title="请选择图片"
            accept=".png, .jpg, .jpeg"
            @change="imgChange"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="warning" @click="goodUpLoad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import good from '@/components/good.vue'
export default {
  components: {
    good
  },
  data() {
    return {
      goodList: [],
      showDialog: false,
      good: {},
      options: [
        { value: '奶茶', label: '奶茶' },
        { value: '口感', label: '口感' },
        { value: '新鲜', label: '新鲜' },
        { value: '冰沙', label: '冰沙' }
      ]
    }
  },
  methods: {
    // 获取商品列表
    async getGoodList() {
      const { data: res } = await this.$http.get(
        'https://www.tsaiduck.cn/api/goodlist'
      )
      if (res.meta.status !== 200) return this.$showMsg()
      this.goodList = res.data
    },
    // 修改或删除商品
    changeGood(e) {
      if (e.method == 'change') {
        this.good = {
          good_name: e.good.good_name,
          good_info: e.good.good_info,
          good_price: e.good.good_price,
          good_class: e.good.good_class,
          good_img: e.good.good_img,
          good_img_preview: e.good.good_img,
          good_id: e.good.good_id
        }
        this.showDialog = true
      } else {
        this.$alert('确定要删除该商品吗？', '删除', {
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
    // 关闭对话框前的函数
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
    // 初始化对话框内的商品信息
    initGood() {
      this.good = {
        good_name: '',
        good_info: '',
        good_price: '',
        good_class: '',
        good_img: '',
        good_img_preview: ''
      }
    },
    // 添加商品
    addGood() {
      this.initGood()
      this.showDialog = true
    },
    // 图片预览
    imgChange(e) {
      // 图片预览
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = () => {
        this.good.good_img_preview = reader.result
      }
      this.good.good_img = e.target.files[0]
    },
    // 图片上传
    async goodUpLoad() {
      this.showDialog = false
      const good = new FormData()
      if (this.good.good_id) {
        good.append('good_id', this.good.good_id)
      }
      good.append('good_name', this.good.good_name)
      good.append('good_info', this.good.good_info)
      good.append('good_price', this.good.good_price)
      good.append('good_class', this.good.good_class)
      good.append('good_img', this.good.good_img)
      const { data: res } = await this.$http.post('/api/uploadImage', good, {
        'Content-Type': 'multipart/form-data;'
      })
      if (res.meta.status !== 200) {
        return this.$showMsg()
      } else {
        this.getGoodList()
      }
    },
    // 删除商品
    async goodDelete(id) {
      const { data: res } = await this.$http.get(
        `/api/deleteGood?good_id=${id}`
      )
      if (res.meta.status !== 200) return this.$showMsg()
      this.$message({
        type: 'success',
        message: `已删除`
      })
      this.getGoodList()
    }
  },
  mounted() {
    this.getGoodList()
  }
}
</script>

<style lang="less" scoped>
.goodManage {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .goodManage-title {
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
      &.addGood {
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
        width: 180px;
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
