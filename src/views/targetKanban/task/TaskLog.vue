<template>
  <div>
    <title-line title="参与人"></title-line>
    <participant-list :taskId="targetId"></participant-list>

    <title-line title="操作日志"></title-line>
    <div class="log-box">
      <scroll :hasMore="noMore" :isLoadings="isloading" @loadingData="loadMore">
        <div slot="dataList">
          <div class="log-item" v-for="(item, i) in logList" :key="i">
            <div class="log-item-wrapper">
              <div class="circle"></div>
              <div class="log-title">
                <div class="user-name">
                  {{ item.username }} {{ item.field_name }}
                </div>
                <div class="time">
                  <span class="comment-icon" @click="handleComment(item, i)">
                    <i class="iconfont icon-message"></i>评论
                  </span>
                  {{ item.created_at }}
                </div>
              </div>
              <div class="log-cont-wrapper">
                <div class="log-cont" v-html="item.log"></div>
              </div>

              <!-- 回复列表 -->
              <div class="reply-box" v-show="item.reply.length > 0">
                <div v-for="(ev, i) in item.reply" class="replay-item" :key="i">
                  <span class="reply-names" v-show="ev.create_user.length > 0"
                    >{{ ev.create_user }} :</span
                  >
                  <span class="reply-txt" v-show="ev.create_user.length > 0"
                    >回复</span
                  >
                  <span class="reply-names">{{ ev.reply_user }}</span>
                  {{ ev.content }}
                  <el-link
                    v-show="ev.can_reply == 1"
                    class="reply-comment"
                    type="primary"
                    @click="handleCommentUser(item, ev, i)"
                    >评论</el-link
                  >
                </div>
              </div>
              <div
                class="comment-ipt"
                v-show="item.isSHowCommentIpt"
                v-loading="item.replyLoading"
              >
                <p class="comment-name">{{ commentName }}</p>
                <at-ta :members="atUserList" name-key="username">
                  <template slot="item" slot-scope="s">
                    <span v-text="s.item.username"></span>
                  </template>
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 4 }"
                    placeholder="请输入评论内容,@他人"
                    v-model="item.iptCont"
                  ></el-input>
                </at-ta>
                <span
                  v-show="item.iptCont.trim().length > 0"
                  class="comment-txt"
                  @click="addTaskUserReply(item)"
                  >回复</span
                >
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <!-- 动态回复 -->
    <task-dynamic-reply
      :targetId="targetId"
      @dynamicReplyOk="dynamicReplyOk"
    ></task-dynamic-reply>
  </div>
</template>

<script>
import Scroll from '_c/common/Scroll'
import TitleLine from '_c/common/TitleLine'
import TaskDynamicReply from './TaskDynamicReply'
import ParticipantList from './ParticipantList'
import { taskActionLogList, addTaskUserReply } from '@/api/targetOkr'
import AtTa from 'vue-at/dist/vue-at-textarea'
import { getAtUserName, getAtUserId } from '_u/utils'
import { mapGetters } from 'vuex'
export default {
  props: {
    targetId: [String, Number]
  },
  data() {
    return {
      logList: [],
      noMore: false,
      isloading: false,
      params: {
        task_id: '',
        page: 1,
        pageSize: 5
      },
      textarea2: '',
      commentName: '',
      replyParams: {
        reply_user_id: '', //回复人id 无则为空
        content: '',
        log_id: '', //动态id
        parent_reply_id: '', //就是你回复某条评论的时候 带上它的reply_id 作为parent_reply_id
        a_user_id: [], //@人员的id
        task_id: '' //任务id
      }
    }
  },
  watch: {},
  computed: {
    ...mapGetters(['atUserList'])
  },
  methods: {
    handleCommentUser(item, itemSonEv) {
      this.replyParams.reply_user_id = itemSonEv.create_user_id
      this.replyParams.log_id = item.log_id
      this.replyParams.parent_reply_id = itemSonEv.reply_id
      item.isSHowCommentIpt = true
      this.commentName = `你 回复 ${itemSonEv.create_user} :`
      this.replyParams.a_user_id = []
    },
    handleComment(item) {
      this.replyParams.reply_user_id = ''
      this.replyParams.log_id = item.log_id
      this.replyParams.parent_reply_id = ''
      item.isSHowCommentIpt = !item.isSHowCommentIpt
      item.iptCont = ''
      this.commentName = ''
      this.replyParams.a_user_id = []
    },
    async addTaskUserReply(item) {
      item.replyLoading = true
      this.replyParams.content = item.iptCont
      this.replyParams.task_id = this.targetId

      let allName = getAtUserName(this.replyParams.content)
      this.replyParams.a_user_id = getAtUserId(this.atUserList, allName)

      try {
        let { data } = await addTaskUserReply(this.replyParams)
        item.iptCont = ''
        item.reply.push(data)
      } catch (error) {
        this._message(error)
      }
      item.replyLoading = false
    },
    dynamicReplyOk(data) {
      data['isSHowCommentIpt'] = false
      data['iptCont'] = ''
      data['replyLoading'] = false
      this.logList.unshift(data)
    },
    initLog() {
      this.logList = []
      this.params.page = 1
      this.taskActionLogList()
    },
    async taskActionLogList() {
      if (this.isloading) return
      this.isloading = true
      this.params.task_id = this.targetId
      try {
        let { data } = await taskActionLogList(this.params)
        data.forEach(el => {
          el.isSHowCommentIpt = false
          el.iptCont = ''
          el.replyLoading = false
        })
        this.noMore = data.length < this.params.pageSize ? true : false
        this.logList = [...this.logList, ...data]
      } catch (error) {
        this._message(error)
      }
      this.isloading = false
    },
    loadMore() {
      if (this.isloading) return
      this.params.page++
      this.taskActionLogList()
    }
  },
  components: {
    Scroll,
    TitleLine,
    TaskDynamicReply,
    ParticipantList,
    AtTa
  }
}
</script>

<style lang="scss" scoped>
.log-box {
  height: 340px;
  margin-top: 20px;
  .log-item {
    padding-left: 10px;
    .log-item-wrapper {
      position: relative;
      border-left: 1px solid #f1eaea;
      padding-left: 20px;
      padding-bottom: 25px;
      .circle {
        position: absolute;
        top: 0;
        left: -4px;
        width: 8px;
        height: 8px;
        border: 2px solid #2f86e0;
        border-radius: 50%;
      }
      .log-title {
        display: flex;
        .user-name {
          flex: 1;
          font-size: 13px;
          color: #333;
          font-weight: 800;
        }
        .time {
          width: auto;
          font-size: 13px;
          color: #999;
          .time {
            color: #969696;
            font-size: 12px;
          }
          .comment-icon {
            font-size: 12px;
            color: #409eff;
            cursor: pointer;
            margin-right: 5px;
            i {
              margin-right: 5px;
              font-size: 14px;
            }
          }
        }
      }
      .log-cont-wrapper {
        margin-top: 10px;
        display: flex;
        .log-cont {
          font-size: 14px;
          color: #333;
          line-height: 20px;
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
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
      }
    }
  }
}
</style>
