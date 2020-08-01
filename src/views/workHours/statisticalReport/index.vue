<template>
  <div class="wrap">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="项目报表" name="projectReport">
        <project-report />
      </el-tab-pane>
      <el-tab-pane label="角色报表" name="roleReport">
        <role-report />
      </el-tab-pane>
      <el-tab-pane label="人员报表" name="memberReport">
        <member-report />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ProjectReport from './components/ProjectReport'
import RoleReport from './components/RoleReport'
import MemberReport from './components/MemberReport'
export default {
  name: 'StatisticalReport',
  data() {
    return {
      activeName: 'projectReport'
    }
  },
  methods: {},
  components: {
    ProjectReport,
    RoleReport,
    MemberReport
  }
}
</script>
