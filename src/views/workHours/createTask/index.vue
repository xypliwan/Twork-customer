<template>
  <div>
    新建任务
    <el-button @click="toPage">新建项目</el-button>
  </div>
</template>
<script>
export default {
  name: 'createTask',
  methods: {
    toPage() {
      this.$router.push('/create-project?id=null')
    }
  }
}
</script>
