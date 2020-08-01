<template>
  <div>
    <img :src="setGreetings.url" class="greetings-img" />
    <p class="greetings-desc">{{ setGreetings.desc }}</p>
  </div>
</template>

<script>
import { isMorAorN } from '_u/utils'
export default {
  data() {
    return {
      greetings: [
        {
          desc: '上午好,美好的一天，加油哦。',
          url: require('@/assets/images/morning.png')
        },
        {
          desc: '下午好,喝杯茶吧,让精神抖擞起来。',
          url: require('@/assets/images/afternoon.png')
        },
        {
          desc: '晚上好,请注意休息。',
          url: require('@/assets/images/night.png')
        }
      ]
    }
  },
  computed: {
    setGreetings() {
      return this.greetings[isMorAorN()]
    }
  }
}
</script>

<style lang="scss" scoped>
.greetings-img {
  width: 175px;
  margin: 0 auto;
  display: block;
}
.greetings-desc {
  font-size: 13px;
  color: #999;
  text-align: center;
  margin-top: 15px;
  font-weight: 800;
  font-family: cursive;
}
</style>
