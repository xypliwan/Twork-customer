<template>
  <div>
    <list-index
      :departmentList="departmentList"
      :periodList="periodList"
      :parViewModel="viewModel"
      v-show="viewModel == 'list'"
    ></list-index>
    <map-index
      :departmentList="departmentList"
      :periodList="periodList"
      :parViewModel="viewModel"
      v-show="viewModel == 'map'"
    ></map-index>
  </div>
</template>

<script>
import { getDepartmentInfo, getPeriodList } from '@/api/common'
import MapIndex from './MapIndex'
import ListIndex from './ListIndex'

export default {
  name: 'target-map',
  data() {
    return {
      viewModel: 'list',
      departmentList: [], //部门列表
      periodList: [] //周期列表
    }
  },
  created() {
    this.getDepartmentInfo()
    this.getPeriodList()
  },
  methods: {
    //获取周期列表
    async getPeriodList() {
      try {
        let { data } = await getPeriodList()
        this.periodList = data
      } catch (error) {
        this._message(error)
      }
    },
    //获取部门和人员
    async getDepartmentInfo() {
      try {
        let { data } = await getDepartmentInfo({ 'get-people': 1 })
        let parentArr = JSON.parse(JSON.stringify(data))
        this.departmentList = this.formateDepartment(parentArr)
      } catch (error) {
        this._message(error)
      }
    },
    formateDepartment(arr) {
      arr.forEach(el => {
        if (el.children) {
          this.formateDepartment(el.children)
        } else {
          delete el.people
        }
      })
      return arr
    }
  },
  components: {
    MapIndex,
    ListIndex
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
  }
  .map-box {
    margin-top: 10px;
    height: calc(100% - 65px);
    overflow: hidden;
  }
}
</style>
