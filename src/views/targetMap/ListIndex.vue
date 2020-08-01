<template>
  <div class="target-map-box">
    <div class="filter-box">
      <list-filter-box
        :departmentList="departmentList"
        :periodList="periodList"
        @toSearch="toSearch"
      >
        <div class="left-box">
          <el-radio-group v-model="viewMode" @change="hanldeChangeViewMode">
            <el-radio label="list">列表模式</el-radio>
            <el-radio label="map">地图模式</el-radio>
          </el-radio-group>
        </div>
      </list-filter-box>
    </div>
    <div class="map-box" v-loading="listLoading">
      <el-collapse accordion v-model="itemIndex" @change="change">
        <el-collapse-item
          v-for="(item, i) in departmentNameList"
          :class="itemIndex == i ? 'collapse-item-item-active' : ''"
          :key="i"
          :name="i"
        >
          <template slot="title">
            <div class="header-title">
              <div class="department-name">
                <div class="rank-box">
                  <img v-if="i < 3" src="./../../assets/images/rank.png" alt />
                  <span class="rank-num" :class="i > 2 ? 'rank-active' : ''">{{
                    i + 1
                  }}</span>
                </div>
                {{ item.department_name }} ({{ item.all_target_num }})
              </div>
              <div class="item">
                平均得分:
                <span class="mark">{{ item.mark }}</span
                >分
              </div>
              <div class="item">
                <!-- 总进度: <el-progress :percentage="Number(item.process)"></el-progress> -->
                总进度: {{ item.process }}%
              </div>
              <div class="item">
                平均信心指数:
                <i class="iconfont icon-favorite"></i>
                <span class="score">{{ item.score }}</span>
              </div>
              <div class="item">
                任务数:
                <span class="task-num"
                  >{{ item.doneTask }} / {{ item.allTask }}</span
                >
              </div>
              <div class="item">
                累计复盘:
                <span class="grand-total">{{ item.summaryNum }}</span> 次
              </div>
            </div>
          </template>
          <div class="list-cont">
            <div class="cont-header cont-header-box">
              <div class="target">目标</div>
              <div class="department">所属部门</div>
              <div class="responsible">责任人</div>
              <div class="score">得分</div>
              <div class="confidence-index">平均信心指数</div>
              <div class="total-tasks">总任务数</div>
              <div class="week-overdue">本周任务</div>
              <div class="week-overdue">本周超期</div>
              <div class="task-update-time">任务更新时间</div>
              <div class="task-review">累计复盘</div>
              <div class="review-time">累计复盘时间</div>
              <div class="dynamic">KR动态</div>
            </div>

            <div>
              <el-tree :data="item.childDepartmen" @node-expand="setPadding">
                <div
                  class="custom-tree-node cont-header cont-tree-cont"
                  slot-scope="{ node, data }"
                >
                  <div
                    class="target cont-target-name"
                    :style="{ paddingLeft: data.indexs * 15 + 'px' }"
                    @click.stop="handleTarget(data)"
                    :title="data.target_name"
                  >
                    {{ data.target_name }}
                  </div>
                  <div class="department">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="data.department_name_all"
                      placement="top"
                    >
                      <span>
                        {{ data.department_name[0] }}
                        <el-tag
                          size="mini"
                          v-if="data.department_name.length > 1"
                          >+{{ data.department_name.length }}</el-tag
                        >
                      </span>
                    </el-tooltip>
                  </div>
                  <div class="responsible">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="data.show_principal_all"
                      placement="top"
                    >
                      <el-tag type="success" size="mini">{{
                        data.show_principal
                      }}</el-tag>
                    </el-tooltip>
                  </div>

                  <div class="score cont-score">{{ data.mark }}</div>
                  <div class="confidence-index cont-confidence-index">
                    <i class="iconfont icon-favorite"></i>
                    {{ data.score }}
                  </div>
                  <!-- 总任务 -->
                  <div
                    class="total-tasks cont-task-cont"
                    @click.stop="handleTaskDay(data, 'all')"
                  >
                    {{ data.done_task }}/{{ data.all_task }}
                  </div>
                  <!-- 本周任务 -->
                  <div
                    class="week-overdue cont-task-cont"
                    @click.stop="handleTaskDay(data, 'week')"
                  >
                    {{ data.week_done }}/{{ data.week }}
                  </div>
                  <!-- 本周超期 -->
                  <div
                    class="week-overdue cont-week-overdue"
                    @click.stop="handleTaskDay(data, 'overdue')"
                  >
                    {{ data.week_overtime }}
                  </div>
                  <div class="task-update-time">{{ data.task_updated_at }}</div>
                  <div class="task-review">{{ data.summary_num }}次</div>
                  <div class="review-time">{{ data.summary_created }}</div>
                  <div
                    class="dynamic dynamic-data"
                    @click.stop="toDynamic(data)"
                  >
                    <i class="iconfont icon-gupiao2"></i>
                  </div>
                </div>
              </el-tree>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <dynamic :targetId="targetId" :dialog.sync="dynamicDialog"></dynamic>
  </div>
