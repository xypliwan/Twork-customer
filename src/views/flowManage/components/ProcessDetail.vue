<template>
  <div class="process" v-loading="detailLoading">
    <!-- <h4>{{detailData.create_user_name}}提交的“{{detailData.list_name}}”流程</h4> -->
    <div class="top">
      <div class="top-circle">
        {{ detailData.create_user_name | nameFilter }}
      </div>
      <div class="right">
        <p>
          <strong
            >{{ detailData.create_user_name }}提交的“{{
              detailData.list_name
            }}”流程</strong
          >
        </p>
        <p class="orange" style="font-size:12px;">
          {{ currenStepDecs }}
          <span class="fr">
            <el-link
              v-if="detailData.button.urge == 1"
              style="margin-left:10px"
              type="success"
              @click="transferVisible = true"
              >转交</el-link
            >
            <el-link
              v-if="detailData.button.change_process_list_people == 1"
              style="margin-left:10px"
              type="success"
              :disabled="urgeDisabled"
              @click="urgeDo"
              >催办</el-link
            >
          </span>
        </p>
      </div>
      <img
        class="status-img"
        :src="getMappingVal(statusImg, 'status', detailData.list_status, 'img')"
        alt
      />
    </div>
    <div class="contents">
      <div class="form-box">
        <div
          class="alert color9"
          v-if="detailData.fromat.detail.base_setting.desc"
        >
          <i class="el-icon-info" style="font-size:16px;"></i>
          {{ detailData.fromat.detail.base_setting.desc }}
        </div>
        <div class="form-item">
          <div
            class="form-item-content"
            :class="{ 'form-item-active': isShow }"
          >
            <div ref="forms">
              <!-- 表单内容 -->
              <static-form
                :detailData="detailData"
                :list="detailData.fromat.detail.form_setting"
                :departmentData="departmentData"
              ></static-form>
            </div>
          </div>
          <!-- 超过限制的最大高度时显示 -->
          <div class="item-btn" v-show="showHeight > 210">
            <el-button type="text" size="mini" @click="isShow = !isShow">{{
              isShow ? '收起' : '查看更多'
            }}</el-button>
          </div>
        </div>
        <!-- 流程步骤 -->
        <process-step
          :detailData="detailData"
          @completeCheck="completeCheck"
          @timeChange="timeChange"
          @delCheck="delCheck"
          @addMatter="addMatter"
        ></process-step>
      </div>
    </div>
    <div class="foorter-btn">
      <div class="status-btn" v-if="detailData.button.reply == 1">
        <el-button
          type="success"
          size="medium"
          plain
          @click="commentVisible = true"
          >评论</el-button
        >
      </div>

      <div class="status-btn" v-if="detailData.button.can_done == 1">
        <el-button
          icon="el-icon-success"
          type="success"
          size="medium"
          plain
          @click="openDailog('done')"
          >完成</el-button
        >
      </div>
      <div class="status-btn" v-if="detailData.button.can_reject == 1">
        <el-button
          icon="el-icon-error"
          type="danger"
          size="medium"
          plain
          @click="openDailog('reject')"
          >拒绝</el-button
        >
      </div>
      <!-- <div class="status-btn" v-if="detailData.button.can_back == 1">
        <el-button type="info" size="medium" plain @click="openDailog('back')"
          >回退</el-button
        >
      </div> -->
      <div class="status-btn" v-if="detailData.button.can_cancel == 1">
        <el-button type="info" size="medium" plain @click="openDailog('cancel')"
          >撤销</el-button
        >
      </div>

      <update-status
        :visible.sync="visible"
        :detailData="detailData"
        :updateStatusInit="updateStatus"
        @confirmOk="confirmOk"
      ></update-status>
    </div>
    <transfer-to
      :urgeInfo="detailData.urge_info"
      :transferVisible.sync="transferVisible"
      @refresh="$emit('refreshList', true)"
    ></transfer-to>

    <comment
      :listId="list_id"
      :visible.sync="commentVisible"
      :detailData="detailData"
      @commentOk="commentOk"
    ></comment>
  </div>
</template>

