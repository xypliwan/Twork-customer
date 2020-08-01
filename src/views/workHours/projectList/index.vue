<template>
  <div class="wrap">
    <div class="title">
      <i class="iconfont el-icon-edit-outline"></i>全部项目
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="listLoading">
      <el-table-column prop="project_name" label="项目名称">
        <template slot-scope="scope">
          <span class="name" @click="goDeatils(scope.row.project_id)">
            <i
              class="iconfont "
              :class="scope.row.icon"
              :style="{ color: scope.row.color }"
            ></i>
            {{ scope.row.project_name }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="end_status" label="项目状态">
        <template slot-scope="scope">
          {{ scope.row.end_status == 1 ? '已开始' : '已结束' }}
        </template>
      </el-table-column>
      <el-table-column prop="charge_name" label="项目负责人"> </el-table-column>
      <el-table-column prop="" label="项目周期">
        <template slot-scope="scope">
          {{ scope.row.start_at | checkTime }} -
          {{ scope.row.end_at | checkTime }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getProjectList } from '@/api/workHours'
import common from '@/utils/common'
export default {
  name: 'ProjectList',
  data() {
    return {
      listLoading: false,
      tableData: []
    }
  },
  created() {
    this.getProjectListFn()
  },
  methods: {
    async getProjectListFn() {
      this.listLoading = true
      try {
        let { data } = await getProjectList()
        this.tableData = data
        this.tableData.map((item, index) => {
          if (item.project_id === '1') {
            this.tableData.splice(index, 1)
          }
        })
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    },
    goDeatils(project_id) {
      this.$router.push({
        path: '/work-hours/project',
        query: { id: project_id }
      })
    }
  },
  filters: {
    checkTime(time) {
      if (time == 0) {
        return ''
      }
      return common.checkTime(time * 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .title {
    line-height: 35px;
    .iconfont {
      color: #526ecc;
      font-size: 18px;
      padding: 0 5px;
    }
  }
  .name {
    &:hover {
      color: #526ecc;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
