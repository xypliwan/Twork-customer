<template>
  <el-upload
    class="upload-demo"
    :headers="headers"
    :name="fileName"
    :action="uploadUrl"
    :on-success="handleSuccess"
    :on-error="hanldeError"
    :before-upload="handleBefore"
    :accept="accept"
    multiple
    :show-file-list="false"
  >
    <slot></slot>
  </el-upload>
</template>

<script>
import { getLocalStorage, removeLocalStorage } from '@/utils/localStorage'
import baseURL from '@/config/baseUrl'
export default {
  props: {
    accept: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: 'upload_file'
    }
  },
  data() {
    return {
      isLoading: null
    }
  },
  computed: {
    uploadUrl() {
      return baseURL.requestUrl + '/common/upload'
    },
    headers() {
      return { 'Access-Token': getLocalStorage('access_token') }
    }
  },
  methods: {
    handleBefore() {
      this.isLoading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0)'
      })
    },
    handleSuccess(res) {
      this.isLoading.close()
      if (res.code == 200) {
        if (res.error == 0) {
          this.$emit('upload', res.data)
        } else if (res.error == 1001) {
          removeLocalStorage('Access-Token')
          this.$router.push('/entrance/login')
        } else {
          this._message(`上传失败：${res.message}`)
        }
      } else {
        this._message(`上传失败：${res.message}`)
      }
    },
    hanldeError(res) {
      this.isLoading.close()
      this._message(`上传失败：${res.message}`)
    }
  }
}
</script>

<style lang="scss" scope></style>
