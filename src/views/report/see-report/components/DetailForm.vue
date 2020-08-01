<template>
  <div class="form-wrapper">
    <div class="form-item" v-for="item in list" :key="item.key">
      <div class="form-title">
        {{ item.name }}
      </div>
      <!--  数字输入框 -->
      <div class="conts" v-if="item.type == 'num'">
        {{ item.value }}
      </div>

      <!-- 多行输入框 -->
      <div class="conts" v-if="item.type == 'textarea'">
        <div
          class="textarea-item"
          :key="j"
          v-for="(txt, j) in item.realValue.split(/[\n,]/g)"
        >
          {{ txt }}
        </div>
      </div>

      <!-- 多选框 6 -->
      <div class="conts" v-if="item.type == 'selects'">
        {{ item.value.join('、') }}
      </div>

      <!-- 日期 7-->
      <div class="conts" v-if="item.type == 'datetime'">
        {{ item.value }}
      </div>

      <!-- 附件 -->
      <div class="conts files-cont" v-if="item.type == 'accessory'">
        <div v-for="(file, j) in item.value" :key="j" class="files-item">
          <a :href="file.url" target="_blank">{{ file.file_name }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: Array
  }
}
</script>
<style lang="scss" scoped>
.form-wrapper {
  padding: 20px 0;
  border-bottom: 1px solid #f1f1f1;
  margin-bottom: 20px;
  .form-item {
    margin-bottom: 30px;
    .form-title {
      font-size: 14px;
      color: #222;
      margin-bottom: 10px;
      font-weight: 800;
    }
    .conts {
      font-size: 15px;
      color: #666;
      .textarea-item {
        padding: 3px 0;
        color: #666;
      }
      .files-item {
        margin-bottom: 5px;
        color: #888;
      }
    }
  }
}
</style>
