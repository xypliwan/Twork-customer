<template>
  <div class="create-box">
    <div class="create-header">
      <span class="header-txt">{{
        ruleForm.project_id ? '编辑项目' : '新建项目'
      }}</span>
      <!-- <el-button
        size="mini"
        type="primary"
        class="create-task"
        plain
        @click="toCreateTaskPage"
        >新建任务</el-button -->
      >
    </div>
    <div class="create-form" v-loading="formLoading">
      <el-form
        size="small"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="项目名称" prop="project_name">
          <el-input
            v-model="ruleForm.project_name"
            placeholder="请输入项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目编号" prop="project_num">
          <el-input
            v-model="ruleForm.project_num"
            placeholder="请输入项目编号，最多20字"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目图标" prop="icon">
          <i
            class="iconfont project-icon"
            v-for="(item, i) in projectIcon"
            :key="i"
            :class="item.icon"
            :style="{
              border: ruleForm.icon == item.icon ? '1px solid #ccc' : '',
              color:
                ruleForm.icon == item.icon && ruleForm.color
                  ? ruleForm.color
                  : ''
            }"
            @click="ruleForm.icon = item.icon"
          ></i>
        </el-form-item>
        <el-form-item label="图标颜色">
          <el-color-picker v-model="ruleForm.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="公开范围" prop="is_public">
          <el-select v-model="ruleForm.is_public" placeholder="请选择活动区域">
            <el-option label="私密项目(仅项目内成员可见)" value="0"></el-option>
            <el-option label="公开项目(全员可见)" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目时间" prop="rangTime">
          <el-date-picker
            v-model="ruleForm.rangTime"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目描述" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
          <!-- <div class="appendix">
            <common-upload
              formKey="file"
              :list="flieList"
              desc=""
              changeUploadBt="creatProject"
              @deleteFile="deleteFile"
              @successOk="successOk"
            ></common-upload>
          </div> -->
        </el-form-item>
        <el-form-item label="项目负责人" prop="responsible.name_txt">
          <el-input
            type="textarea"
            readonly
            autosize
            placeholder="请选择"
            v-model="ruleForm.responsible.name_txt"
            @focus="showSelectDom('responsible')"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="项目管理员" prop="administrator.name_txt">
          <el-input
            type="textarea"
            readonly
            autosize
            placeholder="请选择"
            v-model="ruleForm.administrator.name_txt"
            @focus="showSelectDom('administrator')"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="项目角色组" prop="role">
          <el-select
            v-model="ruleForm.role"
            placeholder="请选择"
            filterable
            multiple
          >
            <el-option
              v-for="item in roleList"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目组成员" prop="person.name_txt">
          <el-input
            type="textarea"
            readonly
            autosize
            placeholder="请选择"
            v-model="ruleForm.person.name_txt"
            @focus="showSelectDom('person')"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="backPage">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>

    <select-departments-and-people
      :visible.sync="duVisible"
      :canSelectDepartment="canSelectDepartment"
      :canSelectUser="canSelectUser"
      @updateUser="updateUser"
      :originalData="selectObj"
    ></select-departments-and-people>
  </div>
