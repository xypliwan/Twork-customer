<template>
  <div class="process">
    <h4>{{ detailData.base_setting.name }}</h4>
    <div class="contents scrollbar">
      <el-alert
        v-show="detailData.base_setting.desc"
        :title="detailData.base_setting.desc"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <div class="form-box">
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="120px"
          size="small"
          class="ruleForm"
        >
          <div
            class="form-item"
            v-for="item in detailData.form_setting"
            :key="item.key"
          >
            <!-- 表单验证 -->
            <el-form-item
              :label="
                item.type == 'num' && item.unit
                  ? item.name + '(' + item.unit + ')'
                  : item.type == 'des'
                  ? ''
                  : item.name
              "
              :prop="item.key"
              :rules="{
                required: item.verify,
                message: item.placeholder,
                trigger: ['blur', 'change']
              }"
            >
              <el-input
                v-if="['input', 'money'].find(el => el == item.type)"
                v-model.number="ruleForm[item.key]"
                :placeholder="item.placeholder"
                clearable
                @change="changes"
              ></el-input>
              <el-input
                v-if="item.type == 'textarea'"
                type="textarea"
                v-model="ruleForm[item.key]"
                :placeholder="item.placeholder"
                clearable
                @change="changes"
              ></el-input>
              <el-input
                v-if="item.type == 'num'"
                v-model.number="ruleForm[item.key]"
                :placeholder="item.placeholder"
                clearable
                @change="changes"
              ></el-input>
              <el-select
                v-if="item.type == 'select'"
                v-model="ruleForm[item.key]"
                :placeholder="item.placeholder"
                clearable
                @change="changes"
              >
                <el-option
                  v-for="(el, i) in item.options"
                  :key="i"
                  :label="el.label"
                  :value="el.label"
                ></el-option>
              </el-select>
              <el-select
                v-if="item.type == 'selects'"
                v-model="ruleForm[item.key]"
                multiple
                :placeholder="item.placeholder"
                clearable
                @change="changes"
              >
                <el-option
                  v-for="(el, i) in item.options"
                  :key="i"
                  :label="el.label"
                  :value="el.value"
                ></el-option>
              </el-select>
              <el-date-picker
                v-if="item.type == 'datetime'"
                v-model="ruleForm[item.key]"
                type="datetime"
                :format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                :placeholder="item.placeholder"
                @change="changes"
              ></el-date-picker>
              <el-date-picker
                v-if="item.type == 'datetimerange'"
                v-model="ruleForm[item.key]"
                type="datetimerange"
                range-separator="~"
                :start-placeholder="item.placeholder1"
                :end-placeholder="item.placeholder2"
                :format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                :default-time="['00:00:00', '23:59:59']"
                @change="changes"
              ></el-date-picker>
              <div v-if="item.type == 'img'" class="imgs">
                <common-upload
                  type="img"
                  :formKey="item.key"
                  :list="imgsList"
                  desc="请上传处理附件,可上传多个"
                  accept="image/png, image/jpeg, image/jpg, image/x-icon"
                  @deleteFile="deleteImg"
                  @successOk="successImgOk"
                ></common-upload>
              </div>
              <div v-if="item.type == 'accessory'" class="imgs">
                <common-upload
                  :limit="5"
                  :formKey="item.key"
                  :list="flieList"
                  desc="请上传处理附件,最多上传五个"
                  @deleteFile="deleteFile"
                  @successOk="successOk"
                ></common-upload>
              </div>
              <div v-if="item.type == 'relevance'" class="imgs">
                <span class="el-icon-connection"></span>
                <span
                  style="margin-left:10px"
                  class="el-icon-circle-plus-outline blue"
                ></span>
                <span
                  style="margin-left:10px"
                  class="el-icon-remove-outline red"
                ></span>
              </div>
              <div v-if="item.type == 'department'">
                <el-cascader
                  :options="departmentInfo"
                  v-model="ruleForm[item.key]"
                  :props="{
                    multiple: item.radio_multiple == 'multiple',
                    checkStrictly: true,
                    value: 'department_id',
                    label: 'department_name'
                  }"
                  clearable
                  filterable
                  @change="changes"
                ></el-cascader>
              </div>
              <div v-if="item.type == 'richText'">
                <editor-detail
                  id="editDetail"
                  :contentDefault="item.value"
                  ref="editorRef"
                  :placeholder="item.placeholder"
                  @getcode="cont => changeValEditor(item, cont)"
                ></editor-detail>
              </div>
              <el-alert
                :closable="false"
                v-if="item.type == 'des'"
                :title="item.des"
                type="warning"
                show-icon
              >
              </el-alert>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="审批流程">
              <span class="blue">{{
                detailData.advanced_setting
                  .deal_people_auto_duplicate_removal == 1
                  ? '已启用处理人自动去重'
                  : '不启用处理人自动去重'
              }}</span>
              <div class="gray">
                请填完内容，若依然无法匹配节点，请联系管理员设置
              </div>
            </el-form-item>
          </div>
          <!--  eslint-disable  -->
          <el-form-item v-if="isFlag">
            <el-timeline>
              <template v-for="(item, stepNodeDataItem) in stepNodeData">
                <el-timeline-item
                  :timestamp="item.node_name"
                  placement="top"
                  :key="stepNodeDataItem"
                >
                  <div>
                    <span v-show="item.type == 1">
                      <!-- 审批人 -->
                      <el-tag
                        v-if="el"
                        v-for="(el, i) in item.approver_name.split(' ')"
                        :key="i"
                        type="success"
                        size="small"
                        style="margin-bottom: 8px"
                        >{{ el }}</el-tag
                      >
                    </span>
                    <span class="cc_people" v-show="item.type == 2">
                      <!-- 抄送人 -->
                      <el-tag
                        v-if="el"
                        v-for="(el, i) in item.cc_people.user"
                        :key="i"
                        type="success"
                        size="small"
                        >{{ el.username }}</el-tag
                      >
                      <span
                        v-show="item.can_select_cc_people == 1"
                        class="cc_people-icon el-icon-circle-plus-outline pointer theme-color"
                        @click="addCCPeople(item)"
                      ></span>
                    </span>
                  </div>
                  <!-- v-if="item.can_add_check==1" -->
                  <div v-if="item.type == 1">
                    <el-popover
                      placement="right-start"
                      title="添加处理事项"
                      width="400"
                      trigger="click"
                      v-model="item.visible"
                    >
                      <div class="popover-content">
                        <el-input
                          style="width:100%"
                          size="mini"
                          v-model="item.addMatters.check_name"
                          placeholder="请输入事项名"
                          clearable
                        ></el-input>
                        <el-date-picker
                          style="width:100%"
                          v-model="item.addMatters.time"
                          size="mini"
                          type="daterange"
                          range-separator="~"
                          start-placeholder="预计开始日期"
                          end-placeholder="预计结束日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :default-time="['00:00:00', '23:59:59']"
                        ></el-date-picker>
                        <div style="margin-top: 10px;text-align:center;">
                          <el-button
                            size="mini"
                            type="primary"
                            @click="addMatter(item)"
                            >确认</el-button
                          >
                        </div>
                      </div>
                      <el-button
                        slot="reference"
                        type="text"
                        class="el-icon-plus"
                        >快速创建</el-button
                      >
                    </el-popover>
                  </div>
                  <div class="step" v-if="item.type == 1">
                    <div class="li-flex">
                      <span class="matters">处理事项</span>
                      <span class="times">预计开始/结束</span>
                      <span class="del"></span>
                    </div>
                    <ul ref="processMatters" class="approval-process">
                      <li
                        class="li-flex"
                        v-for="(el, i) in item.check"
                        :key="i"
                      >
                        <span class="matters text-hidden">
                          <el-tooltip
                            class="item gray"
                            effect="dark"
                            :content="el.check_name"
                            placement="top"
                          >
                            <span>{{ el.check_name }}</span>
                          </el-tooltip>
                          <!-- 附件 -->
                          <div
                            v-if="el.files && el.files.length > 0"
                            style="margin-bottom:5px;"
                          >
                            <div
                              class="files-item"
                              v-for="(img, j) in el.files"
                              :key="j"
                            >
                              <a :href="img.url" target="_brank">{{
                                img.name
                              }}</a>
                            </div>
                          </div>
                        </span>

                        <span class="times">
                          <el-date-picker
                            style="width:100%"
                            v-model="el.time"
                            size="mini"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始"
                            end-placeholder="结束"
                            format="MM/dd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            @change="timeChange(el)"
                            :default-time="['00:00:00', '23:59:59']"
                          ></el-date-picker>
                        </span>
                        <span class="del">
                          <span
                            class="el-icon-remove-outline red pointer"
                            @click="item.check.splice(i, 1)"
                          ></span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </el-timeline-item>
              </template>
            </el-timeline>
          </el-form-item>
          <!--  eslint-disable  -->
          <el-form-item>
            <el-button
              :disabled="!isFlag"
              type="primary"
              @click="submitForm('ruleForm')"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <select-departments-and-people
      :visible.sync="duVisible"
      :canSelectDepartment="false"
      @updateUser="updateUser"
      :originalData="cc_people"
    ></select-departments-and-people>
  </div>
