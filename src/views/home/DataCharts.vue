<template>
  <div>
    <div class="charts-box">
      <div class="left">
        <el-tabs v-model="chartParams.type" @tab-click="handleTab">
          <el-tab-pane label="流程处理趋势" name="process"> </el-tab-pane>
          <el-tab-pane label="OKR任务处理趋势" name="task"> </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <span
          class="type-span"
          :class="timeType == item.type ? 'active-color' : ''"
          v-for="item in typeList"
          :key="item.type"
          @click="handleType(item)"
          >{{ item.label }}</span
        >
      </div>
    </div>

    <div id="main" style="width: 100%;height:400px;"></div>
  </div>
</template>
<script>
import { taskCountLog } from '@/api/home'
var echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/title')
export default {
  data() {
    return {
      taskChartData: {},
      chartParams: {
        start_at: '',
        end_at: '',
        type: 'process'
      },
      timeType: 'week',
      typeList: [
        { type: 'week', label: '7天', day: -7 },
        { type: 'month', label: '30天', day: -30 },
        { type: 'double_month', label: '60天', day: -60 },
        { type: 'triple_month', label: '90天', day: -90 }
      ],
      myChart: null
    }
  },
  async mounted() {
    this.initCharts(-7)
  },
  methods: {
    async initCharts(day) {
      await this.fun_date(day)
      await this.getTaskCountLog()
      this.myChart = echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: this.taskChartData.legend
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.taskChartData.time
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.taskChartData.series
      }
      // // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
    },
    handleTab() {
      let day = this.typeList.find(el => el.type == this.timeType).day
      this.initCharts(day)
    },
    handleType(item) {
      this.timeType = item.type
      this.initCharts(item.day)
    },
    async getTaskCountLog() {
      try {
        let { data } = await taskCountLog(this.chartParams)
        if (data.series.length > 0) {
          data.series.forEach(el => {
            this.$set(el, 'type', 'line')
            this.$set(el, 'areaStyle', {})
            this.$set(el, 'stack', '总量')
          })
        }
        this.taskChartData = data
      } catch (error) {
        this._message(error)
      }
    },
    fun_date(aa) {
      var date1 = new Date()
      let month1 = date1.getMonth() + 1
      month1 = month1 < 10 ? '0' + month1 : month1
      let day1 = date1.getDate()
      day1 = day1 < 10 ? '0' + day1 : day1
      let time1 = date1.getFullYear() + '-' + month1 + '-' + day1 //time1表示当前时间
      // 过去或未来时间计算
      var date2 = new Date(date1)
      date2.setDate(date1.getDate() + aa)
      let month2 = date2.getMonth() + 1
      month2 = month2 < 10 ? '0' + month2 : month2
      let day2 = date2.getDate()
      day2 = day2 < 10 ? '0' + day2 : day2
      var time2 = date2.getFullYear() + '-' + month2 + '-' + day2
      this.chartParams.start_at = time2
      this.chartParams.end_at = time1
    }
  }
}
</script>
<style lang="scss" scoped>
.charts-box {
  display: flex;
  .left {
    flex: 1;
  }
  .right {
    margin-left: 10px;
    .type-span {
      font-size: 14px;
      color: #333;
      margin-right: 10px;
      cursor: pointer;
      &.active-color {
        color: #526ecc;
        font-weight: 600;
      }
    }
  }
}
::v-deep #main {
  height: 290px !important;
}
</style>
