<template>
  <div class="wrap">
    <div class="filterWrap">
      <el-form :inline="true" size="mini" ref="ruleForm">
        <el-form-item label="角色名称:">
          <el-select v-model="value" placeholder="请选择角色名称" size="mini">
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="right">
        <div class="screen" @click="showFilter = !showFilter">
          <i class="iconfont icon-guolvqi"></i>更多过滤
        </div>
        <el-button type="primary" size="mini">导出列表</el-button>
        <div class="condition" v-show="showFilter">
          <el-form ref="form" label-width="110px">
            <el-form-item label="项目名称：">
              <el-select
                v-model="filter.project_id"
                placeholder="请选择项目名称"
                size="mini"
              >
                <el-option
                  v-for="(item, index) in filter.projectData"
                  :key="index"
                  :label="item.project_name"
                  :value="item.project_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门名称：">
              <el-select
                v-model="filter.task_status"
                placeholder="请选择部门名称："
                size="mini"
              >
                <el-option
                  v-for="(item, index) in filter.statuList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-top:50px">
              <el-button type="primary" @click="onSubmit" size="mini"
                >查询</el-button
              >
              <el-button size="mini" @click="showFilter = false"
                >取消</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      style="width: 100%;margin-top:10px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="角色名称" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="角色人数"> </el-table-column>
      <el-table-column prop="address" label="项目数"> </el-table-column>
      <el-table-column prop="name" label="角色平均总工时"> </el-table-column>
      <el-table-column prop="address" label="最高时薪"> </el-table-column>
      <el-table-column prop="name" label="平均时薪"> </el-table-column>
      <el-table-column prop="address" label="最低时薪"> </el-table-column>
      <el-table-column label="" width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small"
          >
            查看明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      roleList: [],
      showFilter: false,
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '11'
        }
      ],
      multipleSelection: [],
      filter: {
        projectData: [],
        statuList: [],
        task_status: '',
        project_id: '',
        time: []
      }
    }
  },
  methods: {
    changeFilter() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteRow() {},
    onSubmit() {
      this.showFilter = false
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  min-height: 500px;
  .filterWrap {
    display: flex;
    align-items: center;
    position: relative;
    justify-content: space-between;
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
    .right {
      display: flex;
      position: relative;
      .condition {
        position: absolute;
        z-index: 99;
        top: 40px;
        right: 0;
        width: 300px;
        height: 400px;
        padding: 20px 10px;
        background-color: #fff;
        box-shadow: 0px 7px 16px 0px rgba(38, 46, 49, 0.3);
      }
      .screen {
        line-height: 40px;
        margin-right: 20px;
        font-size: 14px;
        position: relative;
        cursor: pointer;
        i {
          font-size: 20px;
          color: #526ecc;
          margin-right: 5px;
        }
        .el-button--mini {
          height: 30px;
          margin-left: 20px;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
