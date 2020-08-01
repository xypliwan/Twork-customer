<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="okrFlg == '1' ? '编辑OKR' : '新建OKR'"
      :append-to-body="true"
      top="50px"
      :visible.sync="dialog"
      width="900px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          size="small"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
          v-loading="fromLoading"
        >
          <el-row>
            <el-col :span="11">
              <el-form-item label="周期" prop="period_id">
                <el-select
                  filterable
                  clearable
                  v-model="ruleForm.period_id"
                  placeholder="请选择周期"
                >
                  <el-option
                    v-for="item in periodList"
                    :key="item.period_id"
                    :label="item.period_name"
                    :value="item.period_id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="目标类型" prop="tt_id">
                <el-select
                  filterable
                  clearable
                  v-model="ruleForm.tt_id"
                  placeholder="请选择目标类型"
                >
                  <el-option
                    v-for="item in targetProjectList"
                    :key="item.target_type_id"
                    :label="item.target_type_name"
                    :value="item.target_type_id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="目标" prop="target_name">
                <div style="position: relative;">
                  <el-input
                    v-model="ruleForm.target_name"
                    clearable
                    placeholder="输入目标标题，限制30个字以内。好的目标应该是有时限要求的，简洁直白的陈述，能鼓舞人心的、能激发团队共鸣！"
                  ></el-input>
                  <two-step></two-step>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="责任人" prop="responsible_people">
                <el-select
                  filterable
                  clearable
                  v-model="ruleForm.responsible_people"
                  multiple
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
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="所属部门" prop="department_params">
                <div style="position: relative;">
                  <el-cascader
                    collapse-tags
                    filterable
                    :options="departmentInfo"
                    :show-all-levels="false"
                    placeholder="请选择部门"
                    v-model="ruleForm.department_params"
                    :props="optionsPartment"
                    clearable
                  ></el-cascader>
                  <three-step></three-step>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="可见范围" prop="is_public">
                <div style="position: relative;">
                  <el-radio-group v-model="ruleForm.is_public">
                    <el-radio :label="1">公开所有</el-radio>
                    <el-radio :label="0">指定成员</el-radio>
                  </el-radio-group>
                  <four-step></four-step>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item
                label="指定成员"
                prop="see_people_params"
                v-show="ruleForm.is_public == 0"
              >
                <el-cascader
                  collapse-tags
                  filterable
                  :options="allVisibleUser"
                  placeholder="请选择成员"
                  v-model="ruleForm.see_people_params"
                  :props="optionsUser"
                  :show-all-levels="false"
                  clearable
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="kr" label-width="0">
            <kr-list
              :tableData="ruleForm.kr"
              :okrFlg="okrFlg"
              :userList="userList"
              @insetKrItem="insetKrItem"
              @delKrItem="delKrItem"
            ></kr-list>
          </el-form-item>
          <el-form-item prop="parent_target_id" label="父级目标">
            <div style="position: relative;">
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
                :loading-text="
                  ruleForm.parent_target_id == '' ||
                  ruleForm.parent_target_id == '0'
                    ? '请输入父级目标名称模糊搜索'
                    : '加载中'
                "
              >
                <el-option
                  v-for="item in parentTargetList"
                  :label="item.target_name"
                  :key="item.target_id"
                  :value="item.target_id"
                ></el-option>
              </el-select>
              <fix-step></fix-step>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="sumbitSave"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import KrList from './KrList'
import { mapGetters } from 'vuex'
import TwoStep from '_c/guide/TwoStep'
import ThreeStep from '_c/guide/ThreeStep'
import FourStep from '_c/guide/FourStep'
import FixStep from '_c/guide/FixStep'

