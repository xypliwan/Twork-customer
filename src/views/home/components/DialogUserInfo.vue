<template>
  <!-- 添加编辑角色 -->
  <div class="dialog-user-info">
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <div slot="title">
        欢迎使用易协同！
        <span class="theme-color">{{ userInfo.username }} </span>超级管理员
      </div>
      <div class="dialog-user-info-top">
        <ul>
          <li>
            <img class="company-logo" :src="companyInfo.logo_path" alt="Logo" />
            <!-- <logo-upload ref="uploadImg" fileName="upload_file" url="/common/upload" :limit="1" :imgList="imgList" @successOk="successImgOk"></logo-upload> -->
          </li>
          <li>
            <h3 class="theme-color">{{ companyInfo.version_name }}</h3>
            <p>当前套餐类型</p>
            <el-button type="primary" size="mini">更多套餐</el-button>
          </li>
          <li>
            <h3 class="theme-color">{{ companyInfo.use_num }}</h3>
            <p>可设置登录账户</p>
            <el-button type="primary" size="mini">升级人数</el-button>
          </li>
          <li>
            <h3 class="theme-color">{{ companyInfo.active_num }}</h3>
            <p>已设置登录账户</p>
          </li>
        </ul>
      </div>
      <div class="dialog-user-info-content">
        <div class="dialog-user-info-content-item">
          <div class="item-title">
            <span>
              <strong>未激活账户</strong>
            </span>
            <el-input
              class="item-title-input"
              v-model="unactivatedUsername"
              @change="unactivatedSearch"
              @keyup.enter.native="unactivatedSearch"
              size="mini"
              suffix-icon="el-icon-search"
              placeholder="enter键查询名字"
            ></el-input>
          </div>
          <div class="item-table" v-loading="loading">
            <el-table
              ref="unactivatedTable"
              :data="unactivatedFilterData"
              height="300"
              style="width: 100%"
              @selection-change="unactivatedChange"
              :row-key="getRowKeys"
            >
              <el-table-column
                :reserve-selection="true"
                type="selection"
                width="55"
              ></el-table-column>
              <el-table-column prop="username" label="姓名"></el-table-column>
              <el-table-column prop="date" label="部门"></el-table-column>
              <el-table-column prop="address" label="电话"></el-table-column>
            </el-table>
            <div class="item-table-btn">
              <el-button type="primary" size="mini" @click="handleAccount('10')"
                >激活账户</el-button
              >
            </div>
          </div>
        </div>
        <div class="dialog-user-info-content-item">
          <div class="item-title">
            <span>
              <strong>已激活账户</strong>
            </span>
            <el-input
              class="item-title-input"
              v-model="activatedUsername"
              @change="activatedSearch"
              @keyup.enter.native="activatedSearch"
              size="mini"
              placeholder="enter键查询名字"
              suffix-icon="el-icon-search"
            ></el-input>
          </div>
          <div class="item-table" v-loading="loading">
            <el-table
              ref="activatedTable"
              :data="activatedFilterData"
              height="300"
              style="width: 100%"
              @selection-change="activatedChange"
              :row-key="getActivatedRowKeys"
            >
              <el-table-column
                :reserve-selection="true"
                type="selection"
                width="55"
              ></el-table-column>
              <el-table-column prop="username" label="姓名"></el-table-column>
              <el-table-column prop="date" label="部门"></el-table-column>
              <el-table-column prop="address" label="电话"></el-table-column>
            </el-table>
            <div class="item-table-btn">
              <el-button type="primary" size="mini" @click="handleAccount('9')"
                >停用账户</el-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-user-info-footer">
        <el-button size="mini" @click="beforeClose">关 闭</el-button>
        <el-checkbox class="footer-checkbox" v-model="checked"
          >不再提示</el-checkbox
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  companySimpleInfo,
  userList,
  setUserStatus,
  closeUserStatusSet
} from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  name: 'DialogUserInfo',
  props: {
    dialogVisible: Boolean
  },
  data() {
    return {
      loading: false,
      checked: false,
      companyInfo: {},
      imgList: [],
      activatedParams: {
        status: '10', //10已激活
        join_department: ''
      },
      activatedUsername: '',
      activatedData: [], //原始的
      activatedFilterData: [], //过滤后的
      activatedSelected: [],
      unactivatedParams: {
        status: '9', //9 未激活
        join_department: ''
      },
      unactivatedUsername: '',
      unactivatedData: [], //原始
      unactivatedFilterData: [], //过滤后的
      unactivatedSelected: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getcompanySimpleInfo()
        this.getUserList(this.activatedParams)
        this.getUserList(this.unactivatedParams)
      }
    }
  },
  methods: {
    // 获取公司信息
    async getcompanySimpleInfo() {
      try {
        let { data } = await companySimpleInfo()
        this.companyInfo = data
      } catch (error) {
        this._message(error)
      }
    },
    unactivatedSearch() {
      this.unactivatedFilterData = this.unactivatedData.filter(el =>
        el.username
          .toLowerCase()
          .includes(this.unactivatedUsername.toLowerCase())
      )
    },
    activatedSearch() {
      this.activatedFilterData = this.activatedData.filter(el =>
        el.username.toLowerCase().includes(this.activatedUsername.toLowerCase())
      )
    },
    // 数组去重
    uniqObjInArray(objarray) {
      let len = objarray.length
      let tempJson = {}
      let res = []
      for (let i = 0; i < len; i++) {
        //取出每一个对象
        tempJson[JSON.stringify(objarray[i])] = true
      }
      let keyItems = Object.keys(tempJson)
      for (let j = 0; j < keyItems.length; j++) {
        res.push(JSON.parse(keyItems[j]))
      }
      return res
    },
    async getUserList(params) {
      this.loading = true
      try {
        let { data } = await userList(params)
        if (params.status == 9)
          this.unactivatedFilterData = this.unactivatedData = this.uniqObjInArray(
            data
          )

        if (params.status == 10)
          this.activatedFilterData = this.activatedData = this.uniqObjInArray(
            data
          )
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    // 停用或激活
    async handleAccount(status) {
      let params = {
        status,
        user_id:
          status == 9
            ? this.activatedSelected
            : status == 10
            ? this.unactivatedSelected
            : []
      }
      if (params.user_id.length == 0) {
        this.$message.warning('请选择账户')
        return
      }
      try {
        let { message } = await setUserStatus(params)
        this.activatedParams = Object.assign(
          this.activatedParams,
          this.$options.data().activatedParams
        )
        this.unactivatedParams = Object.assign(
          this.unactivatedParams,
          this.$options.data().unactivatedParams
        )
        this.getUserList(this.activatedParams)
        this.getUserList(this.unactivatedParams)
        this.$message.success(message)
      } catch (error) {
        this._message(error)
      }
    },
    unactivatedChange(val) {
      this.unactivatedSelected = val.map(el => el.user_id)
    },
    getRowKeys(row) {
      return row.user_id
    },
    activatedChange(val) {
      this.activatedSelected = val.map(el => el.user_id)
    },
    getActivatedRowKeys(row) {
      return row.user_id
    },
    // 上传图片
    successImgOk(imgs) {
      this.imgsList = imgs
    },
    async closeDialog() {
      try {
        await closeUserStatusSet()
      } catch (error) {
        this._message(error)
      }
    },
    beforeClose() {
      if (this.checked) {
        this.closeDialog()
      }
      this.activatedParams = Object.assign(
        this.activatedParams,
        this.$options.data().activatedParams
      )
      this.unactivatedParams = Object.assign(
        this.unactivatedParams,
        this.$options.data().unactivatedParams
      )
      this.$refs.unactivatedTable.clearSelection()
      this.$refs.activatedTable.clearSelection()
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-user-info {
  .dialog-user-info-top {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #eee;
    ul {
      display: flex;
      justify-content: center;
      li {
        flex: 1;
        line-height: 24px;
        text-align: center;
        .company-logo {
          width: 100%;
        }
      }
      li + li {
        border-left: 1px solid #eee;
      }
    }
  }
  .dialog-user-info-content {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    height: 400px;
    .dialog-user-info-content-item {
      width: 48%;
      .item-table {
        border: 1px solid #eee;
        .item-table-btn {
          margin: 10px;
        }
      }
    }
    .item-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      span {
        flex: 1;
        padding-left: 5px;
        border-left: 3px solid #526ecc;
      }
      .item-title-input {
        width: 200px;
      }
    }
  }
  .dialog-user-info-footer {
    margin-top: 20px;
    text-align: center;
    position: relative;
    .footer-checkbox {
      position: absolute;
      right: 0;
      top: 5px;
    }
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #eee;
    font-weight: bold;
    padding: 20px;
  }
  ::v-deep .el-dialog__body {
    padding: 20px;
  }
}
</style>
