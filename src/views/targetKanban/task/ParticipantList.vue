<template>
  <div class="responsible-list" v-loading="peopleLoading">
    <el-select
      filterable
      size="small"
      @visible-change="visibleChange"
      v-model="participantListId"
      multiple
      collapse-tags
      placeholder="请选择参与人"
    >
      <el-option
        v-for="item in allUser"
        :key="item.user_id"
        :label="item.username"
        :value="item.user_id"
      ></el-option>
    </el-select>
    <el-tag
      size="small"
      class="tag-item"
      :key="user.user_id"
      v-for="user in participantList"
      closable
      :disable-transitions="false"
      @close="handleClose(user)"
      >{{ user.username }}</el-tag
    >
    <!-- <el-input
      type="textarea"
      readonly
      autosize
      placeholder="请选择"
      v-model="params.txt"
      @focus="duVisible = true"
    >
    </el-input>
    <select-departments-and-people
      :visible.sync="duVisible"
      @updateUser="updateUser"
      :originalData="params"
    ></select-departments-and-people> -->
  </div>
</template>

<script>
import { getUserList } from '@/api/common'
import { getTaskPlayerList, updatePlayerList } from '@/api/targetOkr'
// import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'

export default {
  props: {
    taskId: [String, Number]
  },
  data() {
    return {
      allUser: [],
      participantListId: [], //参与人id
      participantList: [], //参与人
      peopleLoading: false,
      duVisible: false,
      params: {
        department: [],
        user: [],
        nameArr: [],
        txt: ''
      }
    }
  },
  components: {
    // SelectDepartmentsAndPeople
  },
  mounted() {
    this.getUserList()
    this.$nextTick(() => {
      this.getTaskPlayerList()
    })
  },
  watch: {
    taskId() {
      this.getTaskPlayerList()
    }
  },
  methods: {
    updateUser(obj) {
      Object.assign(this.params, obj)
      this.params.txt = obj.nameArr.join('、')
    },
    visibleChange(flg) {
      if (!flg) {
        if (this.participantListId.length <= 0) return
        this.updatePlayerList()
      }
    },
    async updatePlayerList() {
      this.peopleLoading = true
      try {
        let { data } = await updatePlayerList({
          task_id: this.taskId,
          user_ids: this.participantListId
        })
        this.participantList = data
      } catch (error) {
        this._message(error)
      }
      this.peopleLoading = false
    },

    async getTaskPlayerList() {
      try {
        let { data } = await getTaskPlayerList({ task_id: this.taskId })
        this.participantList = data
        this.participantListId = this.participantList.map(item => item.user_id)
      } catch (error) {
        this._message(error)
      }
    },
    handleClose(user) {
      this.participantListId.forEach((el, i) => {
        if (el == user.user_id) {
          this.participantListId.splice(i, 1)
        }
      })

      this.participantList.forEach((el, i) => {
        if (el.user_id == user.user_id) {
          this.participantList.splice(i, 1)
        }
      })
      this.updatePlayerList()
    },
    async getUserList() {
      try {
        let { data } = await getUserList()
        this.allUser = data
      } catch (error) {
        this._message(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.responsible-list {
  margin-bottom: 20px;
  margin-top: 10px;
  .tag-item {
    margin: 8px 8px;
  }
}
</style>
