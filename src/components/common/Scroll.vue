<template>
  <div class="wrapper-scroll" @scroll="onScroll" ref="wrapper">
    <div class="inner-wrapper" ref="innerWrapper">
      <slot name="dataList" v-if="direction"></slot>
      <div class="loading-box" :class="isLoadings ? 'loading-box-active' : ''">
        <img src="@/assets/images/loading.gif" alt />
      </div>
      <div
        class="text-desc"
        :class="!isLoadings && hasMore ? 'no-data-active' : ''"
      >
        暂无更多数据
      </div>
      <slot name="downDataList" v-if="!direction" ref="downRref"></slot>
    </div>
  </div>
</template>

<script>
// 调用时，该最近的一层父级div一定要指定高度，否则无法滚动！！！
export default {
  props: {
    hasMore: Boolean,
    isLoadings: Boolean,
    direction: {
      //滚动加载方向   true往下滚   false往上滚
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      innerLoading: false
    }
  },

  watch: {
    innerLoading(newVal) {
      if (newVal) {
        if (!this.hasMore) {
          if (this.direction) {
            this.$emit('loadingData')
          } else {
            let innerHeightDown = this.$refs.innerWrapper.lastChild.clientHeight //可滚动的div高度
            this.$emit('loadingData', innerHeightDown)
          }
        }
      }
    }
  },
  methods: {
    toScrollTop() {
      this.$refs.wrapper.scrollTop = 0
    },
    //oldHeight上一次的高度
    resetHeight(oldHeight) {
      //每次重新加载，重新设置滚动条的位置
      //滚动条位置 = 新加入后的数据生成的总div高度 - 加入前的高度
      let innerHeightDown = this.$refs.innerWrapper.lastChild.clientHeight //可滚动的div高度
      let newHeight = innerHeightDown - oldHeight //新加入的div的高度
      this.$refs.wrapper.scrollTop = newHeight
    },
    onScroll() {
      if (this.direction) {
        //往下滚
        //固定高度的dom
        let outerHeight = this.$refs.wrapper.clientHeight
        //装内容的dom
        let innerHeight = this.$refs.innerWrapper.firstChild.clientHeight
        //可滚动容器超出当前窗口显示范围的高度
        let domScrollTop = this.$refs.wrapper.scrollTop
        this.innerLoading = outerHeight + domScrollTop >= innerHeight - 30
      } else {
        //往上滚
        if (this.$refs['wrapper']) {
          let domScrollTopDown = this.$refs.wrapper.scrollTop //滚动条距离上面的距离
          this.innerLoading = domScrollTopDown <= 30
        }
      }
    },
    setScrollTop() {
      //初始化时的距离顶部的高度
      // this.$nextTick(() => {

      this.$refs.wrapper.scrollTop = this.$refs.wrapper.scrollHeight

      // this.$refs.wrapper.scrollTop = this.$refs.innerWrapper.clientHeight;

      // this.$refs.wrapper.scrollTop = this.$refs.wrapper.scrollHeight;
      // console.log(this.$refs.wrapper.scrollTop,'scrollTop')
      // });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.wrapper-scroll {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  @include scrollBar;

  .inner-wrapper {
    width: 100%;
    .loading-box {
      text-align: center;
      opacity: 0;
      height: 27px;
      img {
        width: 25px;
      }
      &.loading-box-active {
        opacity: 1;
      }
    }
    .text-desc {
      text-align: center;
      font-size: 12px;
      color: #888;
      opacity: 0;
      height: 20px;
      line-height: 20px;
      &.no-data-active {
        opacity: 1;
      }
    }
  }
}
</style>
