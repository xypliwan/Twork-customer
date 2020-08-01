<template>
  <div class="item-wrapper">
    <scroll :hasMore="noMore" :isLoadings="isloading" @loadingData="loadMore">
      <div slot="dataList">
        <div class="item" v-for="(item, i) in dynamicList" :key="i">
          <div class="create-time">{{ item.created_at }}</div>
          <div class="cont">
            <div class="is-read-box" v-if="item.is_read == '0'">
              <!-- <i class="iconfont icon-weidu"></i> -->
            </div>
            <div class="cont-left">
              <i
                v-if="
                  [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '11',
                    '12',
                    '13',
                    '14'
                  ].includes(item.dynamit_type)
                "
                class="iconfont icon-wodemubiao"
              ></i>
              <i
                v-if="
                  [
                    '21',
                    '22',
                    '23',
                    '24',
                    '25',
                    '26',
                    '27',
                    '28',
                    '29',
                    '30'
                  ].includes(item.dynamit_type)
                "
                class="iconfont icon--liuchengguanli"
              ></i>
              <i
                v-if="['31', '32', '33'].includes(item.dynamit_type)"
                class="iconfont icon-guanliyuanbidu"
              ></i>
              <!-- <img src="../../assets/images/okr.png" alt />
              <img src="../../assets/images/liuchen.png" alt />
              <img src="../../assets/images/huibao.png" alt />
              <img src="../../assets/images/richeng.png" alt /> -->
            </div>
            <div class="cont-right">
              <!--1 okr创建   4:kr评分-->
              <div v-if="item.dynamit_type == '1' || item.dynamit_type == '4'">
                <div class="cont-title">
                  <span class="color-title">{{ item.username }}</span>
                  {{ item.predicate }}
                  <span class="color-title">{{ item.title }}</span>
                </div>
                <div class="cont-txt" v-html="item.config.html"></div>
                <el-button type="primary" size="mini" @click="toOkrDetail(item)"
                  >查看详情</el-button
                >
              </div>
              <!-- 2:kr复盘  3,5:kr 评论-->
              <div
                v-if="
                  item.dynamit_type == '2' ||
                    item.dynamit_type == '3' ||
                    item.dynamit_type == '5'
                "
              >
                <div class="cont-title">
                  <span class="color-title">{{ item.username }}</span>
                  {{ item.predicate }}
                  <span class="color-title">{{ item.title }}</span>
                </div>
                <div class="cont-txt" v-html="item.config.html"></div>
                <el-button type="primary" size="mini" @click="tokrDynamic(item)"
                  >查看详情</el-button
                >
              </div>
              <!-- 6:删除okr目标-->
              <div v-if="item.dynamit_type == '6'">
                <div class="cont-title">
                  <span class="color-title">{{ item.username }}</span>
                  {{ item.predicate }}
                  <span class="color-title">{{ item.title }}</span>
                </div>
                <el-button
                  v-if="item.is_read == '0'"
                  type="primary"
                  size="mini"
                  style="margin-top:10px;"
                  @click="setDynamicRead(item)"
                  >标记为已读</el-button
                >
              </div>

              <!-- 11:任务评论@人  12:任务责任人和参与人  13:任务创建  14:任务过期-->
              <div
                v-if="
                  item.dynamit_type == '11' ||
                    item.dynamit_type == '12' ||
                    item.dynamit_type == '13' ||
                    item.dynamit_type == '14'
                "
              >
                <div class="cont-title">
                  <span class="color-title">{{ item.username }}</span>
                  {{ item.predicate }}
                  <span class="color-title">{{ item.title }}</span>
                </div>
                <div class="cont-txt" v-html="item.config.html"></div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="toTaskDetail(item)"
                  >查看详情</el-button
                >
              </div>

              <!-- 21流程评论@人   22流程评论 -->
              <div
                v-if="item.dynamit_type == '21' || item.dynamit_type == '22'"
              >
                <div class="cont-title">
                  <span class="color-title">{{ item.username }}</span>
                  {{ item.predicate }}
                  <span class="color-title">{{ item.title }}</span>
                </div>
                <div class="cont-txt" v-html="item.config.html"></div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="toProcessDetail(item)"
                  >查看详情</el-button
                >
              </div>

              <!-- 23流程抄送   24流程处理  25流程完成节点  26整个流程完成  27流程拒绝节点  28撤销流程 29流程催办 30流程转交-->
              <div
                v-if="
                  ['23', '24', '25', '26', '27', '28', '29', '30'].find(
                    el => el == item.dynamit_type
                  )
                "
              >
                <div class="cont-title">
                  <span class="color-title">{{ item.username }}</span>
                  {{ item.predicate }}
                  <span class="color-title">{{ item.title }}</span>
                </div>
                <div class="cont-txt">
                  <div class="process-title">
                    流程标题:
                    <span class="color-title">{{ item.config.list_name }}</span>
                  </div>
                  <div class="process-content">
                    <p
                      class="process-cont"
                      v-for="(el, i) in item.config.fromat.detail.form_setting"
                      :key="i"
                    >
                      <span v-show="el.type != 'richText'"
                        >{{ el.name }}：</span
                      >
                      <span
                        class="richText"
                        v-if="el.type == 'richText'"
                        v-html="item.config.fromat.form[el.key]"
                      ></span>
                      <span
                        v-show="
                          !['img', 'accessory', 'richText'].find(
                            ele => ele == el.type
                          )
                        "
                      >
                        {{
                          item.config.fromat.form[el.key]
                            | myFilter(el.type, departmentData)
                        }}
                      </span>
                      <span
                        v-if="['img', 'accessory'].find(ele => ele == el.type)"
                      >
                        <a
                          v-for="(v, ii) in item.config.fromat.form[el.key]"
                          :key="ii"
                          :href="v.url"
                          target="_blank"
                          >{{ v.name }}</a
                        >
                      </span>
                    </p>
                  </div>
                </div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="toProcessDetail(item)"
                  >查看详情</el-button
                >
              </div>
              <!-- 31汇报创建（跳创建汇报） -->
              <div v-if="['31'].find(el => el == item.dynamit_type)">
                <div class="cont-title">
                  <span class="color-title">{{ item.username }}</span>
                  创建了汇报模板
                  <span class="color-title">{{ item.title }}</span>
                </div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="toReportTem(item.config, item)"
                  >查看详情</el-button
                >
              </div>
              <!-- 32汇报汇总（不跳）  33汇报提醒（不跳） ） -->
              <div v-if="['32', '33'].find(el => el == item.dynamit_type)">
                <div class="cont-title">
                  <span class="color-title">{{ item.username }}</span>
                  {{ item.predicate }}
                  <span class="color-title">{{ item.title }}</span>
                </div>
              </div>

              <!-- 34汇报评论@人（跳列表详情） -->
              <div v-if="['34'].find(el => el == item.dynamit_type)">
                <div class="cont-title">
                  {{ item.dynamit_type }}
                  <span class="color-title">{{ item.username }}</span>
                  {{ item.predicate }}
                  <span class="color-title">{{ item.title }}</span>
                </div>
                <div class="cont-txt" v-html="item.config.html"></div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="toReportDetail(item.config, item)"
                  >查看详情</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>

    <!-- kr动态弹框 -->
    <dynamic-kr
      :krIdToDynamic="krIdToDynamic"
      :targetId="targetIdToDynamic"
      :dialog.sync="krLogDialog"
    ></dynamic-kr>

    <!-- 任务详情 -->
    <task-detail
      :dialog.sync="taskDialog"
      :taskId="taskId"
      :userList="atUserList"
    ></task-detail>
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
import { getDynamicList, setDynamicRead } from '@/api/dynamic'
import DynamicKr from '_v/targetKanban/kr/Dynamic'
import TaskDetail from '_v/targetKanban/task/TaskDetail'
import ProcessDetail from './ProcessDetail'
import { mapGetters } from 'vuex'
import { departmentGetArr } from '@/api/common'
export default {
  data() {
    return {
      userList: [], //用户列表
      departmentData: [], //部门列表
      dynamicList: [],
      noMore: true,
      isloading: false,
      params: {
        page: 1,
        pageSize: 10,
        is_read: 0, //1已读 0未读
        dynamit_type_code: '' //分类代码  OKR为okr    流程为process    汇报为report   日程 schedule  全部为空
      },
      //kr复盘
      targetIdToDynamic: '',
      krIdToDynamic: '',
      krLogDialog: false,

      //任务详情
      taskDialog: false,
      taskId: '',

      //流程详情
      processDialog: false,
      listId: '' //流程id
    }
  },
  created() {
    this.getDynamicList()
    this.getDepartment()
  },
  computed: {
    ...mapGetters(['atUserList', 'dynamicInfo'])
  },
  watch: {
    dynamicInfo(newVal) {
      this.dynamicList.unshift(newVal)
    }
  },
  methods: {
    toReportDetail(info, item) {
      if (item.is_read == '0') {
        this.setDynamicRead(item)
      }
      this.$router.push(`/report?reportdetail=true&listid=${info.list_id}`)
    },
    toReportTem(info, item) {
      if (item.is_read == '0') {
        this.setDynamicRead(item)
      }
      this.$router.push(`/write-report?reportid=${info.report_id}`)
    },
    toProcessDetail(item) {
      this.processDialog = true
      this.listId = item.config.list_id
      if (item.is_read == '0') {
        this.setDynamicRead(item)
      }
    },
    async setDynamicRead(item) {
      try {
        await setDynamicRead({ dynamic_id: item.dynamic_id })
        item.is_read = '1'
      } catch (error) {
        this._message(error)
      }
    },
    //前往任务详情
    toTaskDetail(item) {
      this.taskDialog = true
      this.taskId = item.config.task_id
      if (item.is_read == '0') {
        this.setDynamicRead(item)
      }
    },
    //前往kr动态
    tokrDynamic(item) {
      this.krLogDialog = true
      this.targetIdToDynamic = item.config.target_id
      this.krIdToDynamic = item.config.kr_id
      if (item.is_read == '0') {
        this.setDynamicRead(item)
      }
    },

    //前往目标看板
    toOkrDetail(item) {
      const { href } = this.$router.resolve({
        path: '/target/target-kanban',
        query: {
          targetid: item.config.target_id
        }
      })
      window.open(href, '_blank')
      if (item.is_read == '0') {
        this.setDynamicRead(item)
      }
    },
    loadMore() {
      if (this.isloading) return
      this.params.page++
      this.getDynamicList()
    },
    async getDynamicList() {
      if (this.isloading) return
      this.isloading = true
      this.params.kr_id = this.krId
      try {
        let { data } = await getDynamicList(this.params)
        this.noMore = data.length < this.params.pageSize
        this.dynamicList = [...this.dynamicList, ...data]
      } catch (error) {
        this._message(error)
      }
      this.isloading = false
    },
    parentCall(params) {
      this.dynamicList = []
      Object.assign(this.params, params)
      this.params.page = 1
      this.getDynamicList()
    },
    async getDepartment() {
      try {
        let { data } = await departmentGetArr()
        this.departmentData = data
      } catch (error) {
        this._message(error)
      }
    }
  },
  components: {
    Scroll,
    DynamicKr,
    TaskDetail,
    ProcessDetail
  }
}
</script>

