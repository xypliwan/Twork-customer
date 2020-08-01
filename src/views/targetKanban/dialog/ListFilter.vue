<template>
  <div>
    <el-form
      size="small"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="目标标题" prop="target_name">
        <el-input
          v-model="ruleForm.target_name"
          placeholder="模糊查询"
        ></el-input>
      </el-form-item>
      <el-form-item label="目标类型" prop="tt_id">
        <el-select
          filterable
          clearable
          v-model="ruleForm.tt_id"
          placeholder="请选择"
        >
          <el-option
            v-for="item in targetProjectList"
            :key="item.target_type_id"
            :label="item.target_type_name"
            :value="item.target_type_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="周期" prop="period_id_arr">
        <el-select
          filterable
          collapse-tags
          multiple
          clearable
          v-model="ruleForm.period_id_arr"
          placeholder="请选择"
        >
          <el-option
            v-for="item in periodList"
            :key="item.period_id"
            :label="item.period_name"
            :value="item.period_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="责任人" prop="responsible_people">
        <el-select
          filterable
          clearable
          v-model="ruleForm.responsible_people"
          placeholder="请选择"
        >
          <el-option
            v-for="item in userList"
            :key="item.user_id"
            :label="item.username"
            :value="item.user_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门" prop="department_params">
        <el-cascader
          @change="changeCascader"
          filterable
          :options="departmentInfo"
          :show-all-levels="false"
          placeholder="请选择部门"
          v-model="department_params"
          :props="optionsPartment"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="parent_target_id" label="父级目标">
        <el-select
          @change="handleParent"
          v-model="ruleForm.parent_target_id"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入父级目标名称模糊搜索"
          :remote-method="remoteParentTarget"
          :loading="cLoading"
        >
          <el-option
            v-for="item in parentTargetList"
            :label="item.target_name"
            :key="item.target_id"
            :value="item.target_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否关注" prop="focus">
        <el-radio-group v-model="ruleForm.focus">
          <el-radio label="all">全部</el-radio>
          <el-radio label="1">已关注</el-radio>
          <el-radio label="0">未关注</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否归档" prop="place_on_file">
        <el-radio-group v-model="ruleForm.place_on_file">
          <el-radio label="all">全部</el-radio>
          <el-radio label="1">已归档</el-radio>
          <el-radio label="0">未归档</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="与我相关" prop="about_me">
        <el-radio-group v-model="ruleForm.about_me">
          <el-radio label="all">全部</el-radio>
          <el-radio label="1">我创建的</el-radio>
          <el-radio label="2">我负责的</el-radio>
        </el-radio-group>
        <!-- <el-switch v-model="ruleForm.about_me" active-value="1" inactive-value="0"></el-switch>
        <span style="margin-left:10px;">{{ ruleForm.about_me == '1' ? '与我相关' : '与我无关' }}</span>-->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">搜索</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSearchTargetList } from '@/api/targetOkr'
export default {
  props: {
    targetProjectList: Array, //目标类型
    periodList: Array, //周期列表  多选
    userList: Array, //责任人
    departmentInfo: Array //部门
  },
  data() {
    return {
      ruleForm: {
        focus: 'all', //1关注 0未关注  'all'全部
        target_name: '', //目标名
        tt_id: '', //类型id
        period_id_arr: '', //周期id数组
        responsible_people: '', //责任人
        department_id: '', //部门id
        parent_target_id: '', //父目标id
        place_on_file: 'all', //是否归档  归档 1是 0否
        about_me: 'all' //与我相关   我创建的1  我负责的2  全部all
      },
      rules: {},
      optionsPartment: {
        multiple: false,
        value: 'department_id',
        label: 'department_name'
      },
      cLoading: false,
      parentTargetList: [],
      department_params: []
    }
  },
  computed: {},
  watch: {
    'ruleForm.about_me'(newVal) {
      if (newVal == '1') {
        this.ruleForm.responsible_people = ''
      }
    }
  },
  methods: {
    changeCascader() {
      if (this.department_params.length > 0) {
        this.ruleForm.department_id = this.department_params[
          this.department_params.length - 1
        ]
      } else {
        this.ruleForm.department_id = ''
      }
    },
    submitForm() {
      this.$emit('searchFilter', this.ruleForm)
    },
    resetForm() {
      this.department_params = []
      this.ruleForm.department_id = ''
      this.$refs.ruleForm.resetFields()
    },
    handleParent(e) {
      if (!e) {
        this.ruleForm.parent_target_id = '0'
      }
    },
    async remoteParentTarget(query) {
      if (!query) return
      this.cLoading = true
      try {
        let { data } = await getSearchTargetList({ keyword: query })
        this.parentTargetList = data
      } catch (error) {
        this._message(error)
      }
      this.cLoading = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
