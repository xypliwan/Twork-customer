<template>
  <div class="review-box">
    <el-dialog
      title="复盘"
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
          <el-form-item>
            <el-button plain size="mini" round>kr {{ krInfo.sort }}</el-button>
            <span class="kr-name">{{ krInfo.kr_name }}</span>
            <el-tag class="username" type="success" size="mini">{{
              krInfo.username
            }}</el-tag>
            <span class="process">进度 {{ krInfo.process }} %</span>
          </el-form-item>
          <el-form-item label="总结" prop="kr_summary.summary">
            <el-input
              v-model="ruleForm.kr_summary.summary"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              placeholder="请输入描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="改进" prop="kr_summary.improve">
            <el-input
              v-model="ruleForm.kr_summary.improve"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              placeholder="请输入描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="信心指数">
            <i
              class="iconfont icon-favorite"
              style="color:#f6af42;font-size:18px;"
            ></i>
            {{ ruleForm.kr_summary.now_score }} 分
          </el-form-item>

          <el-form-item label-width="0" prop="reason">
            <el-table
              :data="ruleForm.reason"
              style="width: 100%"
              :row-style="this.$root.tableContentStyle"
              :header-cell-style="this.$root.tableTitileStyle"
              stripe
            >
              <el-table-column label="参与人" prop="ad_name" width="80">
                <template slot-scope="scope">
                  <div>
                    <el-tag type="success" size="mini">{{
                      scope.row.user_name
                    }}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="信心指数" width="120">
                <template slot-scope="scope">
                  <div>
                    <i
                      class="iconfont icon-favorite"
                      style="color:#f6af42;font-size:18px;"
                    ></i>
                    {{ scope.row.score }} 分
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="原因" prop="reason"></el-table-column>

              <el-table-column
                label="操作"
                width="50"
                header-align="center"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <div class="cz-box">
                    <el-link type="primary" @click="delItem(scope.$index)"
                      >删除</el-link
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label-width="0">
            <create-reason
              :userList="userList"
              @createKrView="createKrView"
            ></create-reason>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button size="mini" @click="handleClose">关闭</el-button>
          <el-button size="mini" type="primary" @click="sumbitSave"
            >提交</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CreateReason from '../dialog/CreateReason'
import { saveSummary } from '@/api/targetOkr'
export default {
  props: {
    dialog: Boolean,
    krInfo: Object,
    userList: Array
  },
  data() {
    return {
      ruleForm: {
        kr_summary: {
          kr_id: '', //krId
          summary: '', //总结
          improve: '', //改进
          now_score: 0 //信心指数
        },
        reason: [] //user_id  参与人id   user_name责任人名  score信心指数   reason原因
      },
      rules: {
        'kr_summary.summary': [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        'kr_summary.improve': [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        reason: [
          {
            required: true,
            message: '请您创建信心指数，再进行提交复盘。',
            trigger: 'change'
          }
        ]
      },
      fromLoading: false
    }
  },
  methods: {
    delItem(index) {
      this.ruleForm.reason.splice(index, 1)
      this.getAverageScore()
    },
    createKrView(info) {
      let obj = Object.create(null)
      obj = { ...info }
      this.ruleForm.reason.push(obj)
      this.getAverageScore()
    },
    getAverageScore() {
      //计算平均分
      let snapNum = 0
      this.ruleForm.reason.forEach(ev => {
        snapNum += ev.score
      })
      this.ruleForm.kr_summary.now_score = (
        snapNum / this.ruleForm.reason.length
      ).toFixed(2)
    },
    async saveSummary() {
      this.fromLoading = true
      // console.log(this.krInfo)
      this.ruleForm.kr_summary.kr_id = this.krInfo.kr_id
      // return;
      try {
        let { message } = await saveSummary(this.ruleForm)
        this._message(message, 'success')
        this.$emit('viewOk')
        this.handleClose()
      } catch (error) {
        this._message(error)
      }
      this.fromLoading = false
    },
    sumbitSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.saveSummary()
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
      this.ruleForm.reason = []
      this.$emit('update:dialog', false)
    }
  },
  components: {
    CreateReason
  }
}
</script>

<style lang="scss" scoped>
.kr-name {
  font-size: 14px;
  color: #333;
  margin: 0 15px;
}
.username {
  margin-left: 30px;
}
.process {
  font-size: 14px;
  color: #333;
  margin-left: 15px;
}
</style>
