<template>
  <div class="target">
    <div
      class="extend-box"
      :class="isExtend ? 'active-extend' : ''"
      @click="isExtend = false"
    >
      <i class="iconfont icon-zhankai2"></i>
    </div>
    <div class="target-left" :class="isExtend ? 'active-wd' : ''">
      <attention-box
        @changeTargetId="changeTargetId"
        ref="attentionBoxRef"
        @extendChange="extendChange"
        :targetProjectList="targetProjectList"
        :periodList="periodList"
        :userList="userList"
        :departmentInfo="departmentInfo"
      ></attention-box>
    </div>
    <div class="target-right">
      <div class="target-title">
        <target-header
          ref="okrHeaderRef"
          @createOkr="createOkrMol"
          :targetId="targetId"
          @sendTeamNorm="sendTeamNorm"
          @delOkrOk="delOkrOk"
        ></target-header>
      </div>
      <div v-show="targetId == ''">
        <no-data></no-data>
      </div>
      <div class="target-cont" v-show="targetId !== ''">
        <div class="cont-item task-box">
          <task
            :targetId="targetId"
            :userList="userList"
            :isExpandTask="isExpandTask"
            @handleTaskExtend="handleTaskExtend"
          ></task>
        </div>
        <div style="width:10px"></div>
        <div
          class="cont-item res-box"
          :class="isExpandTask ? 'res-box-active' : ''"
        >
          <div class="key-result">
            <key-result
              :targetId="targetId"
              :userList="userList"
              @updateKrList="updateKrList"
            ></key-result>
          </div>
          <div class="team-stauts">
            <team-index :targetId="targetId" :teamNorm="teamNorm"></team-index>
          </div>
        </div>
      </div>
    </div>

    <create-okr
      :dialog.sync="createOkrDialog"
      :departmentInfo="departmentInfo"
      :periodList="periodList"
      :targetProjectList="targetProjectList"
      :userList="userList"
      :allVisibleUser="allVisibleUser"
      @createOkrOk="createOkrOk"
      @updateOkrOk="updateOkrOk"
      :okrFlg="okrFlg"
      :targetId="targetId"
    ></create-okr>

    <last-step></last-step>
  </div>
</template>

<script>
import AttentionBox from './AttentionBox'
import CreateOkr from './dialog/CreateOkr'
import TargetHeader from './TargetHeader'
import KeyResult from './kr/KeyResult'
import Task from './task/Task'
import TeamIndex from './TeamIndex'
import NoData from '_c/common/NoData'
import LastStep from '_c/guide/LastStep'

import {
  getDepartmentInfo,
  getTargetProjectList,
  getPeriodList,
  getUserList
} from '@/api/common'

import { mapGetters } from 'vuex'

