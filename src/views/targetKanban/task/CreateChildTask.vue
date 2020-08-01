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
        <div
          class="left"
          @click="isShowCreate = !isShowCreate"
          v-show="!isShowCreate"
        >
          <i class="el-icon-plus"></i>
          快速创建
        </div>

        <div class="right" v-show="isShowCreate">
          <div class="task-title">
            <el-form-item label-width="0" prop="title">
              <el-input
                placeholder="标题"
                @keyup.enter.native="sumbitSave"
                clearable
                v-model="ruleForm.title"
              ></el-input>
            </el-form-item>
          </div>

          <div class="task-user">
            <el-form-item label-width="0" prop="user_id">
              <el-select
                size="mini"
                clearable
                filterable
                v-model="ruleForm.user_id"
                placeholder="执行人"
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
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="ruleForm.deadline"
                type="datetime"
                placeholder="截止日期"
                default-time="23:59:59"
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
import { createChildTask } from '@/api/targetOkr'
export default {
  props: {
    userList: Array,
    taskId: [String, Number],
    firstResponsibleId: [String, Number]
  },
  data() {
    return {
      ruleForm: {
        task_id: '',
        title: '',
        user_id: '',
        deadline: '' //截止日期
      },
      rules: {
        title: [{ required: true, message: '请选择', trigger: 'blur' }],
        user_id: [{ required: true, message: '请选择', trigger: 'change' }],
        deadline: [{ required: true, message: '请选择日期', trigger: 'change' }]
      },
      fromLoading: false,
      isShowCreate: false
    }
  },
  watch: {
    firstResponsibleId(newVal) {
      this.ruleForm.user_id = newVal
    }
  },
  methods: {
    async createTask() {
      this.fromLoading = true
      this.ruleForm.task_id = this.taskId
      try {
        let { message } = await createChildTask(this.ruleForm)
        this._message(message, 'success')
        this.$emit('createChildTaskOk')
        this.resetForm()
      } catch (error) {
        this._message(error)
      }
      this.fromLoading = false
    },
    handleShowIcon() {
      this.isShowCreate = !this.isShowCreate
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
    .task-title {
      overflow: hidden;
      flex: 1;
      margin: 0 5px;
    }
    .task-user {
      width: 155px;
      overflow: hidden;
      margin: 0 5px;
    }
    .times {
      width: 135px;
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
  }
}
</style>
