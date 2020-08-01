<template>
  <el-dialog
    title="动态设置"
    :append-to-body="true"
    :visible.sync="dynamicDialog"
    width="1000px"
    :before-close="handleClose"
  >
    <div>
      <title-line title="业务订阅设置"></title-line>

      <div class="dynamic-box">
        <div class="left-status">
          <el-switch
            @change="updateDynamicSet"
            v-model="params.okr"
            :active-value="1"
            :inactive-value="0"
            active-color="#526ecc"
            inactive-color="#dcdfe6"
          ></el-switch>
        </div>
        <div class="left-txt">{{ params.okr == 1 ? '已开启' : '已关闭' }}</div>
        <div class="cont">
          <div class="cont-title">OKR业务动态订阅</div>
          <div class="cont-text">
            包含OKR建立后通知相关责任人、任务责任人通知、任务评论通知、任务超期提醒、复盘更新通知、评分通知等。
          </div>
        </div>
      </div>
      <div class="dynamic-box">
        <div class="left-status">
          <el-switch
            @change="updateDynamicSet"
            v-model="params.process"
            :active-value="1"
            :inactive-value="0"
            active-color="#526ecc"
            inactive-color="#dcdfe6"
          ></el-switch>
        </div>
        <div class="left-txt">
          {{ params.process == 1 ? '已开启' : '已关闭' }}
        </div>
        <div class="cont">
          <div class="cont-title">流程业务动态订阅</div>
          <div class="cont-text">
            包含需要你进行处理的、处理完成通知你的、催你进行处理的、转交你处理的、评论你的、回复你的、评论发表、超期提醒等。
          </div>
        </div>
      </div>
      <div class="dynamic-box">
        <div class="left-status">
          <el-switch
            @change="updateDynamicSet"
            v-model="params.schedule"
            :active-value="1"
            :inactive-value="0"
            active-color="#526ecc"
            inactive-color="#dcdfe6"
          ></el-switch>
        </div>
        <div class="left-txt">
          {{ params.schedule == 1 ? '已开启' : '已关闭' }}
        </div>
        <div class="cont">
          <div class="cont-title">日程动态订阅</div>
          <!-- <div class="cont-text">包含需要你进行处理的、处理完成通知你的、催你进行处理的、转交你处理的、评论你的、回复你的、评论发表、超期提醒等。</div> -->
        </div>
      </div>
      <div class="dynamic-box">
        <div class="left-status">
          <el-switch
            @change="updateDynamicSet"
            v-model="params.report"
            :active-value="1"
            :inactive-value="0"
            active-color="#526ecc"
            inactive-color="#dcdfe6"
          ></el-switch>
        </div>
        <div class="left-txt">
          {{ params.report == 1 ? '已开启' : '已关闭' }}
        </div>
        <div class="cont">
          <div class="cont-title">汇报业务动态订阅</div>
          <div class="cont-text">
            包含日常汇报提醒、汇报记录查看提醒、汇报总结推送等。
          </div>
        </div>
      </div>
      <!-- <div class="dynamic-box">
        <div class="left-status">
          <el-switch @change="updateDynamicSet" v-model="params.ec_erp" :active-value="1" :inactive-value="0" active-color="#526ecc" inactive-color="#dcdfe6"></el-switch>
        </div>
        <div class="left-txt">{{params.ec_erp == 1 ? '已开启' : '已关闭'}}</div>
        <div class="cont">
          <div class="cont-title">易仓ERP动态订阅</div>
          <div class="cont-text">包含ERP产品、采购、仓库、销售日常报告推送。</div>
        </div>
      </div>-->
    </div>
  </el-dialog>
</template>

<script>
import TitleLine from '_c/common/TitleLine'
import { getDynamicSet, updateDynamicSet } from '@/api/dynamic'
export default {
  props: {
    dynamicDialog: Boolean
  },
  data() {
    return {
      params: {
        user_id: '',
        voice: 0, //提示声音 1有
        input: 0, //弹框提醒 1有
        okr: 0, //okr业务动态 1有
        process: 0, //流程动态 1有
        schedule: 0, //日常动态 1有
        report: 0, //汇报 1有
        ec_erp: 0, //易仓erp动态订阅 1有
        company_id: null,
        company_code: '',
        created_at: null,
        updated_at: null
      },
      setLoading: false
    }
  },
  created() {
    this.getDynamicSet()
  },
  methods: {
    async updateDynamicSet() {
      try {
        await updateDynamicSet(this.params)
      } catch (error) {
        this._message(error)
      }
    },
    async getDynamicSet() {
      this.setLoading = true
      try {
        let { data } = await getDynamicSet()
        Object.assign(this.params, data)
      } catch (error) {
        this._message(error)
      }
      this.setLoading = false
    },
    handleClose() {
      this.$emit('update:dynamicDialog', false)
    }
  },
  components: {
    TitleLine
  }
}
</script>

<style lang="scss" scoped>
.dynamic-box {
  margin-bottom: 15px;
  margin-top: 10px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  .left-status {
    width: 70px;
  }
  .left-txt {
    width: 70px;
  }
  .cont {
    flex: 1;
    font-size: 1px;
    color: #333;
    font-size: 15px;
    line-height: 22px;
    .cont-text {
      font-size: 14px;
      color: #888;
    }
  }
}
</style>
