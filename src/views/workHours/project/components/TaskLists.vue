<template>
  <div class="wrap" v-loading="tableLoading">
    <add-task
      @addTaskOk="getListAgain"
      :project_id="projectId"
      :responsibleId="responsibleId"
    ></add-task>
    <el-row type="flex" class="row-bg filter" justify="space-between">
      <el-col :span="4"
        ><el-select
          size="mini"
          v-model="filter.roleValue"
          placeholder="全部"
          @change="changeFilter"
        >
          <el-option
            v-for="item in filter.roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
      ></el-col>
      <el-col :span="4"
        ><el-select
          size="mini"
          v-model="filter.statuValue"
          placeholder="全部"
          @change="changeFilter"
        >
          <el-option
            v-for="item in filter.statuList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
      ></el-col>
      <el-col :span="4">
        <div @click="popTaskTree">
          <el-input
            size="mini"
            v-model="filter.category_name"
            readonly
            placeholder="请选择任务类型"
          />
        </div>
      </el-col>
      <el-col :span="6"
        ><el-input
          size="mini"
          v-model="filter.title"
          placeholder="请输入任务标题搜索"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="changeFilter"
            size="mini"
          ></el-button> </el-input
      ></el-col>
      <el-col :span="2">
        <el-button @click="resize" size="mini">重置</el-button>
      </el-col>
    </el-row>

    <el-tabs v-model="activeCardName" type="card" style="margin-top: 10px;">
      <el-tab-pane label="列表视图" name="listView">
        <span slot="label"><i class="iconfont icon-gantetu"></i> 列表视图</span>
        <list-view
          :tableData="tableData"
          :projectId="projectId"
          @getListAgain="getListAgain"
        />
      </el-tab-pane>
      <!-- <el-tab-pane label="看板视图" name="kanbanView">
        <span slot="label"
          ><i class="iconfont icon-huabanfuben"></i> 看板视图</span
        >
        <kanban-view :tableData="tableData" />
      </el-tab-pane> -->
    </el-tabs>
    <Pagination
      :paginationData="pageParams"
      @handleCurrentChange="PaginationChange"
    />
    <task-type-tree
      :treeDialogVisible="tree.treeDialogVisible"
      :project_id="projectId"
      :defaultId="tree.defaultId"
      @cancleTypeTree="cancleTypeTree"
      @saveTypeTree="saveTypeTree"
      :status="1"
      :duoxuan="true"
    />
  </div>
</template>
<script>
import TaskTypeTree from '../../components/TaskTypeTrees'
import Pagination from '_c/common/Pagination'
import { taskList } from '@/api/workHours'
import AddTask from '../../components/AddTask'
import KanbanView from './KanbanView'
import ListView from './ListView'
import common from '@/utils/common'
export default {
  data () {
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
        title: null,
        category_name: '',
        category_id: []
      },
      tableData: [],
      pageParams: {
        page: 1,
        pageSize: 10,
        totalCount: 0
      },
      tableLoading: false,
      activeCardName: 'listView',
      tree: {
        treeDialogVisible: false,
        defaultId: []
      }
    }
  },
  props: {
    projectId: {
      type: String,
      default: ''
    },
    RoleAuthority: {
      type: Boolean,
      default: false
    },
    responsibleId: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created () {
    this.getList()
  },
  watch: {
    projectId () {
      this.filter.roleValue = null //重置
      this.filter.statuValue = null
      this.filter.title = null
      this.filter.category_name = null
      this.filter.category_id = null
      this.pageParams.page = 1
      this.pageParams.totalCount = 0
      this.getList()
    }
  },
  methods: {
    async getList () {
      // console.log('id', this.projectId)
      this.tableLoading = true
      try {
        let params = {
          project_id: this.projectId, //项目id
          is_myself: this.filter.roleValue, //1我为负责人 2我为创建人
          task_status: this.filter.statuValue, //任务状态 0未开始 1进行中 2已完成 3已逾期
          title: this.filter.title, //任务名称
          category_id: this.filter.category_id
        }
        let page = JSON.parse(JSON.stringify(this.pageParams))
        page['totalCount'] = undefined //去掉totalcount
        Object.assign(params, page)

        let { data, paginator } = await taskList(params)
        data.map(item => {
          if (item.start_at !== '' && item.end_at !== '') {
            item.time = [
              common.checkTime(item.start_at),
              common.checkTime(item.end_at)
            ]
          } else {
            item.time = []
          }
        })
        this.tableData = data
        this.pageParams = paginator
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    },
    PaginationChange (value) {
      this.pageParams.page = value
      this.getList()
    },
    getListAgain () {
      this.$emit('getDetailAgain')
      this.getList()
    },
    changeFilter () {
      this.pageParams = {
        page: 1,
        pageSize: 10,
        totalCount: 0
      }
      this.getList()
    },
    popTaskTree () {
      this.tree.defaultId = this.filter.category_id
      this.tree.treeDialogVisible = true
    },
    resize () {
      this.filter.roleValue = null
      this.filter.statuValue = null
      this.filter.title = null
      this.filter.category_name = null
      this.filter.category_id = null
      this.pageParams.page = 1
      this.pageParams.totalCount = 0
      this.getList()
    },
    cancleTypeTree () {
      this.tree.treeDialogVisible = false
    },
    saveTypeTree (item) {
      console.log(item)
      let category_name = []
      let category_id = []
      item.map(i => {
        category_name.push(i.category_name)
        category_id.push(i.category_id)
      })
      this.filter.category_name = category_name.join(',')
      this.filter.category_id = category_id
      this.getList()
      this.tree.treeDialogVisible = false
    }
  },
  components: {
    ListView,
    Pagination,
    AddTask,
    // eslint-disable-next-line vue/no-unused-components
    KanbanView,
    TaskTypeTree
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .deleteBt {
    display: flex;
    height: 40px;
    align-items: center;
    float: right;
  }
  .filter {
    margin-top: 15px;
    position: absolute;
    z-index: 99;
    right: 0;
    width: 70%;
    // display: flex;
    // align-items: center;
    // justify-content: flex-end;
  }
}
</style>
