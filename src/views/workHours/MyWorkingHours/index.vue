<template>
  <div class="wrap" v-loading="detailLoading">
    <div class="title">
      <i class="iconfont el-icon-edit-outline"></i>我的任务工时
    </div>
    <div class="filter">
      <div class="items">
        <div
          v-for="(item, index) in timeRang"
          :key="index"
          :class="timeActive === index ? 'item active' : 'item '"
          @click="changeTime(item.tip, index)"
        >
          {{ item.text }}
        </div>
      </div>
      <div class="timeWrap">
        <el-date-picker
          v-model="filter.time"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        >
        </el-date-picker>
      </div>
      <el-button type="primary" size="mini" @click="doSearch">查询</el-button>
    </div>
    <div class="main">
      <div class="item">
        <div class="tip">已填写工时</div>
        <div class="num">{{ tableData.total_list.hour }}</div>
      </div>
      <div class="item">
        <div class="tip">已填写任务数</div>
        <div class="num">{{ tableData.total_list.task_num }}</div>
      </div>
      <div class="item">
        <div class="tip">已填项目数</div>
        <div class="num">{{ tableData.total_list.project_num }}</div>
      </div>
    </div>
    <div class="tableTitle">
      <div class="tip"><i class="el-icon-c-scale-to-original"></i>任务详情</div>
      <div class="screenWrap">
        <div class="screen" @click="showFilter = !showFilter">
          <i class="iconfont icon-guolvqi"></i>任务过滤
        </div>
        <el-button type="danger" size="mini" @click="delTask()"
          >删除任务</el-button
        >
        <div class="condition" v-show="showFilter">
          <el-form ref="form" label-width="90px">
            <el-form-item label="项目名称：">
              <el-select
                v-model="filter.project_id"
                placeholder="请选择项目名称"
                size="mini"
              >
                <el-option
                  v-for="(item, index) in projectList"
                  :key="index"
                  :label="item.project_name"
                  :value="item.project_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务状态：">
              <el-select
                v-model="filter.task_status"
                placeholder="请选择任务状态"
                size="mini"
              >
                <el-option
                  v-for="(item, index) in statuList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务类型：">
              <div @click="chooseTaskType()">
                <el-input
                  size="mini"
                  v-model="filter.taskType"
                  readonly
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" size="mini"
                >查询</el-button
              >
              <el-button size="mini" @click="reseting">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData.work_list"
      style="width: 100%;margin-bottom: 20px;"
      border
      default-expand-all
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="category_name" label="任务类型"> </el-table-column>
      <el-table-column prop="title" label="任务标题"> </el-table-column>
      <el-table-column prop="project_name" label="项目标题"> </el-table-column>
      <el-table-column prop="task_status_name" label="任务状态">
      </el-table-column>
      <el-table-column prop="charge_name" label="责任人"> </el-table-column>
      <el-table-column prop="percent" label="任务进度" width="130">
        <template slot-scope="scope">
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="scope.row.percent"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="hour" label="已填报工时"> </el-table-column>
    </el-table>
    <task-type-tree
      :treeDialogVisible="tree.treeDialogVisible"
      :project_id="this.filter.project_id"
      :defaultId="tree.defaultId"
      @cancleTypeTree="cancleTypeTree"
      @saveTypeTree="saveTypeTree"
    />
  </div>
