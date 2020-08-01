<template>
  <div class="subscribe-schedule">
    <el-dialog
      title="订阅日程组"
      :visible.sync="subscribeScheduleVisible"
      width="500px"
      :show-close="false"
      :before-close="beforeClose"
    >
      <div class="subscribe-schedule-content">
        <el-input
          placeholder="请输入内容"
          clearable
          v-model="list.params.keyword"
          size="small"
          @keyup.enter.native="search"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="search"
          ></i>
        </el-input>
        <div
          class="subscribe-schedule-list"
          v-show="list.subscribeData.length > 0"
        >
          <div class="list-flex">
            <div class="list-flex-left">日程组</div>
            <div class="list-flex-right">操作</div>
          </div>
          <ul class="scrollbar">
            <li
              v-for="(item, index) in list.subscribeData"
              :key="index"
              class="list-flex"
            >
              <div class="list-flex-left">{{ item.name }}</div>
              <div class="list-flex-right ">
                <span
                  v-if="item.had_join === 0"
                  class="theme-color pointer"
                  @click="handleSubscribe(item)"
                  >订阅</span
                >
                <span v-if="item.had_join === 1" class="color9">已参与</span>
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
        <p v-show="list.subscribeData.length == 0" class="no-data">
          {{ dataDesc }}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOpenList, userSubscribe } from '@/api/schedule'
export default {
  props: {
    subscribeScheduleVisible: Boolean
  },
  name: '',
  data() {
    return {
      dataDesc: '暂无可订阅日程组',
      list: {
        params: {
          keyword: '',
          page: 1,
          pageSize: 10
        },
        totalCount: null,
        subscribeData: []
      }
    }
  },
  watch: {
    subscribeScheduleVisible(val) {
      if (val) {
        this.getOpenList()
        // this.form.s_group_id = this.move_target_group.s_group_id
        // this.move_params.setting_id = this.move_target.setting_id
      }
    }
  },
  methods: {
    // 获取可订阅的日程组
    async getOpenList() {
      try {
        let { data, paginator } = await getOpenList(this.list.params)
        if (data.length == 0) this.dataDesc = '暂无相关日程组数据'
        this.list.subscribeData = data
        this.list.totalCount = paginator.totalCount
      } catch (error) {
        this._message(error)
      }
    },
    search() {
      this.list.params.page = 1
      this.getOpenList()
    },
    handleSizeChange(e) {
      this.list.params.pageSize = e
      this.getOpenList()
    },
    handleCurrentChange(e) {
      this.list.params.page = e
      this.getOpenList()
    },
    // 订阅
    async handleSubscribe(item) {
      try {
        await userSubscribe({ id: item.id })
        this.$message.success('您已订阅' + item.name)
        this.$emit('refreshGroupList')
        this.getOpenList()
      } catch (error) {
        this._message(error)
      }
    },
    beforeClose() {
      this.$emit('update:subscribeScheduleVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.subscribe-schedule {
  .subscribe-schedule-list {
    padding: 10px 0px;
    .list-flex {
      display: flex;
      padding: 10px;
      align-items: center;
      .list-flex-left {
        flex: 1;
      }

      .list-flex-right {
      }
    }
    li:hover {
      background-color: #ebf8fe;
    }
    ul {
      height: 355px;
    }
    .list-page {
      text-align: center;
      margin-bottom: -10px;
    }
  }
  .no-data {
    text-align: center;
    color: #aaa;
    font-size: 18px;
    margin: 30px;
  }
}
</style>
