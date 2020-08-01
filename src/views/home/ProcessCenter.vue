<template>
  <el-tabs v-model="activeName">
    <!-- <el-tab-pane label="ERP系统通知" name="first"
      ><erp-notice></erp-notice
    ></el-tab-pane> -->
    <el-tab-pane label="个人工作流" name="second">
      <personal-workflow></personal-workflow>
    </el-tab-pane>
    <!-- <el-tab-pane label="我收藏的" name="third">我收藏的</el-tab-pane> -->
  </el-tabs>
</template>
<script>
import PersonalWorkflow from './components/PersonalWorkflow'
export default {
  data() {
    return {
      activeName: 'second'
    }
  },
  watch: {
    activeName(newVal) {
      console.log(newVal)
    }
  },
  components: {
    PersonalWorkflow
  }
}
</script>
