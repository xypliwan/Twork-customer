<template>
  <el-form
    size="small"
    :inline="true"
    :model="ruleForm"
    class="demo-form-inline"
    ref="ruleForms"
  >
    <el-form-item prop="user_id">
      <el-select v-model="ruleForm.user_id" filterable placeholder="汇报人">
        <el-option
          v-for="item in allUserList"
          :key="item.user_id"
          :label="item.username"
          :value="item.user_id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="report_id">
      <el-select v-model="ruleForm.report_id" filterable placeholder="汇报类型">
        <el-option
          v-for="item in templateList"
          :key="item.user_id"
          :label="item.report_name"
          :value="item.report_id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="time">
      <el-date-picker
        size="mini"
        v-model="ruleForm.time"
        type="date"
        format="yyyy-MM-dd"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        :clearable="true"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button size="mini" type="primary" @click="search">查询</el-button>
      <el-button size="mini" @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    allUserList: Array,
    templateList: Array
  },
  data() {
    return {
      ruleForm: {
        time: '',
        report_id: '', //汇报模板id
        user_id: '' //用户id
      }
    }
  },
  created() {
    let date = new Date()
    let month = date.getMonth() + 1
    let day = date.getDate()
    this.ruleForm.time = `${date.getFullYear()}-${
      month < 10 ? `0${month}` : month
    }-${day < 10 ? `0${day}` : day} `
    this.search()
  },
  methods: {
    search() {
      this.$emit('search', this.ruleForm)
    },
    reset() {
      this.$refs.ruleForms.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped></style>
