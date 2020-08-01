<template>
  <div class="wrap">
    <div class="head">
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="addGroupsDialogVisible = true"
        >新建标签分组</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="addLabelDialogVisible = true"
        >新建标签</el-button
      >
      <div class="serachWrap">
        <el-input
          v-model="searchValue"
          placeholder="输入要搜索的内容"
          class="search"
          size="small"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            size="small"
            @click="doSearch()"
          ></el-button>
        </el-input>
      </div>
    </div>
    <el-collapse accordion>
      <el-collapse-item class="collapsetitle">
        <template slot="title">
          <span>运营1组标签</span>
          <div>可见人员：<span style="color: #526ecc;">亚马逊运营组</span></div>
          <div class="btns">
            <el-button type="text" @click.stop="clickBT()">添加标签</el-button>
            <el-button type="text" @click.stop="clickBT()">编辑组</el-button>
            <el-button type="text" @click.stop="clickBT()">添加组</el-button>
          </div>
        </template>
        <div class="main">
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
        </div>
      </el-collapse-item>
      <el-collapse-item class="collapsetitle">
        <template slot="title">
          <span>运营1组标签</span>
          <div>可见人员：<span style="color: #526ecc;">亚马逊运营组</span></div>
          <div class="btns">
            <el-button type="text" @click.stop="clickBT()">添加标签</el-button>
            <el-button type="text" @click.stop="clickBT()">编辑组</el-button>
            <el-button type="text" @click.stop="clickBT()">添加组</el-button>
          </div>
        </template>
        <div class="main">
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
        </div>
      </el-collapse-item>
      <el-collapse-item class="collapsetitle">
        <template slot="title">
          <span>运营1组标签</span>
          <div>可见人员：<span style="color: #526ecc;">亚马逊运营组</span></div>
          <div class="btns">
            <el-button type="text" @click.stop="clickBT()">添加标签</el-button>
            <el-button type="text" @click.stop="clickBT()">编辑组</el-button>
            <el-button type="text" @click.stop="clickBT()">添加组</el-button>
          </div>
        </template>
        <div class="main">
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
          <el-tag>标签一</el-tag>
        </div>
      </el-collapse-item>
    </el-collapse>
    <add-label
      :addLabelDialogVisible="addLabelDialogVisible"
      @cancleLabelDialog="cancleLabelDialog"
      @saveLabelDialog="saveLabelDialog"
    />
    <add-groups
      :addGroupsDialogVisible="addGroupsDialogVisible"
      @cancleGroupsDialog="cancleGroupsDialog"
      @saveGroupsDialog="saveGroupsDialog"
    />
  </div>
</template>
<script>
import AddLabel from './components/AddLabel'
import AddGroups from './components/AddGroups'
export default {
  name: 'TaskLabel',
  data() {
    return {
      searchValue: '',
      addLabelDialogVisible: false,
      addGroupsDialogVisible: false
    }
  },
  methods: {
    clickBT() {},
    doSearch() {},
    cancleLabelDialog() {
      this.addLabelDialogVisible = false
    },
    saveLabelDialog() {
      this.addLabelDialogVisible = false
    },
    cancleGroupsDialog() {
      this.addGroupsDialogVisible = false
    },
    saveGroupsDialog() {
      this.addGroupsDialogVisible = false
    }
  },
  components: {
    AddLabel,
    AddGroups
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .head {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .serachWrap {
      width: 300px;
      margin-left: 100px;
    }
  }
  .collapsetitle {
    display: block;
    ::v-deep .el-collapse-item__header {
      position: relative;
      padding-left: 30px;
      justify-content: space-between;
      .el-collapse-item__arrow {
        position: absolute;
        top: 0;
        left: 0;
        line-height: 48px;
      }
    }
    .main {
      ::v-deep .el-tag {
        margin-right: 10px;
      }
    }
  }
}
</style>
