<template>
  <div class="wrap">
    <div class="title"><i class="iconfont icon-renyuan"></i>工时填报查询</div>
    <div class="searchWrap">
      <el-form
        :inline="true"
        :model="params"
        size="mini"
        ref="ruleForm"
        @cell-click="handleCellClick"
      >
        <el-form-item label="项目名称" prop="project_id">
          <el-select
            v-model="params.project_id"
            placeholder="请选择"
            size="mini"
            clearable
            filterable
          >
            <el-option
              v-for="item in projectList"
              :key="item.project_id"
              :label="item.project_name"
              :value="item.project_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="departmentAndName">
          <div @click="popSelectPeople">
            <el-input
              v-model="params.departmentAndName"
              :clearable="true"
              placeholder="请选择"
              readonly
            ></el-input>
          </div>
        </el-form-item>
        <!-- <el-form-item label="角色名称" prop="resource_status">
          <el-select
            v-model="params.role"
            placeholder="请选择"
            size="mini"
            clearable
            filterable
          >
            <el-option
              v-for="item in roleList"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateValue"
            size="small"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="selectTime"
            :clearable="false"
            style="width: 250px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="useUserList" size="mini"
            >查询</el-button
          >
          <el-button size="mini" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btsWrap">
      <div class="leftItem">
        <!-- <el-button type="primary" size="mini">录入人员</el-button>
        <el-button type="primary" size="mini">添加到项目</el-button> -->
      </div>
      <div class="rightItem">
        <div class="item">
          <i class="redColor"></i>
          超额分配
        </div>
        <div class="item">
          <i class="greenColor"></i>
          完全分配
        </div>
        <div class="item">
          <i class="orangeColor"></i>
          部分分配
        </div>
        <div class="item">
          <i class="whiteColor"></i>
          未分配
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :cell-style="cellStyle"
      @cell-click="handleCellClick"
      v-loading="tableLoading"
    >
      <el-table-column type="selection" width="55" fixed> </el-table-column>
      <el-table-column
        prop="user_name"
        label="人员姓名"
        width="100"
        align="center"
        fixed
      >
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色名称"
        width="150"
        align="center"
        fixed
      >
      </el-table-column>
      <el-table-column
        prop="department_name"
        label="部门名称"
        width="150"
        align="center"
        fixed
      ></el-table-column>
      <el-table-column
        :label="item.label"
        align="center"
        v-for="(item, i) in titleData"
        :key="i"
      >
        <el-table-column
          v-for="(ev, j) in item.child"
          :key="j"
          :prop="ev.prop"
          :label="ev.label"
          width="50"
          align="center"
        >
        </el-table-column>
      </el-table-column>
    </el-table>
    <task-pop
      :taskPop="taskPop"
      :project_id="params.project_id"
      @cancel="cancelPop"
      @save="cancelPop"
      :data="pop"
    />
    <select-departments-and-people
      :visible.sync="duVisible"
      @updateUser="updateUser"
      :originalData="selectObj"
      :canSelectDepartment="canSelectDepartment"
      :canSelectUser="canSelectUser"
    ></select-departments-and-people>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'
