<template>
  <div class="wrap">
    <el-dialog
      :title="data.name + ' - ' + data.date + ' - ' + '任务列表'"
      :visible.sync="taskPop"
      :close-on-click-modal="false"
      :show-close="false"
      width="50%"
    >
      <div class="items" v-loading="tableLoading">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="projectName">
            <span>项目：</span>{{ item.project_name }}
          </div>
          <div class="taskName"><span>任务：</span>{{ item.title }}</div>
          <div class="taskName"><span>所填工时：</span>{{ item.hour }}</div>
        </div>
        <p v-if="list.length === 0" style="text-align: center;">暂无任务</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskListByid } from '@/api/workHours'
export default {
  name: '',
  data () {
    return {
      tableLoading: false,
      list: []
    }
  },
  props: {
    taskPop: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {
          user_id: null,
          name: null,
          date: null
        }
      }
    },
    project_id: {
      type: String,
      default: null
    }
  },
  watch: {
    taskPop (newValue) {
      if (newValue && newValue !== null) {
        this.getList()
      }
    },
    deep: true
  },
  methods: {
    async getList () {
      //获取任务类型列表
      this.tableLoading = true
      try {
        let obj = {
          user_id: this.data.user_id,
          date: this.data.date,
          project_id: this.project_id
        }
        let { data } = await getTaskListByid(obj)
        console.log(data)
        this.list = data.child
      } catch (error) {
        this._message(error)
      }
      this.tableLoading = false
    },
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.$emit('save')
    }
  },
  computed: {}
}
</script>
<style lang="scss" scoped>
.wrap {
  .items {
    padding: 5px;
    .item {
      background-color: #e8e8e8;
      margin-bottom: 10px;
      .projectName {
        line-height: 30px;
        span {
          font-weight: bold;
        }
      }
      .taskName {
        line-height: 30px;
        span {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
