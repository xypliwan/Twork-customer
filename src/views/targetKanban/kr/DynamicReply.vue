<template>
  <div style="padding-top:40px;">
    <title-line title="发表评论"></title-line>
    <div class="ipt-box" v-show="krId !== ''" v-loading="iptLoading">
      <at-ta :members="atUserList" name-key="username">
        <template slot="item" slot-scope="s">
          <span v-text="s.item.username"></span>
        </template>
        <!-- @keyup.enter.native="addCommentActionLog" -->
        <el-input
          type="textarea"
          class="ipt"
          :autosize="{ minRows: 4, maxRows: 4 }"
          placeholder="请输入KR评论，@他人"
          v-model="params.log"
        ></el-input>
      </at-ta>
      <el-link type="primary" class="ipt-btn" @click="addCommentActionLog"
        >回复</el-link
      >
    </div>
  </div>
</template>

<script>
import TitleLine from '_c/common/TitleLine'
import { addCommentActionLog } from '@/api/targetOkr'
import AtTa from 'vue-at/dist/vue-at-textarea'
import { mapGetters } from 'vuex'
import { getAtUserName, getAtUserId } from '_u/utils'
export default {
  props: {
    targetId: [String, Number],
    krId: [String, Number]
  },
  data() {
    return {
      params: {
        kr_id: '',
        log: '',
        target_id: '',
        a_user_id: []
      },
      iptLoading: false
    }
  },
  watch: {
    krId() {
      this.params.log = ''
    }
  },
  computed: {
    ...mapGetters(['atUserList'])
  },
  methods: {
    async addCommentActionLog() {
      if (this.params.log.trim().length <= 0) {
        this._message('请输入内容', 'warning')
        return
      }

      let allName = getAtUserName(this.params.log)
      this.params.a_user_id = getAtUserId(this.atUserList, allName)

      this.iptLoading = true
      this.params.kr_id = this.krId
      this.params.target_id = this.targetId
      try {
        let { data } = await addCommentActionLog(this.params)
        this.$emit('dynamicReplyOk', data)
        this.params.log = ''
        this.params.a_user_id = []
      } catch (error) {
        this._message(error)
      }
      this.iptLoading = false
    }
  },
  components: {
    TitleLine,
    AtTa
  }
}
</script>

<style lang="scss" scoped>
.ipt-box {
  padding: 0 10px;
  padding-top: 5px;
  border-top: 1px solid #f1f1f1;
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
</style>