import TaskPop from './components/TaskPop'
// import { getDepartmentInfo } from '@/api/common'
import { useUserList, getUserRole, workHourProjectList } from '@/api/workHours'
export default {
  name: 'UserSearch',
  data () {
    return {
      taskPop: false,
      canSelectDepartment: true,
      canSelectUser: true,
      formInline: {
        user: '',
        region: ''
      },
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.maxDate = maxDate
          this.minDate = minDate
        }
        // disabledDate: time => {
        //   if (this.minDate) {
        //     let range = 7 * 24 * 3600 * 1000
        //     return (
        //       time.getTime() > this.minDate.getTime() + range ||
        //       time.getTime() < this.minDate.getTime() - range
        //     )
        //   }
        // }
      },
      titleData: [],
      tableData: [],
      roleList: [],
      params: {
        project_id: '', //项目id
        departmentAndName: '', //部门或者人员名字
        start_day: '', //开始时间
        end_day: '', //结束时间
        role: '',
        department: [],
        user: []
      },
      dateValue: [],
      // departmentInfo: [],
      optionsPartment: {
        checkStrictly: true,
        value: 'department_id',
        label: 'department_name'
      },
      duVisible: false,
      selectObj: {
        department: [],
        user: []
      },
      tableLoading: false,
      pop: {
        user_id: null,
        name: null,
        date: null
      },
      projectList: [] //项目列表
    }
  },
  async created () {
    // await this.getUserRole()
    this.getProjectListFn()
    this.setDefaultDate(7) //前后一星期
  },
  computed: {
    ...mapGetters(['projectData'])
  },
  methods: {
    async getProjectListFn () {
      try {
        let { data } = await workHourProjectList()
        this.projectList = data
      } catch (error) {
        this._message(error)
      }
    },
    cancelPop () {
      this.taskPop = false
    },
    handleCellClick (row, column) {
      if (column.realWidth == 50) {
        this.taskPop = true
        this.pop.user_id = row.user_id
        this.pop.name = row.user_name
        this.pop.date = column.property
      }
    },
    setDefaultDate (num) {
      //设置时间筛选框的默认日期，当期日期到过去一星期
      let date1 = new Date()
      let currentTime =
        date1.getFullYear() +
        '-' +
        (date1.getMonth() + 1) +
        '-' +
        date1.getDate()
      let date2 = new Date(date1)
      date2.setDate(date1.getDate() + num)
      let lastWeekTime =
        date2.getFullYear() +
        '-' +
        (date2.getMonth() + 1) +
        '-' +
        date2.getDate()
      this.dateValue = [currentTime, lastWeekTime]
      this.params.start_day = currentTime
      this.params.end_day = lastWeekTime
      this.useUserList()
    },
    async useUserList () {
      this.tableLoading = true
      try {
        let obj = {
          project_id: this.params.project_id,
          start_day: this.params.start_day,
          end_day: this.params.end_day,
          department: this.params.department,
          user: this.params.user
          // role_id: this.params.role
        }
        let {
          data: { tableData, titleData }
        } = await useUserList(obj)
        this.titleData = titleData
        this.tableData = tableData
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    },
    async getUserRole () {
      try {
        let { data } = await getUserRole()
        this.roleList = data
      } catch (error) {
        this._message(error)
      }
    },
    reset () {
      this.selectObj.department = []
      this.selectObj.user = []
      this.params.department = []
      this.params.user = []
      this.params.role = ''
      this.$refs.ruleForm.resetFields()
    },
    // //获取部门和人员
    // async getDepartmentInfo() {
    //   try {
    //     let { data } = await getDepartmentInfo({ 'get-people': 1 })
    //     this.departmentInfo = this.formateDepartment(data)
    //   } catch (error) {
    //     this._message(error)
    //   }
    // },
    formateDepartment (arr) {
      arr.forEach(el => {
        if (el.children) {
          this.formateDepartment(el.children)
        } else {
          delete el.people
        }
      })
      return arr
    },
    selectTime (e) {
      if (!e) {
        this.params.start_day = ''
        this.params.end_day = ''
      } else {
        this.params.start_day = e[0]
        this.params.end_day = e[1]
      }
    },
    // eslint-disable-next-line no-unused-vars
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      if (column.realWidth == 50) {
        for (let i in row) {
          if (i == column.property) {
            let num = Number(row[i])
            if (num > 8) {
              return {
                background: 'rgba(217, 0, 27, 1)',
                color: '#fff',
                cursor: 'pointer'
              }
            } else if (num == 8) {
              return {
                background: 'rgba(23, 114, 6, 1)',
                color: '#fff',
                cursor: 'pointer'
              }
            } else if (num > 0 && num < 8) {
              return {
                background: 'rgba(245, 154, 35, 1)',
                color: '#333',
                cursor: 'pointer'
              }
            } else if (num == 0) {
              return {
                background: '#ffffff',
                color: '#333',
                cursor: 'pointer'
              }
            }
          }
        }
      }
    },
    popSelectPeople () {
      this.duVisible = true
    },
    updateUser (obj) {
      Object.assign(this.selectObj, obj)
      let department = []
      let user = []
      obj.department.map(item => {
        department.push(item.department_id)
      })
      obj.user.map(item => {
        user.push(item.user_id)
      })
      this.params.department = department
      this.params.user = user
      this.params.departmentAndName = obj.nameArr.join('、')
    }
  },
  components: {
    SelectDepartmentsAndPeople,
    TaskPop
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .title {
    line-height: 35px;
    .icon-renyuan {
      color: #526ecc;
      font-size: 18px;
      padding: 0 5px;
    }
  }
  .searchWrap {
    background-color: #eff1f6;
    padding: 15px 10px;
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
  .btsWrap {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .leftItem {
      display: flex;
      align-items: center;
    }
    .rightItem {
      display: flex;
      align-items: center;
      .item {
        margin-right: 20px;
        display: flex;
        align-items: center;
        font-size: 14px;
        i {
          display: inline-block;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          margin-right: 5px;
        }
      }
    }
  }
  .redColor {
    background-color: rgba(217, 0, 27, 1);
    color: #fff;
  }
  .greenColor {
    background-color: rgba(23, 114, 6, 1);
    color: #fff;
  }
  .orangeColor {
    background-color: rgba(245, 154, 35, 1);
    color: #fff;
  }
  .whiteColor {
    background-color: #fff;
    border: 1px solid #ccc;
  }
}
</style>
