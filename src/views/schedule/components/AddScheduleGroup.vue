<template>
  <div class="add-schedule-group">
    <el-dialog
      :title="groupId ? '编辑日程组' : '添加日程组'"
      :visible.sync="addScheduleGroupVisible"
      width="600px"
      :show-close="false"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <div class="add-schedule-group-content">
        <el-form ref="form" :model="form" label-width="90px" size="small">
          <el-form-item label="日程组名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="公开范围" prop="visit_scope">
            <el-select v-model="form.visit_scope" placeholder="请选择活动区域">
              <el-option
                v-for="(item, index) in visitScope"
                :key="index"
                :label="item.value"
                :value="item.key.toString()"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日程颜色" prop="color">
            <el-color-picker v-model="form.color" size="mini"></el-color-picker>
          </el-form-item>
          <el-form-item label="日程描述" prop="desc">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>

          <el-form-item label="管理成员" prop="admin_user">
            <el-select
              v-model="form.admin_user"
              multiple
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in allUserData"
                :key="index"
                :label="item.username"
                :value="Number(item.user_id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编辑成员" prop="participate_user">
            <el-select
              v-model="form.participate_user"
              multiple
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in allUserData"
                :key="index"
                :label="item.username"
                :value="Number(item.user_id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订阅成员" prop="subscribe_user">
            <el-select
              v-model="form.subscribe_user"
              multiple
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in allUserData"
                :key="index"
                :label="item.username"
                :value="Number(item.user_id)"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="beforeClose">取 消</el-button>
        <el-button
          v-if="!groupId"
          type="primary"
          size="mini"
          @click="addSchedule"
          >确 定</el-button
        >
        <el-button
          v-if="groupId"
          type="primary"
          size="mini"
          @click="editSchedule"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  scheduleGroupAdd,
  scheduleGroupDetail,
  scheduleGroupUpdate
} from '@/api/schedule'
export default {
  props: {
    addScheduleGroupVisible: Boolean,
    groupId: [Number, String],
    allUserData: Array,
    visitScope: Array
  },
  name: '',
  data() {
    return {
      form: {
        name: '',
        visit_scope: '',
        color: '#409EFF',
        desc: '',
        admin_user: [],
        participate_user: [],
        subscribe_user: [],
        detailData: {}
      }
    }
  },
  watch: {
    groupId(val) {
      if (val) {
        this.getDetail(val)
      }
    }
  },
  methods: {
    // 获取详情
    async getDetail(id) {
      try {
        let { data } = await scheduleGroupDetail({ id })
        this.detailData = data
        this.form = Object.assign(this.form, data)
      } catch (error) {
        this._message(error)
      }
    },
    async addSchedule() {
      try {
        await scheduleGroupAdd(this.form)
        this.$message.success('添加成功')
        this.$emit('refreshGroupList', true)
        this.beforeClose()
      } catch (error) {
        this._message(error)
      }
    },
    async editSchedule() {
      try {
        this.form.id = this.groupId
        await scheduleGroupUpdate(this.form)
        this.$message.success('修改成功')
        this.$emit('refreshGroupList', true)
        this.beforeClose()
      } catch (error) {
        this._message(error)
      }
    },
    beforeClose() {
      this.$refs.form.resetFields()
      this.$emit('update:addScheduleGroupVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.add-schedule-group {
  .add-schedule-group-content {
  }
}
</style>
