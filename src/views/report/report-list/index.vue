<template>
  <div class="list-wrapper" v-loading="listLoading">
    <title-line title="最近使用模板"></title-line>
    <div class="report-box">
      <div
        v-for="item in lastReportList"
        :key="item.report_id"
        class="report-item"
        @click="toWrite(item)"
      >
        <div class="left">
          <i
            class="iconfont"
            :class="item.icon"
            :style="{ color: getIconColor(item.icon) }"
          ></i>
        </div>
        <el-tooltip
          class="item"
          effect="dark"
          :content="item.report_name"
          placement="top"
        >
          <div class="right">{{ item.report_name }}</div>
        </el-tooltip>
      </div>
    </div>
    <no-data
      desc="您还没有可用的汇报模板，请前往后台设置汇报模板后使用
"
      v-if="!lastReportList.length"
    ></no-data>
    <title-line title="全部汇报模板"></title-line>
    <div class="report-box">
      <div
        v-for="item in reportList"
        :key="item.report_id"
        class="report-item"
        @click="toWrite(item)"
      >
        <div class="left">
          <i
            class="iconfont"
            :class="item.icon"
            :style="{ color: getIconColor(item.icon) }"
          ></i>
        </div>
        <el-tooltip
          class="item"
          effect="dark"
          :content="item.report_name"
          placement="top"
        >
          <div class="right">{{ item.report_name }}</div>
        </el-tooltip>
      </div>
    </div>
    <no-data
      desc="您还没有可用的汇报模板，请前往后台设置汇报模板后使用"
      v-if="!reportList.length"
    ></no-data>
  </div>
</template>
<script>
import { reportList } from '@/api/report'
import TitleLine from '_c/common/TitleLine'
import NoData from '_c/common/NoData'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      reportList: [],
      lastReportList: [],
      listLoading: false
    }
  },
  created() {
    this.getReportListFn()
  },
  computed: {
    ...mapGetters(['iconList'])
  },
  methods: {
    toWrite(item) {
      this.$router.push(`/write-report?reportid=${item.report_id}`)
    },
    getIconColor(icon) {
      return this.iconList.find(el => el.icon == icon).color
    },
    async getReportListFn() {
      this.listLoading = true
      try {
        let {
          data: { list, last_use }
        } = await reportList()
        this.reportList = list
        this.lastReportList = last_use
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    }
  },
  components: {
    TitleLine,
    NoData
  }
}
</script>
<style lang="scss" scoped>
.list-wrapper {
  .report-box {
    padding: 15px 0;
    margin: 10px 0;
    border-top: 1px solid #f1f1f1;
    display: flex;
    flex-wrap: wrap;
    .report-item {
      width: 200px;
      margin-right: 14px;
      border: 1px solid #e4e4e4;
      border-radius: 3px;
      padding: 8px 15px;
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      cursor: pointer;
      .left {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        .iconfont {
          font-size: 42px;
        }
      }
      .right {
        flex: 1;
        font-size: 15px;
        color: #333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 20px;
      }
    }
  }
}
</style>
