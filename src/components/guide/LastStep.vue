<template>
  <div class="last-guide" v-if="guideNum == 7">
    <img class="imgs" src="@/assets/images/kanbanguide.png" alt />
    <el-button class="to-btn" type="primary" @click="toStep"
      >立即开启OKR之旅</el-button
    >
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { setFirstLoginDone } from '@/api/user'
export default {
  data() {
    return {
      imgUrl: require('@/assets/images/kanbanguide.png')
    }
  },
  computed: {
    ...mapGetters(['guideNum'])
  },
  methods: {
    ...mapActions(['setGuideNum']),
    toStep() {
      this.setGuideNum(null)
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
.last-guide {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  .imgs {
    width: 100%;
    height: 100%;
  }
  .to-btn {
    position: absolute;
    bottom: 50px;
    left: 43%;
    z-index: 99;
  }
}
</style>
