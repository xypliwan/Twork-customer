<template>
  <div class="wrap" v-loading="detailLoading">
    <div class="filter">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select
            size="mini"
            v-model="filter.roleValue"
            placeholder="请选择"
            @change="changelist"
          >
            <el-option
              v-for="item in filter.roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            size="mini"
            v-model="filter.statuValue"
            placeholder="请选择"
            @change="changelist"
          >
            <el-option
              v-for="item in filter.statuList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="filter.title"
            placeholder="输入任务名称、编号搜索"
            size="mini"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="changelist"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="列表视图" name="listView">
        <span slot="label"><i class="iconfont icon-gantetu"></i> 列表视图</span>
        <list-view :tableData="tableData" @getListAgain="getListAgain" />
      </el-tab-pane>
      <el-tab-pane label="看板视图" name="kanbanView">
        <span slot="label"
          ><i class="iconfont icon-huabanfuben"></i> 看板视图</span
        >
        <kanban-view :tableData="tableData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import KanbanView from './components/KanbanViews'
import ListView from './components/ListViews'
import { manageList } from '@/api/workHours'
export default {
  name: 'TaskManagement',
  data() {
    return {
      filter: {
        roleValue: null,
        roleList: [
          { label: '全部', value: null },
          { label: '我负责的', value: '1' },
          { label: '我分配的', value: '2' }
        ],
        statuValue: null,
        statuList: [
          { label: '全部', value: null },
          { label: '未开始', value: '0' },
          { label: '进行中', value: '1' },
          { label: '已完成', value: '2' },
          { label: '已逾期', value: '3' }
        ],
        title: null
      },
      activeName: 'listView',
      detailLoading: false,
      tableData: []
    }
  },
  methods: {
    async getManageList() {
      this.detailLoading = true
      try {
        let obj = {
          is_myself: this.filter.roleValue, //1我为负责人 2我为创建人
          task_status: this.filter.statuValue, //任务状态 0未开始 1进行中 2已完成 3已逾期
          title: this.filter.title
        }

        let { data } = await manageList(obj)
        data.map((item, index) => {
          //树形数据。渲染树形数据时，必须要指定 唯一row-key
          item.id = index + 1
          if (item.child) {
            item.child.map((item2, index2) => {
              item2.id = parseInt(item.id.toString() + (index2 + 1).toString())
              item2.time = [item2.start_at, item2.end_at]
              item2.nameArr = item2.charge_name.split(',')
            })
          }
        })
        this.detailLoading = false
        this.tableData = data
        console.log(this.tableData)
      } catch (error) {
        this._message(error)
      }
    },
    changelist() {
      this.getManageList()
    },
    getListAgain() {
      this.getManageList()
    }
  },
  created() {
    this.getManageList()
  },
  components: {
    KanbanView,
    ListView
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .filter {
    padding: 8px;
    background: #f1f1f1;
    margin-bottom: 2px;
  }
}
</style>
