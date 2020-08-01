<template>
  <div>
    <el-dialog
      :visible.sync="treeDialogVisible"
      title="选择任务类型"
      width="50%"
      :modal="modal"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-tree
        :data="treeData"
        ref="tree"
        @check="checkGroupNode"
        show-checkbox
        :check-strictly="true"
        :default-expand-all="true"
        node-key="category_id"
        :props="treeProps"
        style="height:350px;overflow-y: scroll;"
        v-loading="tableLoading"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()" size="small">确定</el-button>
        <el-button @click="cancle()" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { taskCategoryList } from '@/api/workHours'
export default {
  data () {
    return {
      treeData: [],
      treeProps: {
        id: 'category_id',
        label: 'category_name',
        children: 'child'
      },
      tableLoading: false
    }
  },
  props: {
    treeDialogVisible: {
      type: Boolean,
      default: false
    },
    defaultId: {
      type: Array,
      default: null
    },
    status: {
      type: [Number, String],
      default: null
    },
    project_id: {
      type: [Number, String],
      default: null
    },
    modal: {
      type: Boolean,
      default: true
    },
    duoxuan: {
      type: Boolean,
      default: false
    },
    tableList: {
      type: Array,
      default: () => {
        return []
      }
    },
    index: {
      type: [Number, String],
      default: null
    }
  },
  created () {
    this.getTreeList()
  },
  watch: {
    defaultId (newValue) {
      if (newValue && newValue !== null) {
        this.setdefaultId()
      } else {
        this.clearChoose()
      }
    },
    treeDialogVisible (newValue) {
      if (newValue && newValue !== null) {
        this.getTreeList()
      }
    }
  },
  methods: {
    async getTreeList () {
      if (this.project_id === null) {
        return
      }
      //获取任务类型列表
      this.tableLoading = true
      this.treeData = []
      try {
        let obj = {
          project_id: this.project_id,
          status: this.status ? this.status : undefined
        }

        let { data } = await taskCategoryList(obj)
        this.treeData = data
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    },
    checkGroupNode: function (a, b) {
      if (!this.duoxuan) {
        //项目列表快速创建任务进来的支持多选
        if (b.checkedKeys.length > 0) {
          this.$refs.tree.setCheckedKeys([a.category_id])
        }
      }
    },
    clearChoose () {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
      })
    },
    setdefaultId () {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.defaultId)
      })
    },
    save () {
      let arr = this.$refs.tree.getCheckedNodes()
      let project_id
      let num
      this.tableList.map((item, index) => {
        if (item.project_id + item.category_id === this.index) {
          num = index
          project_id = this.tableList[index].project_id // 获取当前选中的项目id
        }
      })
      let list = JSON.parse(JSON.stringify(this.tableList))
      list.splice(num, 1) // 不跟自己对比
      let canChoose = true
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (project_id === list[j].project_id && arr[i].category_id === list[j].category_id) {
            this.$message({
              message: '此周已存在相同类型任务',
              type: 'warning'
            })
            canChoose = false
            break
          }
        }
      }
      if (canChoose) {
        this.$emit('saveTypeTree', this.$refs.tree.getCheckedNodes())
      }
    },
    cancle () {
      this.$emit('cancleTypeTree')
    }
  }
}
</script>
<style lang="scss" scoped></style>
