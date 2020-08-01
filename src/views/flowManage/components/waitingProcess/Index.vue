<template>
  <div class="initiate-process">
    <div class="search">
      <div class="high-search" :class="{ expand: isOpen }">
        <el-row :gutter="20">
          <el-col :span="10" class="col">
            <span class="gray">提交流程时间</span>
            <el-date-picker
              class="col-flex"
              v-model="time1"
              size="mini"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              @change="
                () => {
                  list.params.create_start = time1 ? time1[0] : ''
                  list.params.create_end = time1 ? time1[1] : ''
                }
              "
            ></el-date-picker>
          </el-col>
          <el-col :span="10" class="col">
            <span class="gray">完成处理时间</span>
            <el-date-picker
              class="col-flex"
              v-model="time2"
              size="mini"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              @change="
                () => {
                  list.params.finish_start = time2 ? time2[0] : ''
                  list.params.finish_end = time2 ? time2[1] : ''
                }
              "
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10" class="col">
            <span class="gray">流程单发起人</span>
            <el-select
              class="col-flex"
              v-model="list.params.create_user_id"
              filterable
              clearable
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in allUser"
                :key="item.user_id"
                :label="item.username"
                :value="item.user_id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="10" class="col">
            <span class="gray">流程类型</span>
            <el-select
              class="col-flex"
              v-model="list.params.process_id"
              clearable
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in processOptions"
                :key="item.process_id"
                :label="item.name"
                :value="item.process_id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <div>
          <el-button type="primary" size="mini" @click="search">搜索</el-button>
          <el-button size="mini" @click="clearParams">清空</el-button>
        </div>
      </div>
    </div>
    <div class="flow-content">
      <el-radio-group
        v-if="['2', '3'].find(el => el == status)"
        v-model="stepStatus"
        size="small"
        @change="statusSearch"
      >
        <el-radio-button
          v-for="(item, index) in statusData"
          :key="index"
          :label="item.id"
          >{{ item.label }}</el-radio-button
        >
      </el-radio-group>
      <div
        class="card-box"
        :class="{ 'card-box-type': type == 'deal_done' || type == 'my_create' }"
      >
        <div
          v-loading="loading"
          class="container left scrollbar"
          ref="container"
        >
          <ul ref="inner">
            <li
              class="pointer"
              :class="{ 'li-active': list_id == item.list_id }"
              v-for="(item, index) in list.processData"
              :key="index"
              @click="getDetail(item)"
            >
              <h5>
                <span class="proccess_title"
                  >{{ item.create_user_name }}提交的“{{
                    item.list_name
                  }}”流程</span
                >
                <!-- 0初始 1 进行中 2完成 3拒绝 4撤销 -->
                <span
                  class="process_status fr"
                  :class="
                    getMappingVal(listStatus, 'id', item.list_status, 'bgc')
                  "
                  >{{
                    getMappingVal(listStatus, 'id', item.list_status, 'label')
                  }}</span
                >
              </h5>

              <p
                class="color9"
                v-for="(el, i) in item.fromat.detail.form_setting"
                :key="i"
              >
                <span v-show="el.type != 'richText'">{{ el.name }}：</span>
                <span
                  class="richText"
                  v-if="el.type == 'richText'"
                  v-html="item.fromat.form[el.key]"
                ></span>
                <span
                  v-show="
                    !['img', 'accessory', 'richText'].find(
                      ele => ele == el.type
                    )
                  "
                  >{{
                    item.fromat.form[el.key] | myFilter(el.type, departmentData)
                  }}</span
                >
                <span v-if="['img', 'accessory'].find(ele => ele == el.type)">
                  <a
                    v-for="(v, ii) in item.fromat.form[el.key]"
                    :key="ii"
                    :href="v.url"
                    target="_blank"
                    >{{ v.name }}</a
                  >
                </span>
              </p>
            </li>
          </ul>
          <div
            v-if="!loading && list.processData.length == 0"
            class="color9"
            style="margin:10px;text-align:center;"
          >
            暂无数据
          </div>
        </div>
        <div class="right scrollbar">
          <process-detail
            v-show="list_id"
            :departmentData="departmentData"
            :list_id="list_id"
            ref="processDetail"
            @refreshList="clearParams"
          ></process-detail>
          <greetings-box v-show="!list_id" class="greetings"></greetings-box>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { processGetList, groupList } from '@/api/flowManage'
