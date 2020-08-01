<template>
  <div class="schedule-filtration">
    <el-dialog
      title="查询"
      :visible.sync="filtrationVisible"
      width="1000px"
      :before-close="beforeClose"
    >
      <div class="schedule-filtration-content">
        <div class="schedule-filtration-list">
          <!-- v-show="list.subscribeData.length > 0" -->
          <ul>
            <li class="list-flex">
              <div class="list-flex-left">
                <el-input
                  class="filtration"
                  placeholder="请输入内容"
                  v-model="list.params.keyword"
                  size="small"
                  @keyup.enter.native="search()"
                >
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="search()"
                  ></i>
                </el-input>
                <div
                  v-show="list.params.schedule_module === 'schedule'"
                  class="list-flex-left-box"
                >
                  <h5>我订阅的日程组</h5>
                  <ul>
                    <li v-for="(el, i) in groupData" :key="i">
                      <span
                        class="li-flex-left pointer"
                        @click="setChecked(el)"
                      >
                        <span
                          :class="
                            el.isChecked
                              ? 'el-icon-folder-checked'
                              : 'el-icon-folder'
                          "
                          :style="{ color: el.color }"
                        ></span>
                        {{ el.name }}
                      </span>
                    </li>
                  </ul>
                </div>
                <div class="list-flex-left-box">
                  <h5>日程责任人</h5>
                  <el-select
                    v-model="userIds"
                    multiple
                    filterable
                    placeholder="请选择"
                    size="mini"
                    @change="userChange"
                  >
                    <el-option
                      v-for="item in allUserData"
                      :key="item.user_id"
                      :label="item.username"
                      :value="item.user_id"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="list-flex-left-box">
                  <h5>日期</h5>
                  <el-date-picker
                    class="el-date-picker"
                    size="mini"
                    v-model="times"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right"
                    @change="timeChange"
                  >
                  </el-date-picker>
                </div>
                <div class="left-search">
                  <div class="search-btn pointer" @click="search()">查询</div>
                </div>
              </div>
              <div class="list-flex-right ">
                <div class="schedule-type">
                  <span
                    class="schedule-type-item pointer"
                    :class="{ 'active-color': currentIndex == index }"
                    v-for="(item, index) in moduleData"
                    :key="index"
                    @click="clickType(item, index)"
                    >{{ item.value }}</span
                  >
                </div>
                <div class="right-list scrollbar">
                  <div
                    class="list-flex-right-item"
                    v-for="(item, index) in list.subscribeData"
                    :key="index"
                  >
                    <span
                      class="list-flex-right-item-time"
                      :style="{ '--bgc': '#4b7902' }"
                      >{{ timeFormat(item.start_time, 'MM月DD日') }}</span
                    >
                    <div class="right-item-flex1">
                      <h5>{{ item.title }}</h5>
                      <div>
                        <span
                          title="责任人"
                          class="list-flex-right-icon el-icon-s-custom theme-color"
                        ></span>
                        <el-tag
                          size="mini"
                          v-for="(v, i) in item.user_id"
                          :key="i"
                          >{{ v.user_name }}</el-tag
                        >
                      </div>
                    </div>
                    <span class="color9"
                      >{{ timeFormat(item.start_time, 'hh:mm') }} -
                      {{ timeFormat(item.end_time, 'hh:mm') }}</span
                    >
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="list-page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="list.params.page"
              :page-sizes="[10, 20, 30, 50, 100]"
              :page-size="list.params.pageSize"
              layout="total, sizes,slot, prev, pager, next, jumper"
              :total="list.totalCount"
            ></el-pagination>
          </div>
        </div>
        <!-- <p v-show="list.subscribeData.length == 0" class="no-data">
          {{ dataDesc }}
        </p> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import {
  scheduleList,
  getScheduleModule,
  scheduleTaskList,
  scheduleGroupList
} from '@/api/schedule'

