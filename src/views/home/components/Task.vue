<template>
  <div class="task-list">
    <scroll :hasMore="noMore" :isLoadings="isloading" @loadingData="loadMore">
      <div slot="dataList">
        <el-row v-for="(item, i) in list" :key="i" class="list-item">
          <el-col :span="2"> {{ i + 1 }}. </el-col>
          <el-col :span="10" class="list-name">
            <div @click="openDetail(item)">
              {{ item.title }}
            </div>
          </el-col>
          <el-col :span="4">
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
          </el-col>
          <el-col :span="5">
            <el-progress :percentage="Number(item.process)"></el-progress>
          </el-col>
          <el-col :span="3" class="list-time">
            {{ item.task_status_name }}
          </el-col>
        </el-row>
      </div>
    </scroll>
    <task-detail
      :taskId="taskId"
      :dialog.sync="detailDialog"
      :userList="userList"
    ></task-detail>
  </div>
</template>
<script>
import Scroll from '_c/common/Scroll'
import { allTargetTaskList } from '@/api/targetOkr'
import TaskDetail from '../../targetKanban/task/TaskDetail'
export default {
  props: {
    activeName: String,
    userList: Array
  },
  data() {
    return {
      params: {
        page: 1,
        pageSize: 20,
        task_status_init_and_doing: 1
      },
      noMore: true,
      isloading: false,
      list: [],
      detailDialog: false,
      taskId: ''
    }
  },
  watch: {
    activeName: {
      handler() {
        if (this.activeName == 'task') {
          this.params.page = 1
          this.list = []
          this.getAllTargetTaskList()
        }
      },
      immediate: true
    }
  },
  methods: {
    openDetail(item) {
      this.taskId = item.task_id
      this.detailDialog = true
    },
    async getAllTargetTaskList() {
      if (this.isloading) return
      this.isloading = true
      try {
        let { data } = await allTargetTaskList(this.params)
        this.noMore = data.length < this.params.pageSize
        this.list = [...this.list, ...data]
      } catch (error) {
        this._message(error)
      }
      this.isloading = false
    },
    loadMore() {
      if (this.isloading) return
      this.params.page++
      this.getAllTargetTaskList()
    }
  },
  components: {
    Scroll,
    TaskDetail
  }
}
</script>
<style lang="scss" scoped>
.task-list {
  height: 420px;
  .list-item {
    padding: 10px 0px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 13px;
    color: #333;
    .list-name {
      color: #526ecc;
      font-size: 14px;
      cursor: pointer;
    }
    .list-time {
      color: #666;
    }
  }
}
</style>
