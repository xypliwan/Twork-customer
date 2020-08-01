<template>
  <div class="okr">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="任务" name="first">
        <ul class="scrollbar" v-loadmore="onLoadTarget">
          <li
            class="li-flex pointer"
            v-for="(item, index) in task.listData"
            :key="index"
            @click="openDetail(item)"
          >
            <span class="li-left">
              <span>{{ index + 1 }}.&nbsp;</span>
              <span class="list-title">{{ item.title }}</span>
            </span>
            <span class="li-right">
              <span class="user-span">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.people.map(el => el.username).join('，')"
                  placement="top"
                >
                  <el-tag
                    v-if="item.people.length > 1"
                    type="success"
                    size="mini"
                    style="margin-left:0"
                    >{{ item.people[0].username }}+{{
                      item.people.length - 1
                    }}</el-tag
                  >
                  <el-tag
                    v-if="item.people.length == 1"
                    type="success"
                    size="mini"
                    style="margin-left:0"
                    >{{ item.people[0].username }}</el-tag
                  >
                </el-tooltip>
              </span>
              <!-- <span>进度 {{item.process}}%</span> -->
              <span class="progress">
                <el-progress :percentage="Number(item.process)"></el-progress>
              </span>
              <span class="status-span">{{ item.task_status_name }}</span>
            </span>
          </li>
        </ul>
      </el-tab-pane>

      <el-tab-pane label="关键结果（kr）" name="second">
        <ul class="scrollbar" v-loadmore="onLoadKr" v-loading="loading">
          <li
            class="li-flex pointer"
            v-for="(item, index) in kr.listData"
            :key="index"
            @click="topOkr(item)"
          >
            <span class="li-left">
              <!-- <span>KR{{index+1}}. &nbsp;</span> -->
              <el-tag size="mini" style="margin-right:10px;"
                >KR{{ item.sort }}</el-tag
              >
              <span class="list-title">{{ item.kr_name }}</span>
            </span>
            <span class="li-right">
              <span style="user-span">
                <el-tag type="success" size="mini" style="margin-left:0">{{
                  item.username
                }}</el-tag>
              </span>
              <!-- <span>进度 {{item.process}}%</span> -->
              <span class="progress">
                <el-progress :percentage="Number(item.process)"></el-progress>
              </span>
              <span>
                <i class="iconfont icon-favorite orange"></i>
                {{ item.score }}
              </span>
              <span>
                <label class="mark">{{ item.mark }}</label> 分
              </span>
            </span>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="目标" name="third">
        <ul class="scrollbar" v-loadmore="onLoadTask" v-loading="loading">
          <li
            class="target-flex pointer"
            v-for="(item, index) in target.listData"
            :key="index"
            @click="topOkr(item)"
          >
            <span class="li-left">
              <span>{{ index + 1 }}. &nbsp;</span>
              <span class="list-title">{{ item.target_name }}</span>
            </span>
            <span class="li-right">
              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  item.responsible_people.map(el => el.username).join('，')
                "
                placement="top"
              >
                <el-tag
                  v-if="item.responsible_people.length > 0"
                  type="success"
                  size="mini"
                  style="margin-left:0"
                  >{{ item.responsible_people[0].username }}+{{
                    item.responsible_people.length - 1
                  }}</el-tag
                >
              </el-tooltip>
              <span class="process">
                <el-progress :percentage="Number(item.process)"></el-progress>
              </span>
            </span>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
    <task-detail
      :taskId="taskId"
      :dialog.sync="detailDialog"
      :userList="userList"
      @updateOk="updateOk"
    ></task-detail>
  </div>
</template>