export default {
  props: {
    filtrationVisible: Boolean,
    allUserData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  name: '',
  data() {
    return {
      dataDesc: '暂无数据',
      currentIndex: 0,
      moduleData: [], // 模块化
      userIds: [], //责任人id
      times: '', //日期
      groupData: [],
      list: {
        params: {
          keyword: '',
          schedule_module: '', //模块名，可以从日程模块列表获取 任务，流程等特有字段
          schedule_group_id: '', //日程组id，用逗号分隔 日程才有的字段
          start_time: '',
          end_time: '',
          user_id: '',
          page: 1,
          pageSize: 10
        },
        totalCount: 0,
        subscribeData: []
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  watch: {
    filtrationVisible(val) {
      if (val) {
        this.search()
      }
    }
  },
  created() {
    this.getScheduleModule()
    this.getGoupList()
  },
  methods: {
    // 获取模块基础数据
    async getScheduleModule() {
      try {
        const { data } = await getScheduleModule()
        this.moduleData = data.schedule_module
        this.moduleData.push({ key: 'schedule', value: '日程' })
        this.list.params.schedule_module = this.moduleData[0].key
      } catch (error) {
        this._message(error)
      }
    },
    // 日程组列表数据
    async getGoupList(keyword) {
      try {
        let { data } = await scheduleGroupList({ keyword })
        data.forEach(el => {
          this.$set(el, 'isShow', false)
          el.data.forEach(v => {
            this.$set(v, 'isChecked', false)
          })
        })
        this.groupData = [...data[0].data, ...data[1].data]
      } catch (error) {
        this._message(error)
      }
    },

    // 获取任务，流程列表
    async scheduleTaskList() {
      try {
        // delete this.list.params.schedule_group_id
        let { data, paginator } = await scheduleTaskList(this.list.params)
        if (data.length == 0) this.dataDesc = '暂无数据'
        this.list.subscribeData = data
        this.list.totalCount = paginator.totalCount
      } catch (error) {
        this._message(error)
      }
    },
    // 获取日程列表
    async scheduleList() {
      try {
        let { data, paginator } = await scheduleList(this.list.params)
        if (data.length == 0) this.dataDesc = '暂无数据'
        this.list.subscribeData = data
        this.list.totalCount = paginator.totalCount
      } catch (error) {
        this._message(error)
      }
    },
    setChecked(el) {
      this.$set(el, 'isChecked', !el.isChecked)
      const schedule_group_id = this.groupData
        .filter(el => el.isChecked)
        .map(v => v.id)
      this.list.params.schedule_group_id = schedule_group_id.join(',')
      this.search()
    },
    // 选择责任人
    userChange(val) {
      this.list.params.user_id = val.join(',')
      this.search()
    },
    // 选择日期
    timeChange(val) {
      if (val) {
        this.list.params.start_time = val[0]
        this.list.params.end_time = val[1]
      } else {
        this.list.params.start_time = ''
        this.list.params.end_time = ''
      }
      this.search()
    },
    search(page) {
      this.list.params.page = page || 1
      console.log(page, this.list.params.page, 333)
      if (this.list.params.schedule_module === 'schedule') {
        // 点击日程
        this.scheduleList()
      } else {
        //除日程之外的模块
        this.scheduleTaskList()
      }
    },
    handleSizeChange(e) {
      this.list.params.pageSize = e
      this.search(this.list.params.page)
    },
    handleCurrentChange(e) {
      // this.list.params.page = e
      this.search(e)
    },
    // 点击模块触发
    clickType(item, index) {
      this.currentIndex = index
      this.list.params.schedule_module = item.key
      this.search()
    },
    // 时间格式转换
    timeFormat(time, format) {
      return moment(time).format(format)
    },
    beforeClose() {
      this.$emit('update:filtrationVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.schedule-filtration {
  position: relative;
  .filtration {
    margin-bottom: 10px;
  }
  .schedule-type {
    border-bottom: 1px solid #eee;
    padding: 0 10px;
    .schedule-type-item {
      display: inline-block;
      padding: 15px 20px;
      font-weight: bold;
      &.active-color {
        color: #536fcc;
        background-color: #dce2f5;
      }
    }
  }
  .schedule-filtration-list {
    .list-flex {
      display: flex;
      border-bottom: 1px solid #eee;
      margin-bottom: 5px;
      .list-flex-right {
        flex: 1;
        border-left: 1px solid #eee;
        .right-list {
          height: 50vh;
          padding: 10px;
        }
        .list-flex-right-item {
          display: flex;
          align-items: center;
          padding: 10px;
          line-height: 18px;
          border: 1px solid #eee;
          border-radius: 5px;
          margin-bottom: 5px;
          .list-flex-right-item-time {
            width: 90px;
            position: relative;
            font-weight: bold;
            &::after {
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
              clear: both;
              content: '';
              display: block;
              width: 5px;
              height: 30px;
              border-radius: 2px;
              background-color: var(--bgc);
            }
          }
          .right-item-flex1 {
            flex: 1;
            padding-right: 5px;
          }
          .list-flex-right-icon {
            padding-right: 5px;
          }
          .el-tag {
            margin-right: 5px;
          }
        }
      }
      .list-flex-left {
        width: 330px;
        padding: 10px;
        .list-flex-left-box {
          margin-bottom: 15px;
          h5 {
            margin-bottom: 5px;
          }
          .el-date-picker {
            width: 310px;
          }
          li {
            line-height: 20px;
          }
        }
        .left-search {
          margin-top: 30px;
          .search-btn {
            width: 200px;
            text-align: center;
            padding: 10px;
            color: #fff;
            border-radius: 8px;
            margin: 0 auto;
            background-color: #536fcc;
          }
        }
      }
    }
  }
  .no-data {
    text-align: center;
    color: #aaa;
    font-size: 18px;
    margin: 30px;
  }
  .list-page {
    text-align: right;
  }
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #eee;
}
</style>
