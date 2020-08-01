<template>
  <div>
    <div class="res-box" v-loading="krLoading">
      <no-data v-if="!krList.length"></no-data>
      <div
        v-for="item in krList"
        :key="item.kr_id"
        class="kr-item"
        :class="currentId == item.kr_id ? 'active-kritem' : ''"
        @click="hadeleClickItem(item.kr_id)"
      >
        <div class="left">
          <i class="iconfont icon-juxingbeifen"></i>
          <span class="sort">KR{{ item.sort }}</span>
        </div>
        <div class="right">
          <div class="top">
            <div class="top-item top-title">{{ item.kr_name }}</div>
          </div>
          <div class="buttom">
            <div class="top-outher-info">
              <el-tag type="success" size="mini" style="margin-left:0">{{
                item.username
              }}</el-tag>
              <span>进度 {{ item.process }}%</span>
              <span>
                <i class="iconfont icon-favorite"></i>
                {{ item.score }}
              </span>
              <span>
                <label class="mark">{{ item.mark }}</label> 分
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <week-confidence-chart
      :krId="currentId"
      ref="chartWeekRef"
    ></week-confidence-chart>
  </div>
</template>

<script>
import NoData from '_c/common/NoData'
import WeekConfidenceChart from './WeekConfidenceChart'
import { getKrList } from '@/api/targetOkr'
export default {
  props: {
    targetId: [String, Number],
    krIdToDynamic: {
      type: [String, Number],
      default: ''
    } //动态传过来的kr id
  },
  data() {
    return {
      krLoading: false,
      reviewDialog: false,
      krScoreDialog: false,
      krList: [],
      krInfo: {},
      currentId: ''
    }
  },
  watch: {
    currentId(newVal) {
      this.$emit('changeKrId', newVal)
    }
  },
  methods: {
    hadeleClickItem(id) {
      this.currentId = id
    },
    async getKrLists() {
      this.krLoading = true
      try {
        let { data } = await getKrList({ target_id: this.targetId })
        this.krList = data
        if (this.krIdToDynamic !== '') {
          this.currentId = this.krIdToDynamic
          this.$emit('changeKrId', this.currentId)
        } else {
          if (this.krList.length > 0) {
            this.currentId = this.krList[0].kr_id
            this.$emit('changeKrId', this.currentId)
          }
        }
      } catch (error) {
        this._message(error)
      }
      this.krLoading = false
    }
  },
  components: {
    NoData,
    WeekConfidenceChart
  }
}
</script>

<style lang="scss" scoped>
.res-box {
  margin: 20px 0;
  //   height: calc(100% - 100px);
  overflow-y: auto;
  height: 400px;
  .kr-item {
    margin-bottom: 10px;
    background: #fff;
    display: flex;
    cursor: pointer;
    &.active-kritem {
      background: #f1f1f1;
    }
    &:hover {
      background: #f1f1f1;
    }
    .left {
      width: 50px;
      overflow: hidden;
      position: relative;
      .icon-juxingbeifen {
        font-size: 65px;
        color: #2d70b5;
        position: relative;
        top: -11px;
      }
      .sort {
        font-size: 12px;
        color: #fff;
        position: absolute;
        left: 5px;
        top: 7px;
      }
    }
    .right {
      flex: 1;
      padding: 8px 0;
      .top {
        display: flex;
        .top-item {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .top-title {
          font-size: 13px;
          font-weight: 800;
        }
      }
      .buttom {
        display: flex;
        margin-top: 10px;
        .top-outher-info {
          text-align: right;
          display: flex;
          align-items: center;
          span {
            font-size: 12px;
            color: #555;
            margin: 0 20px;
            .icon-favorite {
              font-size: 16px;
              color: #f6af42;
            }
            .mark {
              font-size: 17px;
              color: #84d6ae;
              font-weight: 700;
            }
          }
        }
      }
    }
  }
}
</style>
