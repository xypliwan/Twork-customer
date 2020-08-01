<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :before-close="close"
      :close-on-click-modal="false"
      :show-close="false"
      width="600px"
      title="编辑工时"
    >
      <el-form
        ref="ruleForm"
        label-width="80px"
        size="small"
        v-loading="loading"
      >
        <el-form-item label="日期">
          {{ objInfo.day }}
        </el-form-item>
        <el-form-item label="工时" prop="objInfo.hour">
          <el-input
            v-model="objInfo.hour"
            placeholder="请填写"
            @input="changeinput"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="工作描述" prop="objInfo.text.desc">
          <el-input
            type="textarea"
            v-model="objInfo.text.desc"
            :maxlength="2000"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="存在问题" prop="objInfo.text.question">
          <el-input
            type="textarea"
            v-model="objInfo.text.question"
            :maxlength="2000"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="解决措施" prop="objInfo.text.solution">
          <el-input
            type="textarea"
            v-model="objInfo.text.solution"
            :maxlength="2000"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="save">确定</el-button>
          <el-button @click="close">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { updateWorkHours } from '@/api/workHours'
// import { workHoursDetail, updateWorkHours } from '@/api/workHours'
export default {
  props: {
    visible: Boolean,
    objInfo: Object
  },
  data () {
    return {
      // ruleForm: {
      //   project_id: '',
      //   task_id: '',
      //   day: '', //日期
      //   hour: '', //工时
      //   desc: '', //工作描述
      //   question: '', //存在问题
      //   solution: '' //解决措施
      // },
      // rules: {
      //   hour: [{ required: true, message: '请输入', trigger: 'blur' }],
      //   desc: [{ required: false, message: '请输入', trigger: 'blur' }],
      //   question: [{ required: false, message: '请输入', trigger: 'blur' }],
      //   solution: [{ required: false, message: '请输入', trigger: 'blur' }]
      // },
      loading: false
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        // console.log(1111, this.objInfo)
        // this.workHoursDetail()
      }
    }
  },
  methods: {
    save () {
      // console.log(this.objInfo)
      this.updateWorkHours()
      // this.$emit('updateOk', this.objInfo)
      // this.$refs.ruleForm.validate(valid => {
      //   if (valid) {
      //     // this.updateWorkHours()
      //   } else {
      //     return false
      //   }
      // })
    },
    async updateWorkHours () {
      this.loading = true
      try {
        let obj = {
          project_id: this.objInfo.project_id,
          task_id: this.objInfo.task_id,
          hour: this.objInfo.hour === '' ? 0 : parseFloat(this.objInfo.hour),
          desc: this.objInfo.text.desc,
          question: this.objInfo.text.question,
          solution: this.objInfo.text.solution,
          day: this.objInfo.day,
          title: this.objInfo.title,
          category_id: this.objInfo.category_id,
          start_day: this.objInfo.start_day,
          end_day: this.objInfo.end_day
        }
        let { message, data } = await updateWorkHours(obj)
        this._message(message, 'success')
        obj.task_id = data.task_id
        obj.hour = data.hour
        this.$emit('updateOk', obj)
        this.close()
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    // async workHoursDetail() {
    //   this.loading = true
    //   try {
    //     let { data } = await workHoursDetail(this.objInfo)
    //     Object.assign(this.ruleForm, data)
    //   } catch (error) {
    //     this._message(error)
    //   }
    //   this.loading = false
    // },
    changeinput () {
      this.objInfo.hour = this.objInfo.hour.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1')
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
