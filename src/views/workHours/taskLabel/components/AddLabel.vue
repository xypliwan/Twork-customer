<template>
  <div>
    <el-dialog
      :visible.sync="addLabelDialogVisible"
      :show-close="false"
      title="新建标签"
      width="50%"
    >
      <el-select v-model="value" placeholder="请选择分组名称">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
        type="textarea"
        class="textarea"
        :rows="8"
        placeholder="输入标签，一行一个"
        v-model="textarea"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()">保存标签</el-button>
        <el-button @click="cancle()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: null,
      textarea: ''
    }
  },
  props: {
    addLabelDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  watch: {},
  methods: {
    cancle() {
      this.$emit('cancleLabelDialog')
    },
    save() {
      console.log(this.textarea)
      this.$emit('saveLabelDialog')
    }
  }
}
</script>
<style lang="scss" scoped>
.textarea {
  margin-top: 20px;
}
</style>
