<template>
  <div class="okr-manage">
    okr
    <el-input v-model="input" placeholder="请输入内容"></el-input>
  </div>
</template>

<script>
export default {
  name: 'OkrManage',
  data() {
    return {
      input: ''
    }
  }
}
</script>

<style scoped lang="scss">
.okr-manage {
}
</style>
