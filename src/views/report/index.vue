<template>
  <div class="report-manage">
    <div class="tabs">
      <ul>
        <li
          :class="{ active: active == 'ReportList' }"
          @click="active = 'ReportList'"
        >
          写汇报
        </li>
        <li
          :class="{ active: active == 'SeeReport' }"
          @click="active = 'SeeReport'"
        >
          看汇报
        </li>
      </ul>
      <div
        class="filter"
        v-show="active == 'SeeReport'"
        @click="isExpend = !isExpend"
      >
        筛选
        <i class="iconfont icon-shousuo" style="font-size:13px;"></i>
      </div>
    </div>
    <div class="report-content">
      <keep-alive>
        <component :is="active" :isExpend="isExpend"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import ReportList from './report-list'
import SeeReport from './see-report'
export default {
  name: 'Report',
  components: {
    ReportList,
    SeeReport
  },
  data() {
    return {
      active: 'ReportList',
      isExpend: true
    }
  },
  activated() {
    if (this.$route.query.reportdetail == 'true' && this.$route.query.listid) {
      this.active = 'SeeReport'
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.report-manage {
  height: 100%;
  padding: 10px;
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  .tabs {
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    position: relative;
    ul {
      margin: 0 auto;
      width: 200px;
      height: 50px;
      line-height: 50px;
      display: flex;
      font-size: 20px;
      font-weight: bold;
      align-items: center;
      justify-content: center;
      li {
        text-align: center;
        flex: 1;
        cursor: pointer;
        font-size: 15px;
        &.active {
          color: $themeColor;
          transition: all 0.3s ease-in;
          box-shadow: $themeColor 0px -2px 0px inset;
        }
      }
    }
    .filter {
      position: absolute;
      right: 10px;
      bottom: 10px;
      z-index: 9;
      cursor: pointer;
      color: #666;
      font-size: 15px;
    }
  }
  .report-content {
    padding: 10px;
    height: calc(100% - 70px);
    overflow-y: auto;
  }
}
</style>
