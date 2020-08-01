<template>
  <div class="ipt-wrapper">
    <div class="ipt-box" v-loading="iptLoading">
      <at-ta :members="atUserList" name-key="username">
        <template slot="item" slot-scope="s">
          <span v-text="s.item.username"></span>
        </template>
        <!-- @keyup.enter.native="addCommentActionLog" -->
        <el-input
          type="textarea"
          class="ipt"
          autosize
          placeholder="@评论: 小小的鼓励，增强团队凝聚力"
          v-model="params.content"
        ></el-input>
      </at-ta>
      <el-link type="primary" class="ipt-btn" @click="addComment">回复</el-link>
    </div>
  </div>
</template>
<script>
import AtTa from 'vue-at/dist/vue-at-textarea'
import { mapGetters } from 'vuex'
import { getAtUserName, getAtUserId } from '_u/utils'
import { reportFrontendReply } from '@/api/report'
export default {
  props: {
    id: String,
    list: Array
  },
  data() {
    return {
      params: {
        // list_id: '',
        // content: '',
        // reply_user_id: '', //回复人id
        // a_user_id: [] //@人id
        list_id: '', //汇报id
        reply_user_id: '', //回复人id 无则为空
        content: '',
        parent_reply_id: '', //就是你回复某条评论的时候 带上它的reply_id 作为parent_reply_id
        a_user_id: [] //@人员的id
      },
      iptLoading: false
    }
  },
  computed: {
    ...mapGetters(['atUserList'])
  },
  methods: {
    async addComment() {
      if (this.params.content.trim().length <= 0) {
        this._message('请输入内容', 'warning')
        return
      }

      let allName = getAtUserName(this.params.content)
      this.params.a_user_id = getAtUserId(this.atUserList, allName)

      this.iptLoading = true
      this.params.list_id = this.id
      try {
        let { data } = await reportFrontendReply(this.params)
        this.$emit('replyOk', data)
        this.params.content = ''
        this.params.a_user_id = []
      } catch (error) {
        this._message(error)
      }
      this.iptLoading = false
    }
  },
  components: {
    AtTa
  }
}
</script>
<style lang="scss" scoped>
.ipt-wrapper {
  padding: 20px 0;
  .ipt-box {
    position: relative;
    &:hover {
      .ipt-btn {
        display: block;
      }
    }
    .ipt-btn {
      position: absolute;
      bottom: 10px;
      right: 30px;
      z-index: 99;
      display: none;
    }
  }
}
</style>
