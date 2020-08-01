<template>
  <div>
    <div class="title-line">
      <el-select
        v-model="params.content_type"
        placeholder="类型"
        size="mini"
        style="width:180px;float: left;margin-right: 20px;"
        @change="handleChange"
      >
        <el-option
          v-for="item in contenType"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="params.time_type"
        placeholder="时间"
        size="mini"
        style="width:180px;float: left;"
        @change="handleChange"
      >
        <el-option
          v-for="item in timeType"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <div class="list-box">
      <scroll :hasMore="noMore" :isLoadings="isloading" @loadingData="loadMore">
        <div slot="dataList">
          <div class="item" v-for="(item, i) in list" :key="i">
            <i
              class="el-icon-circle-plus-outline add-cion"
              @click="sendTitle(item)"
            ></i>
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.title"
              placement="top"
            >
              <div class="txt">
                <div class="txt-inner">
                  {{ item.title }}
                </div>
              </div>
            </el-tooltip>
            <div class="process">
              <el-progress :percentage="Number(item.process)"></el-progress>
            </div>
            <div class="time">{{ item.deadline }} 截止</div>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>
<script>
import Scroll from '_c/common/Scroll'
import { reportFrontendContent } from '@/api/report'
export default {
  props: {
    contenType: Array,
    timeType: Array,
    textAreaKey: String
  },
  data() {
    return {
      params: {
        content_type: '', //task 任务   okr-kr结果  process-check 检查项
        time_type: '', //week 本周 last_week上周
        page: 1,
        pageSize: 15
      },
      isloading: false,
      noMore: false,
      list: []
    }
  },
  watch: {
    timeType() {
      this.params.content_type = ''
      this.params.time_type = ''
      if (this.contenType.length && this.timeType.length) {
        this.params.content_type = this.contenType[0].value
        this.params.time_type = this.timeType[0].value
        this.reportFrontendContent()
      } else {
        this._message('暂无基础数据，请联系管理员')
      }
    }
  },
  methods: {
    sendTitle(item) {
      if (this.textAreaKey == '') {
        this._message('请先聚焦需要添加的文本框', 'warning')
        return
      }
      this.$emit('getTitle', `${item.title}(进度${item.process}%)`)
    },
    handleChange() {
      this.list = []
      this.params.page = 1
      this.reportFrontendContent()
    },
    async reportFrontendContent() {
      if (this.isloading) return
      this.isloading = true
      try {
        let { data } = await reportFrontendContent(this.params)
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
      this.reportFrontendContent()
    }
  },
  components: {
    Scroll
  }
}
</script>
<style lang="scss" scoped>
.title-line {
  height: 35px;
  .people-num {
    color: #526ecc;
    margin-left: 20px;
    font-size: 17px;
    font-weight: 600;
  }
}
.list-box {
  height: 350px;
  overflow-y: auto;
  margin-top: 10px;
  margin-bottom: 20px;
  .item {
    padding: 6px 0;
    display: flex;
    align-items: center;
    .add-cion {
      width: auto;
      font-size: 16px;
      margin-right: 10px;
      cursor: pointer;
    }
    .txt {
      flex: 1;
      font-size: 13px;
      color: #333;
      overflow: hidden;

      .txt-inner {
        widows: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .process {
      width: 100px;
      text-align: right;
    }
    .time {
      width: 80px;
      font-size: 13px;
      color: #555;
      text-align: center;
      overflow: hidden;
    }
  }
}
</style>