<script>
import TransferTo from './transferTo'
import {
  processListDetail,
  addCheck,
  updateCheck,
  deleteCheck,
  completeOrCancleCheck,
  addUrge
} from '@/api/flowManage'
import wancheng from '@/assets/images/wancheng.png'
import jujue from '@/assets/images/jujue.png'
import chexiao from '@/assets/images/chexiao.png'
import { mapGetters } from 'vuex'
import StaticForm from './StaticForm'
import ProcessStep from './ProcessStep'
import UpdateStatus from './UpdateStatus'
import Comment from './Comment'
export default {
  props: {
    list_id: [String, Number],
    status: [String, Number],
    departmentData: Array,
    dynamicDialog: Boolean
  },
  components: {
    TransferTo,
    StaticForm,
    ProcessStep,
    UpdateStatus,
    Comment
  },
  name: '',
  data() {
    return {
      commentVisible: false,
      transferVisible: false,
      visible: false,
      isShow: false,
      showHeight: 0,
      detailLoading: false,
      userFlag: false, //判断登录的用户是否是当前处理人
      currenStepDecs: '', //当前步骤处理描述
      urgeDisabled: false, //是否禁止催办
      last_d: 0, //最后一次催办时间戳
      timer: null,
      detailData: {
        fromat: {
          form: {},
          detail: {
            base_setting: {},
            advanced_setting: {}
          }
        },
        step: [],
        button: {}
      },
      updateStatus: {
        status_code: '', //done 完成 reject 拒绝 back 回退 cancel 取消
        list_id: '' //流程表单的id
      },
      listStatus: [
        { id: 0, label: '流程已提交', step_status_name: '未处理' },
        { id: 1, label: '流程处理中', step_status_name: '处理中' },
        { id: 2, label: '流程已通过', step_status_name: '已同意' },
        { id: 3, label: '审批被拒绝', step_status_name: '已拒绝' },
        { id: 4, label: '已撤销', step_status_name: '已撤销' }
      ],
      statusImg: [
        { status: 2, img: wancheng },
        { status: 3, img: jujue },
        { status: 4, img: chexiao }
      ]
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    //父组件调用详情方法
    async getDetail(id) {
      this.detailLoading = true
      this.urgeDisabled = false
      clearInterval(this.timer)
      this.isShow = false
      try {
        let { data } = await processListDetail({ list_id: id })

        data.step.forEach(el => {
          // 获取进行中的步骤
          if (el.step_status == 1) {
            this.userFlag = el.people.find(el => el.user_id == this.userInfo.id)
          }
          if (el.step_type == 1) {
            this.$set(el, 'addMatters', {
              check_name: '',
              time: '',
              files: []
            })
          }
          if (el.step_type == 1 && el.check.length > 0) {
            el.check.forEach(v => {
              v.time = [v.start_at, v.end_at]
            })
          }
        })
        this.detailData = data
        if (this.detailData.urge_info.last_urge_at) {
          this.setDisabled(this.detailData.urge_info.last_urge_at)
        }

        // step_status '0未开始 1进行中 2完成 3 拒绝 4回退',
        if (this.detailData.list_status != 1) {
          this.currenStepDecs = this.getMappingVal(
            this.listStatus,
            'id',
            this.detailData.list_status,
            'label'
          )
        } else {
          // 获取当前处理人
          let arr = JSON.parse(JSON.stringify(this.detailData.step))
          let currentStep = arr.reverse().find(el => el.is_now_deal_step == 1)
          let currenHandler = currentStep.people.map(el => el.username)
          this.currenStepDecs =
            currenHandler.join(',') + '正在' + currentStep.step_status_name
        }
        this.detailLoading = false
        this.$nextTick(() => {
          this.showHeight = this.$refs.forms.offsetHeight
        })
      } catch (error) {
        this.detailLoading = false
        this._message(error)
      }
    },
    // 添加事项
    async addMatter(item) {
      if (!item.addMatters.check_name) return this._message('请输入事项名称”')
      item.addMatters.start_at = item.addMatters.time[0] || ''
      item.addMatters.end_at = item.addMatters.time[1] || ''
      item.addMatters.step_id = item.step_id
      item.addMatters.list_id = this.list_id
      item.visible = false
      try {
        let { data } = await addCheck(item.addMatters)
        item.check.push(data)
        this.getDetail(this.list_id)
      } catch (error) {
        this._message(error)
      }
      item.addMatters.check_name = ''
      item.addMatters.time = ''
    },
    // 事项时间改变触发编辑事项
    async timeChange(data) {
      const { item, el } = data
      el.start_at = el.time ? el.time[0] : ''
      el.end_at = el.time ? el.time[1] : ''
      el.list_id = this.list_id
      el.step_id = item.step_id
      try {
        await updateCheck(el)
      } catch (error) {
        this._message(error)
      }
    },
    // 删除处理事项
    async delCheck(data) {
      const { item, el, i } = data
      try {
        await deleteCheck({
          list_check_id: el.list_check_id
        })
        // this.$message.success(message);
        item.check.splice(i, 1)
        this.getDetail(this.list_id)
      } catch (error) {
        this._message(error)
      }
    },
    // 完成或取消处理事项
    async completeCheck(item) {
      try {
        await completeOrCancleCheck({
          list_check_id: item.list_check_id,
          check_status: item.check_status
        })
        // this.getDetail(this.list_id);
      } catch (error) {
        this._message(error)
      }
    },
    commentOk(id) {
      this.getDetail(id)
    },
    async openDailog(status_code) {
      if (status_code == 'done') {
        let confirmStatus = true // eslint-disable-line
        let arr = JSON.parse(JSON.stringify(this.detailData.step))
        let step = arr.reverse().find(el => el.is_now_deal_step == 1) //当前进行的步骤
        if (step.step_type == 1 && step.check.find(v => v.check_status == 0)) {
          this.$message.warning('请先完成处理事项')
          confirmStatus = false
          return true
        }
      }
      this.updateStatus.status_code = status_code
      this.updateStatus.list_id = this.list_id
      this.visible = true
    },
    confirmOk() {
      this.$emit('refreshList', true)
      if (this.dynamicDialog) {
        this.$emit('closeDialog', true)
      }
    },
    // 催办操作判断
    setDisabled(last_time) {
      // last_time 2020-04-10 10:30:00
      let last_d = new Date(last_time)
      this.last_d = last_d.getTime(last_d)
      // 需要有催办信息且距离上次催办时间超过一个小时才可以进行催办，否则按钮灰显。
      this.timer = setInterval(() => {
        let current_d = new Date()
        if (current_d.getTime(current_d) - this.last_d < 60 * 60 * 1000) {
          this.urgeDisabled = true
        } else {
          this.urgeDisabled = false
          clearInterval(this.timer)
        }
      }, 1000)
    },
    // 催办
    async urgeDo() {
      let params = {
        list_id: this.detailData.urge_info.list_id,
        step_id: this.detailData.urge_info.step_id
      }
      try {
        let { data } = await addUrge(params)
        this.$message.success('催办成功')
        clearInterval(this.timer)
        this.setDisabled(data.created_at)
      } catch (error) {
        this._message(error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.process {
  height: 100%;
  overflow-y: auto;
  h4 {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
  }
  .top {
    position: relative;
    padding: 10px;
    border-bottom: 1px solid #eee;
    display: flex;
    height: 72px;
    .top-circle {
      width: 50px;
      height: 50px;
      color: #fff;
      background-color: #586fcf;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .right {
      flex: 1;
      padding: 5px;
      p {
        height: 20px;
        line-height: 20px;
      }
    }
    .status-img {
      width: 100px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }
  .contents {
    padding: 10px;
    height: calc(100% - 72px - 40px);
    overflow-y: auto;
    .form-box {
      .alert {
        width: 100%;
        font-size: 13px;
        height: 34px;
        padding: 8px 16px;
        border-radius: 3px;
        background-color: #f4f4f5;
      }
      .form-item {
        padding: 10px;
        border-bottom: 1px solid #eee;
        .form-item-content {
          max-height: 210px;
          overflow: hidden;
          &.form-item-active {
            max-height: unset;
            height: auto;
          }
        }
      }
    }
  }
  .foorter-btn {
    height: 40px;
    display: flex;
    .status-btn {
      flex: 1;
      width: 100%;
      padding: 0px 10px;
      display: flex;
      .el-button {
        flex: 1;
      }
    }
  }
}

::v-deep .el-timeline-item__timestamp {
  color: #333;
  font-weight: bold;
  font-size: 14px;
}
::v-deep .atwho-wrap {
  width: 100%;
}
</style>
