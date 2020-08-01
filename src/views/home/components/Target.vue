<template>
  <div class="task-list">
    <scroll :hasMore="noMore" :isLoadings="isloading" @loadingData="loadMore">
      <div slot="dataList">
        <el-row v-for="(item, i) in list" :key="i" class="list-item">
          <el-col :span="2"> {{ i + 1 }}. </el-col>
          <el-col :span="13" class="list-name">
            <div>
              {{ item.target_name }}
            </div>
          </el-col>
          <el-col :span="4">
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
          </el-col>
          <el-col :span="5">
            <el-progress :percentage="Number(item.process)"></el-progress>
          </el-col>
        </el-row>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from '_c/common/Scroll'
import { targetListSimple } from '@/api/targetOkr'
export default {
  props: {
    activeName: String
  },
  data() {
    return {
      params: {
        page: 1,
        pageSize: 20,
        no_done: 1
      },
      noMore: true,
      isloading: false,
      list: []
    }
  },
  watch: {
    activeName: {
      handler() {
        if (this.activeName == 'target') {
          this.params.page = 1
          this.list = []
          this.gteTargetListSimple()
        }
      },
      immediate: true
    }
  },
  methods: {
    // async getTargetListSimple() {
    //   this.loading = true
    //   this.target.listData = []
    //   this.target.params.page = 1
    //   try {
    //     let { data, paginator } = await targetListSimple(this.target.params)
    //     this.target.listData = data
    //     this.target.total = paginator.totalCount
    //     this.loading = false
    //   } catch (error) {
    //     this.loading = false
    //     this._message(error)
    //   }
    // },
    async gteTargetListSimple() {
      if (this.isloading) return
      this.isloading = true
      try {
        let { data } = await targetListSimple(this.params)
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
      this.gteTargetListSimple()
    }
  },
  components: {
    Scroll
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
    display: flex;
    align-items: center;
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
