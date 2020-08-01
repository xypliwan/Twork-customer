<template>
  <div v-loading="tableLoading">
    <el-dialog
      :visible.sync="addTaskDialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="80%"
    >
      <el-row class="filterWrap" :gutter="20">
        <el-col :span="7">
          <el-input
            v-model="from.searchValue"
            placeholder="输入任务标题搜索"
            class="search"
            size="mini"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              size="mini"
              @click="doSearch()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-select
            filterable
            v-model="from.proValue"
            placeholder="请选择项目"
            size="mini"
            @change="changeProject"
          >
            <el-option
              v-for="(item, index) in projectData"
              :key="index"
              :label="item.project_name"
              :value="item.project_id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <div>
            <el-cascader
              v-model="from.category_id"
              :options="treeData"
              placeholder="请选择任务类型"
              ref="cascader"
              :props="{
                multiple: true,
                checkStrictly: true,
                value: 'category_id',
                children: 'child',
                label: 'category_name'
              }"
              :show-all-levels="false"
              clearable
              size="mini"
            ></el-cascader>
          </div>
        </el-col>
        <el-button size="mini" @click="doSearch()" type="primary"
          >搜索</el-button
        >
        <el-button size="mini" @click="resize">重置</el-button>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="tableLoading"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="category_name" label="任务类型" align="center">
        </el-table-column>
        <el-table-column prop="title" label="任务标题" align="center">
        </el-table-column>
        <el-table-column prop="project_name" label="项目标题" align="center">
        </el-table-column>
        <el-table-column prop="charge_name" label="任务负责人" align="center">
        </el-table-column>
        <el-table-column label="任务周期" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.start_at }} - {{ scope.row.end_at }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()" size="small"
          >确定添加</el-button
        >
        <el-button @click="cancle()" size="small">取 消</el-button>
      </span>
      <!-- <task-type-tree
        :treeDialogVisible="tree.treeDialogVisible"
        :defaultId="tree.defaultId"
        :project_id="project_id"
        :modal="false"
        @cancleTypeTree="cancleTypeTree"
        @saveTypeTree="saveTypeTree"
      /> -->
      <Pagination
        :paginationData="pageParams"
        @handleCurrentChange="PaginationChange"
      />
    </el-dialog>
  </div>
</template>

<script>
// import TaskTypeTree from '../../components/TaskTypeTrees'
import Pagination from '_c/common/Pagination'
import {
  taskScreenList,
  taskCategoryList,
  getProjectList
} from '@/api/workHours'
export default {
  name: '',
  data() {
    return {
      projectData: [],
      from: {
        searchValue: '',
        category_id: [],
        proValue: '',
        proOptions: []
      },
      tableData: [],
      treeData: [],
      tree: {
        treeDialogVisible: false,
        defaultId: null
      },
      multipleSelection: [],
      tableLoading: false,
      pageParams: {
        page: 1,
        pageSize: 10,
        totalCount: 0
      },
      project_id: null
    }
  },
  props: {
    addTaskDialogVisible: {
      type: Boolean,
      default: false
    },
    task_ids: {
      type: Array,
      default: () => {
        return []
      }
    },
    time: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    task_ids: {
      //深度监听，可监听到对象、数组的变化
      // eslint-disable-next-line no-unused-vars
      handler(newV) {
        this.getList()
      },
      deep: true
    }
  },
  created() {
    this.getProjectListFn()
  },
  methods: {
    async getProjectListFn() {
      try {
        let { data } = await getProjectList()
        this.projectData = data
      } catch (error) {
        this._message(error)
      }
    },
    resize() {
      this.from.searchValue = ''
      this.from.proValue = ''
      this.project_id = null
      this.tableData = []
      this.treeData = []
      let obj = {}
      obj.stopPropagation = () => {}
      try {
        this.$refs.cascader.clearValue(obj)
      } catch (err) {
        this.$refs.cascader.handleClear(obj)
      }
      this.getList()
    },
    async getTreeList() {
      if (this.project_id === null) {
        return
      }
      //获取任务类型列表
      try {
        let obj = {
          project_id: this.project_id
        }
        let { data } = await taskCategoryList(obj)
        this.treeData = data
      } catch (error) {
        this._message(error)
      }
    },
    PaginationChange(value) {
      this.pageParams.page = value
      this.getList()
    },
    async getList() {
      this.tableLoading = true
      let arr = this.from.category_id
      let newArr = []
      arr.map(i => {
        newArr.push(i[i.length - 1])
      })
      let obj = {
        task_id: this.task_ids,
        project_id: this.from.proValue,
        title: this.from.searchValue,
        category_id: newArr,
        page: this.pageParams.page,
        pageSize: this.pageParams.pageSize,
        start_at: this.time[0],
        end_at: this.time[1]
      }
      try {
        let { data, paginator } = await taskScreenList(obj)
        this.tableData = data
        this.pageParams = paginator
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    },
    doSearch() {
      this.getList()
    },
    changeProject() {
      this.project_id = this.from.proValue
      this.getTreeList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    chooseTask() {
      if (this.project_id === null) {
        this.$message({
          message: '请先选择项目',
          type: 'warning'
        })
        return
      }
      this.tree.treeDialogVisible = true
    },
    save() {
      this.$emit('save', this.multipleSelection)
      // console.log(this.task_ids)
    },
    cancle() {
      this.$emit('cancle')
    }

    // saveTypeTree(item) {
    //   if (item[0]) {
    //     this.from.category_id = item[0].category_id
    //     this.from.taskValue = item[0].category_name
    //   } else {
    //     this.from.category_id = ''
    //     this.from.taskValue = ''
    //   }
    //   this.tree.treeDialogVisible = false
    //   this.getList()
    // }
  },
  components: {
    Pagination
  }
}
</script>
<style lang="scss" scoped>
.filterWrap {
  display: flex;
  margin-bottom: 10px;
}
</style>
