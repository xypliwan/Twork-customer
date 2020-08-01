<template>
  <div class="task-type" v-loading="listLoading">
    <!-- 测试 -->
    <el-button type="text" @click="goBack">
      <i class="el-icon-back " />返回</el-button
    >
    <div class="type-header">
      <el-button
        size="small"
        type="primary"
        icon="el-icon-folder-add"
        @click="toCreate($options.data().detail, 'create')"
        >新建类型分组</el-button
      >
      <el-input
        size="small"
        placeholder="请输入分组名称"
        v-model="filterTxt"
        class="search-box input-with-select"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-tree
      :data="groupList"
      node-key="category_id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent"
      :props="options"
      :filter-node-method="filterNode"
      @node-drag-end="handleDragEnd"
      ref="tree"
      draggable
    >
    </el-tree>
    <create-group
      :dialog.sync="createVisible"
      :detail="detail"
      :operatTxt="operatTxt"
      @addOk="getGroupListFn"
      :projectId="projectId"
    ></create-group>
  </div>
</template>
<script>
import CreateGroup from './CreateGroup'
import { getGroupList, delGroup, updateCategorySort } from '@/api/workHours'
export default {
  name: '',
  data() {
    return {
      filterTxt: '',
      createVisible: false,
      groupList: [],
      options: {
        label: 'category_name',
        children: 'child'
      },
      detail: {
        category_name: '',
        p_category_id: '0',
        category_id: ''
      },
      operatTxt: '',
      listLoading: false
    }
  },
  created() {
    this.getGroupListFn()
  },
  props: {
    projectId: {
      type: [Number, String],
      default: null
    }
  },
  watch: {
    filterTxt(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    filterNode(value, data) {
      if (!value) return true
      return data.category_name.indexOf(value) !== -1
    },
    // eslint-disable-next-line no-unused-vars
    handleDragEnd(draggingNode, dropNode, dropType) {
      this.changSort()
    },
    async changSort() {
      this.listLoading = true
      try {
        let obj = {
          project_id: this.projectId,
          category: this.groupList
        }
        await updateCategorySort(obj)
        this.getGroupListFn()
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    },
    renderContent(h, { node, data }) {
      return (
        <div class="custom-tree-node">
          <span>
            {data.child && data.child.length > 0 ? (
              <i class="iconfont icon-xiangmu-mian project-icon"></i>
            ) : (
              <i class="iconfont icon-okr_allperform project-icon"></i>
            )}
            {node.label}
          </span>
          <span class="fr">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top-start"
            >
              <i
                class="el-icon-edit"
                on-click={() => this.toCreate(data, 'edit')}
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="添加子分类"
              placement="top-start"
            >
              <i
                class="el-icon-folder-add"
                on-click={() => this.toCreate(data, 'addSun')}
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top-start"
            >
              <i
                class="el-icon-delete"
                on-click={() => this.delGroup(data)}
              ></i>
            </el-tooltip>
          </span>
        </div>
      )
    },
    async getGroupListFn() {
      this.listLoading = true
      try {
        let obj = {
          project_id: this.projectId
        }
        let { data } = await getGroupList(obj)
        this.groupList = data
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    },
    delGroup(data) {
      this.$confirm(`确定删除 ${data.category_name} 分组及子分组吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delGroupFn(data)
        })
        .catch(() => {})
    },
    async delGroupFn(data) {
      this.listLoading = true
      try {
        let { message } = await delGroup({ category_id: data.category_id })
        this._message(message, 'success')
        this.delGroupFormet(this.groupList, data.category_id)
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    },
    delGroupFormet(arr, id) {
      arr.forEach((el, i) => {
        if (el.child) {
          this.delGroupFormet(el.child, id)
        }
        if (el.category_id == id) {
          arr.splice(i, 1)
        }
      })
    },
    toCreate(data, txt) {
      Object.assign(this.detail, data)
      if (txt == 'addSun') {
        this.detail.p_category_id = this.detail.category_id
        this.detail.category_name = ''
      }
      this.operatTxt = txt
      this.createVisible = true
    }
  },
  components: {
    CreateGroup
  }
}
</script>
<style lang="scss" scoped>
.task-type {
  .type-header {
    margin: 10px 0;
    margin-bottom: 30px;
    .search-box {
      width: 400px;
      margin-left: 30px;
    }
  }
  ::v-deep .el-tree-node__content {
    height: 35px;
    border-bottom: 1px solid #f1f1f1;
    &:hover {
      background: #f1f1f1;
    }
    .fr {
      i {
        font-size: 18px;
        margin: 0 10px;
      }
    }
  }
  ::v-deep .custom-tree-node {
    width: 100%;
  }
  ::v-deep .project-icon {
    margin-right: 10px;
  }
}
</style>
