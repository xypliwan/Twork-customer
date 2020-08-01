<template>
  <!-- 转交 -->
  <div class="transfer-to">
    <el-dialog
      title="流程当前处理人转交"
      :visible.sync="transferVisible"
      width="30%"
      center
      :show-close="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <span>
        <el-cascader
          size="mini"
          collapse-tags
          filterable
          :options="allVisibleUser"
          placeholder="请选择处理人"
          v-model="user_ids"
          :props="optionsUser"
          :show-all-levels="false"
          clearable
        ></el-cascader>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="transferOthers"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartmentInfo } from '@/api/common'
import { updateProcessListPeople } from '@/api/flowManage'

export default {
  props: {
    transferVisible: Boolean,
    urgeInfo: Object
  },
  data() {
    return {
      allVisibleUser: [], //所有可见成员
      optionsUser: {
        multiple: true,
        value: 'department_id',
        label: 'department_name'
      },
      user_ids: [],
      params: {
        list_id: '',
        step_id: '',
        user_ids: []
      }
    }
  },
  created() {
    this.getDepartmentInfo()
  },
  methods: {
    handleClose() {
      this.user_ids = []
      this.$emit('update:transferVisible', false)
    },
    async transferOthers() {
      this.params.list_id = this.urgeInfo.list_id
      this.params.step_id = this.urgeInfo.step_id
      this.params.user_ids = this.user_ids.map(el => el[el.length - 1])
      if (this.params.user_ids.length == 0)
        return this.$message.warning('请选择处理人')

      try {
        await updateProcessListPeople(this.params)
        this.$message.success('当前处理人已发生转变')
        this.handleClose()
        this.$emit('refresh', true)
      } catch (error) {
        this._message(error)
      }
    },
    //获取部门和人员
    async getDepartmentInfo() {
      try {
        let { data } = await getDepartmentInfo({ 'get-people': 1 })
        let userArr = JSON.parse(JSON.stringify(data))
        this.allVisibleUser = this.formateAllVisibleUser(userArr)
      } catch (error) {
        this._message(error)
      }
    },
    pushData(obj) {
      let item = {
        department_id: obj.user_id,
        department_name: obj.username,
        user_id: obj.user_id,
        user_name: obj.username
      }
      return item
    },
    formateAllVisibleUser(arr) {
      arr.forEach(el => {
        if (el.children) {
          if (el.people && el.people.length > 0) {
            el.people.forEach(peopleItem => {
              el.children.push(this.pushData(peopleItem))
            })
          }
          this.formateAllVisibleUser(el.children)
        } else {
          if (el.people && el.people.length > 0) {
            el['children'] = []
            el['disabled'] = false
            el.people.forEach(peopleItem => {
              el['children'].push(this.pushData(peopleItem))
            })
          } else {
            if (el.user_id) {
              el['disabled'] = false
            } else {
              el['disabled'] = true
              el.department_name = `${el.department_name}(暂无成员)`
            }
          }
        }
      })
      return arr
    }
  }
}
</script>

<style scoped lang="scss">
.transfer-to {
}
</style>
