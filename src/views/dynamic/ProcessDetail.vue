<template>
  <el-drawer
    title="详情"
    :with-header="false"
    :visible.sync="processDialog"
    size="1000px"
    :append-to-body="true"
    :before-close="close"
  >
    <div class="dialog-wrapper">
      <process-detail
        ref="processDetail"
        :list_id="list_id"
        :departmentData="departmentData"
        :dynamicDialog="true"
        @closeDialog="close"
      ></process-detail>
    </div>
  </el-drawer>
</template>
<script>
import ProcessDetail from '_v/flowManage/components/ProcessDetail'
export default {
  props: {
    processDialog: Boolean,
    list_id: [String, Number],
    departmentData: Array
  },
  data() {
    return {
      status: ''
    }
  },

  watch: {
    processDialog(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.processDetail.getDetail(this.list_id)
        })
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:processDialog', false)
    }
    //   // 获取详情
    // getDetail(item) {
    //   this.list_id = item.list_id;
    //   this.$refs.processDetail.getDetail(item.list_id);
    // }
  },
  components: {
    ProcessDetail
  }
}
</script>

<style lang="scss" scoped>
.dialog-wrapper {
  padding: 20px 10px;
}
::v-deep .el-drawer__body {
  overflow-y: auto;
}
</style>
