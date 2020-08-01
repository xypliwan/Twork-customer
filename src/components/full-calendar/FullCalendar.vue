<template>
  <div>
    <FullCalendar
      ref="fullCalendar"
      defaultView="dayGridMonth"
      locale="zh-cn"
      :header="{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      }"
      :plugins="calendarPlugins"
      :allDaySlot="false"
      :slotLabelFormat="slotLabelFormat"
      :slotLabelInterval="{ hours: 1 }"
      slotDuration="00:30:00"
      :eventTimeFormat="eventTimeFormat"
      :displayEventEnd="true"
      :handleWindowResize="false"
      :buttonText="buttonText"
      :events="getCalendarEvents"
      :eventLimit="true"
      eventLimitText="更多"
      @dateClick="handleDateClick"
      @eventClick="handleEventClick"
    />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { scheduleGetMyList } from '@/api/schedule'
import vueEvent from '@/utils/vue-event'
import moment from 'moment'

// displayEventEnd: true 显示结束时间
export default {
  name: 'fullcalendar_page',
  components: {
    FullCalendar
  },
  data() {
    return {
      buttonText: {
        today: '今天',
        month: '月',
        week: '周',
        day: '天',
        list: '列表'
      },
      calendarPlugins: [
        // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      // calendarEvents: [
      //   {
      //     title: '今日日程',
      //     start: new Date(),
      //     color: '#A61000'
      //   }
      // ],
      // 周与日的左侧时间显示格式
      slotLabelFormat: [{ hour: 'numeric', minute: '2-digit', hour12: false }],
      // 日程表格中时间显示格式
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        // meridiem: false
        hour12: false
      },
      calendarApi: null,
      schedule_group_id: '',
      params: {
        keyword: '',
        start_time: '',
        end_time: '',
        schedule_group_id: ''
      },
      scheduleList: []
    }
  },
  computed: {},
  mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi()
    // console.log(this.$refs.fullCalendar, this.calendarApi)
    vueEvent.$on('refreshScheduleList', el => {
      this.schedule_group_id = el
      this.calendarApi.refetchEvents() //刷新数据
    })
    vueEvent.$on('refreshList', () => {
      this.calendarApi.refetchEvents() //刷新数据
    })
    vueEvent.$on('gotoPast', el => {
      this.gotoPast(el)
    })
  },
  methods: {
    async scheduleGetMyList() {
      try {
        const { data } = await scheduleGetMyList(this.params)
        this.scheduleList = data
      } catch (error) {
        this._message(error)
      }
    },
    async getCalendarEvents(info, successCallback) {
      console.log(info, 'info')
      // failureCallback 是失败返回函数
      this.params.schedule_group_id = this.schedule_group_id
      this.params.start_time = moment(info.start).format('YYYY-MM-DD hh:mm:ss')
      this.params.end_time = moment(info.end).format('YYYY-MM-DD hh:mm:ss')
      await this.scheduleGetMyList()
      let events = []
      this.scheduleList.forEach(el => {
        events.push({
          title: el.title,
          start: el.start_time,
          end: el.end_time,
          id: el.schedule_id,
          extendedProps: {
            status: 'done'
          },
          // borderColor: 'green',
          color: '#6fddb1'
        })
      })
      successCallback(events)
    },
    gotoPast(time) {
      const day = moment(time).format('YYYY-MM-DD')
      this.calendarApi.gotoDate(day) // 跳转到指定时间
    },
    handleDateClick(arg) {
      console.log(arg, '点击当前时间')
      vueEvent.$emit('addDate', arg)
      this.$emit('openDailog', true)
      return
    },
    handleEventClick(info) {
      vueEvent.$emit('editDate', info.event)
      this.$emit('openDailog', true)
      // console.log(info, '日程信息')
    }
  }
}
</script>

<style lang="scss" scoped>
// you must include each plugins' css
// paths prefixed with ~ signify node_modules
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';

::v-deep .fc-toolbar.fc-header-toolbar {
  padding: 0 10px;
}
::v-deep .fc-left .fc-button-group .fc-button-primary,
::v-deep .fc-left .fc-button-group .fc-button-primary:hover {
  color: #555;
  border: 0px;
  background-color: #fff;
}
::v-deep .fc-right .fc-button-group .fc-button-primary,
::v-deep .fc-right .fc-button-group .fc-button-primary:hover {
  color: #555;
  background-color: #fff;
  border: 1px solid #eee;
}

::v-deep .fc th {
  padding: 4px;
}

// ::v-deep .fc-button {
//   color: #555;
//   background-color: #fff;
//   border: 0px;
// }
// ::v-deep .fc-button-primary {
//   border: 1px solid #eee;
// }
</style>
