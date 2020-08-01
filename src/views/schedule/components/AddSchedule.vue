<template>
  <div class="add-schedule">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addScheduleVisible"
      width="450px"
      :show-close="false"
      :before-close="beforeClose"
    >
      <div class="dialog-content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="ruleForm"
        >
          <el-form-item prop="title">
            <el-input
              placeholder="请输入日程标题"
              v-model="ruleForm.title"
              clearable
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item prop="start_time">
            <el-date-picker
              v-model="ruleForm.start_time"
              type="datetime"
              placeholder="选择日程开始时间"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              size="small"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="end_time">
            <el-date-picker
              v-model="ruleForm.end_time"
              type="datetime"
              placeholder="选择日程结束时间"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              size="small"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="user_id">
            <el-select
              v-model="ruleForm.user_id"
              multiple
              filterable
              placeholder="请选择日程责任人"
              size="small"
            >
              <el-option
                v-for="(item, index) in allUserData"
                :key="index"
                :label="item.username"
                :value="Number(item.user_id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="schedule_group_id">
            <el-select
              v-model="ruleForm.schedule_group_id"
              clearable
              filterable
              placeholder="请选择日程组"
              size="small"
            >
              <el-option
                v-for="(item, index) in myScheduleData"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="!ruleForm.schedule_id"
          type="primary"
          size="mini"
          @click="addSchedule"
          >保 存</el-button
        >
        <el-button
          v-if="ruleForm.schedule_id"
          type="primary"
          size="mini"
          @click="updateSchedule"
          >保 存</el-button
        >
        <el-button size="mini" @click="beforeClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { scheduleAdd, scheduleDetail, scheduleUpdate } from '@/api/schedule'
import vueEvent from '@/utils/vue-event'
var moment = require('moment')
export default {
  props: {
    addScheduleVisible: Boolean,
    allUserData: Array,
    myScheduleData: Array
  },
  name: '',
  data() {
    return {
      dialogTitle: '添加日程',
      ruleForm: {
        schedule_id: '',
        title: '',
        start_time: '',
        end_time: '',
        user_id: [],
        schedule_group_id: ''
      },
      rules: {
        title: [{ required: true, message: '请输入日程名称', trigger: 'blur' }],
        start_time: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        end_time: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        user_id: [
          { required: true, message: '请选择日程组', trigger: 'change' }
        ],
        schedule_group_id: [
          { required: true, message: '请选择日程组', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    addScheduleVisible(val) {
      if (val) {
        // this.move_params.s_group_id = this.move_target_group.s_group_id
        // this.move_params.setting_id = this.move_target.setting_id
      }
    }
  },
  mounted() {
    // 新增时
    vueEvent.$on('addDate', arg => {
      this.dialogTitle = '添加日程'
      let start_time, end_time
      if (arg.allDay) {
        let date = new Date()
        let dateHours = date.getHours()
        start_time = Date.parse(arg.date) + dateHours * 60 * 60 * 1000 //当前小时
        end_time = start_time + 30 * 60 * 1000
      } else {
        start_time = arg.date
        end_time = Date.parse(arg.date) + 30 * 60 * 1000
      }
      this.ruleForm.start_time = moment(start_time).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.ruleForm.end_time = moment(end_time).format('YYYY-MM-DD HH:mm:ss')
    })
    // 编辑时
    vueEvent.$on('editDate', event => {
      this.dialogTitle = '编辑日程'
      this.ruleForm.start_time = moment(event.start).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.ruleForm.end_time = moment(event.end).format('YYYY-MM-DD HH:mm:ss')
      this.ruleForm.schedule_id = event.id
      this.getDetail(this.ruleForm.schedule_id)
      console.log(event, this.ruleForm.end_time, 'event')
    })
  },
  methods: {
    // 日程详情
    async getDetail(schedule_id) {
      try {
        const { data } = await scheduleDetail({ schedule_id })
        this.mixinObjAssign(this.ruleForm, data)
        console.log(this.ruleForm)
      } catch (error) {
        this._message(error)
      }
    },

    // 添加日程
    async addSchedule() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          try {
            delete this.ruleForm.schedule_id
            await scheduleAdd(this.ruleForm)
            this.$message.success('添加成功')
            vueEvent.$emit('refreshList')
            this.beforeClose()
          } catch (error) {
            this._message(error)
          }
        } else {
          return false
        }
      })
    },
    // 编辑日程
    async updateSchedule() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          try {
            await scheduleUpdate(this.ruleForm)
            this.$message.success('修改成功')
            vueEvent.$emit('refreshList')
            this.beforeClose()
          } catch (error) {
            this._message(error)
          }
        } else {
          return false
        }
      })
    },
    beforeClose() {
      this.ruleForm = Object.assign(
        this.ruleForm,
        this.$options.data().ruleForm
      )
      this.$refs.ruleForm.resetFields()
      this.$emit('update:addScheduleVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.add-schedule {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
