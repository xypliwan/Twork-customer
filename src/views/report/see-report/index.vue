<template>
  <div class="see-wrapper">
    <div class="search-box" :class="isExpend ? 'active' : ''">
      <search-form
        :allUserList="allUserList"
        :templateList="templateList"
        @search="search"
        ref="searchRef"
      ></search-form>
      <div class="pb"></div>
    </div>

    <div class="see-report">
      <div class="left" :style="{ height: isExpend ? '705px' : '645px' }">
        <div class="time-box">
          <i
            style="cursor: pointer;"
            class="el-icon-arrow-left"
            @click="nextDate('pre')"
          ></i>
          <span class="data-txt">{{ getMouthAndDay }}</span>
          <i
            style="cursor: pointer;"
            class="el-icon-arrow-right"
            @click="nextDate('next')"
          ></i>
        </div>
        <div v-if="params.page == 1 && !reportList.length" class="init-no-data">
          还没有汇报给你的记录
        </div>
        <scroll
          v-else
          :hasMore="noMore"
          :isLoadings="isloading"
          @loadingData="loadMore"
        >
          <div slot="dataList">
            <div v-for="(item, i) in reportList" :key="i" class="report-box">
              <!-- <div class="time-box">
                <el-tag effect="dark" size="small">{{ item.time }}</el-tag>
              </div> -->
              <div class="list-box">
                <div
                  v-for="(ev, j) in item.arr"
                  :key="j"
                  class="list-info"
                  @click="reportId = ev.list_id"
                  :class="ev.list_id == reportId ? 'active-info' : ''"
                >
                  <div class="left-list">
                    {{ ev.create_user_name | nameFilter }}
                  </div>
                  <div class="right-list">
                    <div class="report-title">{{ ev.report_name }}</div>
                    <div class="report-time">{{ ev.created_at }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <div class="right" :style="{ height: isExpend ? '705px' : '645px' }">
        <detail v-show="reportId !== ''" :reportId="reportId"></detail>
        <div class="greet-box" v-show="reportId == ''">
          <greetings></greetings>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getReportList, reportList } from '@/api/report'
import { getUserList } from '@/api/common'
import Scroll from '_c/common/Scroll'
import SearchForm from './components/SearchForm'
import Detail from './components/Detail'
import Greetings from '_c/common/Greetings'
import { getNextDate } from '_u/utils'
export default {
  props: {
    isExpend: Boolean
  },
  data() {
    return {
      params: {
        page: 1,
        pageSize: 15,
        time: ''
      },
      noMore: false,
      isloading: false,
      reportList: [],
      allUserList: [],
      templateList: [],
      reportId: ''
    }
  },
  activated() {
    if (this.$route.query.reportdetail == 'true' && this.$route.query.listid) {
      this.reportId = this.$route.query.listid
    }
  },
  created() {
    this.getUserListFn()
    this.reportTemListFn()
    // this.getReportListFn()
  },
  computed: {
    getMouthAndDay() {
      let timeArr = this.params.time.split('-')
      let str = timeArr.splice(1, timeArr.length)
      return str.join('-')
    }
  },
  methods: {
    nextDate(txt) {
      if (txt == 'pre') {
        // console.log(this.$refs.searchRef)
        this.$refs.searchRef.ruleForm.time = getNextDate(this.params.time, -1)
      } else if (txt == 'next') {
        this.$refs.searchRef.ruleForm.time = getNextDate(this.params.time, 1)
      }
      this.$refs.searchRef.search()
    },
    search(params) {
      Object.assign(this.params, params)
      console.log(this.params, ' 333')
      this.params.page = 1
      this.reportList = []
      this.getReportListFn()
    },
    loadMore() {
      if (this.isloading) return
      this.params.page++
      this.getReportListFn()
    },
    async getReportListFn() {
      if (this.isloading) return
      this.isloading = true
      try {
        let { data } = await getReportList(this.params)
        this.noMore = data.length < this.params.pageSize
        this.reportList = [...this.reportList, ...data]
      } catch (error) {
        this._message(error)
      }
      this.isloading = false
    },
    async reportTemListFn() {
      try {
        let {
          data: { list }
        } = await reportList()
        this.templateList = list
      } catch (error) {
        this._message(error)
      }
    },
    async getUserListFn() {
      try {
        let { data } = await getUserList()
        this.allUserList = data
      } catch (error) {
        this._message(error)
      }
    }
  },
  components: {
    Scroll,
    SearchForm,
    Detail,
    Greetings
  }
}
</script>
<style lang="scss" scoped>
.see-wrapper {
  .search-box {
    overflow: hidden;
    transition: all 0.2s ease;
    height: 60px;
    .pb {
      height: 10px;
      background: #f1f1f1;
    }
    &.active {
      height: 0;
    }
  }
  .see-report {
    display: flex;
    height: 100%;
    padding-top: 10px;
    .left {
      width: 400px;
      border-right: 1px solid #f1f1f1;
      margin-right: 10px;
      padding-right: 10px;
      background: #fff;
      transition: all 0.2s ease;
      .time-box {
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-bottom: 2px solid #eae5e5;
        border-top: 2px solid #eae5e5;
        font-size: 16px;
        margin-bottom: 10px;
        .data-txt {
          margin: 0 10px;
        }
      }
      .init-no-data {
        font-size: 13px;
        text-align: center;
        color: #666;
      }
      .report-box {
        padding-bottom: 10px;
        margin-bottom: 10px;
        .time-box {
          text-align: center;
        }
        .list-box {
          margin-top: 10px;
          .list-info {
            display: flex;
            padding: 10px 5px;
            border-bottom: 1px solid #f1f1f1;
            cursor: pointer;
            &.active-info {
              background: #f1f1f1;
            }
            .left-list {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              color: #fff;
              background: #526ecc;
              font-size: 13px;
            }
            .right-list {
              flex: 1;
              margin-left: 10px;
              .report-title {
                font-size: 15px;
                counter-reset: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .report-time {
                font-size: 13px;
                color: #666;
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
    .right {
      flex: 1;
      background: #fff;
      overflow-y: auto;
      transition: all 0.2s ease;
      .greet-box {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
