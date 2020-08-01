<template>
  <!-- 转交 -->
  <div class="preview-excel">
    <el-dialog
      title="预览"
      :visible.sync="previewVisible"
      width="80%"
      :fullscreen="true"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div class="preview-excel-content">
        <iframe
          :src="`https://view.officeapps.live.com/op/view.aspx?src=${file.url}`"
          width="100%"
          height="100%"
          frameborder="1"
        ></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    previewVisible: Boolean,
    file: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    handleClose() {
      this.$emit('update:previewVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.preview-excel {
  .preview-excel-content {
    height: calc(100vh - 90px);
  }
}
</style>
