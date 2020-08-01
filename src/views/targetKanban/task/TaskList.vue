<template>
  <div class="task-list-box">
    <!-- :header-cell-style="this.$root.tableTitileStyle" -->
    <el-table
      :data="taskList"
      style="width: 100%"
      stripe
      v-loading="tableLoading"
      :row-style="this.$root.tableContentStyle"
      @cell-click="test"
    >
      <el-table-column
        header-align="center"
        align="center"
        label="NO"
        width="50"
        fixed
      >
        <template slot-scope="scope">
          <div>
            {{ scope.$index + 1 + (pageInfo.page - 1) * pageInfo.pageSize }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="KR." width="60" fixed>
        <template slot-scope="scope">
          <div>
            <el-tag size="mini">KR{{ scope.row.sort }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="任务标题" min-width="200">
        <template slot-scope="scope">
          <div class="task-name" @click.stop :title="scope.row.title">
            <el-input
              size="mini"
              @blur="changeTitle(scope.row)"
              v-model="scope.row.title"
            ></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="70">
        <template slot-scope="scope">
          <el-link type="warning">{{ scope.row.task_status_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="进度" width="70">
        <template slot-scope="scope">
          <div>{{ scope.row.process }}%</div>
        </template>
      </el-table-column>
      <el-table-column label="执行人" width="100">
        <template slot-scope="scope">
          <div>
            <el-tooltip
              effect="dark"
              :content="scope.row.all_people"
              placement="top"
            >
              <el-tag type="success" size="mini">{{
                scope.row.show_people
              }}</el-tag>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="截止日期" prop="deadline" width="100">
        <template slot-scope="scope">
          <div>
            <i
              v-if="scope.row.is_warning == 1"
              class="iconfont icon-icon-life-alarm"
              style="font-size:15px;color:#ed3c33"
            ></i>
            &nbsp;&nbsp;
            <el-tooltip
              :disabled="scope.row.is_warning !== 1"
              class="item"
              effect="dark"
              :content="'超时' + scope.row.overtime + '天'"
              placement="top"
            >
              <span>{{ scope.row.deadline }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="50"
        header-align="center"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <div
            class="cz-box"
            v-loading="openrnLoading"
            v-show="scope.row.can_handle == 1"
          >
            <el-dropdown>
              <span class="el-dropdown-link">
                <i
                  class="iconfont icon-msnui-more"
                  style="color:#409eff;font-size:14px;"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in tagList"
                  :key="item.tag_id"
                  v-if="item.tag_id !== '0'"
                >
                  <div @click="setTag(scope.row.task_id, item.tag_id)">
                    标记为{{ item.name }}
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="del">
                  <div @click="delTaskItem(scope.row.task_id, scope.row.title)">
                    删除
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <task-detail
      :taskId="taskId"
      :dialog.sync="detailLialog"
      :userList="userList"
      @updateOk="updateOk"
    ></task-detail>
  </div>
</template>

<script>
import TaskDetail from './TaskDetail'
import { updateTask, setTaskTag, delTask } from '@/api/targetOkr'
export default {
  props: {
    taskList: Array,
    tableLoading: Boolean,
    pageInfo: Object,
    tagList: Array,
    userList: Array
  },
  data() {
    return {
      openrnLoading: false,
      taskId: '',
      detailLialog: false
    }
  },
  methods: {
    updateOk() {
      this.$emit('updateOk')
    },
    test(row, column) {
      if (column.label == '任务标题' || column.label == '操作') return
      this.toDetail(row)
    },
    toDetail(item) {
      this.taskId = item.task_id
      this.detailLialog = true
    },
    delTaskItem(taskId, title) {
      this.$confirm(`确定删除此任务 ： ${title} 吗?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delTask(taskId)
        })
        .catch(() => {})
    },
    async delTask(id) {
      this.openrnLoading = true
      try {
        await delTask({ task_id: id })
        this.$emit('setTagOk')
      } catch (error) {
        this._message(error)
      }
      this.openrnLoading = false
    },
    async setTag(taskId, tagId) {
      this.openrnLoading = true
      try {
        await setTaskTag({ task_id: taskId, tag_id: tagId })
        this.$emit('setTagOk')
      } catch (error) {
        this._message(error)
      }
      this.openrnLoading = false
    },
    async changeTitle(item) {
      try {
        await updateTask({ task_id: item.task_id, title: item.title })
      } catch (error) {
        this._message(error)
      }
    }
  },
  components: {
    TaskDetail
  }
}
</script>

<style lang="scss" scoped>
.task-list-box {
  ::v-deep .el-table td {
    cursor: pointer;
  }
  .task-name {
    ::v-deep .el-input__inner {
      border: 1px solid rgba(0, 0, 0, 0);
      font-size: 13px;
      padding: 0 5px;
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
  ::v-deep .el-table td {
    padding: 5px 0;
  }
  ::v-deep tr {
    height: 45px !important;
  }
}
</style>
