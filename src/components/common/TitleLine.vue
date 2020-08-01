<template>
  <div class="line-box">
    <span class="line"></span>
    <span class="title-name">{{ title }}</span>
    <div class="slot-box">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>

<style lang="scss">
.line-box {
  height: 40px;
  padding: 10px 5px;
  display: flex;
  align-items: center;
  background: #fff;
  display: flex;
  .slot-box {
    flex: 1;
  }
  .line {
    float: left;
    display: inline-block;
    width: 5px;
    height: 100%;
    background: $themeColor;
    margin-right: 8px;
  }
  .title-name {
    color: #333;
    font-size: 14px;
    font-weight: 800;
  }
}
</style>
