<template>
  <div class="task-list">
    <scroll :hasMore="noMore" :isLoadings="isloading" @loadingData="loadMore">
      <div slot="dataList">
        <el-row v-for="(item, i) in list" :key="i" class="list-item">
          <el-col :span="3">
            <el-tag size="mini">KR{{ item.sort }}</el-tag>
          </el-col>
          <el-col :span="6" class="list-name">
            <div>
              {{ item.kr_name }}
            </div>
          </el-col>
          <el-col :span="3">
            <el-tag type="success" size="mini">{{ item.username }}</el-tag>
          </el-col>
          <el-col :span="5">
            <el-progress :percentage="Number(item.process)"></el-progress>
          </el-col>
          <el-col :span="3">
            <i class="iconfont icon-favorite orange"></i>
            {{ item.score }}
          </el-col>
          <el-col :span="3" class="list-time"> {{ item.mark }}分 </el-col>
        </el-row>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from '_c/common/Scroll'
import { targetKrListAll } from '@/api/targetOkr'
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
        if (this.activeName == 'krRes') {
          this.params.page = 1
          this.list = []
          this.getTargetKrListAll()
        }
      },
      immediate: true
    }
  },
  methods: {
    // async getTargetKrListAll() {
    //   this.loading = true
    //   this.kr.listData = []
    //   this.kr.params.page = 1
    //   try {
    //     let { data, paginator } = await targetKrListAll(this.kr.params)
    //     this.kr.listData = data
    //     this.kr.total = paginator.totalCount
    //     this.loading = false
    //   } catch (error) {
    //     this.loading = false
    //     this._message(error)
    //   }
    // },
    async getTargetKrListAll() {
      if (this.isloading) return
      this.isloading = true
      try {
        let { data } = await targetKrListAll(this.params)
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
      this.getTargetKrListAll()
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
