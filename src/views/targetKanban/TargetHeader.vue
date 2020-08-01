<template>
  <div class="header-wapper" v-loading="detailLoading">
    <div class="header-info-box" v-show="targetId !== ''">
      <el-progress
        type="circle"
        :percentage="parseInt(targetDetail.process)"
        :width="50"
      ></el-progress>
      <el-tooltip class="item" effect="dark" content="编辑OKR" placement="top">
        <span class="title-name" @click="createOkr('1')">{{
          targetDetail.target_name
        }}</span>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        :content="targetDetail.place_on_file == '0' ? 'OKR正常' : 'OKR已归档'"
        placement="top-start"
      >
        <el-switch
          class="mr10"
          v-model="targetDetail.place_on_file"
          active-value="0"
          @change="changeFile"
          inactive-value="1"
        ></el-switch>
      </el-tooltip>
      <el-tag type="info" class="mr10" size="mini">{{
        targetDetail.period_name
      }}</el-tag>
      <el-tooltip
        class="item"
        effect="dark"
        :content="targetDetail.responsible_people_all"
        placement="top-start"
      >
        <el-tag type="success" class="mr10" size="mini">{{
          targetDetail.responsible_people_name
        }}</el-tag>
      </el-tooltip>
      <el-tag type="info" class="mr10" size="mini"
        >父级目标:
        {{
          targetDetail.parent_target_id
            ? targetDetail.parent_target_name
            : '暂未关联'
        }}</el-tag
      >

      <el-tag
        class="mr10"
        style="cursor: pointer;"
        @click="setTop"
        :type="targetDetail.is_top == '1' ? 'warning' : 'info'"
        size="mini"
        >{{ targetDetail.is_top == '1' ? '已置顶' : '未置顶' }}</el-tag
      >

      <el-link
        type="danger"
        size="mini"
        v-if="userAuth.includes('del-target') && targetDetail.can_handle == 1"
        @click="delOkr"
        >删除OKR</el-link
      >
    </div>

    <span class="create-bon">
      <el-tooltip
        class="item"
        effect="dark"
        content="查看OKR新手流程指引"
        placement="top"
      >
        <el-link
          @click="handleToGuide"
          type="primary"
          style="margin-right:10px;"
          >我是新手?</el-link
        >
      </el-tooltip>

      <el-button
        slot="reference"
        @click="createOkr('0')"
        size="mini"
        type="primary"
        >新建OKR</el-button
      >
      <first-step></first-step>
    </span>

    <guide-dialog :zIndex="9999" v-if="false"></guide-dialog>
  </div>
</template>

<script>
import {
  getTargetDetail,
  setTargetTop,
  setTargetPlaceOnFile,
  delTarget
} from '@/api/targetOkr'
import { targetAddLog } from '@/api/common'

import GuideDialog from '_c/common/GuideDialog'
import FirstStep from '_c/guide/FirstStep'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    targetId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      detailLoading: false,
      targetDetail: {
        process: 0, //进度
        target_name: '', //目标名
        period_name: '', //周期类型名
        responsible_people: [], //所有的责任人
        responsible_people_all: '', //显示所有责任人
        responsible_people_name: '', //当前显示名字
        parent_target_id: '',
        parent_target_name: '', //父级目标名
        place_on_file: '0', //是否归档  1是 0否
        is_top: '0', //是否置顶  1是  0否
        team_norm: '', //团队指标
        can_handle: 1 //0不能操作   1能操作
      }
    }
  },
  created() {
    let createTxt = this.$route.query.create
    if (createTxt && createTxt == 'okr') {
      this.createOkr('0')
    }
  },
  watch: {
    targetId(newVal) {
      if (newVal.length <= 0) return
      this.getTargetDetail(newVal)
    },
    needCreateOkr() {
      this.createOkr('0')
    }
  },
  computed: {
    ...mapGetters(['userAuth', 'needCreateOkr'])
  },
  methods: {
    ...mapActions(['setGuideNum']),
    delOkr() {
      this.$confirm(
        '确定删除该OKR吗? 若执行，此OKR所有相关数据将无法恢复，请谨慎处理！',
        '提示',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.delTarget()
        })
        .catch(() => {})
    },
    async delTarget() {
      this.detailLoading = true
      try {
        let { message } = await delTarget({ target_id: this.targetId })
        this._message(message, 'success')
        this.$emit('delOkrOk')
      } catch (error) {
        this._message(error)
      }
      this.detailLoading = false
    },
    handleToGuide() {
      this.setGuideNum(1)
    },
    async changeFile() {
      try {
        await setTargetPlaceOnFile({
          place_on_file: this.targetDetail.place_on_file,
          target_id: this.targetId
        })
        this._message(
          this.targetDetail.place_on_file == '1' ? 'OKR已归档' : 'OKR成功激活',
          'success'
        )
      } catch (error) {
        console.log(error)
      }
    },
    async setTop() {
      let isTop = this.targetDetail.is_top == '0' ? '1' : '0'
      try {
        await setTargetTop({
          is_top: isTop,
          target_id: this.targetId
        })
        this.targetDetail.is_top = isTop
        this._message(isTop == '1' ? '置顶成功' : '取消置顶成功', 'success')
      } catch (error) {
        this._message(error)
      }
    },
    async getTargetDetail(id) {
      this.detailLoading = true
      try {
        let { data } = await getTargetDetail({ target_id: id })
        this.targetDetail = data
        this.targetDetail['responsible_people_all'] = ''
        this.targetDetail.responsible_people.forEach(el => {
          this.targetDetail.responsible_people_all += ` ${el.username} `
        })
        if (this.targetDetail.responsible_people.length > 0) {
          if (this.targetDetail.responsible_people.length > 1) {
            this.targetDetail.responsible_people_name =
              this.targetDetail.responsible_people[0].username +
              '+' +
              this.targetDetail.responsible_people.length
          } else {
            this.targetDetail.responsible_people_name = this.targetDetail.responsible_people[0].username
          }
        }
        this.$emit('sendTeamNorm', this.targetDetail.team_norm)
      } catch (error) {
        this._message(error)
      }
      this.detailLoading = false
    },
    async createOkr(flg) {
      this.$emit('createOkr', flg)
      try {
        // 记录点击
        await targetAddLog()
      } catch (error) {
        this._message(error)
      }
    }
  },
  components: {
    GuideDialog,
    FirstStep
  }
}
</script>

<style lang="scss" scoped>
.header-wapper {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  .header-info-box {
    height: 100%;
    display: flex;
    align-items: center;
    ::v-deep .el-progress__text {
      font-size: 13px !important;
    }
    .title-name {
      margin-left: 10px;
      margin-right: 20px;
      max-width: 450px;
      color: #333;
      font-size: 16px;
      font-weight: 800;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
  }
  .create-bon {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
