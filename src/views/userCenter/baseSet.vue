<template>
  <div class="company-info">
    <div class="title-info">
      <!-- 这是测试的注释 -->
      <span class="title">基本信息</span>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="110px"
      size="small"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="登录账号" prop="username">
            <el-input v-model="ruleForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="所在部门/岗位" prop="departmetn">
            <el-input v-model="ruleForm.departmetn" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱账号" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
            <!-- <el-select style="width: 100%" v-model="ruleForm.contacts_user_id" placeholder="请选择">
              <el-option v-for="(item,index) in userData" :key="index" :label="item.username" :value="item.user_id"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="姓名" prop="name_alies">
            <el-input v-model="ruleForm.name_alies"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
              <el-radio label="">未知</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="addres">
            <el-cascader
              change-on-select
              filterable
              clearable
              v-model="addressValue"
              :options="addressOptions"
              :props="addressProps"
              @change="handleChange"
            ></el-cascader>

            <el-input
              style="margin-top:10px"
              type="textarea"
              v-model="ruleForm.address"
              placeholder="街道地址"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="头像上传" prop="head_img">
            <img
              width="100px"
              :src="ruleForm.head_img"
              v-if="ruleForm.head_img.length"
            />
            <upload
              @upload="upload"
              accept="image/png, image/jpeg, image/jpg, image/x-icon"
            >
              <el-link type="primary">上传头像</el-link>
            </upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { infoDetail, updateDetail } from '@/api/user'
import areaData from '@/assets/js/areas'
import Upload from '_c/common/Upload'

export default {
  name: 'CompanyInfo',
  components: { Upload },
  data() {
    return {
      addressValue: [],
      addressOptions: areaData || [],
      addressProps: {
        value: 'name',
        label: 'name',
        children: 'children'
      },
      userData: [], //用户信息
      ruleForm: {
        username: '',
        departmetn: '',
        email: '', //
        phone: '', //
        name_alies: '', //姓名
        head_img: '', //
        sex: '', //
        address: '', //
        country: '', //
        province: '', //
        city: '',
        area: ''
      },
      rules: {
        // company_name: [{ required: true, message: '请填写企业全称', trigger: 'blur' }],
        // company_abbreviation: [{ required: true, message: '请填写企业简称', trigger: 'blur' }],
        // contacts_user_name: [{ required: true, message: '请填写企业联系人', trigger: 'change' }],
        // telephone: [{ required: true, message: '请填写企业联系电话', trigger: 'blur' }],
        // email: [{ required: true, message: '请填写企业邮箱', trigger: 'blur' }],
        // logo_path: [{ required: true, message: '请上传企业LOGO', trigger: 'change' }],
        // addres: [{ required: true, message: '请填写地址', trigger: 'blur' }]
      }
    }
  },
  watch: {},
  created() {
    this.getUserInfo()
  },
  methods: {
    upload(data) {
      this.ruleForm.head_img = data.url
    },
    async getUserInfo() {
      try {
        let { data } = await infoDetail()
        this.assignVal(data)
        this.addressValue = [data.country, data.province, data.city, data.area]
      } catch (error) {
        this._message(error)
      }
    },
    handleChange(value) {
      if (value.length > 0) {
        this.ruleForm.country = value[0]
        this.ruleForm.province = value[1]
        this.ruleForm.city = value[2]
        this.ruleForm.area = value[3]
      } else {
        this.ruleForm.country = ''
        this.ruleForm.province = ''
        this.ruleForm.city = ''
        this.ruleForm.area = ''
      }
      //   this.$emit('selectChange', this.addressValue);
    },
    // 赋值
    assignVal(val) {
      if (Object.keys(val).length > 0) {
        Object.keys(this.ruleForm).forEach(key => {
          this.ruleForm[key] = val[key]
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateDetail(this.ruleForm).then(res => {
            if (res.code == 200 && res.error == 0) {
              this.$message.success('编辑成功')
              this.getUserInfo()
            } else {
              this._message(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.company-info {
  padding: 10px;
  .title-info {
    margin-bottom: 20px;
    .title {
      font-weight: bold;
      color: #444;
      padding-left: 10px;
      border-left: 3px solid #72b2ff;
    }
  }
}
</style>
