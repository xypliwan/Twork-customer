<template>
  <div class="task-wrapper">
    <div class="task-header">
      <title-line title="任务列表">
        <div slot class="create-task-box">
          <el-tooltip
            class="item"
            effect="dark"
            :content="isExpandTask ? '收起' : '展开'"
            placement="top"
          >
            <i
              slot
              class="el-icon-arrow-right extend-task-icon"
              :class="isExpandTask ? 'icon-active' : ''"
              @click="handleTaskExtend"
            ></i>
          </el-tooltip>
        </div>
      </title-line>
      <div class="tag-wrapper">
        <el-tabs v-model="params.tag_id" @tab-click="handleClick">
          <el-tab-pane
            :label="item.name"
            :name="item.tag_id"
            v-for="item in tagList"
            :key="item.tag_id"
          ></el-tab-pane>
        </el-tabs>
      </div>

      <create-task
        :targetId="targetId"
        :tagId="params.tag_id"
        :userList="userList"
        @createTaskOk="getTaskList"
      ></create-task>
    </div>
    <div class="task-list">
      <task-list
        :taskList="taskList"
        :tableLoading="tableLoading"
        :pageInfo="params"
        :tagList="tagList"
        @setTagOk="getTaskList"
        :userList="userList"
        @updateOk="getTaskList"
      ></task-list>
    </div>
    <div class="task-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="params.pageSize"
        layout="total, sizes,slot, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import TitleLine from '_c/common/TitleLine'
import TaskList from './TaskList'
import CreateTask from './CreateTask'

import { getTaskTag, getTaskList } from '@/api/targetOkr'

export default {
  props: {
    targetId: [String, Number],
    userList: Array,
    isExpandTask: Boolean
  },
  data() {
    return {
      params: {
        target_id: '', //目标id
        tag_id: '', //任务标签
        page: 1,
        pageSize: 10
      },
      tagList: [], //任务标签
      taskList: [],
      tableLoading: false,
      total: null
    }
  },
  watch: {
    async targetId(newVal) {
      if (newVal.length <= 0) return
      await this.getagList()

      let types = this.$route.query.type
      let targetid = this.$route.query.targetid
      if (types && targetid) {
        switch (types) {
          case 'all':
            this.params.tag_id = '0'
            break
          case 'week':
            this.params.tag_id = '1'
            break
          case 'overdue':
            this.params.tag_id = 'overtime'
            break
        }
        await this.getTaskList()
      } else {
        await this.getTaskList()
      }
    }
  },
  methods: {
    handleTaskExtend() {
      this.$emit('handleTaskExtend')
    },
    async getTaskList() {
      this.params.target_id = this.targetId
      this.tableLoading = true
      try {
        let { data, paginator } = await getTaskList(this.params)
        this.taskList = data
        this.taskList.forEach(el => {
          el['show_people'] = ''
          el['all_people'] = ''
          if (el.people.length > 0) {
            if (el.people.length > 1) {
              el['show_people'] = el.people[0].username + '+' + el.people.length
            } else {
              el['show_people'] = el.people[0].username
            }

            el.people.forEach(ev => {
              el['all_people'] += ` ${ev.username} `
            })
          }
        })
        this.total = paginator.totalCount
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    },
    handleClick() {
      this.params.page = 1
      this.getTaskList()
    },
    async getagList() {
      try {
        let { data } = await getTaskTag()
        this.tagList = data
        if (this.tagList.length > 0) {
          this.params.tag_id = this.tagList[0].tag_id
        }
      } catch (error) {
        this._message(error)
      }
    },
    handleSizeChange(e) {
      this.params.pageSize = e
      this.getTaskList()
    },
    handleCurrentChange(e) {
      this.params.page = e
      this.getTaskList()
    }
  },
  components: {
    TitleLine,
    TaskList,
    CreateTask
  }
}
</script>
<style lang="scss" scoped>
.task-wrapper {
  height: 100%;
  overflow: hidden;

  .create-task-box {
    text-align: right;
    .extend-task-icon {
      color: #526ecc;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s linear;
      transform: rotate(0deg);

      &.icon-active {
        transform: rotate(180deg);
      }
    }
  }
  .task-header {
    height: 140px;
    .tag-wrapper {
      border-top: 1px solid #f1f1f1;
      padding: 0 20px;
      ::v-deep .el-tabs__header {
        margin-bottom: 0;
      }
      ::v-deep .el-tabs__nav-wrap::after {
        height: 0px;
      }
    }
  }
  .task-pagination {
    height: 40px;
    border-top: 1px solid #f1f1f1;
    padding: 4px 20px;
    text-align: right;
  }
  .task-list {
    height: calc(100% - 190px);
    overflow-y: auto;
  }
}
</style>