</template>

<script>
import { processDetail, processFrontendAdd } from '@/api/flowManage'
import { getDepartmentInfo } from '@/api/common'
import { isType } from '@/utils/utils'
import CommonUpload from '@/components/common/CommonUpload'
import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'
import EditorDetail from '_c/common/Editor'
export default {
  props: {
    process_id: [String, Number]
  },
  components: { CommonUpload, SelectDepartmentsAndPeople, EditorDetail },
  name: '',
  data() {
    return {
      visible: false,
      isFlag: false,
      ruleForm: {}, //表单
      addParams: {
        process_id: '',
        list_name: '', //流程名
        fromat: {
          form: {},
          detail: {}
        },
        step: []
      }, //添加流程审批参数
      detailData: {
        base_setting: {},
        form_setting: [],
        step_setting: {},
        advanced_setting: {}
      },
      departmentInfo: [], //部门
      imgsList: [], //{url:'',file_name:''}
      flieList: [], //{url:'',file_name:''}
      stepNodeData: [], //流程步骤数据（处理人，抄送人）
      verifyArr: [], //表单必填字段集合
      duVisible: false,
      cc_people: {
        department: [],
        user: [],
        nameArr: [],
        txt: ''
      }
    }
  },
  watch: {
    process_id(val) {
      if (val) {
        this.ruleForm = {}
        this.$refs.ruleForm.resetFields()
      }
    }
  },
  created() {
    this.getDepartmentInfo()
  },
  mounted() {},
  methods: {
    changeValEditor(item, cont) {
      let formItem = this.detailData.form_setting.find(el => el.key == item.key)
      formItem.value = cont
      this.ruleForm[item.key] = cont
      this.changes()
    },
    //父组件调用详情方法
    async getDetail(id) {
      try {
        let { data } = await processDetail({ process_id: id })
        this.detailData = data
        this.verifyArr = this.detailData.form_setting.filter(el => el.verify)
        //无必填条件情况下直接显示流程,否则走流程条件判断
        if (this.verifyArr.length == 0) {
          this.stepNodeData = []
          this.recursionFun(this.detailData.step_setting)
        } else {
          this.changes()
        }
      } catch (error) {
        this._message(error)
      }
    },
    changes() {
      if (this.verifyArr.length == 0) return
      this.stepNodeData = []
      let isCheck = true //所有必填条件填写完为true,否则false
      this.verifyArr.forEach(el => {
        if (!this.ruleForm[el.key]) isCheck = false
      })
      // console.log(isCheck, this.verifyArr, '22222')
      if (isCheck) {
        this.recursionFun(this.detailData.step_setting)
      }
    },
    //递归处理流程步骤数据
    /* eslint-disable */
    recursionFun(data) {
      if (data.condition_nodes && data.condition_nodes.length > 0) {
        this.isFlag = false
        // priority_level 对多个符合流程条件的，取权重大的流程1》2》3
        let condition_nodes = [] //符合条件的流程
        data.condition_nodes.forEach((el, index) => {
          if (
            el.condition_form_config &&
            el.condition_form_config.length >= 0
          ) {
            // 查找审核流程条件与表单输入的相同的数据
            let arr = el.condition_form_config.filter(v => {
              if (this.ruleForm[v.key]) {
                // v.moneyType=='5' 介于两个金额之间  小于:0  大于:1   小于等于:2  等于:3  大于等于:4 介于两个数之间:5
                if (v.type == 'money') {
                  switch (v.moneyType) {
                    case '0':
                      return parseInt(this.ruleForm[v.key]) < parseInt(v.value)
                      break
                    case '1':
                      return parseInt(this.ruleForm[v.key]) <= parseInt(v.value)
                      break
                    case '2':
                      return parseInt(this.ruleForm[v.key]) > parseInt(v.value)
                      break
                    case '3':
                      return parseInt(this.ruleForm[v.key]) >= parseInt(v.value)
                      break
                    case '4':
                      return parseInt(this.ruleForm[v.key]) == parseInt(v.value)

                      break
                    case '5':
                      if (v.lessMoneyType == 0 && v.moreMoneyType == 0) {
                        return (
                          parseInt(this.ruleForm[v.key]) > v.moreVal &&
                          parseInt(this.ruleForm[v.key]) < v.lessVal
                        )
                      } else if (v.lessMoneyType == 0 && v.moreMoneyType == 1) {
                        return (
                          parseInt(this.ruleForm[v.key]) >= v.moreVal &&
                          parseInt(this.ruleForm[v.key]) < v.lessVal
                        )
                      } else if (v.lessMoneyType == 1 && v.moreMoneyType == 0) {
                        return (
                          parseInt(this.ruleForm[v.key]) > v.moreVal &&
                          parseInt(this.ruleForm[v.key]) <= v.lessVal
                        )
                      } else if (v.lessMoneyType == 1 && v.moreMoneyType == 1) {
                        return (
                          parseInt(this.ruleForm[v.key]) >= v.moreVal &&
                          parseInt(this.ruleForm[v.key]) <= v.lessVal
                        )
                      }
                      break
                  }
                } else if (v.type == 'num') {
                  switch (v.numType) {
                    case '0':
                      return parseInt(this.ruleForm[v.key]) < parseInt(v.value)
                      break
                    case '1':
                      return parseInt(this.ruleForm[v.key]) <= parseInt(v.value)
                      break
                    case '2':
                      return parseInt(this.ruleForm[v.key]) > parseInt(v.value)
                      break
                    case '3':
                      return parseInt(this.ruleForm[v.key]) >= parseInt(v.value)
                      break
                    case '4':
                      return parseInt(this.ruleForm[v.key]) == parseInt(v.value)

                      break
                    case '5':
                      if (v.lessNumType == 0 && v.moreNumType == 0) {
                        return (
                          parseInt(this.ruleForm[v.key]) > v.moreVal &&
                          parseInt(this.ruleForm[v.key]) < v.lessVal
                        )
                      } else if (v.lessNumType == 0 && v.moreNumType == 1) {
                        return (
                          parseInt(this.ruleForm[v.key]) >= v.moreVal &&
                          parseInt(this.ruleForm[v.key]) < v.lessVal
                        )
                      } else if (v.lessNumType == 1 && v.moreNumType == 0) {
                        return (
                          parseInt(this.ruleForm[v.key]) > v.moreVal &&
                          parseInt(this.ruleForm[v.key]) <= v.lessVal
                        )
                      } else if (v.lessNumType == 1 && v.moreNumType == 1) {
                        return (
                          parseInt(this.ruleForm[v.key]) >= v.moreVal &&
                          parseInt(this.ruleForm[v.key]) <= v.lessVal
                        )
                      }
                      break
                  }
                } else if (v.type == 'select') {
                  // 单选框
                  return v.checkVal.find(el => el == this.ruleForm[v.key])
                } else {
                  return this.ruleForm[v.key].toString() == v.value.toString()
                }
              }
            })
            // 所有审核流程条件的值与表单输入的值相匹配时，显示流程
            if (el.condition_form_config.length == arr.length) {
              condition_nodes.push(data.condition_nodes[index])
              this.isFlag = true
            }
          }
        })
        if (condition_nodes.length > 0) {
          // 当多个条件符合时，获取符合条件且权重最高的流程条件分支
          let max_priority_level = Math.min.apply(
            Math,
            condition_nodes.map(item => {
              return parseInt(item.priority_level)
            })
          )
          let target_condition_nodes = condition_nodes.find(
            el => el.priority_level == max_priority_level
          )
          if (
            target_condition_nodes.type == 1 ||
            target_condition_nodes.type == 2
          ) {
            // 收集处理人及抄送人数据
            this.stepNodeData.push(
              JSON.parse(JSON.stringify(target_condition_nodes))
            )
          }
          this.recursionFun(JSON.parse(JSON.stringify(target_condition_nodes)))
        } else {
          this.isFlag = false
          return true
        }
      }
      if (data.child_node) {
        this.isFlag = true
        // 只需要1处理人，2抄送人数据
        if (data.child_node.type == 1) {
          this.$set(data.child_node, 'addMatters', {
            check_name: '',
            time: '',
            files: []
          })
          this.stepNodeData.push(JSON.parse(JSON.stringify(data.child_node)))
        } else if (data.child_node.type == 2) {
          this.stepNodeData.push(JSON.parse(JSON.stringify(data.child_node)))
        }
        this.recursionFun(JSON.parse(JSON.stringify(data.child_node)))
      }
      return true
    },
    // 添加抄送人
    addCCPeople(item) {
      this.duVisible = true
      if (isType(item.cc_people) === 'Object') {
        this.cc_people = item.cc_people
      } else {
        this.cc_people = item.cc_people = this.$options.data().cc_people
      }
    },
    updateUser(obj) {
      Object.assign(this.cc_people, obj)
      this.cc_people.txt = obj.nameArr.join('、')
    },

    /* eslint-disable */
    // 上传图片
    successImgOk(data, formKey) {
      this.imgsList.push(data)
      data.name = data.file_name
      this.ruleForm[formKey] = this.ruleForm[formKey] || []
      this.ruleForm[formKey].push({
        url: data.url,
        name: data.file_name
      })
    },
    // 删除图片
    deleteImg(i, formKey) {
      this.imgsList.splice(i, 1)
      this.ruleform[formKey].splice(i, 1)
    },
    // 上传附件
    successOk(data, formKey) {
      this.flieList.push(data)
      data.name = data.file_name
      this.ruleForm[formKey] = this.ruleForm[formKey] || []
      this.ruleForm[formKey].push({
        url: data.url,
        name: data.file_name
      })
    },
    // 删除附件
    deleteFile(i, formKey) {
      this.flieList.splice(i, 1)
      this.ruleform[formKey].splice(i, 1)
    },
    // 添加事项
    addMatter(item) {
      if (!item.addMatters.check_name || !item.addMatters.time) {
        this._message('请填写完整!', 'warning')
        return
      }
      item.visible = false
      item.addMatters.start_at = item.addMatters.time[0] || ''
      item.addMatters.end_at = item.addMatters.time[1] || ''
      item.check.push(JSON.parse(JSON.stringify(item.addMatters)))
      item.addMatters.check_name = ''
      item.addMatters.time = ''
    },
    // 事项时间改变触发
    timeChange(item) {
      item.start_at = item.time ? item.time[0] : ''
      item.end_at = item.time ? item.time[1] : ''
    },
    // 添加流程审批接口
    async processAdd() {
      // 参数处理
      this.addParams.process_id = this.process_id
      this.addParams.list_name = this.detailData.base_setting.name
      this.addParams.fromat.form = this.ruleForm
      this.addParams.fromat.detail = this.detailData
      let arr = this.stepNodeData.map(el => {
        let user_ids = []
        // el.cc_people最初是数组，后面数据格式变化为对象
        if (isType(el.cc_people) === 'Object') {
          user_ids = el.cc_people.user.map(el => el.user_id)
        } else {
          user_ids = el.cc_people || []
        }
        let obj = {
          step_type: el.type,
          deal_approver: el.deal_approver,
          user_ids: el.type == 1 ? el.approver : user_ids,
          check: el.check
        }
        return obj
      })
      // console.log(this.stepNodeData, arr, 'arr')
      this.addParams.step = arr

      try {
        let { message } = await processFrontendAdd(this.addParams)
        this.$message.success(message)
        this.$emit('closeDarwer', false)
      } catch (error) {
        this._message(error)
      }
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.processAdd()
        } else {
          return false
        }
      })
    },

    //获取部门和人员
    async getDepartmentInfo() {
      try {
        let { data } = await getDepartmentInfo({ 'get-people': 1 })
        let parentArr = JSON.parse(JSON.stringify(data))
        this.departmentInfo = this.formateDepartment(parentArr)
      } catch (error) {
        this._message(error)
      }
    },
    formateDepartment(arr) {
      arr.forEach(el => {
        if (el.children) {
          this.formateDepartment(el.children)
        } else {
          delete el.people
        }
      })
      return arr
    }
  }
}
</script>

