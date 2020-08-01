<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      size="mini"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
      v-loading="fromLoading"
    >
      <div class="fast-task-box">
        <div class="left" @click="handleShowIcon" v-show="!isShowCreate">
          <i class="el-icon-plus"></i>
          点击此处，快速创建任务
        </div>

        <div class="right" v-show="isShowCreate">
          <div class="kr-box">
            <el-form-item label-width="0" prop="kr_id">
              <el-select
                v-loading="userLoading"
                filterable
                clearable
                v-model="ruleForm.kr_id"
                placeholder="KR"
              >
                <el-option
                  v-for="item in krList"
                  :key="item.kr_id"
                  :label="'KR' + item.sort"
                  :value="item.kr_id"
                >
                  <span style="float: left">
                    <el-tag size="mini">kr{{ item.sort }}</el-tag>
                    &nbsp;&nbsp; {{ item.kr_name }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="task-title" :title="ruleForm.title">
            <el-form-item label-width="0" prop="title">
              <el-input
                @blur="titleIsFocus = false"
                @focus="titleIsFocus = true"
                placeholder="任务标题"
                @keyup.enter.native="sumbitSave"
                clearable
                v-model="ruleForm.title"
              ></el-input>
            </el-form-item>
          </div>

          <div class="task-user" :class="titleIsFocus ? 'user-active' : ''">
            <el-form-item label-width="0" prop="user_ids">
              <el-select
                size="mini"
                multiple
                collapse-tags
                clearable
                filterable
                v-model="ruleForm.user_ids"
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

          <div class="times">
            <el-form-item label-width="0" prop="deadline">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="ruleForm.deadline"
                type="date"
                placeholder="截止日期"
              ></el-date-picker>
            </el-form-item>
          </div>
          <span class="open-btn">
            <el-link type="primary" @click="sumbitSave">确认</el-link
            >&nbsp;&nbsp;
            <el-link type="info" @click="cencalAdd">取消</el-link>
          </span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getKrListSimple, createTask } from '@/api/targetOkr'
import { mapGetters } from 'vuex'

export default {
  props: {
    userList: Array,
    targetId: [String, Number],
    tagId: String
  },
  data() {
    return {
      ruleForm: {
        kr_id: '',
        title: '',
        user_ids: [],
        tag_id: '',
        deadline: '' //截止日期
      },
      rules: {
        kr_id: [{ required: true, message: '请选择', trigger: 'change' }],
        title: [{ required: true, message: '请选择', trigger: 'blur' }],
        user_ids: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      fromLoading: false,
      krList: [],
      userLoading: false,
      isShowCreate: false,
      titleIsFocus: false
    }
  },
  computed: {
    ...mapGetters(['needRefreshKrList'])
  },
  watch: {
    needRefreshKrList() {
      this.getKrListSimple()
    },
    targetId(newVal) {
      if (newVal.length <= 0) return
      this.getKrListSimple()
    }
  },
  methods: {
    async createTask() {
      this.fromLoading = true
      this.ruleForm.tag_id = this.tagId
      try {
        let { message } = await createTask(this.ruleForm)
        this._message(message, 'success')
        this.$emit('createTaskOk')
        this.resetForm()
      } catch (error) {
        this._message(error)
      }
      this.fromLoading = false
    },
    handleShowIcon() {
      this.isShowCreate = !this.isShowCreate
      if (this.isShowCreate) {
        this.getKrListSimple()
      }
    },
    async getKrListSimple() {
      this.userLoading = true
      try {
        let { data } = await getKrListSimple({ target_id: this.targetId })
        this.krList = data
      } catch (error) {
        this._message(error)
      }
      this.userLoading = false
    },
    sumbitSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.createTask()
        } else {
          return false
        }
      })
    },
    cencalAdd() {
      this.resetForm()
      this.isShowCreate = false
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.fast-task-box {
  height: 60px;
  display: flex;
  align-items: center;
  background: #f1f1f1;
  .left {
    width: auto;
    font-size: 14px;
    padding: 0 5px;
    font-weight: 800;
    color: #999;
    cursor: pointer;
  }
  .right {
    flex: 1;
    padding-top: 15px;
    height: 100%;
    display: flex;
    ::v-deep .el-input__inner {
      padding: 0 5px;
      border: none;
    }
    .kr-box {
      width: 70px;
      overflow: hidden;
      margin: 0 5px;
    }

    .task-user {
      width: 165px;
      overflow: hidden;
      margin: 0 5px;
      &.user-active {
        width: 80px;
        height: 28px;
      }
    }
    .times {
      width: 90px;
      overflow: hidden;
      ::v-deep .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: auto;
      }
      ::v-deep .el-icon-time:before {
        display: none;
      }
      ::v-deep .el-input__icon {
        display: none;
      }
    }
    .open-btn {
      margin-left: 10px;
      margin-top: 8px;
      display: inline-block;
      width: 75px;
    }
    .task-title {
      overflow: hidden;
      flex: 1;
      margin: 0 5px;
    }
  }
}
</style>
