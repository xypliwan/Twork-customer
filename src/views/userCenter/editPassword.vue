<template>
  <div class="pass-word">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" prop="old_password">
        <el-input
          type="password"
          v-model="ruleForm.old_password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input
          type="password"
          v-model="ruleForm.new_password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfig_password">
        <el-input
          type="password"
          v-model="ruleForm.comfig_password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { modifyPassword } from '@/api/user'
export default {
  name: 'Password',
  data() {
    var validateOldPass = (rule, value, callback) => { // eslint-disable-line
      if (!value) {
        return callback(new Error('请输入原密码'))
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.ruleForm.comfig_password !== '') {
          this.$refs.ruleForm.validateField('comfig_password')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.ruleForm.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        old_password: '',
        new_password: '',
        comfig_password: ''
      },
      rules: {
        old_password: [
          { request: true, message: '请输入原密码', trigger: 'blur' }
        ],
        new_password: [{ validator: validatePass, trigger: 'blur' }],
        comfig_password: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    async save() {
      try {
        let { message } = await modifyPassword(this.ruleForm)
        this.$message.success(message)
      } catch (error) {
        this._message(error)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.save()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.pass-word {
  background-color: #fff;
  height: 100%;
  max-width: 500px;
}
</style>
