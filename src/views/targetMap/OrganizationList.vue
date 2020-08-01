<template>
  <div class="organization-list-box" v-loading="listLoading">
    <div class="target-parment">
      <el-checkbox v-model="companyTarget">公司目标</el-checkbox>
    </div>
    <!-- default-expand-all -->
    <el-tree
      :data="listData"
      show-checkbox
      node-key="department_id"
      :props="defaultProps"
      :default-expanded-keys="defaultExpendArr"
      check-strictly
      @check-change="handleClick"
      @check="getCheck"
      ref="treeForm"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="font-size:13px;color:#666;">
          {{ node.label }}
          <span v-show="data.set_num > 0">( {{ data.set_num }} )</span>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { getDepartmentInfo } from '@/api/common'
export default {
  data() {
    return {
      listLoading: false,
      companyTarget: true,
      listData: [],
      defaultProps: {
        label: 'department_name',
        children: 'children'
      },
      params: {
        department_id: '' //部门id
      },
      i: 0,
      defaultExpendArr: []
    }
  },
  mounted() {
    this.getDepartmentInfo()
  },
  watch: {
    companyTarget(newVal) {
      if (newVal) {
        this.params.department_id = ''
        this.$refs.treeForm.setCheckedNodes([])
        this.$emit('toSearch', this.params)
      }
    }
  },
  methods: {
    getCheck(data, checked) {
      if (checked.checkedKeys.length > 0) {
        let id = checked.checkedKeys[0]
        this.params.department_id = id
        this.companyTarget = false
        this.$emit('toSearch', this.params)
      }
    },
    handleClick(data, checked) {
      this.i++
      if (this.i % 2 === 0) {
        if (checked) {
          this.$refs.treeForm.setCheckedNodes([])
          this.$refs.treeForm.setCheckedNodes([data])
        } else {
          this.$refs.treeForm.setCheckedNodes([])
        }
      }
    },
    async getDepartmentInfo() {
      this.listLoading = true
      try {
        let { data } = await getDepartmentInfo({ 'get-target-num': 1 })
        this.listData = data
        if (this.listData.length > 0) {
          this.defaultExpendArr.push(this.listData[0].department_id)
        }
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.organization-list-box {
  padding: 15px 8px;
  min-height: 700px;
  .target-parment {
    margin-bottom: 10px;
    padding-left: 23px;
  }
}
</style>
