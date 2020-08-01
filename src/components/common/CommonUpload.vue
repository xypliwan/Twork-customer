<template>
  <div>
    <el-upload
      class="upload-demo"
      :headers="headers"
      name="upload_file"
      :action="uploadUrl"
      :on-success="handleSuccess"
      :on-error="hanldeError"
      :before-upload="handleBefore"
      :accept="accept"
      multiple
      :show-file-list="false"
    >
      <!-- :disabled="list.length >= limit" -->
      <el-button
        size="mini"
        type="primary"
        class="lod"
        v-show="list.length < limit || !limit"
        v-if="changeUploadBt === ''"
        >上传</el-button
      >
      <div class="info" v-if="changeUploadBt === 'creatProject'">
        <!-- 创建项目页面的上传文件按钮样式 -->
        <i class="iconfont icon-fujian"></i>
        添加附件
      </div>
      <el-button size="mini" type="primary" v-if="changeUploadBt === 'project'">
        <!-- 项目详情-文档列表上传文件按钮样式 -->
        上传文档
      </el-button>
      <div slot="tip" class="el-upload__tip desc-tip" v-if="desc !== ''">
        {{ desc }}
      </div>
    </el-upload>

    <ul class="file-wrapper" v-if="changeUploadBt !== 'project'">
      <li class="file-item" v-for="(item, i) in list" :key="i">
        <a :href="item.url" target="_blank">
          <img
            v-if="type == 'img'"
            style="width:14px;margin-right:3px;"
            :src="item.url"
            alt
          />
          {{ item.file_name }}
        </a>
        <i class="el-icon-error" @click="deleteItem(i)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import { getLocalStorage, removeLocalStorage } from '@/utils/localStorage'
import baseURL from '@/config/baseUrl'
export default {
  props: {
    limit: Number,
    list: [Array],
    desc: String,
    type: String, //附件类型,图片或其他
    formKey: String, //表单字段key
    accept: {
      type: String,
      default: ''
    },
    changeUploadBt: {
      type: String,
      default: ''
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
    deleteItem(i) {
      this.$emit('deleteFile', i, this.formKey)
    },
    handleSuccess(res) {
      this.isLoading.close()
      if (res.code == 200) {
        if (res.error == 0) {
          this.$emit('successOk', res.data, this.formKey)
        } else if (res.error == 1001) {
          removeLocalStorage('access_token')
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

<style lang="scss" scope>
.desc-tip {
  line-height: 18px !important;
}
.file-wrapper {
  margin-top: 10px;
  .file-item {
    font-size: 13px;
    color: #333;
    padding-right: 20px;
    position: relative;
    border-bottom: 1px solid #e2dcdc;
    padding-bottom: 10px;
    margin-bottom: 10px;
    .iconfont {
      font-size: 13px;
      color: #999;
      position: absolute;
      top: 5px;
      right: 0px;
      cursor: pointer;
    }
    .el-icon-error {
      margin-left: 15px;
      cursor: pointer;
      font-size: 16px;
      color: #666;
    }
  }
}
</style>
