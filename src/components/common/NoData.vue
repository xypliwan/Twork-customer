<template>
  <div class="no-data">
    <img src="./../../assets/images/nodata.png" alt />
    <p class="desc">{{ desc }}</p>
  </div>
</template>

<script>
export default {
  props: {
    desc: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style lang="scss" scoped>
.no-data {
  text-align: center;
  margin: 50px 0;
  img {
    width: 100px;
  }
  .desc {
    font-size: 13px;
    margin-top: 15px;
    color: #b5a8a8;
  }
}
</style>