export default {
  name: 'target-kanban',
  data() {
    return {
      departmentInfo: [], //所有部门
      periodList: [], //周期列表
      targetProjectList: [], //获取目标类型
      userList: [], //责任人列表
      allVisibleUser: [], //所有可见成员

      createOkrDialog: false,
      targetId: '',
      teamNorm: '', //团队状态指标
      isExtend: false,
      okrFlg: '',
      isExpandTask: false //是否展开任务列表
    }
  },
  created() {
    this.getDepartmentInfo()
    this.getPeriodList()
    this.getTargetProjectList()
    this.getUserList()
  },
  mounted() {},
  watch: {
    guideNum(newVal) {
      if (newVal == 2) {
        this.createOkrMol('0')
      }
    }
  },
  computed: {
    ...mapGetters(['guideNum'])
  },
  methods: {
    handleTaskExtend() {
      this.isExpandTask = !this.isExpandTask
      if (this.isExpandTask) {
        this.isExtend = true
      }
    },
    delOkrOk() {
      this.targetId = ''
      this.$refs.attentionBoxRef.handleTab()
    },
    updateKrList() {},
    createOkrMol(flg) {
      //flg 0创建   1修改
      this.okrFlg = flg
      this.createOkrDialog = true
    },
    extendChange() {
      this.isExtend = true
    },
    sendTeamNorm(teamNorm) {
      this.teamNorm = teamNorm
    },
    changeTargetId(targetId) {
      this.targetId = targetId
    },
    updateOkrOk(targetId) {
      this.$refs.okrHeaderRef.getTargetDetail(targetId)
      this.$refs.attentionBoxRef.getTaskList()
    },
    //创建成功
    createOkrOk(targetId) {
      this.targetId = targetId
      this.$refs.attentionBoxRef.getTaskList()
    },
    //获取责任人列表
    async getUserList() {
      try {
        let { data } = await getUserList()
        this.userList = data
      } catch (error) {
        this._message(error)
      }
    },
    //获取目标类型
    async getTargetProjectList() {
      try {
        let { data } = await getTargetProjectList()
        this.targetProjectList = data
      } catch (error) {
        this._message(error)
      }
    },
    //获取周期列表
    async getPeriodList() {
      try {
        let { data } = await getPeriodList()
        this.periodList = data
      } catch (error) {
        this._message(error)
      }
    },
    //获取部门和人员
    async getDepartmentInfo() {
      try {
        let { data } = await getDepartmentInfo({ 'get-people': 1 })
        let parentArr = JSON.parse(JSON.stringify(data))
        let userArr = JSON.parse(JSON.stringify(data))
        this.departmentInfo = this.formateDepartment(parentArr)
        this.allVisibleUser = this.formateAllVisibleUser(userArr)
      } catch (error) {
        this._message(error)
      }
    },
    formateDepartment(arr) {
      arr.forEach(el => {
        if (el.children) {
          this.formateDepartment(el.children)
        } else {
          delete el.people
        }
      })
      return arr
    },
    pushData(obj) {
      let item = {
        department_id: obj.user_id,
        department_name: obj.username,
        user_id: obj.user_id,
        user_name: obj.username
      }
      return item
    },
    formateAllVisibleUser(arr) {
      arr.forEach(el => {
        if (el.children) {
          if (el.people && el.people.length > 0) {
            el.people.forEach(peopleItem => {
              el.children.push(this.pushData(peopleItem))
            })
          }
          this.formateAllVisibleUser(el.children)
        } else {
          if (el.people && el.people.length > 0) {
            el['children'] = []
            el['disabled'] = false
            el.people.forEach(peopleItem => {
              el['children'].push(this.pushData(peopleItem))
            })
          } else {
            if (el.user_id) {
              el['disabled'] = false
            } else {
              el['disabled'] = true
              el.department_name = `${el.department_name}(暂无成员)`
            }
          }
        }
      })
      return arr
    }
  },
  components: {
    AttentionBox,
    CreateOkr,
    TargetHeader,
    KeyResult,
    Task,
    TeamIndex,
    NoData,
    LastStep
  }
}
</script>

<style lang="scss" scoped>
.target {
  background: #f4f4f4;
  height: 100%;
  display: flex;
  overflow-x: hidden;
  .extend-box {
    position: fixed;
    top: 90px;
    left: 0px;
    z-index: 999;
    width: 25px;
    height: 25px;
    background: rgba(64, 158, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0px 15px 15px 0;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s linear;
    transform: translateX(-100%);
    &.active-extend {
      transform: translateX(0%);
    }
    i {
      font-size: 16px;
    }
  }
  .target-left {
    float: left;
    height: 100%;
    overflow: hidden;
    background: #fff;
    width: 250px;
    transition: all 0.2s linear;
    &.active-wd {
      width: 0px;
    }
  }
  .target-right {
    flex: 1;
    margin-left: 15px;
    overflow: hidden;
    .target-title {
      height: 60px;
      background: #fff;
      padding: 5px 5px;
    }
    .target-cont {
      display: flex;
      margin-top: 10px;
      height: calc(100% - 70px);
      .cont-item {
        flex: 1;
        overflow-x: hidden;
      }
      .task-box {
        background: #fff;
      }
      .res-box {
        &.res-box-active {
          overflow: hidden;
          flex: 0;
        }
        .key-result {
          height: calc(100% - 150px);
          padding-bottom: 20px;
          overflow: hidden;
        }
        .team-stauts {
          height: 150px;
        }
      }
    }
  }
}
</style>
