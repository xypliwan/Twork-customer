<template>
  <div class="wrap">
    <div class="bts">
      <el-button size="mini" type="danger">移除</el-button>
    </div>
    <div class="main">
      <div class="item">
        <div class="tip">角色总数</div>
        <div class="num">{{ info.role_num }}</div>
      </div>
      <div class="item">
        <div class="tip">角色总人数</div>
        <div class="num">{{ info.person_num }}</div>
      </div>
      <div class="item">
        <div class="tip">角色总工时</div>
        <div class="num">{{ info.role_hour }}</div>
      </div>
      <div class="item">
        <div class="tip">角色总成本</div>
        <div class="num">{{ info.role_cost }}</div>
      </div>
    </div>
    <div class="filterWrap">
      <i class="iconfont icon-chengyuan"></i>
      角色列表
      <div class="inputWrap">
        <el-input
          v-model="searchValue"
          placeholder="请输入部门，人名查询"
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
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      stripe
      border
      @selection-change="handleSelectionChange"
      v-loading="tableLoading"
      :row-style="this.$root.tableContentStyle"
      :header-cell-style="this.$root.tableTitileStyle"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="scope">{{ scope.row.role_name }}</template>
      </el-table-column>
      <el-table-column prop="user_num" label="角色人数"> </el-table-column>
      <el-table-column prop="hour" label="角色总工时"> </el-table-column>
      <el-table-column prop="average_hour" label="角色平均工时">
      </el-table-column>
      <el-table-column prop="average_cost" label="角色平均成本">
      </el-table-column>
      <el-table-column prop="all_cost" label="预计项目成本"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { roleList } from '@/api/workHours'
export default {
  data() {
    return {
      searchValue: null,
      info: {},
      tableData: [],
      multipleSelection: [],
      tableLoading: false
    }
  },
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  created() {
    this.getList()
  },
  watch: {
    projectId() {
      this.getList()
    }
  },
  methods: {
    async getList() {
      this.tableLoading = true
      try {
        let params = {
          project_id: this.projectId, //项目id
          name: this.searchValue //人名or部门名称
        }
        let { data } = await roleList(params)
        this.tableData = data.roleData
        this.info = data.totalData
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    },
    doSearch() {
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.wrap {
  .bts {
    background-color: #eff1f6;
    padding: 5px;
    font-size: 13px;
    line-height: 35px;
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
  .filterWrap {
    background-color: #fff;
    padding: 5px;
    font-size: 13px;
    line-height: 35px;
    i {
      font-size: 18px;
      margin-right: 5px;
      color: #526ecc;
    }
    .inputWrap {
      float: right;
      width: 230px;
      height: 35px;
      margin: 0 40px;
      .search {
      }
    }
  }
}
</style>
