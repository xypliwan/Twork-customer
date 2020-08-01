<template>
  <div>
    <slot></slot>
    <div class="right-box">
      <el-button type="primary" size="small" @click="createOkr"
        >新建OKR</el-button
      >
      <div class="period-box">
        <el-select
          size="small"
          @change="changePeriod"
          filterable
          clearable
          v-model="params.period_id"
          placeholder="请选择周期"
        >
          <el-option
            v-for="item in periodList"
            :key="item.period_id"
            :label="item.period_name"
            :value="item.period_id"
          ></el-option>
        </el-select>
      </div>

      <el-tooltip
        class="item"
        effect="dark"
        :content="horizontal ? '纵向视图' : '横向视图'"
        placement="top"
      >
        <i
          class="iconfont icon-hengxiangbuju"
          @click="handleHorizontal"
          :class="horizontal ? 'active-icon' : ''"
        ></i>
      </el-tooltip>
    </div>

    <create-okr
      :dialog.sync="createOkrDialog"
      :departmentInfo="departmentInfo"
      :periodList="periodList"
      :targetProjectList="targetProjectList"
      :userList="userList"
      :allVisibleUser="allVisibleUser"
      @createOkrOk="createOkrOk"
      :okrFlg="okrFlg"
      :targetId="targetId"
    ></create-okr>
  </div>
</template>

<script>
import CreateOkr from '_v/targetKanban/dialog/CreateOkr'
import {
  getDepartmentInfo,
  getTargetProjectList,
  getUserList,
  targetAddLog
} from '@/api/common'

export default {
  props: {
    departmentList: Array, //部门列表
    periodList: Array, //周期列表
    horizontal: Boolean
  },
  data() {
    return {
      params: {
        period_id: '' //周期id
      },
      departmentInfo: [], //所有部门
      targetProjectList: [], //获取目标类型
      userList: [], //责任人列表
      allVisibleUser: [], //所有可见成员

      createOkrDialog: false,
      targetId: '',
      okrFlg: ''
    }
  },
  created() {
    this.getDepartmentInfo()
    this.getTargetProjectList()
    this.getUserList()
  },
  watch: {},
  methods: {
    handleHorizontal() {
      this.$emit('handleHorizontal')
    },
    createOkrOk(id) {
      const { href } = this.$router.resolve({
        path: '/target/target-kanban',
        query: {
          targetid: id
        }
      })
      window.open(href, '_blank')
    },
    async createOkr() {
      this.okrFlg = '0'
      this.createOkrDialog = true
      try {
        // 记录点击
        await targetAddLog()
      } catch (error) {
        this._message(error)
      }
    },
    changePeriod() {
      this.$emit('toSearch', this.params)
    },
    //获取责任人列表
    async getUserList() {
      try {
        let { data } = await getUserList()
        this.userList = data
      } catch (error) {
        this._message(error)
      }
    },
    //获取目标类型
    async getTargetProjectList() {
      try {
        let { data } = await getTargetProjectList()
        this.targetProjectList = data
      } catch (error) {
        this._message(error)
      }
    },
    //获取部门和人员
    async getDepartmentInfo() {
      try {
        let { data } = await getDepartmentInfo({ 'get-people': 1 })
        let parentArr = JSON.parse(JSON.stringify(data))
        let userArr = JSON.parse(JSON.stringify(data))
        this.departmentInfo = this.formateDepartment(parentArr)
        this.allVisibleUser = this.formateAllVisibleUser(userArr)
      } catch (error) {
        this._message(error)
      }
    },
    formateDepartment(arr) {
      arr.forEach(el => {
        if (el.children) {
          this.formateDepartment(el.children)
        } else {
          delete el.people
        }
      })
      return arr
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
  },
  components: {
    CreateOkr
  }
}
</script>

<style lang="scss" scoped>
.right-box {
  float: right;
  .period-box {
    width: 160px;
    display: inline-block;
    margin-left: 15px;
  }
  .icon-hengxiangbuju {
    color: #333;
    cursor: pointer;
    margin-left: 20px;
    transform: rotate(0deg);
    display: inline-block;
    &.active-icon {
      transform: rotate(90deg);
    }
  }
}
</style>
