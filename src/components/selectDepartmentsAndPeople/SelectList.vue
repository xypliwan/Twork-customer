<template>
  <div class="">
    <div class="architecture-box" v-show="!showSearch">
      <div
        class="select-item"
        v-for="item in selectList"
        :key="timestamp + item.department_id"
      >
        <el-row>
          <el-col :span="19">
            <el-checkbox
              v-if="canSelectDepartment"
              v-model="item.select"
              @change="
                e => {
                  handleChange(item, e)
                }
              "
            >
              <span>
                <i class="iconfont icon-wenjian"></i>
                {{ item.department_name }}
              </span>
            </el-checkbox>
            <span v-if="!canSelectDepartment">
              <i class="iconfont icon-wenjian"></i>
              {{ item.department_name }}
            </span>
          </el-col>
          <el-col :span="4" :offset="1" style="text-align: right;">
            <el-link
              :underline="false"
              :disabled="item.select"
              @click="hanldNext(item)"
              ><i class="iconfont icon-xiaji"></i>下级</el-link
            >
          </el-col>
        </el-row>
      </div>
      <div
        class="select-item"
        v-for="(userItem, j) in userSelectList"
        :key="j + timestamp + j"
      >
        <el-checkbox
          v-if="canSelectUser"
          v-model="userItem.select"
          @change="
            e => {
              handleChangeUser(userItem, e)
            }
          "
        >
          <span>
            <i class="iconfont icon-touxiang" style="font-size: 12px"></i>
            {{ userItem.username }}
          </span>
        </el-checkbox>
        <span v-if="!canSelectUser">
          <i class="iconfont icon-touxiang" style="font-size: 12px"></i>
          {{ userItem.username }}
        </span>
      </div>
    </div>
    <div class="saerch-box" v-show="showSearch">
      <div
        class="select-item"
        v-for="(item, sI) in searchDarList"
        :key="timestamp + sI + item.department_id"
      >
        <el-row>
          <el-col :span="19">
            <el-checkbox
              v-if="canSelectDepartment"
              v-model="item.select"
              @change="
                e => {
                  handleChange(item, e)
                }
              "
            >
              <span
                ><i class="iconfont icon-wenjian"></i>
                {{ item.department_name }}</span
              >
              <span v-if="!canSelectDepartment">
                <i class="iconfont icon-wenjian"></i>
                {{ item.department_name }}
              </span>
            </el-checkbox>
          </el-col>
        </el-row>
      </div>
      <div
        class="select-item"
        v-for="userItem in searchUserList"
        :key="timestamp + userItem.user_id"
      >
        <el-checkbox
          v-if="canSelectUser"
          v-model="userItem.select"
          @change="
            e => {
              handleChangeUser(userItem, e)
            }
          "
        >
          <span
            ><i class="iconfont icon-touxiang" style="font-size: 12px"></i>
            {{ userItem.username }}</span
          >
          <span v-if="!canSelectUser">
            <i class="iconfont icon-touxiang" style="font-size: 12px"></i>
            {{ userItem.username }}
          </span>
        </el-checkbox>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showSearch: Boolean,
    canSelectDepartment: Boolean,
    canSelectUser: Boolean,
    id: String,
    searchDarList: Array,
    searchUserList: Array,
    selectList: Array,
    userSelectList: Array
  },
  data() {
    return {
      idOwn: ''
    }
  },
  computed: {
    timestamp() {
      return new Date().getTime()
    }
  },
  methods: {
    hanldNext(item) {
      this.$emit('nextDepartment', item)
    },
    handleChangeUser(item, flg) {
      this.$emit('changeUser', { item, flg })
    },
    handleChange(item, flg) {
      this.$emit('changeDar', { item, flg })
    }
  }
}
</script>
<style lang="scss" scoped>
.select-item {
  padding: 6px 0;
}
</style>
