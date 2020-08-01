<template>
  <div class="first-step" v-if="guideNum == 1">
    <div class="inner-box">
      <div class="txt">欢迎使用OKR，点击此处，新建OKR，开启OKR使用第一步</div>
      <div class="btn-box">
        <el-button size="mini" type="primary" @click="toStep(2)"
          >下一步指引</el-button
        >
        <el-button size="mini" @click="toStep(0)">我是高手，跳过指引</el-button>
      </div>
    </div>
    <i class="iconfont icon-shoushi"></i>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { setFirstLoginDone } from '@/api/user'
export default {
  computed: {
    ...mapGetters(['guideNum'])
  },
  methods: {
    ...mapActions(['setGuideNum']),
    toStep(num) {
      this.setGuideNum(num)
      this.setFirstLoginDone()
    },
    async setFirstLoginDone() {
      try {
        await setFirstLoginDone()
      } catch (error) {
        this._message(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.first-step {
  position: absolute;
  top: 35px;
  right: 5px;
  z-index: 9999;
  width: 400px;
  .inner-box {
    width: 350px;
    float: left;
    height: 100%;
    border: 1px solid #f1f1f1;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 3px;
    overflow: hidden;
    padding: 20px 15px;
    .txt {
      font-size: 17px;
      color: #666;
      line-height: 24px;
      font-weight: 600;
    }
    .btn-box {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
    }
  }
  .icon-shoushi {
    font-size: 30px;
    margin-left: 10px;
    margin-top: 10px;
    display: inline-block;
    color: #409eff;
    animation: rotatefresh 1.2s infinite linear;
    transition: all 0.2s;
  }
}

@keyframes rotatefresh {
  0% {
    transform: translateY(0px);
  }
  20% {
    transform: translateY(3px);
  }
  40% {
    transform: translateY(6px);
  }
  60% {
    transform: translateY(10px);
  }
  80% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
