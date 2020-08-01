<template>
  <div class="target-map-box">
    <div class="filter-box">
      <filter-box
        :horizontal="horizontal"
        :departmentList="departmentList"
        :periodList="periodList"
        @toSearch="toSearch"
        @handleHorizontal="horizontal = !horizontal"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="organizationFlg ? '展开列表' : '隐藏列表'"
          placement="top"
        >
          <i
            class="iconfont icon-zhankai icon-zhankai-x"
            :class="organizationFlg ? 'active-icon' : ''"
            @click="organizationFlg = !organizationFlg"
          ></i>
        </el-tooltip>

        <el-radio-group
          style="margin-left:40px;"
          v-model="viewMode"
          @change="hanldeChangeViewMode"
        >
          <el-radio label="list">列表模式</el-radio>
          <el-radio label="map">地图模式</el-radio>
        </el-radio-group>
      </filter-box>
    </div>

    <div class="map-box">
      <div class="map-left" :class="organizationFlg ? 'active-wd' : ''">
        <div class="map-left-inner">
          <organization-list @toSearch="toSearch"></organization-list>
        </div>
      </div>

      <div class="map-right" v-loading="mapLoading">
        <no-data v-show="mapListData.length <= 0"></no-data>
        <div class="tree-wrapper-box" v-show="mapListData.length > 0">
          <div v-for="(item, i) in mapListData" :key="i" class="map-item">
            <vue2-org-tree
              :name="item.target_id + 'test'"
              :data="item"
              :horizontal="horizontal"
              :collapsable="true"
              :render-content="renderContent"
              @on-expand="onExpand"
              @on-node-click="onNodeClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterBox from './FilterBox'
import NoData from '_c/common/NoData'
import OrganizationList from './OrganizationList'
import { targetListMap } from '@/api/targetMap'

