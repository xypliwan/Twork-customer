<template>
  <div class="wrap">
    <div class="title">
      <span><i class="iconfont icon-renyuan"></i>人员成本费率</span>
      <div class="bts">
        <el-button size="small">新增</el-button>
        <el-button type="primary" size="small">批量导入</el-button>
        <el-button type="danger" size="small">删除</el-button>
      </div>
    </div>
    <div class="searchWrap">
      <el-form :inline="true" :model="params" size="mini" ref="ruleForm">
        <el-form-item label="姓名：">
          <el-input
            v-model="params.name"
            placeholder="请输入人员姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门：">
          <el-select
            v-model="params.department"
            placeholder="请选择"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in params.departmentData"
              :key="item.project_id"
              :label="item.project_name"
              :value="item.project_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色：">
          <el-select
            v-model="params.role"
            placeholder="请选择"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in params.roleData"
              :key="item.project_id"
              :label="item.project_name"
              :value="item.project_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-date-picker
            v-model="params.dateValue"
            size="small"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="selectTime"
            :clearable="false"
            style="width: 250px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch" size="mini"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="name" label="部门"> </el-table-column>
      <el-table-column prop="address" label="角色"> </el-table-column>
      <el-table-column prop="name" label="内部成本(￥)"> </el-table-column>
      <el-table-column prop="name" label="对外成本(￥)"> </el-table-column>
      <el-table-column prop="address" label="上次修改人"> </el-table-column>
      <el-table-column prop="name" label="创建时间"> </el-table-column>
      <el-table-column prop="name" label="更新时间"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="edit el-icon-edit-outline" @click="edit(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <add-member :visible.sync="editVisible" />
  </div>
</template>
<script>
import AddMember from './components/AddMember'
export default {
  name: 'PersonnelCost',
  data() {
    return {
      editVisible: false,
      params: {
        name: '',
        department: '',
        departmentData: [],
        role: '',
        roleData: [],
        dateValue: []
      },
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: 'xxx'
        }
      ],
      multipleSelection: []
    }
  },
  methods: {
    selectTime() {},
    doSearch() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    edit() {
      this.editVisible = true
    }
  },
  components: {
    AddMember
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .title {
    line-height: 35px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon-renyuan {
      color: #526ecc;
      font-size: 18px;
      padding: 0 5px;
    }
  }
  .searchWrap {
    background-color: #eff1f6;
    padding: 15px 10px;
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
  .edit {
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
