<template>
  <div class="user-center">
    <div class="flex">
      <div class="flex-left">
        <ul>
          <li :class="{ active: flagIndex == 1 }" @click="flagIndex = 1">
            基础信息
          </li>
          <li :class="{ active: flagIndex == 2 }" @click="flagIndex = 2">
            修改密码
          </li>
          <li :class="{ active: flagIndex == 3 }" @click="flagIndex = 3">
            绑定微信
          </li>
        </ul>
      </div>
      <div class="flex-right">
        <base-set v-show="flagIndex == 1"></base-set>
        <edit-password v-show="flagIndex == 2"></edit-password>
        <binding-we-chat
          v-show="flagIndex == 3"
          :flagIndex="flagIndex"
        ></binding-we-chat>
      </div>
    </div>
  </div>
</template>

<script>
import editPassword from './editPassword'
import BaseSet from './baseSet'
import BindingWeChat from './bindingWeChat'
export default {
  name: 'UserCenter',
  components: { editPassword, BaseSet, BindingWeChat },
  data() {
    return {
      flagIndex: 1
    }
  },
  mounted() {
    if (this.$route.query.flagIndex)
      this.flagIndex = this.$route.query.flagIndex
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.user-center {
  background-color: #fff;
  height: 100%;
  .flex {
    display: flex;
    height: 100%;
    .flex-left {
      color: #3b3b3b;
      font-size: 14px;
      padding: 10px;
      width: 100px;
      height: 100%;
      line-height: 30px;
      border-right: 1px solid #eee;
      li {
        padding: 0 10px;
      }
      .active {
        background-color: #fff;
        border-right: 2px solid rgb(34, 132, 223);
      }
    }
    .flex-right {
      flex: 1;
      padding: 20px;
    }
  }
}
</style>