<script>
import TaskDetail from '../targetKanban/task/TaskDetail'
import { getUserList } from '@/api/common'
import {
  targetListSimple,
  targetKrListAll,
  allTargetTaskList
} from '@/api/targetOkr'
export default {
  name: '',
  components: { TaskDetail },
  data() {
    return {
      loading: false,
      detailDialog: false,
      userList: [],
      taskId: '',
      activeName: 'first',
      target: {
        params: {
          page: 1,
          pageSize: 20,
          no_done: 1
        },
        listData: [],
        total: null
      },
      kr: {
        params: {
          page: 1,
          pageSize: 20,
          no_done: 1
        },
        listData: [],
        total: null
      },
      task: {
        params: {
          page: 1,
          pageSize: 20,
          task_status_init_and_doing: 1
        },
        listData: [],
        total: null
      }
    }
  },
  created() {
    //   this.getTargetListSimple()
    this.getUserList()
    this.getAllTargetTaskList()
  },
  methods: {
    moreInfo() {},
    //获取责任人列表
    async getUserList() {
      try {
        let { data } = await getUserList()
        this.userList = data
      } catch (error) {
        this._message(error)
      }
    },
    async getTargetListSimple() {
      this.loading = true
      this.target.listData = []
      this.target.params.page = 1
      try {
        let { data, paginator } = await targetListSimple(this.target.params)
        this.target.listData = data
        this.target.total = paginator.totalCount
        this.loading = false
      } catch (error) {
        this.loading = false
        this._message(error)
      }
    },
    //页面初始化之后会触发一次，在页面往下加载的过程中会多次调用【滚动触底加载】
    async onLoadTarget() {
      let self = this
      let totalPage = Math.ceil(self.target.total / self.target.params.pageSize) //总页码
      if (self.loading || totalPage <= self.target.params.page) return
      self.loading = true
      self.target.params.page = self.target.params.page + 1
      try {
        let { data, paginator } = await targetListSimple(self.target.params)
        self.target.listData = self.target.listData.concat(data)
        self.target.total = paginator.totalCount
        self.loading = false
      } catch (error) {
        self.loading = false
        self._message(error)
      }
    },
    async getTargetKrListAll() {
      this.loading = true
      this.kr.listData = []
      this.kr.params.page = 1
      try {
        let { data, paginator } = await targetKrListAll(this.kr.params)
        this.kr.listData = data
        this.kr.total = paginator.totalCount
        this.loading = false
      } catch (error) {
        this.loading = false
        this._message(error)
      }
    },
    async onLoadKr() {
      let self = this
      let totalPage = Math.ceil(self.kr.total / self.kr.params.pageSize) //总页码
      if (self.loading || totalPage <= self.kr.params.page) return
      self.loading = true
      self.kr.params.page = self.kr.params.page + 1
      try {
        let { data, paginator } = await targetKrListAll(self.kr.params)
        self.kr.listData = self.kr.listData.concat(data)
        self.kr.total = paginator.totalCount
        self.loading = false
      } catch (error) {
        self.loading = false
        self._message(error)
      }
    },

    async getAllTargetTaskList() {
      this.loading = true
      this.task.listData = []
      this.task.params.page = 1
      try {
        let { data, paginator } = await allTargetTaskList(this.task.params)
        this.task.listData = data
        this.task.total = paginator.totalCount
        this.loading = false
      } catch (error) {
        this.loading = false
        this._message(error)
      }
    },
    //页面初始化之后会触发一次，在页面往下加载的过程中会多次调用【滚动触底加载】
    async onLoadTask() {
      let self = this
      let totalPage = Math.ceil(self.task.total / self.task.params.pageSize) //总页码
      if (self.loading || totalPage <= self.task.params.page) return
      self.loading = true
      self.task.params.page = self.task.params.page + 1
      try {
        let { data, paginator } = await allTargetTaskList(self.task.params)
        self.task.listData = self.task.listData.concat(data)
        self.task.total = paginator.totalCount
        self.loading = false
      } catch (error) {
        self.loading = false
        self._message(error)
      }
    },

    handleClick(tab) {
      switch (tab.paneName) {
        case 'first':
          this.getAllTargetTaskList()

          break
        case 'second':
          this.getTargetKrListAll()

          break
        case 'third':
          this.getTargetListSimple()

          break

        default:
          break
      }
    },
    openDetail(item) {
      this.taskId = item.task_id
      this.detailDialog = true
    },
    topOkr(item) {
      this.$router.push({
        path: '/target/target-kanban',
        query: {
          targetid: item.target_id
        }
      })
      // window.open('http://tw-test.ecgtool.com/#/target/target-kanban?targetid=38')
    },
    updateOk() {
      this.$emit('updateOk')
    }
  }
}
</script>

<style scoped lang="scss">
.okr {
  // min-height: 400px;
  ul {
    height: 420px;
    line-height: 30px;
  }
  .li-flex {
    display: flex;
    padding: 5px 0px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 13px;
    color: #333;
    &:hover {
      background: #f1f1f1;
    }
    .li-left {
      flex: 1;
      font-size: 13px;
      .list-title {
        font-size: 14px !important;
        color: $themeColor;
      }
    }
    .li-right {
      width: 350px;
      display: flex;
      align-items: center;
      span {
        flex: 1;
      }
      .status-span {
        width: 60px;
        flex: none;
      }
      .user-span {
        flex: none;
        width: 85px;
      }
    }
  }
  .target-flex {
    display: flex;
    padding: 5px 0px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 13px;
    color: #333;
    align-items: center;
    &:hover {
      background: #f1f1f1;
    }
    .li-left {
      flex: 1;
      font-size: 13px;
      .list-title {
        font-size: 14px !important;
        color: $themeColor;
      }
    }
    .li-right {
      display: flex;
      align-items: center;
      .process {
        margin-left: 20px;
        width: 150px;
      }
    }
  }
}
</style>
