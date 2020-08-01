<template>
  <div class="paginationWrap">
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="paginationData.page"
      :total="paginationData.totalCount"
      :page-size="paginationData.pageSize"
      @current-change="handleCurrentChange"
      hide-on-single-page
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    paginationData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    paginationData() {
      // console.log(this.paginationData)
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.paginationWrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
  align-items: center;
}
</style>
