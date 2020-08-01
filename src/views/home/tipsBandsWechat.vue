<template>
  <div>
    <el-dialog
      :visible.sync="dialog"
      width="500px"
      center
      :before-close="handleClose"
    >
      <div class="dialog-content">
        <div>
          <h3>你的账号还没有绑定微信，请尽快绑定</h3>
          <div>
            <img
              src="../../assets/images/xx.png"
              alt="微信"
              @click="bindWechat"
            />
            <p>
              <el-link type="primary" @click="bindWechat">立即绑定微信</el-link>
            </p>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button size="mini" @click="closeTip">不再提示</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { closeWxTip } from '@/api/home'
export default {
  props: {
    dialog: Boolean
  },
  data() {
    return {}
  },
  watch: {},
  methods: {
    async closeTip() {
      try {
        await closeWxTip()
        this.handleClose()
      } catch (error) {
        this._message(error)
      }
    },
    bindWechat() {
      this.$emit('update:dialog', false)
      setTimeout(() => {
        this.$router.push({
          path: '/user-center',
          query: {
            flagIndex: 3
          }
        })
      }, 300)
    },

    handleClose() {
      this.$emit('update:dialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  text-align: center;
  margin-top: 20px;
  img {
    width: 60px;
    height: 60px;
    margin-top: 30px;
    margin-bottom: 10px;
  }
}
</style>
