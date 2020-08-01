<template>
  <div v-loading="detailLoading" class="write-box">
    <div class="left">
      <report-cont
        :detail="detail"
        @uodateTextAreaKey="uodateTextAreaKey"
        ref="formContRef"
      ></report-cont>
      <div class="sub-box">
        <el-button type="primary" size="small" @click="submit">提交</el-button>
      </div>
    </div>
    <div class="right">
      <fast-list
        :contenType="contenType"
        :timeType="timeType"
        :textAreaKey="textAreaKey"
        @getTitle="getTitle"
      ></fast-list>
      <outher-user :detail="detail"></outher-user>
    </div>
  </div>
</template>
<script>
import { reportDetail, addReportCont } from '@/api/report'
import ReportCont from './components/ReportCont'
import FastList from './components/FastList'
import OutherUser from './components/OutherUser'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'WriteReport',
  data() {
    return {
      detailLoading: false,
      detail: {
        report_id: '',
        report_name: '',
        receive_report_people_name: [], //接收人名
        receive_report_people: [], //接受人id
        receive_report_people_num: null, //接收人数
        check_report_people_name: [], //查阅人名
        check_report_people_num: null, //查阅人数
        check_report_people: [], //查阅人id
        fromat: [] //表单数据
      },
      contenType: [],
      timeType: [],
      textAreaKey: ''
    }
  },
  components: {
    ReportCont,
    FastList,
    OutherUser
  },
  activated() {
    if (this.$route.query.reportid) {
      this.detail.report_id = this.$route.query.reportid
      this.reportDetailFn(this.detail.report_id)
    }
  },
  computed: {
    ...mapGetters(['tabList', 'currentPage'])
  },
  methods: {
    ...mapActions(['deleteTablist']),
    viliData() {
      let arr = []
      this.detail.fromat.forEach(el => {
        if (el.verify) {
          if (el.type == 'num' && el.value == null) {
            arr.push(el.name)
          } else if (el.type == 'textarea' && !el.realValue.length) {
            arr.push(el.name)
          } else if (el.type == 'selects' && !el.value.length) {
            arr.push(el.name)
          } else if (el.type == 'datetime' && !el.value.length) {
            arr.push(el.name)
          } else if (el.type == 'accessory' && !el.value.length) {
            arr.push(el.name)
          }
        }
        if (el.type == 'textarea') {
          if (!el.realValue) {
            el.realValue = ''
          }
        }
      })
      return arr
    },
    submit() {
      let res = this.viliData()
      if (res.length) {
        this._message(`请将以下必填项: ${res.join('、')} 填写完整`, 'warning')
        return
      }
      this.addReportContFn()
    },
    async addReportContFn() {
      this.detailLoading = true
      try {
        let { message } = await addReportCont(this.detail)
        this._message(message, 'success')
        this.backPage()
      } catch (error) {
        this._message(error)
      }
      this.detailLoading = false
    },
    backPage() {
      this.deleteTablist(this.tabList.find(el => el.name == this.currentPage))
      this.$router.push('/report')
    },
    getTitle(title) {
      this.$refs.formContRef.focusSetVal(title)
    },
    uodateTextAreaKey(key) {
      this.textAreaKey = key
    },
    async reportDetailFn(id) {
      this.detailLoading = true
      try {
        let { data } = await reportDetail({ report_id: id })
        Object.assign(this.detail, data)
        this.contenType = this.detail.content_type
        this.timeType = this.detail.time_type
        this.$route.meta.title = data.report_name
      } catch (error) {
        this._message(error)
      }
      this.detailLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.write-box {
  height: 100%;
  display: flex;
  .left {
    flex: 1;
    background: #fff;
    overflow-y: auto;
    min-width: 800px;
    padding: 20px 130px;
    .sub-box {
      text-align: left;
      margin: 20px 0;
    }
  }
  .right {
    overflow-y: auto;
    width: 400px;
    margin-left: 10px;
    background: #fff;
    padding: 20px 10px;
  }
}
</style>