</template>

<script>
import ListFilterBox from './ListFilterBox'
import Dynamic from '_v/targetKanban/kr/Dynamic'
import { getDepartmentNameList, getDepartmentSecondList } from '@/api/targetMap'

export default {
  props: {
    parViewModel: String,
    departmentList: Array,
    periodList: Array
  },
  name: 'target-map',
  data() {
    return {
      itemIndex: '',
      params: {
        //获取目标地图列表模式二级部门信息
        period_id: '' //周期id
      },
      secondDeparParams: {
        // period_id:'',       //周期id
        department_id: '' //部门id
      },
      listLoading: false,
      viewMode: 'list',
      departmentNameList: [],
      targetId: '',
      dynamicDialog: false
    }
  },
  created() {
    this.getDepartmentNameList()
  },
  watch: {
    parViewModel(newVal) {
      this.viewMode = newVal
    }
  },
  methods: {
    setPadding(data) {
      data.children.forEach(el => {
        el['indexs'] = data.indexs + 1
      })
    },
    toDynamic(data) {
      //查看动态
      this.targetId = data.target_id
      this.dynamicDialog = true
    },
    handleTaskDay(data, type) {
      const { href } = this.$router.resolve({
        path: '/target/target-kanban',
        query: {
          targetid: data.target_id,
          type
        }
      })
      window.open(href, '_blank')
    },
    handleTarget(data) {
      const { href } = this.$router.resolve({
        path: '/target/target-kanban',
        query: {
          targetid: data.target_id
        }
      })
      window.open(href, '_blank')
    },
    change() {
      if (typeof this.itemIndex == 'number') {
        if (
          this.departmentNameList[this.itemIndex].childDepartmen.length <= 0
        ) {
          this.secondDeparParams.department_id = this.departmentNameList[
            this.itemIndex
          ].department_id
          this.getDepartmentSecondList()
        }
      }
    },
    async getDepartmentSecondList() {
      try {
        let { data } = await getDepartmentSecondList(this.secondDeparParams)
        this.formatDepartmentData(data)
        this.departmentNameList[this.itemIndex].childDepartmen = data
      } catch (error) {
        this._message(error)
      }
    },
    formatDepartmentData(arr) {
      arr.forEach(el => {
        if (el.children && el.children.length > 0) {
          this.formatDepartmentData(el.children)
        }
        el['indexs'] = 0
        el['department_name_all'] = ''
        el['department_name_all'] = el.department_name.join(' ')
        el['show_principal'] = ''
        el['show_principal_all'] = ''
        if (el.responsible_people.length > 1) {
          el.responsible_people.forEach(ev => {
            el[
              'show_principal'
            ] = `${el.responsible_people[0].username} +${el.responsible_people.length}`
            el['show_principal_all'] += ` ${ev.username} `
          })
        } else {
          el['show_principal'] = el.responsible_people[0].username
          el['show_principal_all'] = el.responsible_people[0].username
        }
      })
    },
    toSearch(params) {
      Object.assign(this.params, params)
      this.getDepartmentNameList()
    },
    async getDepartmentNameList() {
      this.listLoading = true
      try {
        let { data } = await getDepartmentNameList(this.params)
        data.forEach(el => {
          el['childDepartmen'] = []
          el.process = Number(el.process * 100).toFixed(0)
        })
        data.sort((a, b) => {
          return b.process - a.process
        })
        this.departmentNameList = data
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    },
    hanldeChangeViewMode() {
      this.$parent.viewModel = this.viewMode
    }
  },
  components: {
    ListFilterBox,
    Dynamic
  }
}
</script>

<style lang="scss" scoped>
.target-map-box {
  height: 100%;
  .filter-box {
    padding: 10px 10px;
    background: #fff;
    overflow: hidden;
    .left-box {
      display: inline-block;
      margin-top: 9px;
    }
  }
  .map-box {
    margin-top: 10px;
    height: calc(100% - 65px);
    overflow: hidden;
    display: flex;
    width: 100%;
    ::v-deep .el-collapse-item__header {
      &.is-active {
        background: #bec8ea;
      }
    }
    ::v-deep .el-collapse {
      width: 100%;
    }
    ::v-deep .el-collapse-item__header {
      height: 55px;
      line-height: 55px;
    }
    .header-title {
      width: 100%;
      height: 45px;
      overflow: hidden;
      display: flex;
      align-items: center;
      .item {
        display: inline-block;
        // padding: 0 25px;
        width: 180px;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        color: #666;
        .mark {
          font-size: 20px;
          color: #27dc71;
          margin-right: 5px;
        }
        .icon-favorite {
          font-size: 20px;
          margin-right: 5px;
          color: #eeaf5a;
        }
        .score {
          font-size: 20px;
          color: #27dc71;
        }
        .task-num {
          font-size: 16px;
          color: #888;
        }
        .grand-total {
          font-size: 16px;
          color: #888;
        }
      }
      .department-name {
        // min-width: 220px;
        width: 250px;
        padding: 0px 15px;
        height: 45px;
        overflow: hidden;
        font-size: 14px;
        color: #666;
        font-weight: 800;
        display: flex;
        align-items: center;
        .rank-box {
          width: 40px;
          height: 45px;
          position: relative;
          display: flex;
          align-items: center;
          float: left;
          img {
            width: 35px;
            margin: 0 auto;
          }
          .rank-num {
            position: absolute;
            top: 1;
            left: 37%;
            z-index: 99;
            color: #fff;
            font-size: 12px;
            font-weight: bold;
            &.rank-active {
              color: #333;
            }
          }
        }
      }
    }

    .list-cont {
      border-top: 5px solid #f1f1f1;
      border-bottom: 1px solid #f1f1f1;

      .cont-header {
        width: 100%;
        padding: 5px 0;
        display: flex;
        font-size: 14px;
        color: #333;
        font-weight: 800;
        .no {
          width: 50px;
          text-align: center;
        }
        .department {
          width: 150px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .responsible {
          width: 100px;
        }
        .target {
          // flex: 1;
          width: 300px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .score {
          width: 80px;
          text-align: center;
        }
        .confidence-index {
          width: 100px;
          text-align: center;
        }
        .total-tasks {
          width: 90px;
          text-align: center;
        }
        .week-overdue {
          width: 70px;
          text-align: center;
        }
        .task-update-time {
          width: 145px;
        }
        .task-review {
          width: 80px;
          text-align: center;
        }
        .review-time {
          width: 145px;
        }
        .dynamic {
          width: 60px;
        }
      }
      .cont-tree-cont {
        font-weight: normal;
        font-size: 14px;
        color: #333;
        .cont-target-name {
          color: $themeColor;
        }
        .cont-score {
          color: #27dc71;
        }
        .icon-favorite {
          margin-right: 5px;
          color: #eeaf5a;
        }
        .cont-confidence-index {
          color: #27dc71;
        }
        .cont-task-cont {
          color: $themeColor;
        }
        .cont-week-overdue {
          color: #f56c6c;
        }
        .dynamic-data {
          text-align: center;
        }
      }
    }
    .cont-header-box {
      padding-left: 25px !important;
      background: #f1f1f1;
    }
  }
  ::v-deep .el-tree-node__content {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #f1f1f1;
  }
  ::v-deep .el-tree-node__content {
    padding-left: 0px !important;
  }
}
</style>