export default {
  props: {
    parViewModel: String,
    departmentList: Array,
    periodList: Array
  },
  name: 'target-map',
  data() {
    return {
      params: {
        period_id: '', //周期id
        department_id: '' //部门id
      },
      mapLoading: false,
      mapData: {},
      mapListData: [],
      horizontal: false,
      collapsable: true,
      expandAll: true,
      viewForm: {
        targetViewType: ''
      },
      organizationFlg: false,
      viewMode: 'list'
    }
  },
  created() {},
  async mounted() {
    await this.targetListMap()
    await this.expandChange()
  },
  watch: {
    parViewModel(newVal) {
      this.viewMode = newVal
    }
  },
  methods: {
    hanldeChangeViewMode() {
      this.$parent.viewModel = this.viewMode
    },
    toTargetKanBanPage(e, data) {
      const { href } = this.$router.resolve({
        path: '/target/target-kanban',
        query: {
          targetid: data.target_id
        }
      })
      window.open(href, '_blank')
      e.stopPropagation()
    },
    changeTagView() {
      this.mapData = this.mapListData.find(
        item => item.target_id == this.viewForm.targetViewType
      )
      this.expandChange()
    },
    renderContent(h, data) {
      return (
        <div
          class="x-tree-box"
          on-click={e => {
            this.toTargetKanBanPage(e, data)
          }}
        >
          <div class="x-wrapper">
            <div class="year">
              <span class="period-name">{data.period_name}</span>
              <span class="target-type">{data.target_type}</span>
            </div>
            <div class="target-name">{data.target_name}</div>
            <div class="res-data">
              <div class="kr-num">关键结果: {data.kr_num}</div>
              <div class="process">
                <div class="process-left">
                  <i class="el-icon-check"></i>
                  {data.done_task}/{data.all_task}
                </div>
                <div class="process-right">
                  <el-progress percentage={data.process}></el-progress>
                </div>
              </div>
            </div>
          </div>

          <div class="department">
            <el-tooltip
              class="item"
              effect="dark"
              content={data.all_people}
              placement="top"
            >
              <span>{data.show_people}</span>
            </el-tooltip>
          </div>
        </div>
      )
    },
    //
    onExpand(e, data) {
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    onNodeClick() {},
    collapse(list) {
      var _this = this
      list.forEach(function(child) {
        if (child.expand) {
          child.expand = false
        }
        child.children && _this.collapse(child.children)
      })
    },
    expandChange() {
      this.mapListData.forEach(el => {
        this.toggleExpand(el, true)
      })
      // this.toggleExpand(this.mapData, this.expandAll);
    },
    toggleExpand(data, val) {
      var _this = this
      if (Array.isArray(data)) {
        data.forEach(function(item) {
          _this.$set(item, 'expand', val)
          if (item.children) {
            _this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          _this.toggleExpand(data.children, val)
        }
      }
    },
    async targetListMap() {
      this.mapLoading = true
      try {
        let { data } = await targetListMap(this.params)
        this.mapListData = data
        this.formatTargetMap(this.mapListData)
        this.expandChange()
      } catch (error) {
        this._message(error)
      }
      this.mapLoading = false
    },
    formatTargetMap(arr) {
      arr.forEach(el => {
        if (el.children) {
          this.formatTargetMap(el.children)
        }
        el['show_people'] = ''
        el['all_people'] = ''
        el.process = Number(el.process)
        if (el.responsible_people.length > 0) {
          if (el.responsible_people.length > 1) {
            el[
              'show_people'
            ] = `${el.responsible_people[0].username}+${el.responsible_people.length}`
          } else {
            el['show_people'] = `${el.responsible_people[0].username}`
          }
          el.responsible_people.forEach(ev => {
            el['all_people'] += ` ${ev.username} `
          })
        }
        // }
      })
    },
    toSearch(params) {
      Object.assign(this.params, params)
      this.targetListMap()
    }
  },
  components: {
    FilterBox,
    NoData,
    OrganizationList
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
    .icon-zhankai-x {
      font-size: 23px;
      font-weight: bold;
      display: inline-block;
      transform: rotate(180deg);
      transition: all 0.2s linear;
      margin-top: 5px;
      &.active-icon {
        transform: rotate(0deg);
      }
    }
  }
  .map-box {
    margin-top: 10px;
    height: calc(100% - 65px);
    overflow: hidden;
    display: flex;
    .map-left {
      width: 310px;
      background: #fff;
      overflow: auto;
      transition: all 0.2s linear;
      margin-right: 10px;
      &.active-wd {
        width: 0px;
        margin-right: 0px;
      }
      .map-left-inner {
        width: 310px;
        overflow: auto;
      }
    }
    .map-right {
      flex: 1;
      overflow: hidden;
      padding: 0 15px;
      box-sizing: border-box;
      background: #fff;
      .tree-wrapper-box {
        overflow: auto;
        height: calc(100% - 35px);
        .map-item {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 5px solid #f1f1f1;
          overflow: auto;
        }
      }
      ::v-deep .org-tree-node-label .org-tree-node-label-inner {
        padding: 0;
        .x-tree-box {
          border-radius: 5px;
          overflow: hidden;
          width: 300px;
          box-shadow: 0px 5px 13px 0px #dedede;
          cursor: pointer;
          .x-wrapper {
            background: #4272cc;
            padding: 10px 10px;
            .year {
              color: #fff;
              font-size: 12px;
              overflow: hidden;
              .period-name {
                float: left;
                padding: 2px 8px;
                background: #fff;
                color: #4272cc;
                border-radius: 10px;
              }
              .target-type {
                float: right;
              }
            }
            .target-name {
              color: #fff;
              font-size: 15px;
              font-weight: bold;
              line-height: 22px;
              text-align: left;
              margin: 10px 0;
            }
            .res-data {
              color: #fff;
              font-size: 12px;
              display: flex;
              align-items: center;
              .kr-num {
                width: 90px;
                text-align: left;
              }
              .process {
                flex: 1;
                display: flex;
                text-align: right;
                .process-left {
                  width: auto;
                }
                .process-right {
                  flex: 1;
                  ::v-deep .el-progress__text {
                    color: #ffffff !important;
                  }
                  .el-progress__text {
                    color: #ffffff !important;
                  }
                }
              }
            }
          }
          .department {
            background: #fff;
            padding: 15px 8px;
            font-size: 12px;
            color: #333;
            text-align: left;
          }
        }
      }
    }
  }
}
</style>
