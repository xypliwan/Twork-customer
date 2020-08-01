<template>
  <el-dialog
    :title="
      operatTxt == 'create'
        ? '新增分组'
        : operatTxt == 'edit'
        ? '编辑分组'
        : '增加子分类'
    "
    :close-on-click-modal="false"
    :append-to-body="true"
    top="200px"
    :visible.sync="dialog"
    width="600px"
    :before-close="handleClose"
  >
    <div class="create-cont" v-loading="createLoading">
      <el-input
        clearable
        size="small"
        v-model="params.category_name"
        placeholder="请输入分类名称"
      ></el-input>
    </div>
    <div class="create-footer">
      <el-button type="primary" size="small" @click="save">确定</el-button>
      <el-button type="primary" size="small" @click="handleClose"
        >关闭</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { addTaskGroup, updateGroup } from '@/api/workHours'
export default {
  props: {
    dialog: Boolean,
    operatTxt: String,
    projectId: {
      type: [Number, String],
      default: null
    },
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      params: {
        category_name: '',
        p_category_id: '0', //0为分组，其他为父分类的id
        category_id: '',
        project_id: ''
      },
      createLoading: false
    }
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        Object.assign(this.params, this.detail)
      }
    }
  },
  methods: {
    save() {
      if (!this.params.category_name.length) {
        this._message('请填写分类名称', 'warning')
        return
      }
      switch (this.operatTxt) {
        case 'create':
          this.addTaskGroupFn()
          break
        case 'edit':
          this.updateGroupFn()
          break
        case 'addSun':
          this.addTaskGroupFn()
          break
      }
    },
    async updateGroupFn() {
      this.createLoading = true
      try {
        this.params.project_id = this.projectId
        let { message } = await updateGroup(this.params)
        this._message(message, 'success')
        this.$emit('addOk')
        this.handleClose()
      } catch (error) {
        this._message(error)
      }
      this.createLoading = false
    },
    async addTaskGroupFn() {
      this.createLoading = true
      try {
        this.params.project_id = this.projectId
        let { message } = await addTaskGroup(this.params)
        this._message(message, 'success')
        this.$emit('addOk')
        this.handleClose()
      } catch (error) {
        this._message(error)
      }
      this.createLoading = false
    },
    handleClose() {
      this.params.category_name = ''
      this.$emit('update:dialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.create-cont {
  margin: 80px 0;
}
.create-footer {
  text-align: right;
}
</style>
