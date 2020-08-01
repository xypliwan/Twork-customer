<template>
  <div class="kr-wrapper">
    <title-line title="关键结果( Key Result )">
      <div slot>
        <span class="all-mark">
          <label>{{ allKrAverageScore }}</label
          >分
        </span>
        <el-tooltip
          class="item"
          effect="dark"
          content="关键结果动态"
          placement="top"
        >
          <i
            class="iconfont icon-jiankong"
            @click="logDialog = true"
            v-show="krList.length > 0"
          ></i>
        </el-tooltip>
      </div>
    </title-line>

    <create-kr
      :userList="userList"
      :targetId="targetId"
      @createKrOk="createKrOk"
    ></create-kr>

    <div class="res-box" v-loading="krLoading">
      <no-data v-if="!krList.length"></no-data>
      <div v-for="item in krList" :key="item.kr_id" class="kr-item">
        <div class="left">
          <i class="iconfont icon-juxingbeifen"></i>
          <span class="sort">KR{{ item.sort }}</span>
        </div>
        <div class="right">
          <div class="top">
            <div class="top-item top-title">
              <el-input
                :title="item.kr_name"
                v-model="item.kr_name"
                @blur="updateKrItem(item)"
                size="mini"
              ></el-input>
            </div>
            <div class="top-item top-outher-info">
              <el-tag type="success" size="mini">{{ item.username }}</el-tag>
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
          <div class="buttom">
            <div class="suggest-box">
              <span class="suggest-txt">改进</span>
              {{ item.improve.length &lt;= 0 ? '无' : item.improve }}
            </div>
            <div class="operat-box">
              <el-link type="primary" @click="reviewKr(item)">复盘</el-link>
              <el-divider direction="vertical"></el-divider>

              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="iconfont icon-msnui-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="toScore(item.kr_id)">评分</div>
                  </el-dropdown-item>
                  <el-dropdown-item command="del">
                    <div @click="delKrItem(item.kr_id)">删除</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>

    <kr-review
      :dialog.sync="reviewDialog"
      :krInfo="krInfo"
      :userList="userList"
      @viewOk="getKrList"
    ></kr-review>
    <kr-score
      :dialog.sync="krScoreDialog"
      :id="krId"
      @scoreOk="getKrList"
    ></kr-score>
    <dynamic :targetId="targetId" :dialog.sync="logDialog"></dynamic>
  </div>
</template>

<script>
import TitleLine from '_c/common/TitleLine'
//创建rk
import CreateKr from '../dialog/CreateKr'
//复盘
import KrReview from './KrReview'
//kr评分
import KrScore from '../dialog/KrScore'
import NoData from '_c/common/NoData'
//动态
import Dynamic from './Dynamic'
import { getKrList, updateKr, delKr } from '@/api/targetOkr'
import { mapActions } from 'vuex'
export default {
  props: {
    targetId: [String, Number],
    userList: Array
  },
  data() {
    return {
      krLoading: false,
      reviewDialog: false,
      krScoreDialog: false,
      krList: [],
      krInfo: {},
      krId: '',
      logDialog: false,
      allKrAverageScore: 0
    }
  },
  watch: {
    targetId(newVal) {
      if (newVal.length <= 0) return
      this.getKrList()
    }
  },
  methods: {
    ...mapActions(['setNeedRefreshKrList']),
    createKrOk() {
      this.setNeedRefreshKrList()
      this.getKrList()
    },
    getAllKrAverageScore(all) {
      let num = 0
      let allScore = all.map(item => Number(item.mark))
      allScore.map(item => (num += item))
      this.allKrAverageScore = (num / all.length).toFixed(2)
    },
    delKrItem(krId) {
      this.$confirm('确定删除此KR?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delKr(krId)
        })
        .catch(() => {})
    },
    async delKr(id) {
      this.krLoading = true
      try {
        let { message } = await delKr({ kr_id: id })
        this._message(message, 'success')
        this.getKrList()
        this.setNeedRefreshKrList()
      } catch (error) {
        this._message(error)
      }
      this.krLoading = false
    },
    toScore(krId) {
      this.krId = krId
      this.krScoreDialog = true
    },
    reviewKr(item) {
      this.krInfo = item
      this.reviewDialog = true
    },
    async updateKrItem(item) {
      if (item.kr_name.trim().length <= 0) {
        this._message('关键结果不能为空！', 'warning')
        return
      }
      try {
        await updateKr({ kr_id: item.kr_id, kr_name: item.kr_name })
        this.setNeedRefreshKrList()
      } catch (error) {
        console.log(error)
      }
    },
    async getKrList() {
      this.krLoading = true
      try {
        let { data } = await getKrList({ target_id: this.targetId })
        this.krList = data
        if (this.krList.length > 0) {
          this.getAllKrAverageScore(this.krList)
        }
      } catch (error) {
        this._message(error)
      }
      this.krLoading = false
    }
  },
  components: {
    TitleLine,
    CreateKr,
    KrReview,
    KrScore,
    NoData,
    Dynamic
  }
}
</script>

<style lang="scss" scoped>
.kr-wrapper {
  height: 100%;
  overflow: hidden;
  .icon-jiankong {
    float: right;
    font-size: 15px;
    margin-right: 7px;
    color: #555;
    cursor: pointer;
    &:hover {
      color: #66b1ff;
    }
  }
  .all-mark {
    font-size: 15px;
    color: #333;
    float: right;
    margin-left: 10px;
    margin-right: 10px;
    label {
      font-size: 17px;
      color: #84d6ae;
      font-weight: 700;
    }
  }
  .res-box {
    height: calc(100% - 100px);
    overflow-y: auto;
    margin-top: 4px;
    .kr-item {
      margin-bottom: 10px;
      background: #fff;
      display: flex;
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
            ::v-deep .el-input__inner {
              border: 1px solid #fff;
              font-size: 13px;
              font-weight: 800;
              padding: 0 5px;
            }
            &:hover {
              ::v-deep .el-input__inner {
                border: 1px solid #dcdfe6;
              }
            }
          }
          .top-outher-info {
            text-align: right;
            display: flex;
            align-items: center;
            span {
              font-size: 12px;
              color: #555;
              margin: 0 5px;
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
        .buttom {
          display: flex;
          margin-top: 10px;
          .suggest-box {
            flex: 1;
            font-size: 13px;
            line-height: 17px;
            .suggest-txt {
              color: #2d70b5;
            }
          }
          .operat-box {
            width: 100px;
            text-align: center;
            .icon-msnui-more {
              font-size: 13px;
              color: #66b1ff;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
