<template>
  <div class="home">
    <el-row :gutter="12">
      <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
        <el-row :gutter="12" class="rows">
          <el-col :span="12">
            <el-card shadow="hover">
              <title-line title="流程概况"></title-line>
              <ul style="margin-top:20px;">
                <li @click="toFlowPage('upcom')">
                  {{ flowData.dealNum }}
                  <div>待办</div>
                </li>
                <!-- <li>
                  {{ flowData.timeoutNum }}
                  <div>超时</div>
                </li>-->
                <li>
                  {{ flowData.callDoneNum }}
                  <div>催办</div>
                </li>
                <li @click="toFlowPage('cc')">
                  {{ flowData.ccMeNum }}
                  <div>抄送</div>
                </li>
                <!-- <li>
                  {{ flowData.dealDoneNum }}
                  <div>已办</div>
                </li>-->
                <li @click="toFlowPage('completed')">
                  {{ flowData.doneNum }}
                  <div>已完成</div>
                </li>
                <!-- <li>
                  {{ flowData.myCreateNum }}
                  <div>我发起</div>
                </li>-->
              </ul>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <title-line title="OKR目标概况"></title-line>
              <ul style="margin-top:20px;">
                <!-- <li>
                  {{ taskData.all_num }}
                  <div>总数</div>
                </li>-->
                <li>
                  {{ taskData.done_num }}
                  <div>已完成</div>
                </li>
                <li>
                  {{ taskData.none_num }}
                  <div>未完成</div>
                </li>
                <li>
                  {{ taskData.overtime_num }}
                  <div>已逾期</div>
                </li>
                <!-- <li>
                  {{ taskData.on_time_done_num }}
                  <div>按时完成</div>
                </li>-->
                <li>
                  {{ taskData.overtime_done_num }}
                  <div>逾期完成</div>
                </li>
              </ul>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12" class="rows">
          <el-col :span="24">
            <el-card shadow="hover">
              <title-line title="数据趋势"></title-line>
              <data-charts></data-charts>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12" class="rows">
          <el-col :span="12">
            <el-card shadow="hover">
              <title-line title="个人流程中心"></title-line>
              <process-center></process-center>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <title-line title="个人OKR"></title-line>
              <user-okr></user-okr>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
        <el-card shadow="hover" class="rows">
          <el-carousel indicator-position="outside">
            <el-carousel-item v-for="(item, index) in imgs" :key="index">
              <a :href="item.redirect_url" target="_blank">
                <img :src="item.img_url" alt @click="recordAd(item)" />
              </a>
            </el-carousel-item>
          </el-carousel>
        </el-card>
        <el-row :gutter="12" class="rows">
          <el-col :span="24">
            <announcement></announcement>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <tips-bands-wechat :dialog.sync="dialog"></tips-bands-wechat>
    <dialog-user-info :dialogVisible.sync="dialogVisible"></dialog-user-info>
  </div>
</template>

<script>
import { listAllUrl, taskListCount, flowCount } from '@/api/home'
import { adAddLog } from '@/api/common'
import Announcement from './announcement'
import TitleLine from '_c/common/TitleLine'
import UserOkr from './userOkr'
import tipsBandsWechat from './tipsBandsWechat'
import DialogUserInfo from './components/DialogUserInfo'
import { mapGetters } from 'vuex'
import ProcessCenter from './ProcessCenter'
import DataCharts from './DataCharts'

export default {
  name: 'Home',
  components: {
    Announcement,
    UserOkr,
    TitleLine,
    tipsBandsWechat,
    DialogUserInfo,
    ProcessCenter,
    DataCharts
  },
  data() {
    return {
      dialogVisible: false,
      dialog: false,
      imgs: [],
      taskData: {},
      flowData: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    userInfo(val) {
      // console.log(val, 'userinfo1')
      // 未绑定微信提示
      if (val && val.isBindWx != 1 && val.isCloseWxTips != 1) {
        this.dialog = true
      }
    }
  },
  created() {
    this.getAdList()
    this.getTaskListCount()
    this.flowCount()
  },
  mounted() {
    // 未绑定微信提示
    if (this.userInfo.isBindWx === 0 && this.userInfo.isCloseWxTips === 0) {
      this.dialog = true
    }
    if (this.userInfo.is_open_user_active_set == 1) this.dialogVisible = true
  },
  methods: {
    toFlowPage(path) {
      this.$router.push(`/flowManage?status=${path}`)
    },
    async flowCount() {
      try {
        let { data } = await flowCount()
        this.flowData = data
      } catch (error) {
        this._message(error)
      }
    },
    async getTaskListCount() {
      try {
        let { data } = await taskListCount()
        this.taskData = data
      } catch (error) {
        this._message(error)
      }
    },
    // 获取首页广告
    async getAdList() {
      try {
        let { data } = await listAllUrl()
        this.imgs = data
      } catch (error) {
        this._message(error)
      }
    },
    async recordAd(item) {
      try {
        adAddLog({ ad_id: item.ad_id, type: 1 })
      } catch (error) {
        this._message(error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  .rows {
    margin-bottom: 10px;
    .card-top {
      height: 30px;
      line-height: 30px;
      color: #333;
      font-size: 16px;
      margin-bottom: 15px;
    }
    img {
      width: 100%;
      height: 100%;
    }
    ul {
      display: flex;
      justify-content: space-between;
      text-align: center;
      li {
        width: calc((100% - 50px) / 4);
        padding: 10px 10px;
        // background-color: #eee;
        border: 1px solid #ecebeb;
        border-radius: 3px;
        font-size: 25px;
        font-weight: bold;
        background: #e9edfa;
        cursor: pointer;
        div {
          margin-top: 5px;
          font-size: 15px;
          color: #666;
        }
      }
    }
  }
  ::v-deep .el-carousel__container {
    height: 150px;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    height: 100px;
    line-height: 100px;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
}
</style>
