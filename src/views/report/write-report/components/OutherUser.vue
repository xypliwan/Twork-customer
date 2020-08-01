<template>
  <div>
    <title-line title="你的汇报查阅人" class="title-line">
      <span class="people-num">{{ detail.check_report_people_num }}</span>
      人
    </title-line>
    <div class="user-box">
      <el-tag
        size="small"
        class="user-tag"
        v-for="(item, i) in detail.check_report_people_name"
        :key="i"
        >{{ item }}</el-tag
      >
    </div>

    <title-line title="你的固定汇报对象" class="title-line">
      <span class="people-num">{{ detail.receive_report_people_num }}</span
      >人
    </title-line>

    <div class="user-box">
      <el-tag
        size="small"
        class="user-tag"
        v-for="(item, i) in detail.receive_report_people_name"
        :key="i"
        >{{ item }}</el-tag
      >
    </div>
  </div>
</template>
<script>
import TitleLine from '_c/common/TitleLine'
export default {
  props: {
    detail: Object
  },
  components: {
    TitleLine
  }
}
</script>
<style lang="scss" scoped>
.title-line {
  height: 35px;
  font-size: 15px;
  .people-num {
    color: #526ecc;
    margin-left: 20px;
    font-size: 17px;
    font-weight: 600;
  }
}
.user-box {
  margin-top: 15px;
  margin-bottom: 30px;
  max-height: 150px;
  overflow-y: auto;
  .user-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