<style lang="scss" scoped>
.item-wrapper {
  width: 1200px;
  margin: 0 auto;
  margin-top: 10px;
  height: calc(100vh - 160px);
  overflow-y: auto;

  .item {
    margin-bottom: 15px;
    .create-time {
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .cont {
      background: #fff;
      padding: 15px 10px;
      border-radius: 5px;
      display: flex;
      position: relative;
      .is-read-box {
        position: absolute;
        right: 15px;
        top: 18px;
        z-index: 99;
        width: 8px;
        height: 8px;
        background: #ef0808;
        border-radius: 50%;
        i {
          color: #e60c0c;
          font-size: 15px;
        }
      }
      .cont-left {
        width: 42px;
        i {
          color: $themeColor;
          font-size: 30px;
        }
        img {
          width: 30px;
          height: 30px;
        }
      }
      .cont-right {
        flex: 1;
        .cont-title {
          height: 38px;
          line-height: 28px;
          font-size: 16px;
          border-bottom: 1px solid #f1f1f1;
          padding-bottom: 10px;
          .color-title {
            color: $themeColor;
          }
        }
        .cont-txt {
          padding: 10px 0;
          border-bottom: 1px solid #f1f1f1;
          margin-bottom: 14px;
          ::v-deep p {
            line-height: 22px;
            font-size: 14px;
            color: #555;
          }
          .process-content {
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            line-clamp: 5;
            -webkit-box-orient: vertical;
          }
        }
        .process-title {
          font-size: 15px;
          margin-bottom: 10px;
          .color-title {
            color: $themeColor;
          }
        }
      }
    }
  }
}
</style>
