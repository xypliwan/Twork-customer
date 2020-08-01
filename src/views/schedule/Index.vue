<template>
  <div class="schedule">
    <div class="schedule-flex">
      <div class="schedule-flex-left">
        <my-schedule
          :groupData="groupData"
          @openSubscribeDialog="subscribeScheduleVisible = true"
          @searchGroupList="getGoupList"
          @openGroupDialog="openGroupDialog"
        ></my-schedule>
      </div>
      <div class="schedule-flex-right">
        <div class="schedule-operation">
          <span
            class="el-icon-search theme-color pointer"
            @click="openfiltration"
          ></span>
          <!-- <span class="el-icon-setting theme-color pointer"></span> -->
        </div>
        <full-calendar @openDailog="openDailog"></full-calendar>
      </div>
    </div>
    <add-schedule-group
      :addScheduleGroupVisible.sync="addScheduleGroupVisible"
      :groupId="groupId"
      :allUserData="allUserData"
      :visitScope="baseData.visit_scope"
      @refreshGroupList="refreshGroupList"
    ></add-schedule-group>
    <subscribe-schedule
      :subscribeScheduleVisible.sync="subscribeScheduleVisible"
      @refreshGroupList="refreshGroupList"
    ></subscribe-schedule>
    <add-schedule
      :addScheduleVisible.sync="addScheduleVisible"
      :allUserData="allUserData"
      :myScheduleData="myScheduleData"
    ></add-schedule>
    <schedule-filtration
      :allUserData="allUserData"
      :filtrationVisible.sync="filtrationVisible"
    ></schedule-filtration>
  </div>
</template>

<script>
import FullCalendar from '@/components/full-calendar/FullCalendar'
import MySchedule from './components/MySchedule'
import AddSchedule from './components/AddSchedule'
import AddScheduleGroup from './components/AddScheduleGroup'
import subscribeSchedule from './components/SubscribeSchedule'
import ScheduleFiltration from './components/ScheduleFiltration'
import { getUserList } from '@/api/common'
import { scheduleGroupList, scheduleGroupfilter } from '@/api/schedule'
import vueEvent from '@/utils/vue-event'
export default {
  name: 'schedule',
  components: {
    FullCalendar,
    MySchedule,
    AddSchedule,
    AddScheduleGroup,
    subscribeSchedule,
    ScheduleFiltration
  },
  data() {
    return {
      addScheduleGroupVisible: false,
      subscribeScheduleVisible: false,
      addScheduleVisible: false,
      filtrationVisible: false,
      baseData: {}, //基础数据
      allUserData: [], //所有成员
      groupData: [], //分组数据
      groupId: '' //分组id,
    }
  },
  computed: {
    myScheduleData() {
      return this.groupData.length > 0 ? this.groupData[0].data : []
    }
  },
  watch: {
    addScheduleGroupVisible(val) {
      if (!val) this.groupId = ''
    }
  },
  created() {
    this.getGoupList()
    this.getBaseData()
    this.getAllUser()
  },
  methods: {
    // 基础数据
    async getBaseData() {
      try {
        let { data } = await scheduleGroupfilter()
        this.baseData = data
      } catch (error) {
        this._message(error)
      }
    },
    // 成员数据
    async getAllUser() {
      try {
        let { data } = await getUserList()
        this.allUserData = data
      } catch (error) {
        this._message(error)
      }
    },
    // 日程组列表
    async getGoupList(keyword) {
      try {
        let { data } = await scheduleGroupList({ keyword })
        let schedule_group = []
        data.forEach(el => {
          this.$set(el, 'isShow', false)
          el.data.forEach(v => {
            this.$set(v, 'isChecked', true)
            schedule_group.push(v)
          })
        })
        this.groupData = data
        const schedule_group_id = schedule_group.map(el => el.id).join(',')
        vueEvent.$emit('refreshScheduleList', schedule_group_id)
      } catch (error) {
        this._message(error)
      }
    },
    refreshGroupList() {
      this.getGoupList()
    },
    openGroupDialog(el) {
      this.groupId = el.id || ''
      this.addScheduleGroupVisible = true
      console.log(el.id, 333)
    },
    openDailog(val) {
      this.addScheduleVisible = val
    },
    openfiltration() {
      this.filtrationVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.schedule {
  background-color: #fff;
  .schedule-flex {
    display: flex;
    .schedule-flex-left {
      padding: 20px;
      width: 300px;
      background-color: #f8f9fa;
      .schedule-flex-left-nav {
        display: flex;
        align-items: center;
        box-shadow: #ccc 0px 0px 2px;
        margin-bottom: 10px;
        span {
          text-align: center;
          flex: 1;
          padding: 10px 0px;
          line-height: 24px;
          cursor: pointer;
          &.active {
            box-shadow: #526ecc 0px 3px 0px inset;
          }
        }
      }
    }
    .schedule-flex-right {
      padding-top: 20px;
      flex: 1;
      position: relative;
      .schedule-operation {
        position: absolute;
        right: 150px;
        top: 28px;
        font-size: 26px;
        span {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
