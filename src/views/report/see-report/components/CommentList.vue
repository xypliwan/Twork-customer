<template>
  <div class="comment-list">
    <div class="reply-box" v-show="list.length > 0">
      <div v-for="(ev, i) in list" class="replay-item" :key="i">
        <div>
          <span class="reply-names" v-show="ev.create_user_name.length > 0"
            >{{ ev.create_user_name }} :</span
          >
          <span class="reply-txt" v-show="ev.create_user_name.length > 0"
            >回复</span
          >
          <span class="reply-names">{{ ev.reply_user_name }}</span>
          {{ ev.content }}
          <el-link
            v-show="ev.can_reply == 1"
            class="reply-comment"
            type="primary"
            @click="handleCommentUser(ev, i)"
            >评论</el-link
          >
        </div>
        <div
          class="comment-ipt"
          v-show="ev.isSHowCommentIpt"
          v-loading="ev.replyLoading"
        >
          <!-- <p class="comment-name">{{ commentName }}</p> -->
          <at-ta :members="atUserList" name-key="username">
            <template slot="item" slot-scope="s">
              <span v-text="s.item.username"></span>
            </template>
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              placeholder="请输入评论内容"
              v-model="ev.iptCont"
            ></el-input>
          </at-ta>
          <span
            v-show="ev.iptCont.trim().length > 0"
            class="comment-txt"
            @click="reply(ev)"
            >回复</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AtTa from 'vue-at/dist/vue-at-textarea'
import { getAtUserName, getAtUserId } from '_u/utils'
import { reportFrontendReply } from '@/api/report'
import { mapGetters } from 'vuex'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      replyParams: {
        list_id: '', //汇报id
        reply_user_id: '', //回复人id 无则为空
        content: '',
        parent_reply_id: '', //就是你回复某条评论的时候 带上它的reply_id 作为parent_reply_id
        a_user_id: [] //@人员的id
      }
    }
  },
  computed: {
    ...mapGetters(['atUserList'])
  },
  methods: {
    handleCommentUser(item) {
      this.replyParams.reply_user_id = item.create_user_id
      this.replyParams.list_id = item.list_id
      this.replyParams.parent_reply_id = item.reply_id
      item.isSHowCommentIpt = true
      this.replyParams.a_user_id = []
    },
    async reply(item) {
      item.replyLoading = true
      this.replyParams.content = item.iptCont
      this.replyParams.list_id = item.list_id

      let allName = getAtUserName(this.replyParams.content)
      this.replyParams.a_user_id = getAtUserId(this.atUserList, allName)
      try {
        let { data } = await reportFrontendReply(this.replyParams)
        item.iptCont = ''
        item.isSHowCommentIpt = false
        this.$emit('replyOk', data)
        this.replyParams.content = ''
        this.replyParams.a_user_id = []
      } catch (error) {
        this._message(error)
      }
      item.replyLoading = false
    }
  },
  components: {
    AtTa
  }
}
</script>
<style lang="scss" scoped>
.comment-list {
  padding: 20px 0;
  .reply-box {
    background: #f1f1f1;
    padding: 10px 8px;
    border-radius: 4px;
    .replay-item {
      padding: 2px 0;
      line-height: 20px;
      .reply-names {
        color: #409eff;
      }
      .reply-txt {
        margin: 0 8px;
      }
      .reply-comment {
        display: none;
        margin-left: 10px;
      }
      &:hover {
        .reply-comment {
          display: inline;
          margin-left: 10px;
        }
      }
    }
    .comment-ipt {
      margin-top: 10px;
      position: relative;
      ::v-deep .atwho-view {
        bottom: -74px;
        left: 32px;
      }
      .comment-name {
        font-size: 13px;
        color: #666;
        margin-bottom: 8px;
      }
      .comment-txt {
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 99;
        font-size: 13px;
        color: #409eff;
        cursor: pointer;
      }
    }
  }
}
</style>