import { getUserList, departmentGetArr } from '@/api/common'
import ProcessDetail from '../ProcessDetail'
import GreetingsBox from '_c/common/Greetings'

export default {
  name: '',
  props: {
    status: [Number, String],
    type: String,
    isOpen: Boolean,
    keyword: String
  },
  components: {
    ProcessDetail,
    GreetingsBox
  },
  data() {
    return {
      // isOpen: false,
      loading: false,

      time1: '', //提交时间
      time2: '', //完成时间
      // 1 处理中 2处理完成 3处理拒绝 4处理撤销
      statusData: [
        { id: '', label: '全部' },
        { id: 1, label: '处理中' },
        { id: 2, label: '处理完成' },
        { id: 3, label: '处理被拒绝' },
        { id: 4, label: '已撤销' }
      ],
      stepStatus: '',
      listStatus: [
        { id: 0, label: '初始', bgc: 'bgc-gray' },
        { id: 1, label: '处理中', bgc: 'bgc-orange' },
        { id: 2, label: '已完成', bgc: 'bgc-green' },
        { id: 3, label: '已拒绝', bgc: 'bgc-red' },
        { id: 4, label: '已撤销', bgc: 'bgc-gray' }
      ],
      allUser: [], //所有成员
      departmentData: [], //部门
      processOptions: [], // 流程模板
      list: {
        params: {
          page: 1,
          pageSize: 20,
          type: '', //deal 待处理 deal_done 处理完成 my_create我发起的 cc_me 抄送我的
          keyword: '', //关键词
          create_start: '', //创建开始时间
          create_end: '', //创建结束时间
          create_user_id: '', //发起人id
          finish_start: '', //完成开始时间
          finish_end: '', //完成结束时间
          process_id: '' //模板id
          // list_status: '' //1 处理中 2处理完成 3处理拒绝 4处理撤销
        },
        processData: [],
        total: 0
      },
      list_id: '',
      containerHeight: 0,
      innerHeight: 0,
      height: '300px'
    }
  },
  watch: {
    keyword(val) {
      this.list.params.keyword = val
    },
    type(val) {
      this.list.params.type = val
      this.stepStatus = ''
      this.list.params.list_status = ''
    }
  },
  created() {
    // this.getList();
    this.getUserList()
    this.getDepartment()
    this.getGroupList()
  },
  mounted() {
    // 监听左侧列表页面滚动，触底加载列表
    this.$refs.container.addEventListener('scroll', this.initScroll)
  },
  methods: {
    async getGroupList() {
      this.processOptions = []
      try {
        let { data } = await groupList()
        data.forEach(el => {
          this.processOptions = [...this.processOptions, ...el.process]
        })
      } catch (error) {
        this._message(error)
      }
    },
    // 获取所有人
    async getUserList() {
      try {
        let { data } = await getUserList()
        this.allUser = data
      } catch (error) {
        this._message(error)
      }
    },
    async getDepartment() {
      try {
        let { data } = await departmentGetArr()
        this.departmentData = data
      } catch (error) {
        this._message(error)
      }
    },
    search() {
      this.list.params.page = 1
      this.getList()
    },
    statusSearch(val) {
      this.list.params.list_status = val
      this.search()
    },
    clearParams() {
      this.time1 = ''
      this.time2 = ''
      this.$emit('clearKeywork', true)
      this.list.params = Object.assign(
        this.list.params,
        this.$options.data().list.params
      )
      this.list.params.type = this.type
      this.search()
    },
    // 获取初始列表数据
    async getList() {
      this.loading = true
      this.list_id = ''
      this.list.processData = []
      this.list.params.page = 1
      try {
        let { data, paginator } = await processGetList(this.list.params)
        this.list.processData = data
        this.list.total = paginator.totalCount

        this.list.processData.forEach(el => {
          if (el.fromat.detail.form_setting.length > 3) {
            el.fromat.detail.form_setting = el.fromat.detail.form_setting.splice(
              0,
              3
            )
          } else {
            for (var key in el.fromat.form) {
              // 如果是富文本类型，截取字符串第三个<br/>前的内容展示
              if (key == 'richText123') {
                el.fromat.form[key] = el.fromat.form[key]
                  .split('<br/>')
                  .splice(0, 3)
                  .join('<br/>')
              }
            }
          }
        })

        this.loading = false
      } catch (error) {
        this.loading = false
        this._message(error)
      }
    },

    //页面初始化之后会触发一次，在页面往下加载的过程中会多次调用【滚动触底加载】
    async onLoad() {
      let self = this
      self.loading = true
      self.list.params.page = self.list.params.page + 1
      try {
        let { data, paginator } = await processGetList(self.list.params)
        data.forEach(el => {
          if (el.fromat.detail.form_setting.length > 3) {
            el.fromat.detail.form_setting = el.fromat.detail.form_setting.splice(
              0,
              3
            )
          } else {
            for (var key in el.fromat.form) {
              // 如果是富文本类型，截取字符串第三个<br/>前的内容展示
              if (key == 'richText123') {
                el.fromat.form[key] = el.fromat.form[key]
                  .split('<br/>')
                  .splice(0, 3)
                  .join('<br/>')
              }
            }
          }
        })
        self.list.processData = self.list.processData.concat(data)
        self.list.total = paginator.totalCount
        self.loading = false
      } catch (error) {
        self.loading = false
        self._message(error)
      }
    },
    // 滚动触底加载列表数据
    initScroll(e) {
      this.containerHeight = this.$refs.container.clientHeight
      this.innerHeight = this.$refs.inner.offsetHeight
      let totalPage = Math.ceil(this.list.total / this.list.params.pageSize) //总页码
      if (this.loading || totalPage <= this.list.params.page) return
      let scrollTop = e.target.scrollTop
      if (scrollTop + this.containerHeight >= this.innerHeight) {
        this.onLoad()
      }
    },
    // 获取详情
    getDetail(item) {
      this.list_id = item.list_id
      this.$refs.processDetail.getDetail(item.list_id)
    }
  }
}
</script>

