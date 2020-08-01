<template>
  <div class="left-box">
    <div class="attention-header">
      <div class="left">
        <el-tabs v-model="isFocus" @tab-click="handleTab">
          <el-tab-pane label="关注" name="1"></el-tab-pane>
          <el-tab-pane label="未关注" name="0"></el-tab-pane>
          <el-tab-pane label="全部" name="all"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <el-tooltip
          class="item"
          effect="dark"
          content="更多过滤"
          placement="top"
        >
          <el-popover placement="right" width="500" trigger="click">
            <list-filter
              :targetProjectList="targetProjectList"
              :periodList="periodList"
              :userList="userList"
              :departmentInfo="departmentInfo"
              @searchFilter="searchFilter"
            ></list-filter>
            <i slot="reference" class="iconfont icon-shaixuan"></i>
          </el-popover>
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="dark"
          content="隐藏目标看板"
          placement="top"
        >
          <i class="iconfont icon-shousuo" @click="handleChangeExtend"></i>
        </el-tooltip>
      </div>
    </div>

    <div class="attention-cont">
      <attention-list
        :isFocus="isFocus"
        @changeTargetId="changeTargetId"
        ref="attentionListRef"
      ></attention-list>
    </div>
  </div>
</template>

<script>
import AttentionList from './AttentionList'
import ListFilter from './dialog/ListFilter'
export default {
  props: {
    targetProjectList: Array, //目标类型
    periodList: Array, //周期列表  多选
    userList: Array, //责任人
    departmentInfo: Array //部门和人
  },
  data() {
    return {
      isFocus: '1'
    }
  },
  mounted() {},
  methods: {
    handleTab() {
      let item = {
        page: 1,
        pageSize: 15,
        focus: this.isFocus //1关注  0未关注
      }
      this.$refs.attentionListRef.toSearch(item)
    },
    searchFilter(params) {
      this.isFocus = 'all'
      Object.assign(params, {
        page: 1,
        pageSize: 15,
        target_id: ''
      })
      this.$refs.attentionListRef.toSearch(params)
    },
    handleChangeExtend() {
      this.$emit('extendChange', true)
    },
    getTaskList() {
      this.$refs.attentionListRef.createTaskReatList()
    },
    changeTargetId(item) {
      this.$emit('changeTargetId', item.target_id)
    }
  },
  components: {
    AttentionList,
    ListFilter
  }
}
</script>

<style lang="scss" scoped>
.left-box {
  overflow: hidden;
  height: 100%;
  .attention-header {
    display: flex;
    height: 40px;
    padding: 0 10px;
    border-bottom: 2px solid #f1f1f1;
    .left {
      flex: 1;
      ::v-deep .el-tabs__nav-wrap::after {
        display: none;
      }
      ::v-deep .el-tabs__header {
        margin-bottom: 5px;
      }
      ::v-deep .el-tabs__item {
        padding: 0 8px;
      }
    }
    .right {
      width: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        color: #526ecc;
        font-size: 16px;
        cursor: pointer;
      }
      .icon-shaixuan {
        font-weight: 600;
        position: relative;
        top: 2px;
      }
      .icon-shousuo {
        transform: rotate(90deg);
        margin-left: 8px;
      }
    }
  }
  .attention-cont {
    margin-top: 10px;
    width: 250px;
    height: 100%;
  }
}
</style>
