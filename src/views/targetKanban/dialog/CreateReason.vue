<template>
  <div class="create-kr-box">
    <div class="user-select">
      <el-select
        size="mini"
        filterable
        v-model="params.user_id"
        placeholder="请选择"
      >
        <el-option
          v-for="item in userList"
          :key="item.value"
          :label="item.username"
          :value="item.user_id"
        ></el-option>
      </el-select>
    </div>
    <div class="confidence-box">
      <i class="iconfont icon-favorite"></i>
      <div class="confidence-it">
        <el-select
          size="mini"
          filterable
          v-model="params.score"
          placeholder="请选择"
        >
          <el-option
            v-for="item in confidenceList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      分
    </div>
    <div class="ipt">
      <el-input
        size="small"
        v-model="params.reason"
        placeholder="输入信心指数原因"
      ></el-input>
    </div>

    <div class="create-btn" @click="createKrReason">创建</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    userList: Array
  },
  data() {
    return {
      params: {
        user_id: '', //责任人id
        reason: '', //原因
        score: 0, //信心分数
        user_name: '' //责任人名
      },
      confidenceList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] //信息指数
    }
  },
  watch: {},
  mounted() {
    this.params.user_id = String(this.userInfo.id)
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    createKrReason() {
      if (!this.params.user_id || this.params.reason.trim().length <= 0) {
        this._message('请把创建信息填写完整', 'warning')
        return
      }
      this.params.user_name = this.userList.filter(
        item => item.user_id == this.params.user_id
      )[0].username
      this.$emit('createKrView', this.params)
      this.resetData()
    },
    resetData() {
      this.params.user_id = String(this.userInfo.id)
      this.params.reason = ''
      this.params.score = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.create-kr-box {
  background: #fff;
  display: flex;
  height: 40px;
  align-items: center;
  border-top: 1px solid #f1f1f1;
  border-bottom: 1px solid #f1f1f1;
  .ipt {
    flex: 1;
    ::v-deep .el-input .el-input__inner {
      border: none;
      //   border-bottom: 1px solid #DCDFE6;
    }
  }
  .user-select {
    width: 90px;
    margin-right: 15px;
  }
  .confidence-box {
    display: flex;
    align-items: center;
    width: 120px;
    font-size: 13px;
    .icon-favorite {
      color: #f6af42;
      font-size: 17px;
    }
    .confidence-it {
      width: 70px;
      margin: 0 5px;
    }
  }
  .create-btn {
    width: 45px;
    background: #409eff;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
  }
}
</style>
