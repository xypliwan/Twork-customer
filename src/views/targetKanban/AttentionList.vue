<template>
  <div class="attention-list">
    <scroll :hasMore="noMore" :isLoadings="isloading" @loadingData="loadMore">
      <div slot="dataList">
        <div
          class="target-item"
          v-for="(item, i) in targetlist"
          :key="i"
          @click="handleItem(item)"
          :class="item.target_id == currentId ? 'active-item' : ''"
        >
          <div class="outher-info">
            <span class="outher-item" style="text-align:left">
              <el-tag size="mini">{{ item.period_name }}</el-tag>
            </span>
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.allResponsible"
              placement="top"
            >
              <span
                class="username outher-item"
                v-if="
                  item.responsible_people && item.responsible_people.length > 0
                "
              >
                {{ item.responsible_people[0].username }}
                <i class="el-icon-plus"></i>
              </span>
            </el-tooltip>

            <span class="outher-item">
              <el-tag size="mini" type="info" effect="plain">{{
                item.target_type
              }}</el-tag>
            </span>

            <i
              class="iconfont icon-e637 icon-focus"
              :class="item.focus == 1 ? 'active-focus' : ''"
              @click.stop="setFoucs(item, i)"
            ></i>
          </div>
          <div class="target-name">{{ item.target_name }}</div>
          <div class="schedule-info">
            <span class="schedule-num">
              <i class="el-icon-check"></i>
              {{ item.done_task }}/{{ item.all_task }}
            </span>
            <span class="process">
              <el-progress
                :percentage="Number(item.process)"
                color="#71ef3e"
              ></el-progress>
            </span>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getTargetList, setTargetFocus } from '@/api/targetOkr'
import Scroll from '_c/common/Scroll'
export default {
  props: {
    isFocus: [Number, String]
  },
  data() {
    return {
      currentId: '',
      targetlist: [],
      noMore: false,
      isloading: false,
      params: {
        page: 1,
        pageSize: 15,
        focus: '1' //1关注  0未关注
      }
    }
  },
  watch: {
    // isFocus(newVal) {
    //   this.params.focus = newVal;
    //   this.targetlist = [];
    //   this.params.page = 1;
    //   this.getTargetList();
    // }
  },
  async mounted() {
    const targetId = this.$route.query.targetid
    if (targetId) {
      this.$parent.isFocus = 'all'
      let item = {
        page: 1,
        pageSize: 15,
        target_id: targetId
      }

      await this.toSearch(item)
    } else {
      await this.getTargetList()
    }
    if (this.targetlist.length > 0) {
      this.handleItem(this.targetlist[0])
      this.currentId = this.targetlist[0].target_id
    }
  },
  methods: {
    async toSearch(params) {
      this.params = params
      this.targetlist = []
      this.params.page = 1
      await this.getTargetList()
    },
    handleItem(item) {
      this.currentId = item.target_id
      this.$emit('changeTargetId', item)
    },
    async setFoucs(item) {
      let focus = item.focus == 1 ? 0 : 1
      try {
        await setTargetFocus({
          target_id: item.target_id,
          focus
        })
        item.focus = focus
        this._message(focus == 1 ? '关注成功' : '取消关注成功', 'success')
      } catch (error) {
        this._message(error)
      }
    },
    createTaskReatList() {
      this.params.page = 1
      this.targetlist = []
      this.getTargetList()
    },
    async getTargetList() {
      if (this.isloading) return
      this.isloading = true
      try {
        let { data } = await getTargetList(this.params)
        data.forEach(el => {
          el['allResponsible'] = ''
          el.responsible_people.forEach(ev => {
            el['allResponsible'] += ` ${ev.username} `
          })
        })
        this.noMore = data.length < this.params.pageSize ? true : false
        this.targetlist = [...this.targetlist, ...data]
      } catch (error) {
        this._message(error)
      }
      this.isloading = false
    },
    loadMore() {
      if (this.isloading) return
      this.params.page++
      this.getTargetList()
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
.attention-list {
  height: calc(100% - 70px);
  .target-item {
    padding: 10px 10px;
    border-bottom: 1px solid #f1f1f1;
    cursor: pointer;
    .outher-info {
      display: flex;
      overflow: hidden;
      .outher-item {
        flex: 1;
        text-align: center;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
      .icon-focus {
        width: 15px;
        font-size: 13px;
        color: #ccc;
        cursor: pointer;
        margin-top: 3px;
        &.active-focus {
          color: #f59a23;
        }
      }
      .username {
        text-align: center;
        font-size: 12px;
        color: #333;
        line-height: 19px;
        max-width: 68px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .target-name {
      margin: 15px 0;
      font-size: 13px;
      line-height: 17px;
    }
    .schedule-info {
      display: flex;
      overflow: hidden;
      .schedule-num {
        width: 50px;
        font-size: 12px;
        line-height: 18px;
      }
      .process {
        flex: 1;
      }
    }
    &:hover {
      background: $themeColor;
      color: #fff !important;
      .username {
        color: #fff;
      }
      ::v-deep .el-progress__text {
        color: #fff;
      }
    }
    &.active-item {
      background: $themeColor;
      color: #fff !important;
      .target-name {
        font-weight: 800;
      }
      .username {
        color: #fff;
      }
      ::v-deep .el-progress__text {
        color: #fff;
      }
    }
  }
}
</style>
