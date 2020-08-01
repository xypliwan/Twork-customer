<template>
  <div>
    <el-dialog
      title="评分"
      :append-to-body="true"
      top="50px"
      :visible.sync="dialog"
      width="800px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          size="small"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          v-loading="fromLoading"
        >
          <el-form-item label="评分" prop="mark">
            <el-slider
              v-model="ruleForm.mark"
              show-input
              :min="0"
              :max="1"
              :step="0.01"
            ></el-slider>
          </el-form-item>
          <el-form-item label="评分总结" prop="content">
            <el-input
              v-model="ruleForm.content"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              placeholder="请输入评论"
            ></el-input>
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
import { setKrMark } from '@/api/targetOkr'
export default {
  props: {
    dialog: Boolean,
    id: [String, Number]
  },
  data() {
    return {
      ruleForm: {
        kr_id: '',
        content: '', //内容
        mark: 0 //评分
      },
      rules: {
        content: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      fromLoading: false
    }
  },
  methods: {
    async setKrMark() {
      this.fromLoading = true
      this.ruleForm.kr_id = this.id
      try {
        let { message } = await setKrMark(this.ruleForm)
        this._message(message, 'success')
        this.handleClose()
        this.$emit('scoreOk')
      } catch (error) {
        this._message(error)
      }
      this.fromLoading = false
    },
    sumbitSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.setKrMark()
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
      this.ruleForm.reason = []
      this.$emit('update:dialog', false)
    }
  }
}
</script>
