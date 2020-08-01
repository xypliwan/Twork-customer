<template>
  <div class="wrap">
    <add-task @addTaskOk="getListAgain" :showProjectSelect="true"></add-task>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      border
      row-key="id"
      :row-style="this.$root.tableContentStyle"
      :header-cell-style="this.$root.tableTitileStyle"
      :span-method="arraySpanMethod"
      :tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="项目标题/任务类型" width="150">
        <template slot-scope="scope">
          <span
            v-if="scope.row.child"
            :class="scope.row.child.length > 0 ? '' : 'ml'"
          >
            <i
              class="iconfont  projectIcon"
              :class="scope.row.icon"
              v-if="scope.row.icon"
              :style="{ color: scope.row.color }"
            ></i
            >{{ scope.row.project_name }}</span
          >
          <div
            class="classify task-name"
            @click="popTaskTree(scope.row)"
            v-else-if="!scope.row.child && scope.row.can_update == 1"
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
      <el-table-column prop="title" label="任务标题">
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
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <div class="selectStatue" v-if="scope.row.can_update == 1">
            <el-select
              v-model="scope.row.task_status"
              size="mini"
              style="height:35px;line-height:35px"
              @change="changeStatus(scope.row)"
            >
              <el-option
                v-for="item2 in statusList"
                :disabled="item2.value !== '2'"
                :key="item2.value"
                :label="item2.label"
                :value="String(item2.value)"
              >
              </el-option>
            </el-select>
          </div>
          <div v-else>
            {{ scope.row.task_status_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="charge_name" label="责任人"> </el-table-column>
      <el-table-column prop="percent" label="任务进度" width="130">
        <template slot-scope="scope">
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="scope.row.progress"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="tag_name" label="任务标签（最多添加三个）">
      </el-table-column>
      <el-table-column prop="time" label="开始/结束" width="300">
        <template slot-scope="scope">
          <div>
            <el-date-picker
              style="width:280px;"
              v-model="scope.row.time"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              @change="changeTime(scope.row)"
            >
            </el-date-picker>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <task-type-tree
      :treeDialogVisible="tree.treeDialogVisible"
      :project_id="projectId"
      :defaultId="tree.defaultId"
      @cancleTypeTree="cancleTypeTree"
      @saveTypeTree="saveTypeTree"
    />
  </div>
</template>
<script>
import AddTask from './../../components/AddTask'
import TaskTypeTree from '../../components/TaskTypeTrees'
import { updateTaskList } from '@/api/workHours'
export default {
  data() {
    return {
      statusList: [
        { label: '未开始', value: '0' },
        { label: '进行中', value: '1' },
        { label: '已完成', value: '2' },
        { label: '已逾期', value: '3' }
      ],
      projectId: null,
      tree: {
        treeDialogVisible: false,
        defaultId: null
      }
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      //判断哪一条数据合并格
      if (row.child) {
        return [1, 7]
      }
    },
    blurInput(item) {
      let obj = {
        task_id: item.task_id,
        title: item.title,
        project_id: item.project_id
      }
      this.updateList(obj)
    },
    popTaskTree(item) {
      this.projectId = item.project_id
      this.tree.defaultId = item.category_id
      this.taskID = item.task_id
      this.tree.treeDialogVisible = true
    },
    getListAgain() {
      this.$emit('getListAgain')
    },
    changeTime(item) {
      if (item.time === null) {
        item.time = ['', '']
      }
      let obj = {
        task_id: item.task_id, //任务id
        start_at: item.time[0],
        end_at: item.time[1],
        project_id: item.project_id
      }
      this.updateList(obj)
    },
    changeStatus(item) {
      let obj = {
        task_id: item.task_id, //任务id
        task_status: item.task_status, //任务状态
        project_id: item.project_id
      }
      this.updateList(obj)
    },
    cancleTypeTree() {
      this.tree.treeDialogVisible = false
    },
    saveTypeTree(item) {
      let obj = {
        task_id: this.taskID, //任务id
        category_id: item[0].category_id,
        project_id: this.projectId
      }
      this.updateList(obj)
      this.tree.treeDialogVisible = false
    },
    async updateList(obj) {
      try {
        await updateTaskList(obj)
        this.$emit('getListAgain')
      } catch (error) {
        this._message(error)
      }
    }
  },
  components: {
    AddTask,
    TaskTypeTree
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .projectIcon {
    margin: 0 5px;
  }
  // ::v-deep .el-table__expand-icon {
  //   position: absolute;
  //   left: 0;
  //   // & + span {
  //   //   padding-left: 5px;
  //   // }
  // }
  .ml {
    margin-left: 23px;
  }
  ::v-deep .el-table_1_column_1 .cell {
    display: flex;
  }
  // ::v-deep .el-table__row--level-0 {
  //   background-color: #ccc;
  // }
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
}
</style>
