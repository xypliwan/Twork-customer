<template>
  <div class="dynamic-page">
    <div class="dynamic-header">
      <span> <i class="iconfont icon-diqiu"></i> 协同动态 </span>
      <el-dropdown>
        <span class="dropdown-desc pointer">
          {{ dynamicName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in dynamicType"
            :key="index"
            @click.native="selectDropdown(item)"
            >{{ item.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        v-if="params.is_read === 0"
        class="all-read"
        size="mini"
        @click="setAllRead"
        >全部标记为已读</el-button
      >
      <span class="fr pointer" @click="dynamicDialog = true">
        <i class="iconfont icon-shezhi1"></i> 动态设置
      </span>
      <span class="handle-btn">
        <el-button
          size="mini"
          :type="params.is_read === 0 ? 'primary' : ''"
          @click="clickUnread"
          >未读</el-button
        >
        <el-button
          size="mini"
          :type="params.is_read === 1 ? 'primary' : ''"
          @click="clickRead"
          >已读</el-button
        >
      </span>
    </div>
    <dynamic-list ref="dynamicList"></dynamic-list>

    <dynamic-set :dynamicDialog.sync="dynamicDialog"></dynamic-set>
  </div>
</template>

<script>
import DynamicSet from './DynamicSet'
import DynamicList from './DynamicList'
import { setAllRead } from '@/api/dynamic'
export default {
  name: 'Dynamic',
  data() {
    return {
      dynamicName: '全部',
      dynamicType: [
        { key: '', name: '全部' },
        { key: 'okr', name: 'OKR' },
        { key: 'process', name: '流程' },
        { key: 'report', name: '汇报' },
        { key: 'schedule', name: '日程' }
      ],
      dynamicDialog: false,
      params: {
        is_read: 0,
        dynamit_type_code: '' //分类代码  OKR为okr    流程为process    汇报为report   日程 schedule  全部为空
      }
    }
  },
  components: {
    DynamicSet,
    DynamicList
  },
  methods: {
    // 下拉选择
    selectDropdown(item) {
      this.dynamicName = item.name
      this.params.dynamit_type_code = item.key
      this.$refs.dynamicList.parentCall(this.params)
    },
    // 未读
    clickUnread() {
      this.params.is_read = 0
      this.$refs.dynamicList.parentCall(this.params)
    },
    // 已读
    clickRead() {
      this.params.is_read = 1
      this.$refs.dynamicList.parentCall(this.params)
    },
    // 设为全部已读
    setAllRead() {
      this.$confirm(`${this.dynamicName}动态信息全部设为已读?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const { message } = await setAllRead({
              dynamit_type_code: this.params.dynamit_type_code
            })
            this.$message.success(message)
            this.$refs.dynamicList.parentCall(this.params)
          } catch (error) {
            this._message(error)
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
.dynamic-page {
  .dynamic-header {
    padding: 0px 15px;
    background: #fff;
    height: 45px;
    line-height: 45px;
    border-radius: 5px;
    overflow: hidden;
    span {
      font-size: 15px;
      color: #333;
      // cursor: pointer;
      i {
        font-size: 16px;
        color: $themeColor;
      }
    }
    .handle-btn {
      float: right;
      margin-right: 10px;
    }
    .all-read {
      margin-left: 10px;
    }
    .dropdown-desc {
      color: #536fcc;
      font-weight: bold;
      margin-left: 10px;
    }
  }
}
</style>
