<template>
  <div class="wrap">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :row-style="this.$root.tableContentStyle"
      :header-cell-style="this.$root.tableTitileStyle"
      stripe
    >
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column label="任务类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <div
            class="classify task-name"
            @click="popTaskTree(scope.row)"
            v-if="scope.row.can_update == 1"
          >
            <el-input
              placeholder="选择任务类型"
              v-model="scope.row.category_name"
              size="mini"
              readonly
            ></el-input>
          </div>
          <div v-else>{{ scope.row.category_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="任务标题">
        <template slot-scope="scope">
          <div class="task-name" v-if="scope.row.can_update == 1">
            <el-input
              size="mini"
              v-model="scope.row.title"
              @blur="blurInput(scope.row)"
            ></el-input>
          </div>
          <div v-else>{{ scope.row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="130">
        <template slot-scope="scope">
          <template v-if="scope.row.can_update == 1">
            <div class="selectStatue">
              <el-select
                v-model="scope.row.task_status"
                size="mini"
                style="height:35px;line-height:35px"
                @change="changeStatus(scope.row)"
              >
                <el-option
                  v-for="item2 in statusList"
                  :disabled="item2.num !== '2'"
                  :key="item2.num"
                  :label="item2.text"
                  :value="String(item2.num)"
                >
                </el-option>
              </el-select>
            </div>
          </template>
          <!-- <template v-else>
            <div :class="scope.row.task_status | chooseStatus('divClass')">
              <i :class="scope.row.task_status | chooseStatus('iClass')"></i>
              {{ scope.row.task_status | chooseStatus('text') }}
            </div>
          </template> -->
          <template v-else>
            {{ scope.row.task_status_name }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="charge_name" label="责任人">
        <template slot-scope="scope">
          <div class="selectStatue">
            <el-select
              v-model="scope.row.charge_id"
              multiple
              size="mini"
              style="height:35px;line-height:35px"
              @change="changePeopleList(scope.row)"
            >
              <el-option
                v-for="item in peopleList"
                :key="item.user_id"
                :label="item.username"
                :value="item.user_id"
              >
              </el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="任务进度" align="center" width="100px">
        <template slot-scope="scope">
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="scope.row.percent"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="开始 / 结束" width="300px" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.can_update == 1">
            <el-date-picker
              style="width:280px;"
              v-model="scope.row.time"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeTime(scope.row)"
              size="mini"
            >
            </el-date-picker>
          </div>
          <div v-else>
            {{ scope.row.start_at | checkTime }} -
            {{ scope.row.end_at | checkTime }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            v-if="scope.row.can_del == 1"
            @click="deleteItem(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <task-type-tree
      :treeDialogVisible="tree.treeDialogVisible"
      :project_id="projectId"
      :defaultId="tree.defaultId"
      @cancleTypeTree="cancleTypeTree"
      @saveTypeTree="saveTypeTree"
      :duoxuan="true"
    />
  </div>
</template>
<script>
import TaskTypeTree from '../../components/TaskTypeTrees'
import common from '@/utils/common'
import { updateTaskList, delProjectTask, taskPeopleList } from '@/api/workHours'
export default {
  name: '',
  data () {
    return {
      statusList: [
        { num: '0', text: '未开始', icon: 'el-icon-date', class: 'statu0' },
        {
          num: '1',
          text: '进行中',
          icon: 'el-icon-edit-outline',
          class: 'statu1'
        },
        { num: '2', text: '已完成', icon: 'el-icon-success', class: 'statu2' },
        { num: '3', text: '已逾期', icon: 'el-icon-time', class: 'statu3' }
      ],
      multipleSelection: [],
      tree: {
        treeDialogVisible: false,
        defaultId: null
      },
      taskID: null,
      peopleList: []
      // peopleID:null
    }
  },
  props: {
    projectId: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    popTaskTree (item) {
      this.tree.defaultId = item.category_id
      this.taskID = item.task_id
      this.tree.treeDialogVisible = true
    },
    blurInput (item) {
      let obj = {
        task_id: item.task_id,
        title: item.title
      }
      this.updateList(obj)
    },
    changeStatus (item) {
      let obj = {
        task_id: item.task_id, //任务id
        task_status: item.task_status //任务状态
      }
      this.updateList(obj)
    },
    changeTime (item) {
      if (item.time === null) {
        item.time = ['', '']
      }
      let obj = {
        task_id: item.task_id, //任务id
        start_at: item.time[0], //开始时间
        end_at: item.time[1] //结束时间
      }
      this.updateList(obj)
    },
    deleteItem (row) {
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let arr = []
          arr.push(row.task_id)
          this.doDel(arr)
        })
        .catch(() => { })
    },
    async updateList (obj) {
      Object.assign(obj, { project_id: this.projectId })
      try {
        await updateTaskList(obj)
        // this._message(message, 'success')
        this.$emit('getListAgain')
      } catch (error) {
        this._message(error)
      }
    },
    async doDel (arr) {
      //删除
      this.tableLoading = true
      let obj = {
        task_ids: arr,
        project_id: this.projectId
      }
      try {
        await delProjectTask(obj)
        this.$emit('getListAgain')
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    },
    delProjectTasks () {
      if (this.multipleSelection.length === 0) {
        this._message('请勾选任务')
        return false
      } else {
        let arr = []
        this.multipleSelection.map(item => {
          arr.push(item.task_id)
        })
        this.doDel(arr)
      }
    },
    cancleTypeTree () {
      this.tree.treeDialogVisible = false
    },
    saveTypeTree (item) {
      let obj = {
        task_id: this.taskID, //任务id
        category_id: item[0].category_id
      }
      this.updateList(obj)
      this.tree.treeDialogVisible = false
    },
    //获取责任人列表
    async getPersonList () {
      try {
        let params = {
          project_id: this.projectId //项目id
        }
        let { data } = await taskPeopleList(params)
        this.peopleList = data.workData
      } catch (error) {
        this._message(error)
      }
    },
    changePeopleList (item) {
      let obj = {
        task_id: item.task_id, //任务id
        charge_id: item.charge_id
      }
      this.updateList(obj)
    }
  },
  computed: {},
  components: {
    TaskTypeTree
  },
  created () {
    this.getPersonList()
  },
  watch: {
    projectId () {
      this.getPersonList()
    }
  },
  filters: {
    checkTime (value) {
      return common.checkTime(value)
    },
    chooseStatus (num, tip) {
      let arr = [
        { num: '0', text: '未开始', icon: 'el-icon-date', class: 'statu0' },
        {
          num: '1',
          text: '进行中',
          icon: 'el-icon-edit-outline',
          class: 'statu1'
        },
        { num: '2', text: '已完成', icon: 'el-icon-success', class: 'statu2' },
        { num: '3', text: '已逾期', icon: 'el-icon-time', class: 'statu3' }
      ]
      let index = arr.findIndex(item => item.num === num)
      if (tip === 'iClass') {
        return arr[index].icon
      } else if (tip === 'text') {
        return arr[index].text
      } else {
        return arr[index].class
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .classify {
    cursor: pointer;
  }
  .task-name {
    ::v-deep .el-input__inner {
      border: 1px solid rgba(0, 0, 0, 0);
      font-size: 13px;
      padding: 0 5px;
      // text-align: center;
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

  .statu3 {
    font-size: 13px;
    color: rgba(217, 0, 27, 1);
  }
  .statu2 {
    font-size: 13px;
    color: rgba(23, 114, 6, 1);
  }
  .statu1 {
    font-size: 13px;
    color: rgba(245, 154, 35, 1);
  }
  .statu0 {
    font-size: 13px;
    color: #000;
  }
}
</style>
