<template>
  <div class="accept-page">
    认可
    <el-input v-model="input" placeholder="请输入内容"></el-input>
  </div>
</template>

<script>
export default {
  name: 'Accept',
  data() {
    return {
      input: ''
    }
  }
}
</script>

<style scoped lang="scss">
.accept-page {
}
</style>
