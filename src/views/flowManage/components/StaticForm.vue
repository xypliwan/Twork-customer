<template>
  <div>
    <div v-for="(item, i) in list" :key="i" class="p-item">
      <span class="color9" v-if="item.type != 'des'">{{ item.name }}： </span>
      <span
        class="richText"
        v-if="item.type == 'richText'"
        v-html="detailData.fromat.form[item.key]"
      ></span>
      <span
        v-if="!['img', 'accessory', 'richText'].find(el => el == item.type)"
        >{{
          detailData.fromat.form[item.key] | myFilter(item.type, departmentData)
        }}</span
      >
      <span v-if="['img', 'accessory'].find(ele => ele == item.type)">
        <div
          v-for="(v, ii) in detailData.fromat.form[item.key]"
          :key="ii"
          style="margin-bottom:5px;"
        >
          <a :href="v.url" target="_blank">{{ v.name }}</a>
        </div>
      </span>
      <el-alert
        :closable="false"
        v-if="item.type == 'des' && item.show"
        :title="item.des"
        type="warning"
        show-icon
      >
      </el-alert>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: Array,
    detailData: Object,
    departmentData: Array
  }
}
</script>
<style lang="scss" scoped>
.p-item {
  display: flex;
  padding: 6px 0px;
  font-size: 14px;
  color: #666;
}
</style>