</template>
<script>
import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'
import CommonUpload from '_c/common/CommonUpload'
import { mapGetters, mapActions } from 'vuex'
import {
  addProject,
  getProjectDetail,
  updateProjectDetail,
  getUserRole
} from '@/api/workHours'
export default {
  name: 'CreateProject',
  data() {
    return {
      canSelectDepartment: true,
      canSelectUser: true,
      formLoading: false,
      roleList: [],
      ruleForm: {
        project_id: '',
        project_name: '', //项目名称
        project_num: '', //项目编号
        icon: 'icon-guanli', //项目图标
        color: '#2c3e50', //颜色
        is_public: '0', //是否公开 1是
        start_at: '', //开始时间
        end_at: '', //结束时间
        desc: '', //项目描述
        file: [],
        role: [],
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
        rangTime: []
      },
      rules: {
        project_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        project_num: [{ required: false, message: '请输入', trigger: 'blur' }],
        is_public: [{ required: true, message: '请选择', trigger: 'change' }],
        icon: [{ required: true, message: '请选择', trigger: 'change' }],
        rangTime: [{ required: false, message: '请选择', trigger: 'change' }],
        desc: [{ required: false, message: '请输入', trigger: 'blur' }],
        role: [{ required: true, message: '请选择', trigger: 'change' }],
        'responsible.name_txt': [{ required: true, message: '请选择' }],
        'administrator.name_txt': [{ required: false, message: '请选择' }],
        'person.name_txt': [{ required: false, message: '请选择' }]
      },
      duVisible: false,
      belongWhoComs: '', // responsible负责人 administrator管理员 person组成员
      selectObj: {
        department: [],
        user: []
      },
      flieList: []
    }
  },
  watch: {
    duVisible(newVal) {
      if (!newVal) {
        this.selectObj.department = []
        this.selectObj.user = []
      }
    }
  },
  activated() {
    const id = this.$route.query.id
    if (id == 'null') {
      this.ruleForm.project_id = ''
      this.resetForm()
    } else if (Number(id)) {
      this.ruleForm.project_id = id
      this.getProjectDetailFn()
    }
  },
  created() {
    this.getUserRole()
  },
  computed: {
    ...mapGetters(['projectIcon', 'tabList', 'currentPage'])
  },
  methods: {
    ...mapActions(['deleteTablist']),
    async updateProjectDetailFn() {
      this.formLoading = true
      try {
        let { message } = await updateProjectDetail(this.ruleForm)
        this._message(message, 'success')
        this.backPage()
      } catch (error) {
        this._message(error)
      }
      this.formLoading = false
    },
    async getProjectDetailFn() {
      this.formLoading = true
      try {
        let { data } = await getProjectDetail({
          project_id: this.ruleForm.project_id
        })
        let role = []
        data.role.map(value => {
          role.push(parseInt(value))
        })
        data.role = role
        Object.assign(this.ruleForm, data)
        this.ruleForm.rangTime.push(this.ruleForm.start_at)
        this.ruleForm.rangTime.push(this.ruleForm.end_at)
      } catch (error) {
        this._message(error)
      }
      this.formLoading = false
    },
    async addProjectFn() {
      this.formLoading = true
      try {
        let { message } = await addProject(this.ruleForm)
        this._message(message, 'success')
        this.backPage()
      } catch (error) {
        this._message(error)
      }
      this.formLoading = false
    },
    async getUserRole() {
      try {
        let { data } = await getUserRole()
        this.roleList = data
      } catch (error) {
        this._message(error)
      }
    },
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.ruleForm.project_id
            ? this.updateProjectDetailFn()
            : this.addProjectFn()
        } else {
          return false
        }
      })
    },
    backPage() {
      this.deleteTablist(this.tabList.find(el => el.name == this.currentPage))
      this.$router.push({
        name: 'WorkHours'
      })
    },
    handleTime(e) {
      if (!e) {
        this.ruleForm.start_at = ''
        this.ruleForm.end_at = ''
      } else {
        this.ruleForm.start_at = e[0]
        this.ruleForm.end_at = e[1]
      }
    },
    updateUser(obj) {
      if (this.belongWhoComs == 'responsible') {
        //负责人
        Object.assign(this.ruleForm.responsible, obj)
        this.ruleForm.responsible.name_txt = obj.nameArr.join('、')
      } else if (this.belongWhoComs == 'administrator') {
        //管理员
        Object.assign(this.ruleForm.administrator, obj)
        this.ruleForm.administrator.name_txt = obj.nameArr.join('、')
      } else if (this.belongWhoComs == 'person') {
        //组成员
        Object.assign(this.ruleForm.person, obj)
        this.ruleForm.person.name_txt = obj.nameArr.join('、')
      }
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
    },
    toCreateTaskPage() {
      this.$router.push('/create-task')
    },
    resetForm() {
      Object.assign(this.ruleForm, this.$options.data().ruleForm)
      this.$refs.ruleForm.resetFields()
    },
    // 上传附件
    successOk(data, formKey) {
      this.flieList.push(data)
      this.ruleForm[formKey].push({
        url: data.url,
        file_name: data.file_name
      })
    },
    // 删除附件
    deleteFile(i, formKey) {
      this.flieList.splice(i, 1)
      this.ruleForm[formKey].splice(i, 1)
    }
  },
  components: {
    SelectDepartmentsAndPeople,
    // eslint-disable-next-line vue/no-unused-components
    CommonUpload
  }
}
</script>
<style lang="scss" scoped>
.create-box {
  background: #fff;
  height: 100%;
  .create-header {
    text-align: center;
    padding: 10px 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #f1f1f1;
    overflow: hidden;
    .header-txt {
      font-size: 16px;
      color: #333;
      font-weight: 600;
    }
    .create-task {
      float: right;
    }
  }
  .create-form {
    width: 600px;
    margin: 0 auto;
    ::v-deep .el-date-editor {
      width: 100%;
    }
    .appendix {
      border: 1px solid #e8e8e8;
      border-top: none;
      padding: 0 10px;
      display: flex;
      .info {
      }
    }
    .project-icon {
      font-size: 30px;
      margin-right: 10px;
      cursor: pointer;
      display: inline-block;
      padding: 5px;
      border: 1px solid #fff;
      border-radius: 3px;
    }
  }
}
</style>