import {
  getSearchTargetList,
  addTarget,
  getDetailSimple,
  updateTargetDetail
} from '@/api/targetOkr'
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    departmentInfo: Array, //部门和人员
    periodList: Array, //周期列表
    targetProjectList: Array, //获取目标类型
    userList: Array, //责任人
    allVisibleUser: Array, //所有可见成员
    okrFlg: String, //0  创建   1修改
    targetId: [String, Number]
  },
  data() {
    return {
      ruleForm: {
        target_id: '',
        target_name: '', //目标名
        period_id: '', //周期id
        tt_id: 1, //目标类型id
        parent_target_id: '', //父目标id
        parent_target_name: '', //父级目标名字
        is_public: 1, // 是否公开 1是
        department: [], //部门数组
        responsible_people: [], //责任人数组
        see_people: [], //可见范围人员数组 公开为空
        see_people_params: [], //可见范围人员数组公开为空 前端遍历参数  多维数组
        department_params: [], //部门参数，前端遍历使用   多维数组
        kr: [
          {
            kr_name: '',
            score: null,
            user_id: ''
          }
        ] //kr
      },
      rules: {
        period_id: [{ required: true, message: '请选择', trigger: 'change' }],
        tt_id: [{ required: true, message: '请选择', trigger: 'change' }],
        target_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        department_params: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        responsible_people: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        see_people_params: [
          { required: false, message: '请选择', trigger: 'change' }
        ],
        kr: [{ required: true, message: '至少输入一条KR', trigger: 'change' }]
      },
      optionsPartment: {
        multiple: true,
        value: 'department_id',
        label: 'department_name'
      },
      optionsUser: {
        multiple: true,
        value: 'department_id',
        label: 'department_name'
      },
      cLoading: true,
      parentTargetList: [], //父级目标
      fromLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'guideNum'])
  },
  mounted() {},
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.ruleForm.responsible_people[0] = String(this.userInfo.id)
        // this.ruleForm.kr[0].user_id = String(this.userInfo.id);

        if (this.okrFlg == '0') {
          this.ruleForm.kr = []
          this.ruleForm.kr.push({
            kr_name: '',
            score: null,
            user_id: String(this.userInfo.id)
          })
          //创建
        } else if (this.okrFlg == '1') {
          //编辑
          this.getDetailSimple()
        }
      }
    },
    'ruleForm.target.is_public'(newVal) {
      if (newVal == 1) {
        //公开
        this.rules.see_people_params[0].required = false
        this.ruleForm.see_people = []
        this.ruleForm.see_people_params = []
      } else {
        this.rules.see_people_params[0].required = true
      }
    }
  },
  methods: {
    //获取oke详情
    async getDetailSimple() {
      this.fromLoading = true
      try {
        let { data } = await getDetailSimple({ target_id: this.targetId })
        Object.assign(this.ruleForm, data)
        this.ruleForm.period_id = String(data.period_id)
        this.ruleForm.parent_target_id = String(data.parent_target_id)

        data.department_params.forEach(item => {
          this.ruleForm.department.push(item[item.length - 1])
        })
        data.see_people_params.forEach(item => {
          this.ruleForm.see_people.push(item[item.length - 1])
        })

        if (this.ruleForm.parent_target_id !== '') {
          this.remoteParentTarget(this.ruleForm.parent_target_name)
        }
      } catch (error) {
        this._message(error)
      }
      this.fromLoading = false
    },
    handleParent(e) {
      if (!e) {
        this.ruleForm.parent_target_id = '0'
      }
    },
    async remoteParentTarget(query) {
      if (query == '') {
        this.parentTargetList = []
        return
      }
      this.cLoading = true
      try {
        let { data } = await getSearchTargetList({ keyword: query })
        this.parentTargetList = data
      } catch (error) {
        this._message(error)
      }
      this.cLoading = false
    },
    delKrItem(i) {
      this.ruleForm.kr.splice(i, 1)
    },
    insetKrItem(i) {
      this.ruleForm.kr.splice(i + 1, 0, {
        kr_name: '',
        score: null,
        user_id: String(this.userInfo.id)
      })
    },
    formateInfo() {
      let isWriteOk = true
      this.ruleForm.department = []
      this.ruleForm.see_people = []
      this.ruleForm.department_params.forEach(item => {
        this.ruleForm.department.push(item[item.length - 1])
      })
      this.ruleForm.see_people_params.forEach(item => {
        this.ruleForm.see_people.push(item[item.length - 1])
      })

      for (let i = 0; i < this.ruleForm.kr.length; i++) {
        let itemKr = this.ruleForm.kr[i]
        if (itemKr.kr_name.trim().length <= 0 || itemKr.score == null) {
          this.$message({
            message: '请将KR信息填写完整，至少填写一条',
            type: 'warning'
          })
          isWriteOk = false
          break
        }
      }

      return isWriteOk
    },
    async addTarget() {
      this.fromLoading = true
      try {
        let { data, message } = await addTarget(this.ruleForm)
        this.$emit('createOkrOk', data.target_id)
        this._message(message, 'success')
        this.handleClose()
      } catch (error) {
        this._message(error)
      }
      this.fromLoading = false
    },
    async updateTargetDetail() {
      this.fromLoading = true
      try {
        let { data, message } = await updateTargetDetail(this.ruleForm)
        this.$emit('updateOkrOk', data.target_id)
        this._message(message, 'success')
        this.handleClose()
      } catch (error) {
        this._message(error)
      }
      this.fromLoading = false
    },
    sumbitSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.formateInfo()) {
            if (this.okrFlg == '0') {
              //新建
              this.ruleForm.target_id = ''
              this.addTarget()
            } else if (this.okrFlg == '1') {
              //修改

              this.ruleForm.target_id = this.targetId
              this.updateTargetDetail()
            }
          }
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleClose() {
      this.resetForm()

      this.$emit('update:dialog', false)
    }
  },
  components: {
    KrList,
    TwoStep,
    ThreeStep,
    FourStep,
    FixStep
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding-top: 10px;
}
.dialog-footer {
  margin-top: 0;
}
</style>
