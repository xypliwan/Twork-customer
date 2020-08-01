<template>
  <div class="child-task">
    <div class="child-task-title">
      <span class="title-name"> <i class="el-icon-s-order"></i> 子任务 </span>

      <span class="complete-box">
        <el-switch
          @change="handleChangeSwich"
          v-model="params.task_son_status"
          :active-value="2"
          :inactive-value="0"
        ></el-switch>
        {{ params.task_son_status == 2 ? '已完成任务' : '所有任务' }}
      </span>
    </div>

    <create-child-task
      :firstResponsibleId="firstResponsibleId"
      :taskId="taskId"
      :userList="userList"
      @createChildTaskOk="getSonList"
    ></create-child-task>

    <el-table
      :data="childTaskList"
      style="width: 100%"
      stripe
      v-loading="tableLoading"
      :row-style="this.$root.tableContentStyle"
    >
      <el-table-column width="30">
        <template slot-scope="scope">
          <div>
            <el-checkbox
              v-model="scope.row.owStatus"
              @change="setSonStatusComfirm($event, scope.row)"
            ></el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="进度" width="80">
        <template slot-scope="scope">
          <div>
            <el-popover placement="top" width="400" trigger="hover">
              <el-slider
                show-input
                v-model="scope.row.process"
                @change="
                  val => {
                    changeProcess(val, scope.row)
                  }
                "
              ></el-slider>
              <span slot="reference">{{ scope.row.process }} %</span>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="执行人" width="80">
        <template slot-scope="scope">
          <div>
            <el-tag type="success" size="mini">{{ scope.row.username }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="截止日期"
        prop="deadline"
        width="120"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="80"
        header-align="center"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="cz-box">
            <el-link
              type="primary"
              @click="delChildTaskComfirm(scope.row.son_id)"
              >删除</el-link
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import CreateChildTask from './CreateChildTask'
import {
  getSonList,
  setSonStatus,
  delSon,
  updateSonProcess
} from '@/api/targetOkr'
export default {
  props: {
    taskId: [String, Number],
    userList: Array,
    firstResponsibleId: [String, Number]
  },
  data() {
    return {
      params: {
        task_id: '',
        task_son_status: 0
      },
      childTaskList: [],
      tableLoading: false,
      processList: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    }
  },
  methods: {
    async changeProcess(val, item) {
      try {
        await updateSonProcess({ son_id: item.son_id, process: val })
      } catch (error) {
        this._message(error)
        this.getSonList()
      }
    },
    handleChangeSwich() {
      this.getSonList()
    },
    async delSon(id) {
      this.tableLoading = true
      try {
        let { message } = await delSon({ son_id: id })
        this._message(message, 'success')
        this.getSonList()
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    },
    delChildTaskComfirm(id) {
      this.$confirm(`确定删除此条子任务吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delSon(id)
        })
        .catch(() => {})
    },
    setSonStatusComfirm(flg, item) {
      this.$delete(item, 'owStatus')
      this.$set(item, 'owStatus', flg)
      this.$confirm(
        `确定将此任务设置成 ${flg ? '已完成' : '未完成'} 吗`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.setSonStatus(flg, item)
        })
        .catch(() => {
          this.$delete(item, 'owStatus')
          this.$set(item, 'owStatus', !flg)
        })
    },
    async setSonStatus(flg, item) {
      this.tableLoading = true
      try {
        let { message } = await setSonStatus({
          task_son_status: flg ? 2 : 0,
          son_id: item.son_id
        })
        this.$delete(item, 'owStatus')
        this.$set(item, 'owStatus', flg)
        this._message(message, 'success')
        this.getSonList()
      } catch (error) {
        this.$delete(item, 'owStatus')
        this.$set(item, 'owStatus', !flg)
        this._message(error)
      }
      this.tableLoading = false
    },
    async getSonList() {
      this.tableLoading = true
      this.params.task_id = this.taskId
      try {
        let { data } = await getSonList(this.params)
        this.childTaskList = data
        this.childTaskList.forEach(el => {
          el.process = Number(el.process)
          el['owStatus'] = el.task_son_status == 2 ? true : false
        })
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    }
  },
  components: {
    CreateChildTask
  }
}
</script>

<style lang="scss" scoped>
.child-task {
  margin-top: 70px;
  .child-task-title {
    margin-bottom: 20px;
    display: flex;
    .title-name {
      flex: 1;
    }
  }
  ::v-deep tr {
    height: 40px !important;
  }
}
</style>
