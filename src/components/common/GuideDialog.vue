<template>
  <div class="guide-dialog" :style="{ 'z-index': zIndex }"></div>
</template>

<script>
export default {
  props: {
    zIndex: Number
  }
}
</script>

<style lang="scss" scoped>
.guide-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($color: #000000, $alpha: 0.2);
}
</style>
