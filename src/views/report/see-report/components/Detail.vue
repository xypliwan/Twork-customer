<template>
  <div class="detail-box" v-loading="detailLoading">
    <div class="detail-header" v-if="detail.icon">
      <div class="left">
        <i
          class="iconfont report-icon"
          :class="detail.icon"
          :style="{ color: getColor(detail.icon) }"
        ></i>
      </div>
      <div class="right">
        <div class="report-name">
          {{ detail.create_user_name }}
          ({{ detail.report_name }})
        </div>
        <div class="report-time">
          {{ detail.created_at }}
          <span
            @click="setLinKFn"
            class="dianzan"
            :class="isZan ? 'active-color' : ''"
          >
            <i class="iconfont icon-dianzan2"></i>
            {{ detail.likes }} 人点赞
          </span>
        </div>
      </div>
    </div>
    <div class="cont">
      <detail-form :list="detail.fromat"></detail-form>
      <div class="viewer-box">
        <div class="left">查阅人</div>
        <div class="right">
          <el-tag
            size="small"
            v-for="(item, i) in detail.check_report_people_arr"
            :key="i"
            class="tag-item"
            >{{ item.username }}</el-tag
          >
        </div>
      </div>
      <div class="viewer-box">
        <div class="left">已读</div>
        <div class="right">
          <template v-for="(item, i) in detail.read_people_arr">
            <el-tag size="small" :key="i" class="tag-item">{{
              item.username
            }}</el-tag>
          </template>
        </div>
      </div>
      <detail-comment
        :id="detail.list_id"
        :list="detail.reply"
        @replyOk="replyOk"
      ></detail-comment>
      <comment-list :list="detail.reply" @replyOk="replyOk"></comment-list>
    </div>
  </div>
</template>
<script>
import { listDetail, setLink } from '@/api/report'
import { mapGetters } from 'vuex'
import DetailForm from './DetailForm'
import DetailComment from './DetailComment'
import CommentList from './CommentList'
export default {
  props: { reportId: String },
  data() {
    return {
      detail: {},
      detailLoading: false,
      isZan: false
    }
  },
  watch: {
    reportId() {
      if (this.reportId == '') return
      this.isZan = false
      this.listDetailFn()
    }
  },
  computed: {
    ...mapGetters(['iconList'])
  },
  methods: {
    replyOk(data) {
      data.isSHowCommentIpt = false
      data.replyLoading = false
      data.iptCont = ''
      this.detail.reply.unshift(data)
    },
    async setLinKFn() {
      try {
        await setLink({
          list_id: this.detail.list_id,
          like: this.isZan ? '0' : '1'
        })
        this.isZan = !this.isZan
        this.detail.likes = this.isZan
          ? Number(this.detail.likes) + 1
          : Number(this.detail.likes) - 1
      } catch (error) {
        this._message(error)
      }
    },
    getColor(icon) {
      return this.iconList.find(el => el.icon == icon).color
    },
    async listDetailFn() {
      this.detailLoading = true
      try {
        let { data } = await listDetail({ list_id: this.reportId })
        data.reply.forEach(el => {
          el.isSHowCommentIpt = false
          el.replyLoading = false
          el.iptCont = ''
        })
        this.detail = data
      } catch (error) {
        this._message(error)
      }
      this.detailLoading = false
    }
  },
  components: {
    DetailForm,
    DetailComment,
    CommentList
  }
}
</script>
<style lang="scss" scoped>
.detail-box {
  padding: 0 100px;
  .detail-header {
    display: flex;
    padding-bottom: 10px;
    border-bottom: 1px solid #f1f1f1;
    .left {
      width: 50px;
      margin-right: 10px;
      display: flex;
      align-items: center;
      .report-icon {
        font-size: 48px;
      }
    }
    .right {
      flex: 1;
      .report-name {
        font-size: 15px;
      }
      .report-time {
        font-size: 13px;
        margin-top: 10px;
        color: #999;
        .dianzan {
          margin-left: 20px;
          font-size: 13px;
          cursor: pointer;
          &.active-color {
            color: #526ecc;
          }
        }
      }
    }
  }
  .cont {
    border-bottom: 1px solid #f1f1f1;
    .viewer-box {
      display: flex;
      margin-bottom: 20px;
      .left {
        width: 50px;
        font-size: 15px;
        margin-right: 10px;
      }
      .right {
        flex: 1;
        .tag-item {
          margin-right: 10px;
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
