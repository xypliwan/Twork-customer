<template>
  <div class="okr">
    <el-tabs v-model="activeName">
      <el-tab-pane label="任务" name="task">
        <task :activeName="activeName"></task>
      </el-tab-pane>
      <el-tab-pane label="关键结果（kr）" name="krRes">
        <kr-res :activeName="activeName" :userList="userList"></kr-res>
      </el-tab-pane>
      <el-tab-pane label="目标" name="target">
        <target :activeName="activeName"></target>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Task from './components/Task'
import { getUserList } from '@/api/common'
import KrRes from './components/KrRes'
import Target from './components/Target'
export default {
  name: '',
  data() {
    return {
      userList: [],
      activeName: 'task'
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取责任人列表
    async getUserList() {
      try {
        let { data } = await getUserList()
        this.userList = data
      } catch (error) {
        this._message(error)
      }
    }
  },
  components: {
    Task,
    KrRes,
    Target
  }
}
</script>