</template>
<script>
import { myWorkHourList, getProjectList } from '@/api/workHours'
import TaskTypeTree from '../components/TaskTypeTrees'
export default {
  name: 'MyWorkingHours',
  data() {
    return {
      detailLoading: false,
      projectList: [],
      filter: {
        project_id: null,
        task_status: null,
        taskType: null,
        category_id: null,
        time: []
      },
      showFilter: false,
      timeActive: 0,
      timeRang: [
        { text: '今日', tip: 'today' },
        { text: '昨日', tip: 'yesterday' },
        { text: '本周', tip: 'thisWeek' },
        { text: '上周', tip: 'lastWeek' }
      ],
      statuList: [
        { label: '全部', value: null },
        { label: '未开始', value: '0' },
        { label: '进行中', value: '1' },
        { label: '已完成', value: '2' },
        { label: '已逾期', value: '3' }
      ],
      tree: {
        treeDialogVisible: false,
        defaultId: null
      },
      tableData: {
        total_list: {},
        work_list: []
      },
      multipleSelection: []
    }
  },
  created() {
    let new_Date = new Date()
    let timesStamp = new_Date.getTime()
    let today = new Date(timesStamp).toLocaleDateString().replace(/\//g, '-')
    this.filter.time = [today, today]
    this.getMyWorkHourList()
    this.getProjectListFn()
  },
  methods: {
    async getMyWorkHourList() {
      this.detailLoading = true
      let obj = {
        start_day: this.filter.time[0],
        end_day: this.filter.time.length > 1 ? this.filter.time[1] : null,
        project_id: this.filter.project_id,
        task_status: this.filter.task_status,
        category_id: this.filter.category_id
      }
      try {
        let { data } = await myWorkHourList(obj)
        this.tableData.total_list = data.total_list
        this.tableData.work_list = data.work_list
      } catch (error) {
        this._message(error)
      }
      this.detailLoading = false
    },
    async getProjectListFn() {
      try {
        let { data } = await getProjectList()
        this.projectList = data
      } catch (error) {
        this._message(error)
      }
    },
    changeTime(tip, index) {
      this.timeActive = index
      let new_Date = new Date()
      let timesStamp = new_Date.getTime()
      let currenDay = new_Date.getDay()
      let today = new Date(timesStamp).toLocaleDateString().replace(/\//g, '-')
      let yesterday = new Date(timesStamp - 24 * 60 * 60 * 1000)
        .toLocaleDateString()
        .replace(/\//g, '-')

      if (tip === 'today') {
        this.filter.time = [today, today]
      } else if (tip === 'yesterday') {
        this.filter.time = [yesterday, yesterday]
      } else if (tip === 'thisWeek') {
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
        this.filter.time = [dates[0], dates[6]]
      } else if (tip === 'lastWeek') {
        let dates = []
        for (let i = 0; i < 7; i++) {
          dates.push(
            new Date(
              timesStamp + 24 * 60 * 60 * 1000 * (i - ((currenDay + 6) % 7) - 7)
            )
              .toLocaleDateString()
              .replace(/\//g, '-')
          )
        }
        this.filter.time = [dates[0], dates[6]]
      }
      this.filter.project_id = null
      this.filter.task_status = null
      this.filter.taskType = null
      this.filter.category_id = null

      this.getMyWorkHourList()
      // console.log(this.filter.time)
    },
    chooseTaskType() {
      if (this.filter.project_id === null) {
        this.$message({
          message: '请先现在项目',
          type: 'warning'
        })
        return
      }
      this.tree.treeDialogVisible = true
    },
    reseting() {
      this.filter.project_id = null
      this.filter.task_status = null
      this.filter.taskType = null
      this.filter.category_id = null
    },
    cancleTypeTree() {
      this.tree.treeDialogVisible = false
    },
    saveTypeTree(item) {
      this.filter.taskType = item[0].category_name
      this.filter.category_id = item[0].category_id
      this.tree.treeDialogVisible = false
    },
    onSubmit() {
      this.showFilter = false
      this.getMyWorkHourList()
    },
    doSearch() {
      this.getMyWorkHourList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    delTask() {
      console.log(this.multipleSelection)
    }
  },
  components: {
    TaskTypeTree
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .title {
    line-height: 35px;
    .iconfont {
      color: #526ecc;
      font-size: 18px;
      padding: 0 5px;
    }
  }
  .filter {
    background: #f1f1f1;
    padding: 5px 10px;
    display: flex;
    .items {
      display: flex;
      .item {
        width: 60px;
        height: 30px;
        border: 1px solid #c8c8c8;
        background: #fff;
        color: #526ecc;
        text-align: center;
        line-height: 30px;
        font-size: 12px;
        cursor: pointer;
        &.active {
          background-color: #526ecc;
          color: #fff;
        }
        &:hover {
          background-color: #526ecc;
          color: #fff;
        }
      }
    }
    .timeWrap {
      width: 300px;
      margin-left: 100px;
      margin-right: 100px;
    }
  }
  .main {
    margin-top: 10px;
    height: 150px;
    background: #f1f1f1;
    display: flex;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .tip {
      }
      .num {
        font-weight: bold;
        line-height: 50px;
      }
    }
  }
  .tableTitle {
    display: flex;
    justify-content: space-between;
    padding: 0 20px 0 0;
    align-items: center;
    font-size: 13px;
    .tip {
      line-height: 40px;
      display: flex;
      align-items: center;
      i {
        font-size: 20px;
        color: #526ecc;
        margin-right: 5px;
      }
    }
    .screenWrap {
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      .condition {
        position: absolute;
        z-index: 99;
        top: 40px;
        right: 0;
        width: 300px;
        height: 400px;
        padding: 20px 10px;
        background-color: #fff;
        box-shadow: 0px 7px 16px 0px rgba(38, 46, 49, 0.3);
      }
      .screen {
        line-height: 40px;
        margin-right: 20px;
        display: flex;
        align-items: center;
        i {
          font-size: 20px;
          color: #526ecc;
          margin-right: 5px;
        }
        .el-button--mini {
          height: 30px;
          margin-left: 20px;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
