<template>
  <div class="team-index" v-loading="teamLoading">
    <title-line title="团队状态指标"></title-line>
    <div class="ipt-box">
      <el-input
        type="textarea"
        @keyup.enter.native="addTeamNorm"
        class="ipt"
        :autosize="{ minRows: 4, maxRows: 4 }"
        placeholder="请输入团队整体指标"
        v-model="params.content"
      ></el-input>
      <el-link type="primary" class="ipt-btn" @click="addTeamNorm"
        >保存</el-link
      >
    </div>
  </div>
</template>

<script>
import TitleLine from '_c/common/TitleLine'
import { addTeamNorm } from '@/api/targetOkr'
export default {
  props: {
    targetId: [String, Number],
    teamNorm: String
  },
  components: {
    TitleLine
  },
  watch: {
    teamNorm(newVal) {
      this.params.content = newVal
    }
  },
  data() {
    return {
      isShowBtn: false,
      params: {
        target_id: '',
        content: ''
      },
      teamLoading: false
    }
  },
  methods: {
    async addTeamNorm() {
      this.teamLoading = true
      this.params.target_id = this.targetId
      try {
        let { message } = await addTeamNorm(this.params)
        this._message(message, 'success')
      } catch (error) {
        this._message(error)
      }
      this.teamLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.team-index {
  background: #fff;
  height: 100%;
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
}
</style>
