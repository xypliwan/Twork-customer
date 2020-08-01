<template>
  <div>
    <el-row
      v-for="(item, i) in targetDar"
      :key="timestamp + i + item.department_id"
      class="item-box"
    >
      <el-col :span="19">
        <i class="iconfont icon-wenjian"></i>
        {{ item.department_name }}
      </el-col>
      <el-col :span="4" :offset="1" style="text-align:right;">
        <i class="el-icon-error close-icon" @click="clearDar(item)"></i>
      </el-col>
    </el-row>
    <el-row
      v-for="(item, j) in targetUserList"
      :key="j + item.user_id + timestamp"
      class="item-box"
    >
      <el-col :span="19">
        <i class="iconfont icon-touxiang" style="font-size: 12px"></i>
        {{ item.username }}
      </el-col>
      <el-col :span="4" :offset="1" style="text-align:right;">
        <i class="el-icon-error close-icon" @click="clear(item)"></i>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    targetDar: Array,
    targetUserList: Array
  },
  computed: {
    timestamp() {
      return new Date().getTime()
    }
  },
  methods: {
    clearDar(item) {
      this.$emit('clearDar', item)
    },
    clear(item) {
      this.$emit('clearUser', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.item-box {
  padding: 6px 0;
  .close-icon {
    cursor: pointer;
  }
}
</style>