<style scoped lang="scss">
.process {
  h4 {
    padding: 15px 10px;
    border-bottom: 1px solid #eee;
  }
  .contents {
    max-height: calc(100vh - 50px);
    padding: 10px;
    .form-box {
      margin-top: 10px;
      padding-top: 10px;
      // border-top: 1px solid #eee;
      .ruleForm {
        padding-right: 30px;
        .cc_people {
          .cc_people-icon {
            margin-left: 10px;
            font-size: 20px;
            font-weight: bold;
          }
        }
      }
      .form-item {
        // width: 50%;
        // min-width: 350px;
        // max-width: 450px;
      }
      .approval-process {
        // max-height: 400px;
        overflow: hidden;
        transition: all 0.5s ease;
        li:hover {
          background: #f1f9eb;
        }
      }
      .li-flex {
        padding: 0px 10px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        .matters {
          flex: 1;
          margin-right: 20px;
          .files-item {
            height: 22px;
            line-height: 22px;
          }
        }
        .times {
          text-align: center;
          width: 140px;
          margin-right: 5px;
        }
        .del {
          width: 50px;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .el-tag + .el-tag {
        margin-right: 10px;
      }
    }
  }
}
.el-popover {
  text-align: left;
}
.popover-content {
  padding: 15px 10px;
  .el-input {
    margin-bottom: 10px;
  }
}
</style>
