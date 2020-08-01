<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :before-close="close"
      :show-close="false"
      width="700px"
      title="新增人员"
    >
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="ruleForm"
        label-width="80px"
        size="small"
        v-loading="loading"
      >
        <el-form-item label="负责人:" prop="responsible.name_txt">
          <el-input
            type="textarea"
            v-model="ruleForm.responsible.name_txt"
            readonly
            autosize
            @focus="showSelectDom('responsible')"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理员:" prop="administrator.name_txt">
          <el-input
            type="textarea"
            v-model="ruleForm.administrator.name_txt"
            readonly
            autosize
            @focus="showSelectDom('administrator')"
          ></el-input>
        </el-form-item>
        <el-form-item label="组成员:" prop="person.name_txt">
          <el-input
            type="textarea"
            v-model="ruleForm.person.name_txt"
            readonly
            autosize
            @focus="showSelectDom('person')"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="onSubmit('ruleForm')" size="mini"
            >确定添加</el-button
          >
          <el-button @click="close" size="mini">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <select-departments-and-people
      :visible.sync="duVisible"
      @updateUser="updateUser"
      :originalData="selectObj"
      :canSelectDepartment="canSelectDepartment"
      :canSelectUser="canSelectUser"
    ></select-departments-and-people>
  </div>
</template>
<script>
import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'
import { addProjectPeople } from '@/api/workHours'
export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      canSelectDepartment: true,
      canSelectUser: true,
      loading: false,
      ruleForm: {
        responsible: {
          //负责人
          department: [],
          user: [],
          nameArr: [],
          name_txt: ''
        },
        administrator: {
          //管理员
          department: [],
          user: [],
          nameArr: [],
          name_txt: ''
        },
        person: {
          //组成员
          department: [],
          user: [],
          nameArr: [],
          name_txt: ''
        },
        project_id: ''
      },
      rules: {
        'responsible.name_txt': [{ required: true, message: '请选择' }],
        'administrator.name_txt': [{ required: true, message: '请选择' }],
        'person.name_txt': [{ required: true, message: '请选择' }]
      },
      duVisible: false,
      belongWhoComs: '', // responsible负责人 administrator管理员 person组成员
      selectObj: {
        department: [],
        user: []
      }
    }
  },
  components: {
    SelectDepartmentsAndPeople
  },
  watch: {},
  methods: {
    async addTaskPeopleFn() {
      //添加成员
      this.ruleForm.project_id = this.projectId
      this.loading = true
      try {
        let { message } = await addProjectPeople(this.ruleForm)
        this._message(message, 'success')
        this.$emit('editOk')
        this.close()
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    close() {
      this.$emit('update:visible', false)
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addTaskPeopleFn()
        } else {
          return false
        }
      })
    },
    updateUser(obj) {
      console.log(obj)
    },
    showSelectDom(txt) {
      this.belongWhoComs = txt
      if (this.belongWhoComs == 'responsible') {
        //负责人
        this.canSelectDepartment = false
        this.canSelectUser = true
        Object.assign(this.selectObj, this.ruleForm.responsible)
      } else if (this.belongWhoComs == 'administrator') {
        //管理员
        this.canSelectDepartment = false
        this.canSelectUser = true
        Object.assign(this.selectObj, this.ruleForm.administrator)
      } else if (this.belongWhoComs == 'person') {
        //组成员
        this.canSelectDepartment = true
        this.canSelectUser = true
        Object.assign(this.selectObj, this.ruleForm.person)
      }
      this.duVisible = true
    }
  }
}
</script>
