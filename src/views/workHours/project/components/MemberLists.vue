<template>
  <div class="wrap">
    <div class="bts" v-if="detail.can_update == 1">
      <el-button size="mini" @click="editVisible = true">编辑成员</el-button>
    </div>
    <div class="main">
      <div class="item">
        <div class="tip">项目成员</div>
        <div class="num">{{ info.person_num }}</div>
      </div>
      <!-- <div class="item">
        <div class="tip">部门数</div>
        <div class="num">{{ info.department_num }}</div>
      </div> -->
      <div class="item">
        <div class="tip">角色数</div>
        <div class="num">{{ info.role_num }}</div>
      </div>
      <div class="item">
        <div class="tip">已填报工时</div>
        <div class="num">{{ info.hour_num }}</div>
      </div>
      <!-- <div class="item">
        <div class="tip">预计项目成本</div>
        <div class="num">{{ info.cost_num }}</div>
      </div> -->
    </div>
    <div class="filterWrap">
      <i class="iconfont icon-chengyuan"></i>
      成员列表
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
      v-loading="tableLoading"
      :row-style="this.$root.tableContentStyle"
      :header-cell-style="this.$root.tableTitileStyle"
    >
      <el-table-column label="姓名">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column prop="department_name" label="部门"> </el-table-column>
      <!-- <el-table-column prop="post" label="岗位名称" show-overflow-tooltip>
      </el-table-column> -->
      <el-table-column prop="role_name" label="角色名称"> </el-table-column>
      <el-table-column prop="hour" label="填报工时"> </el-table-column>
    </el-table>

    <edit-member
      :visible.sync="editVisible"
      :projectId="projectId"
      :detail="detail"
      @editOk="getList"
    ></edit-member>
  </div>
</template>
<script>
import { taskPeopleList } from '@/api/workHours'
import EditMember from './EditMember'
export default {
  data() {
    return {
      searchValue: null,
      info: {
        person_num: '',
        department_num: '',
        role_num: '',
        hour_num: '',
        cost_num: ''
      },
      tableData: [],
      showEditBt: false,
      belongWhoComs: '', // responsible负责人 administrator管理员 person组成员
      editVisible: false,
      tableLoading: false
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
    detail: Object
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
        let { data } = await taskPeopleList(params)
        this.info = data.totalData
        this.tableData = data.workData
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    },
    doSearch() {
      this.getList()
    }
  },
  components: {
    EditMember
  }
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