<style scoped lang="scss">
.initiate-process {
  height: calc(100vh - 175px);
  display: flex;
  flex-direction: column;
  .search {
    .high-search {
      font-size: 14px;
      height: 0px;
      margin-top: 10px;
      overflow: hidden;
      transition: all 0.5s ease;
      .el-row {
        margin-bottom: 10px;
      }
      .col {
        max-width: 500px;
        display: flex;
        align-items: center;
        span {
          padding: 0 10px;
        }
        .col-flex {
          flex: 1;
        }
      }
    }
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
    .expand {
      height: 120px;
    }
  }
  .process-status {
    font-size: 14px;
    display: flex;
    padding: 10px 0px;
    background-color: #f3f3f3;
    li {
      padding: 0px 10px;
    }
    li + li {
      border-left: 1px solid #ccc;
    }
  }
  .flow-content {
    flex: 1;
    overflow: hidden;
    .card-box {
      display: flex;
      border: 1px solid #eee;
      margin-top: 10px;
      height: 100%;
      padding-bottom: 10px;
      .left {
        width: 300px;
        line-height: 26px;
        border-right: 1px solid #eee;
        li {
          height: 136px;
          padding: 10px;
          overflow: hidden;
          border-bottom: 3px solid #e4e7ed;
          box-sizing: border-box;
        }
        li:hover {
          background-color: #f2f2f2;
        }
        .li-active {
          background-color: #f2f2f2;
        }
        p {
          font-size: 14px;
          padding-left: 10px;
          color: #666;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .proccess_title {
          display: inline-block;
          width: calc(100% - 55px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .right {
        flex: 1;
        position: relative;
        .greetings {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .card-box-type {
      padding-bottom: 45px;
    }
  }
  .richText {
    line-height: 18px;
  }
  .process_status {
    padding: 0px 8px;
    border-radius: 15px;
    color: #fff;
    font-weight: 400;
    font-size: 12px;
  }
  .bgc-green {
    background-color: #40bc82;
  }
  .bgc-red {
    background-color: #ed6e67;
  }
  .bgc-gray {
    background-color: #aaaaaa;
  }
  .container {
    height: 100%;
  }
}
</style>
