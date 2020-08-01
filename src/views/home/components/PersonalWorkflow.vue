<template>
  <div class="work-flow">
    <div class="btn-box">
      <el-button
        :type="item.status == params.type ? 'primary' : ''"
        size="mini"
        v-for="item in statusList"
        :key="item.status"
        @click="handleStatus(item)"
        >{{ item.title }}</el-button
      >
    </div>
    <div class="flow-list">
      <scroll :hasMore="noMore" :isLoadings="isloading" @loadingData="loadMore">
        <div slot="dataList">
          <el-row
            v-for="(item, i) in list"
            :key="item.list_id"
            class="list-item"
          >
            <el-col :span="2"> {{ i + 1 }}. </el-col>
            <el-col :span="11" class="list-name">
              <div @click="toProcessDetail(item)">
                {{ item.list_name }}
              </div>
            </el-col>
            <el-col :span="6">
              <el-tag type="success" size="mini">{{
                item.create_user_name
              }}</el-tag>
            </el-col>
            <el-col :span="5" class="list-time">
              {{ item.created_at.split(' ')[0] }}
            </el-col>
          </el-row>
        </div>
      </scroll>
    </div>
    <!-- 流程详情 -->
    <process-detail
      :departmentData="departmentData"
      :processDialog.sync="processDialog"
      :list_id="listId"
    ></process-detail>
  </div>
</template>
<script>
import Scroll from '_c/common/Scroll'
import { processGetList } from '@/api/flowManage'
import ProcessDetail from '_v/dynamic/ProcessDetail'
import { departmentGetArr } from '@/api/common'
export default {
  data() {
    return {
      statusList: [
        { status: 'deal', title: '待处理' },
        { status: 'deal_done', title: '处理完成' },
        { status: 'my_create', title: '我发起的' },
        { status: 'cc_me', title: '抄送我的' },
        { status: 'timeout', title: '超时' },
        { status: 'call_done', title: '催办' }
      ],
      params: {
        type: 'deal',
        page: 1,
        pageSize: 20
      },
      noMore: true,
      isloading: false,
      list: [],
      departmentData: [], //部门列表
      processDialog: false,
      listId: ''
    }
  },
  mounted() {
    this.getDepartment()
    this.processGetListFn()
  },
  methods: {
    toProcessDetail(item) {
      this.listId = item.list_id
      this.processDialog = true
    },
    async getDepartment() {
      try {
        let { data } = await departmentGetArr()
        this.departmentData = data
      } catch (error) {
        this._message(error)
      }
    },
    async processGetListFn() {
      if (this.isloading) return
      this.isloading = true
      try {
        let { data } = await processGetList(this.params)
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
      this.processGetListFn()
    },
    handleStatus(item) {
      this.params.type = item.status
      this.list = []
      this.params.page = 1
      this.processGetListFn()
    }
  },
  components: {
    Scroll,
    ProcessDetail
  }
}
</script>
<style lang="scss" scoped>
.work-flow {
  height: 420px;
  .btn-box {
    ::v-deep .el-button {
      padding: 7px 9px;
    }
  }
  .flow-list {
    margin-top: 10px;
    height: 375px;
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
}
</style>
