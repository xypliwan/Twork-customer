<template>
  <div class="create-kr-box">
    <div class="prompt-box" @click="isShowCreate = true" v-show="!isShowCreate">
      <i class="el-icon-plus"></i>
      点击此处，快速创建KR
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0px"
      class="demo-ruleForm"
    >
      <div
        v-loading="createLoading"
        v-show="isShowCreate"
        class="create-kr-inner-box"
      >
        <div class="ipt">
          <el-form-item prop="kr_name">
            <el-input
              size="mini"
              @keyup.enter.native="submitForm"
              v-model="ruleForm.kr_name"
              placeholder="快速创建关键结果，回车即可"
            ></el-input>
          </el-form-item>
        </div>

        <div class="user-select">
          <el-form-item prop="user_id">
            <el-select
              size="mini"
              filterable
              v-model="ruleForm.user_id"
              placeholder="责任人"
            >
              <el-option
                v-for="item in userList"
                :key="item.value"
                :label="item.username"
                :value="item.user_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="confidence-box">
          <el-form-item prop="score">
            <div class="confidence-inner-box">
              <i class="iconfont icon-favorite"></i>
              <div class="confidence-it">
                <el-select
                  size="mini"
                  filterable
                  v-model="ruleForm.score"
                  placeholder="信心"
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
          </el-form-item>
        </div>
        <div class="create-btn">
          <el-link type="primary" @click="submitForm">确认</el-link>&nbsp;&nbsp;
          <el-link type="info" @click="closeCreateBox">取消</el-link>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { createKr } from '@/api/targetOkr'
import { mapGetters } from 'vuex'
export default {
  props: {
    userList: Array,
    targetId: [String, Number]
  },
  data() {
    return {
      ruleForm: {
        target_id: '', //目标id
        kr_name: '', //kr名字
        user_id: '', //责任人id
        score: null //信心分数
      },
      confidenceList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //信息指数
      createLoading: false,
      isShowCreate: false,
      rules: {
        kr_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        user_id: [{ required: true, message: '请选择', trigger: 'change' }],
        score: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  watch: {
    targetId() {
      this.resetData()
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    closeCreateBox() {
      this.isShowCreate = false
      this.resetData()
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.createKr()
        } else {
          return false
        }
      })
    },
    async createKr() {
      this.createLoading = true
      try {
        let { data, message } = await createKr(this.ruleForm)
        this._message(message, 'success')
        this.$emit('createKrOk', data)
        this.resetData()
      } catch (error) {
        this._message(error)
      }
      this.createLoading = false
    },
    resetData() {
      this.$refs.ruleForm.resetFields()
      this.ruleForm.user_id = String(this.userInfo.id)
      this.ruleForm.target_id = this.targetId
      this.ruleForm.kr_name = ''
      this.ruleForm.score = null
    }
  }
}
</script>

<style lang="scss" scoped>
.create-kr-box {
  height: 60px;
  .prompt-box {
    width: auto;
    font-size: 14px;
    padding: 0 5px;
    font-weight: 800;
    color: #999;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .create-kr-inner-box {
    display: flex;
    height: 60px;
    align-items: center;
    .ipt {
      flex: 1;
      margin-right: 13px;
      ::v-deep .el-input .el-input__inner {
        border: none;
        //   border-bottom: 1px solid #DCDFE6;
      }
      ::v-deep .el-form-item {
        margin-bottom: 0;
      }
      ::v-deep .el-form-item__error {
        padding-top: 0px;
      }
    }
    .user-select {
      width: 90px;
      margin-right: 15px;
      ::v-deep .el-input__inner {
        border: none;
      }
      ::v-deep .el-form-item {
        margin-bottom: 0;
      }
      ::v-deep .el-form-item__error {
        padding-top: 0px;
      }
    }
    .confidence-box {
      width: 120px;

      .confidence-inner-box {
        display: flex;
        align-items: center;
        font-size: 13px;
        .icon-favorite {
          color: #f6af42;
          font-size: 17px;
        }
        .confidence-it {
          width: 85px;
          margin: 0 5px;
          ::v-deep .el-input__inner {
            border: none;
          }
        }
      }
      ::v-deep .el-form-item {
        margin-bottom: 0;
      }
      ::v-deep .el-form-item__error {
        padding-top: 0px;
      }
    }
    .create-btn {
      width: 65px;
      text-align: center;
      color: #fff;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
</style>
