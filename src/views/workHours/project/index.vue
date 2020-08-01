<template>
  <div class="wrap" v-loading="detailLoading">
    <div class="title">
      <i
        class="iconfont "
        :class="detail.icon"
        :style="{ color: detail.color }"
      ></i>
      <span>{{ detail.project_name }}</span>
      <el-button type="text" v-if="detail.can_update" @click="goEdit()"
        >编辑</el-button
      >
      <div class="status">
        <!-- v-model="projectStatu" -->
        <el-switch
          v-model="detail.end_status"
          active-text="开始"
          active-value="1"
          inactive-value="0"
          inactive-text="结束"
          v-if="RoleAuthority"
          @change="changeSwitch()"
        >
        </el-switch>
      </div>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="任务列表" name="taskList">
        <task-list
          :projectId="projectId"
          :RoleAuthority="RoleAuthority"
          :responsibleId="responsibleId"
          @getDetailAgain="getDetailAgain"
        />
      </el-tab-pane>
      <!-- <el-tab-pane label="项目文档" name="documentation">
        <project-file :projectId="projectId" />
      </el-tab-pane> -->
      <el-tab-pane label="成员列表" name="memberList">
        <member-list
          :projectId="projectId"
          :RoleAuthority="RoleAuthority"
          :detail="detail"
        />
      </el-tab-pane>
      <!-- <el-tab-pane label="角色列表" name="roleList">
        <role-list :projectId="projectId" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import {
  projectUpdateStata,
  roleAuthority,
  getProjectDetail
} from '@/api/workHours'
import TaskList from './components/TaskLists'
import MemberList from './components/MemberLists'
import RoleList from './components/RoleList'
import ProjectFile from './components/ProjectFile'
export default {
  name: 'Project',
  data() {
    return {
      activeName: 'taskList',
      projectId: '',
      projectStatu: '1', //项目状态
      RoleAuthority: false, //用户权限，用于判断删除按钮和编辑按钮的置灰
      detailLoading: false,
      detail: {},
      responsibleId: []
    }
  },
  created() {
    this.projectId = this.$route.query.id
    if (this.projectId) {
      this.getProjectDetailFn()
      this.getRoleAuthority()
    }
  },
  watch: {
    $route(newVal) {
      if (newVal.name === 'Project') {
        //监听路由id变化的时候重新请求，因为加了缓存，去到不是项目列表的页面也会监听，所以要排除这部分页面
        this.projectId = newVal.query.id
        if (this.projectId) {
          this.RoleAuthority = false
          this.getProjectDetailFn()
          this.getRoleAuthority()
        }
      }
    }
  },
  methods: {
    async getProjectDetailFn() {
      this.detailLoading = true
      try {
        let { data } = await getProjectDetail({
          project_id: this.projectId
        })
        Object.assign(this.detail, data)
        if (data.responsible) {
          let arr = []
          data.responsible.user.map(item => {
            arr.push(item.user_id)
          })
          this.responsibleId = arr
        }
      } catch (error) {
        this._message(error)
      }
      this.detailLoading = false
    },
    getDetailAgain() {
      this.getProjectDetailFn()
    },
    async getRoleAuthority() {
      try {
        let params = {
          project_id: this.projectId //项目id
        }
        let { data } = await roleAuthority(params)
        if (data.role === '2' || data.role === '3') {
          this.RoleAuthority = true
        }
      } catch (error) {
        this._message(error)
      }
    },
    goEdit() {
      this.$router.push(`/create-project?id=${this.projectId}`)
    },
    async changeSwitch() {
      //改变状态
      try {
        let obj = {
          project_id: this.projectId,
          // end_status: this.projectStatu
          end_status: this.detail.end_status
        }
        let { message } = await projectUpdateStata(obj)
        this._message(message, 'success')
      } catch (error) {
        this._message(error)
      }
    }
  },
  computed: {},
  filters: {},
  components: {
    TaskList,
    MemberList,
    // eslint-disable-next-line vue/no-unused-components
    ProjectFile,
    // eslint-disable-next-line vue/no-unused-components
    RoleList
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  .title {
    line-height: 35px;
    display: flex;
    align-items: center;
    font-size: 14px;
    background-color: #eff1f6;
    margin-bottom: 10px;
    .iconfont {
      color: #526ecc;
      font-size: 18px;
      padding: 0 5px;
    }
    span {
      margin-right: 40px;
      font-weight: bold;
    }
    .status {
      margin-left: 30px;
      display: flex;
      align-items: center;
      i {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        margin-right: 5px;
      }
      .ok {
        background-color: green;
      }
    }
  }
}
</style>
