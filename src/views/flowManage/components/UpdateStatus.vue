<template>
  <el-dialog
    :show-close="false"
    :append-to-body="true"
    :visible.sync="visible"
    width="500px"
    center
    :before-close="resetForm"
  >
    <!-- deal_content_is_must==1 必填 -->
    <el-form :model="updateStatus" ref="ruleForm" label-width="80px">
      <el-form-item
        label="处理意见"
        prop="comment"
        :rules="{
          required:
            detailData.fromat.detail.advanced_setting.deal_content_is_must == 1
              ? true
              : false,
          message:
            detailData.fromat.detail.advanced_setting.deal_content_tips ||
            '请输入',
          trigger: 'blur'
        }"
      >
        <el-input
          v-model="updateStatus.comment"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10 }"
          :placeholder="
            detailData.fromat.detail.advanced_setting.deal_content_tips
          "
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
        <el-button size="mini" @click="resetForm()">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { updateStepStatus } from '@/api/flowManage'
export default {
  props: {
    visible: Boolean,
    detailData: Object,
    updateStatusInit: Object
  },
  data() {
    return {
      updateStatus: {
        status_code: '', //done 完成 reject 拒绝 back 回退 cancel 取消
        list_id: '', //流程表单的id
        comment: '' //意见
      }
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        Object.assign(this.updateStatus, this.updateStatusInit)
      }
    }
  },
  methods: {
    async confirm() {
      try {
        let { message } = await updateStepStatus(this.updateStatus)
        this.$message.success(message)
        this.updateStatus.comment = ''
        this.$emit('confirmOk')
        this.$emit('update:visible', false)
      } catch (error) {
        this._message(error)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.confirm()
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.updateStatus.comment = ''
      this.$refs.ruleForm.resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>
