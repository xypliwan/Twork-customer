<template>
  <div class="wrap">
    <div class="title">
      <i class="iconfont icon-tianxie"></i>填报工时
      <span class="tip">填报规则：填报的每日工时不得少于8小时</span>
    </div>
    <!-- <el-button @click="addTasks" size="small">选择任务</el-button>
    <el-button type="primary" size="small" @click="saveAll">保存</el-button> -->
    <!-- <add-task
      @save="saveAdd"
      @cancle="cancleAdd"
      :addTaskDialogVisible="addTaskDialogVisible"
      :task_ids="task_ids"
      :time="dateValue"
    ></add-task> -->
    <div class="dateFilters">
      <el-button type="primary" size="mini" @click="lastWeek('last')"
        >上一周</el-button
      >
      <el-date-picker
        v-model="dateValue"
        style="width: 250px;margin: 0 10px"
        size="mini"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :clearable="false"
        readonly
      >
      </el-date-picker>
      <el-button type="primary" size="mini" @click="lastWeek('next')"
        >下一周</el-button
      >
      <el-button type="primary" size="mini" @click="ThisWeek()">本周</el-button>
      <el-button type="danger" size="mini" @click="copyLastWeek()"
        >复制上周</el-button
      >
      <i
        class="addIcon el-icon-circle-plus"
        @click="addItem()"
        style="color:#526ecc"
      />
    </div>
    <el-table
      :data="tableList"
      show-summary
      style="width: 100%"
      sum-text="每日工时总计"
      :summary-method="getSummaries"
      :row-style="this.$root.tableContentStyle"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      stripe
      @cell-click="handleCellClick"
      v-loading="tableLoading"
      max-height="700"
    >
      <el-table-column width="80" fixed prop="bt" align="center">
        <template slot-scope="scope">
          <div class="iconWrap">
            <!-- <i
              class="icon el-icon-circle-plus"
              @click="addItem(scope.row, scope.$index)"
            /> -->
            <i
              class="icon el-icon-remove-outline"
              @click="removeItem(scope.row, scope.$index)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="project_name"
        label="项目名称"
        align="center"
        fixed
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <div class="task-name" v-if="scope.row.canChoose == 1">
            <el-select
              v-model="scope.row.project_id"
              placeholder="请选择项目"
              size="mini"
              @change="changeProject(scope.row)"
            >
              <el-option
                v-for="(item, index) in projectData"
                :key="index"
                :label="item.project_name"
                :value="item.project_id"
              ></el-option>
            </el-select>
          </div>
          <div class="task-name" v-else>
            {{ scope.row.project_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="任务类型"
        prop="category_name"
        align="center"
        width="150"
        fixed
        sortable
      >
        <template slot-scope="scope">
          <div
            class="task-name"
            v-if="scope.row.canChoose == 1"
            @click="chooseTask(scope.row)"
          >
            <el-input
              size="mini"
              v-model="scope.row.category_name"
              placeholder="请选择任务类型"
              readonly
            ></el-input>
          </div>
          <div class="task-name" v-else>
            {{ scope.row.category_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="任务标题"
        width="150"
        align="center"
        fixed
        sortable
      >
        <template slot-scope="scope">
          <div class="task-name" v-if="scope.row.canChoose == 1">
            <el-input
              size="mini"
              v-model="scope.row.title"
              placeholder="请输入任务标题"
            ></el-input>
          </div>
          <div class="task-name" v-else>
            {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="role_name" label="角色名称" align="center" fixed>
        <template slot-scope="scope">
          <div class="task-name" v-if="scope.row.ifSave == 0">
            <el-select
              v-model="scope.row.role_id"
              placeholder="请选择角色"
              size="mini"
            >
              <el-option
                v-for="(item, index) in roleList"
                :key="index"
                :label="item.role_name"
                :value="item.role_id"
              ></el-option>
            </el-select>
          </div>
          <div class="task-name" v-else>
            {{ scope.row.role_name }}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        v-for="(item, i) in tableHeader"
        :key="i"
        :label="item.label"
        align="center"
        :prop="item.prop"
      >
      </el-table-column>
      <el-table-column
        prop="all_work_hour"
        label="任务工时总计"
        width="120"
        align="center"
      >
      </el-table-column>
    </el-table>

    <edit-hours
      :visible.sync="editVisible"
      :objInfo="objInfo"
      @updateOk="updateOk"
    ></edit-hours>
    <task-type-tree
      :treeDialogVisible="tree.treeDialogVisible"
      :defaultId="tree.defaultId"
      :project_id="tree.project_id"
      :tableList="tableList"
      @cancleTypeTree="cancleTypeTree"
      @saveTypeTree="saveTypeTree"
      :duoxuan="true"
      :index="index"
    />
  </div>
</template>
<script>
import TaskTypeTree from '../components/TaskTypeTrees'
import {
  workHourList,
  workHourDel,
  // saveWorkHours,
  // getUserRole,
  getProjectList,
  copyLastWeekData
} from '@/api/workHours'
// import AddTask from './components/AddTask'
import EditHours from './components/EditHours'
import { mapGetters } from 'vuex'
import { add } from '_u/utils'
export default {
  name: 'WriteWorkHours',
  data () {
    return {
      dateValue: [],
      projectData: [],
      tableHeader: [],
      tableList: [],
      params: {
        start_day: '',
        end_day: ''
      },
      tableLoading: false,
      editVisible: false,
      objInfo: {
        project_id: '',
        task_id: '',
        title: '',
        category_id: '',
        day: '',
        hour: '',
        text: {
          desc: '',
          question: '',
          solution: ''
        }
      },
      tree: {
        project_id: null,
        treeDialogVisible: false,
        defaultId: null
      },
      addTaskDialogVisible: false,
      task_ids: [],
      roleList: [], //角色列表
      deleteList: [], //记录数据库已经保存的数据被左边减号按钮点击了
      index: null //数据唯一标识，判断点击的是哪条数据 项目id+任务类型id 构成唯一
    }
  },
  created () {
    this.setDefaultDate() //设置默认时间 为本周
    // this.getUserRole() //获取角色列表
    this.getProjectListFn() //获取项目列表
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    handleCellClick (row, column) {
      this.index = row.project_id + row.category_id
      if (
        [
          'project_name',
          'category_name',
          'title',
          'bt',
          'all_work_hour',
          'role_name'
        ].includes(column.property)
      ) {
        return
      } else if (!row.day_list.includes(column.property)) {
        return
        // this.$message({
        //   showClose: true,
        //   message: '不在项目周期内',
        //   type: 'warning'
        // })
      } else if (
        row.project_id === '' ||
        row.project_id === undefined ||
        row.title === '' ||
        row.category_id === ''
      ) {
        this.$message({
          message: '请先选择项目名称/任务类型/任务标题',
          type: 'warning'
        })
        return false
      } else {
        for (let i in row) {
          if (i == column.property) {
            this.objInfo.day = i
          }
        }
        row.child.map(item => {
          if (item.day == column.property) {
            this.objInfo.project_id = row.project_id
            this.objInfo.task_id = row.task_id
            this.objInfo.title = row.title
            this.objInfo.category_id = row.category_id
            this.objInfo.day = item.day
            this.objInfo.text = item.text
            this.objInfo.hour = row[item.day]
            this.objInfo.start_day = this.params.start_day
            this.objInfo.end_day = this.params.end_day
          }
        })
        this.editVisible = true
      }
    },
    async getWorkHourList () {
      this.tableLoading = true
      try {
        let {
          data: { tableData, titleData }
        } = await workHourList(this.params)
        this.tableHeader = titleData
        tableData.map((item, index) => {
          item.ifSave = 1 //是否已经保存过的 1代表已经有的，0代表新增的
          item.canChoose = 0 //1代表项目名称，任务类型，任务标题可以下拉筛选，0代表不能
          // item.titleList = [] //默认任务标题下拉为空
          item.index = index
        })
        this.tableList = tableData
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    },
    setDefaultDate () {
      //设置时间筛选框的默认日期，本周
      let new_Date = new Date()
      let timesStamp = new_Date.getTime()
      let currenDay = new_Date.getDay()
      let dates = []
      for (let i = 0; i < 7; i++) {
        dates.push(
          new Date(
            timesStamp + 24 * 60 * 60 * 1000 * (i - ((currenDay + 6) % 7))
          )
            .toLocaleDateString()
            .replace(/\//g, '-')
        )
      }
      this.dateValue = [dates[0], dates[6]]
      this.params.start_day = dates[0]
      this.params.end_day = dates[6]
      this.getWorkHourList()
    },
    ThisWeek () {
      let canNext = true
      for (let i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].ifSave === 0) {
          canNext = false
        }
      }
      let that = this
      if (!canNext) {
        this.$confirm('本周存在未保存的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.setDefaultDate()
        })
      } else {
        that.setDefaultDate()
      }
    },
    lastWeek (tip) {
      let canNext = true
      for (let i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].ifSave === 0) {
          canNext = false
        }
      }
      let that = this
      if (!canNext) {
        this.$confirm('本周存在未保存的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.next(tip)
        })
      } else {
        that.next(tip)
      }
    },
    async copyLastWeek () { // 复制上周
      this.tableLoading = true
      try {
        let task_id = []
        let list = []
        this.tableList.map(item => {
          if (parseInt(item.task_id) !== 0) {
            task_id.push(item.task_id)
          }
          if (parseInt(item.task_id) === 0) {
            list.push({ project_id: item.project_id, category_id: item.category_id })
          }
        })
        let {
          data: { tableData, titleData }
        } = await copyLastWeekData({
          start_day: this.params.start_day,
          task_id: task_id,
          list: list
        })
        this.tableHeader = titleData
        tableData.map((item, index) => {
          item.ifSave = 0 //是否已经保存过的 1代表已经有的，0代表新增的
          item.canChoose = 0 //1代表项目名称，任务类型，任务标题可以下拉筛选，0代表不能
          item.index = index
        })
        this.tableList = [...this.tableList, ...tableData]
        this.tableLoading = false
      } catch (error) {
        this.tableLoading = false
        this._message(error)
      }
    },
    next (tip) {
      let arr = []
      this.dateValue.map((item, index) => {
        let currentWeek = new Date(this.dateValue[index])
        let lastWeek
        if (tip === 'last') {
          lastWeek = new Date(currentWeek.getTime() - 24 * 60 * 60 * 1000 * 7)
        } else {
          lastWeek = new Date(currentWeek.getTime() + 24 * 60 * 60 * 1000 * 7)
        }
        let YY = lastWeek.getFullYear()
        let MM =
          lastWeek.getMonth() + 1 < 10
            ? '0' + (lastWeek.getMonth() + 1)
            : lastWeek.getMonth() + 1
        let DD =
          lastWeek.getDate() < 10
            ? '0' + lastWeek.getDate()
            : lastWeek.getDate()
        arr[index] = YY + '-' + MM + '-' + DD
      })
      this.dateValue = arr
      this.params.start_day = arr[0]
      this.params.end_day = arr[1]
      this.getWorkHourList()
    },
    async getProjectListFn () {
      try {
        let { data } = await getProjectList({
          status: '1'
        })
        this.projectData = data
      } catch (error) {
        this._message(error)
      }
    },
    chooseTask (item) {
      // console.log(item)
      if (item.project_id === '' || item.project_id === undefined) {
        this.$message({
          message: '请先选择项目',
          type: 'warning'
        })
        return false
      }
      this.tree.defaultId = [item.task_id]
      // this.index = item.index
      this.index = item.project_id + item.category_id
      this.tree.project_id = item.project_id
      this.tree.treeDialogVisible = true
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0 || index === 1 || index === 3) {
          sums[index] = ''
          return
        }
        if (index === 2) {
          sums[index] = '每日工时统计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return add(prev, curr)
            } else {
              return prev.toFixed(1)
            }
          }, 0)
          // sums[index] += '✘'
          sums[index] += ' '
          // sums[index] += '√'
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    cellStyle ({ row, column }) {
      if (
        [
          'project_name',
          'category_name',
          'title',
          'bt',
          'all_work_hour',
          'role_name'
        ].includes(column.property)
      ) {
        return ''
      }
      if (!row.day_list.includes(column.property)) {
        //该日期不可修改
        return 'cursor: not-allowed;background-color: #e8e8e8;'
      } else {
        return 'cursor: pointer;'
      }
    },
    /* eslint-disable */
    headerCellStyle ({ row, column, rowIndex, columnIndex }) {
      if (column.property == this.getToday()) {
        return ' color: #526ecc;font-weight: bold;font-size: 13px;height: 40px'
      }
    },
    /* eslint-enable */
    //表格左边的添加icon
    addItem () {
      let canAdd = true
      for (let i = 0; i < this.tableList.length; i++) {
        if (
          this.tableList[i].project_name === '' ||
          this.tableList[i].category_name === ''
        ) {
          canAdd = false
          break
        }
      }
      let obj = {
        project_id: '',
        project_name: '',
        category_name: '',
        category_id: '',
        task_id: '0',
        title: '',
        all_work_hour: 0,
        day_list: [],
        child: [],
        index: this.tableList.length,
        ifSave: 0,
        canChoose: 1,
        role_id: ''
      }
      let today = this.getToday()
      this.tableHeader.map(i => {
        if (parseInt(today) >= parseInt(i.prop)) {
          obj.day_list.push(i.prop) //比今天大的都不能填置灰
        }
        obj[i.prop] = ''
        obj.child.push({
          day: i.prop,
          text: {
            desc: '',
            question: '',
            solution: ''
          }
        })
      })
      // this.tableList.splice(index + 1, 0, obj)
      if (canAdd) {
        this.tableList.unshift(obj)
      }
    },
    //表格左边的减号icon
    removeItem (item) {
      if (item.ifSave == 1) {
        //已经存入到数据库的数据
        this.workHourDel(item.task_id)
      }
      this.tableList.map((item2, i) => {
        if (
          item2.project_id + item2.category_id ===
          item.project_id + item.category_id
        ) {
          this.tableList.splice(i, 1)
        }
      })
    },
    async workHourDel (id) {
      try {
        await workHourDel({ task_id: id })
      } catch (error) {
        this._message(error)
      }
    },
    changeProject (row) {
      this.projectData.map(item => {
        if (item.project_id === row.project_id) {
          row.project_name = item.project_name
        }
      })
      this.tableHeader.map(item => {
        row[item.prop] = ''
      })
      // row.titleList = []
      // row.day_list = []
      row.category_id = ''
      row.category_name = ''
      // row.role_id = ''
      // row.task_id = ''
      // row.title = ''
    },
    getToday () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let today = year + month + strDate
      return today
    },
    cancleTypeTree () {
      this.tree.treeDialogVisible = false
    },
    saveTypeTree (item) {
      let project_id
      let project_name
      let num = 0
      this.tableList.map((i, j) => {
        if (i.project_id + i.category_id === this.index) {
          project_id = i.project_id
          project_name = i.project_name
          num = j
          this.tableList.splice(j, 1)
        }
      })
      let obj = {
        day_list: [],
        child: []
      }
      let today = this.getToday()
      this.tableHeader.map(i => {
        if (parseInt(today) >= parseInt(i.prop)) {
          obj.day_list.push(i.prop) //比今天大的都不能填置灰
        }
        obj[i.prop] = ''
        obj.child.push({
          day: i.prop,
          text: {
            desc: '',
            question: '',
            solution: ''
          }
        })
      })
      item.map((i, index) => {
        let obj2 = JSON.parse(
          JSON.stringify({
            project_id: project_id,
            project_name: project_name,
            category_name: i.category_name,
            category_id: i.category_id,
            task_id: '0',
            title: i.category_name,
            all_work_hour: 0,
            index: this.tableList.length,
            ifSave: 0,
            canChoose: 1,
            role_id: '',
            ...obj
          })
        )
        this.tableList.splice(num + parseInt(index), 0, obj2)
      })
      this.tree.treeDialogVisible = false
    },
    updateOk (value) {
      this.tableList.map(item => {
        if (item.project_id + item.category_id === this.index) {
          //证明之前是选的当前行的
          item.ifSave = 1
          item.canChoose = 0
          item.task_id = value.task_id
          item[value.day] = value.hour
          item.child.map(item2 => {
            if (item2.day === value.day) {
              item2.text.desc = value.desc
              item2.text.question = value.question
              item2.text.solution = value.solution
            }
          })
          let total = 0
          this.tableHeader.map(i => {
            if (item[i.prop] !== '' && item[i.prop] !== null) {
              total = parseFloat(item[i.prop]) + parseFloat(total) //保存的时候自动计算任务总工时
            }
          })
          item.all_work_hour = total
        }
      })
      this.editVisible = false
    }
    // async getUserRole () {
    //   try {
    //     let { data } = await getUserRole()
    //     this.roleList = data
    //   } catch (error) {
    //     this._message(error)
    //   }
    // }
    // cancleAdd () {
    //   this.addTaskDialogVisible = false
    // },
    //选择任务按钮保存来的
    // saveAdd (arr) {
    //   let newArr = []
    //   arr.map((item, index) => {
    //     let obj = {
    //       project_id: item.project_id,
    //       project_name: item.project_name,
    //       category_name: item.category_name,
    //       category_id: item.category_id,
    //       task_id: item.task_id,
    //       title: item.title,
    //       all_work_hour: 0,
    //       // titleList: [],
    //       day_list: item.child,
    //       child: [],
    //       index: this.tableList.length + index,
    //       ifSave: 0,
    //       canChoose: 0,
    //       role_id: ''
    //     }
    //     this.tableHeader.map(item2 => {
    //       obj[item2.prop] = ''
    //       obj.child.push({
    //         day: item2.prop,
    //         text: {
    //           desc: '',
    //           question: '',
    //           solution: ''
    //         }
    //       })
    //     })
    //     item.child.map(item => {
    //       //可填的日期初始化赋值为空
    //       obj[item] = ''
    //     })
    //     newArr.push(obj)
    //   })
    //   this.tableList.push(...newArr)
    //   this.addTaskDialogVisible = false
    // },
    // addTasks () {
    //   let taskid = []
    //   this.tableList.map(item => {
    //     if (item.ifSave == 1) {
    //       //证明是一开始接口返回的数据 ，不是添加按钮添加的
    //       taskid.push(item.task_id)
    //     }
    //   })
    //   this.task_ids = taskid
    //   this.addTaskDialogVisible = true
    // },
    // async getInfoByTaskId(item) {
    //   //通过任务类型id获取任务标题
    //   this.titleListLoading = true
    //   try {
    //     let project_id
    //     this.tableList.map(i => {
    //       if (i.index === this.index) {
    //         project_id = i.project_id
    //       }
    //     })
    //     let obj = {
    //       category_id: item[0].category_id,
    //       project_id: project_id
    //     }
    //     let { data } = await getInfoByTaskId(obj)
    //     this.tableList.map(i => {
    //       if (i.index === this.index) {
    //         i.titleList = data
    //       }
    //     })
    //     this.titleListLoading = false
    //   } catch (error) {
    //     this._message(error)
    //   }
    // },
    // async saveAll() {
    //   let update = []
    //   let add = []
    //   let canSave = true
    //   this.tableList.map(item => {
    //     if (
    //       item.project_id === '' ||
    //       item.category_name === '' ||
    //       item.title === ''
    //     ) {
    //       this.$message({
    //         message: '请填写完整',
    //         type: 'warning'
    //       })
    //       canSave = false
    //       return false
    //     } else {
    //       if (item.ifSave == 1) {
    //         update.push(item)
    //       } else if (item.ifSave == 0) {
    //         add.push(item)
    //       }
    //     }
    //   })
    //   if (canSave) {
    //     this.tableLoading = true
    //     let delectArr = []
    //     this.deleteList.map(item => {
    //       delectArr.push(item.task_id)
    //     })
    //     let obj = {
    //       update: update,
    //       add: add,
    //       delete: delectArr
    //     }
    //     try {
    //       await saveWorkHours(obj)
    //       this.$message({
    //         message: '保存成功',
    //         type: 'success'
    //       })
    //       this.getWorkHourList()
    //     } catch (error) {
    //       this._message(error)
    //     }
    //     this.tableLoading = false
    //   }
    // },
    // changeTaskTitle(row, taskid) {
    //   //现在任务标题，改变后
    //   let daylist = [] //可填写的日期
    //   row.titleList.map(item => {
    //     if (item.task_id === taskid) {
    //       daylist = item.child
    //     }
    //   })
    //   row.day_list = daylist
    //   daylist.map(item => {
    //     row[item] = '' //可填写日期的自动赋值为空
    //   })
    // },
  },
  components: {
    // AddTask,
    EditHours,
    TaskTypeTree
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .title {
    line-height: 35px;
    .icon-tianxie {
      color: #526ecc;
      font-size: 18px;
      padding: 0 5px;
    }
    .tip {
      margin-left: 20px;
      font-size: 13px;
      color: #777;
    }
  }
  .dateFilters {
    padding: 10px 5px;
    display: flex;
    justify-content: flex-end;
    position: relative;
    .addIcon {
      position: absolute;
      left: 10px;
      bottom: -40px;
      z-index: 99;
      color: #606266;
    }
    .save {
      margin-left: 20px;
    }
  }
  .classify {
    cursor: pointer;
  }
  .iconWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .icon {
    font-size: 18px;
    cursor: pointer;
  }
  .task-name {
    ::v-deep .el-input__inner {
      border: 1px solid rgba(0, 0, 0, 0);
      font-size: 13px;
      padding: 0 5px;
      text-align: center;
      &:hover {
        color: #409eff;
      }
    }
    &:hover {
      ::v-deep .el-input__inner {
        border: 1px solid #dcdfe6;
      }
    }
  }
}
</style>
