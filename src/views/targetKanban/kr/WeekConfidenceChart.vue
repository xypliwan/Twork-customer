<template>
  <div class="chart-box" v-loading="loadingCharts">
    <title-line title="复盘信心指数更新趋势"></title-line>
    <div v-if="chartData.rows.length > 0">
      <ve-line
        :data="chartData"
        :loading="loadingCharts"
        :settings="chartSettings"
      ></ve-line>
    </div>

    <no-data v-show="chartData.rows.length <= 0"></no-data>
  </div>
</template>

<script>
import TitleLine from '_c/common/TitleLine'
import NoData from '_c/common/NoData'
import { getTargetChartList } from '@/api/targetOkr'
export default {
  props: {
    krId: [String, Number]
  },
  data() {
    this.chartSettings = {
      stack: { 用户: ['新增', '已完成'] },
      labelMap: {
        //别名
        date: '日期',
        new_add: '新增',
        completed: '已完成'
      }
    }
    return {
      chartData: {
        // columns: ['date', 'new_add', 'completed'],
        columns: [],
        rows: [
          //   { date: 'kr1', new_add: 1, completed: 2 },
          //   { date: '2019-12-13 24:222,111', new_add: 0, completed: 1093 },
          //   { date: '2019-12-14 24:33,111', new_add: 1396, completed: 1093 }
        ]
      },
      loadingCharts: false
    }
  },
  watch: {
    krId(newVal) {
      if (newVal !== '') {
        this.getTargetChartList()
      } else {
        this.chartData.columns = []
        this.chartData.rows = []
      }
    }
  },
  methods: {
    async getTargetChartList() {
      this.loadingCharts = true
      try {
        //   le
        let { data } = await getTargetChartList({ kr_id: this.krId })
        this.chartData.columns = data.columns
        this.chartData.rows = data.rows
      } catch (error) {
        this._message(error)
      }
      this.loadingCharts = false
    }
  },
  components: {
    TitleLine,
    NoData
  }
}
</script>

<style lang="scss" scoped>
.chart-box {
  padding-top: 20px;
}
</style>
