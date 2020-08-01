<template>
  <el-dialog
    :show-close="false"
    :append-to-body="true"
    :visible.sync="visible"
    width="700px"
    title="评论"
    :before-close="close"
  >
    <div v-loading="loading">
      <div class="reply">
        <at-ta :members="atUserList" name-key="username">
          <template slot="item" slot-scope="s">
            <span v-text="s.item.username"></span>
          </template>
          <el-input
            placeholder="请输入评论内容,@他人"
            type="textarea"
            v-model="replyParams.content"
            clearable
            size="small"
            :autosize="{ minRows: 5, maxRows: 5 }"
            ref="commentRef"
          ></el-input>
        </at-ta>
      </div>
      <div class="file-box">
        <div class="right">
          <upload @upload="upload">
            <el-button type="primary" size="mini"
              ><i class="iconfont icon-fujian"></i>附件</el-button
            >
          </upload>
        </div>
        <div class="left">
          <span
            class="file-item"
            v-for="(file, fileIndex) in this.replyParams.file"
            :key="fileIndex"
          >
            <a :href="file.url" target="_blank">{{ file.file_name }}</a>
            <i class="el-icon-error close-file" @click="delFile(fileIndex)"></i>
          </span>
        </div>
      </div>
      <div class="footer-btn">
        <el-button size="small" @click="close">关闭</el-button>
        <el-button type="primary" size="small" @click="handleReply"
          >评论</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Upload from '_c/common/Upload'
import AtTa from 'vue-at/dist/vue-at-textarea'
import { getAtUserName, getAtUserId } from '_u/utils'
import { mapGetters } from 'vuex'
import { processrreply } from '@/api/flowManage'
export default {
  props: {
    visible: Boolean,
    detailData: Object,
    listId: [Number, String]
  },
  data() {
    return {
      replyParams: {
        list_id: '',
        step_id: '',
        content: '',
        a_user_id: [], //@人员的id
        file: [] //文件
      },
      loading: false
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.commentRef.focus()
        })
      }
    }
  },
  components: { Upload, AtTa },
  computed: {
    ...mapGetters(['atUserList'])
  },
  methods: {
    delFile(i) {
      this.replyParams.file.splice(i, 1)
    },
    upload(data) {
      this.replyParams.file.push(data)
    },
    async handleReply() {
      if (!this.replyParams.content.length) {
        this._message('请输入评论内容', 'warning')
        return
      }
      this.loading = true
      this.replyParams.list_id = this.listId
      let arr = JSON.parse(JSON.stringify(this.detailData.step))
      let step = arr.reverse().find(el => el.is_now_deal_step == 1)
      this.replyParams.step_id = step.step_id

      let allName = getAtUserName(this.replyParams.content)
      this.replyParams.a_user_id = getAtUserId(this.atUserList, allName)
      try {
        await processrreply(this.replyParams)
        this.$emit('commentOk', this.listId)
        this.close()
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    close() {
      Object.assign(this.replyParams, this.$options.data().replyParams)
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.footer-btn {
  text-align: right;
  margin-top: 50px;
}
.file-box {
  padding: 10px 0px;
  overflow-y: auto;
  display: flex;
  .left {
    flex: 1;
    .file-item {
      margin: 15px;
      margin-bottom: 10px;
      display: inline-block;
      font-size: 13px;
      .close-file {
        margin-left: 5px;
        color: #666;
        cursor: pointer;
      }
    }
  }
  .right {
    .icon-shangchuantupian {
      font-size: 50px;
      color: #666;
    }
  }
}
</style>
