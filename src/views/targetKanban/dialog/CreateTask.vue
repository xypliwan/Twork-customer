<template>
  <div>
    <el-dialog
      title="创建任务"
      :append-to-body="true"
      top="50px"
      :visible.sync="dialog"
      width="600px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          size="small"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
          v-loading="fromLoading"
        >
          <el-form-item label="KR" prop="kr_id">
            <el-select
              v-loading="userLoading"
              filterable
              clearable
              v-model="ruleForm.kr_id"
              placeholder="请选择"
            >
              <el-option
                v-for="item in krList"
                :key="item.kr_id"
                :label="item.kr_name"
                :value="item.kr_id"
              >
                <span style="float: left">
                  <el-tag size="mini">kr{{ item.sort }}</el-tag>
                  &nbsp;&nbsp; {{ item.kr_name }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务标题" prop="title">
            <el-input
              placeholder="请输入标题"
              clearable
              v-model="ruleForm.title"
            ></el-input>
          </el-form-item>
          <el-form-item label="责任人" prop="user_ids">
            <el-select
              size="mini"
              multiple
              collapse-tags
              clearable
              filterable
              v-model="ruleForm.user_ids"
              placeholder="请选择"
            >
              <el-option
                v-for="item in userList"
                :key="item.value"
                :label="item.username"
                :value="item.user_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="截止日期" prop="deadline">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="ruleForm.deadline"
              type="datetime"
              placeholder="选择截止日期"
              default-time="23:59:59"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button size="mini" @click="handleClose">关闭</el-button>
          <el-button size="mini" type="primary" @click="sumbitSave"
            >提交</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getKrListSimple, createTask } from '@/api/targetOkr'
export default {
  props: {
    dialog: Boolean,
    userList: Array,
    targetId: [String, Number]
  },
  data() {
    return {
      ruleForm: {
        kr_id: '',
        title: '',
        user_ids: [],
        deadline: '' //截止日期
      },
      rules: {
        kr_id: [{ required: true, message: '请选择', trigger: 'change' }],
        title: [{ required: true, message: '请选择', trigger: 'blur' }],
        user_ids: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      fromLoading: false,
      krList: [],
      userLoading: false
    }
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.getKrListSimple()
      }
    }
  },
  methods: {
    async createTask() {
      this.fromLoading = true
      try {
        let { message } = await createTask(this.ruleForm)
        this._message(message, 'success')
        this.$emit('createTaskOk')
        this.handleClose()
      } catch (error) {
        this._message(error)
      }
      this.fromLoading = false
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
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleClose() {
      this.resetForm()

      this.$emit('update:dialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-date-editor {
  width: 100% !important;
}
</style>
