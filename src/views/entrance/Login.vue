<template>
  <div class="account-login">
    <div class="login-container">
      <div class="container-top">
        <div class="flex">
          <img src="../../assets/images/new_logo.png" alt />
          <span>Twork协同</span>
        </div>
        <!-- <p>提高跨部门协同办公效率，规范不同岗位管理和考核</p> -->
      </div>
      <div class="container-section">
        <div class="title-box">
          <span
            :class="{ 'title-active': titleIndex === 0 }"
            @click="titleIndex = 0"
            >扫码登录</span
          >
          <span
            :class="{ 'title-active': titleIndex === 1 }"
            @click="titleIndex = 1"
            >账号登录</span
          >
        </div>
        <div class="login">
          <el-form
            v-show="titleIndex === 1"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
          >
            <el-form-item prop="username">
              <el-input
                v-model="ruleForm.username"
                autocomplete="off"
                clearable
                placeholder="请输入您的注册账号"
                @keyup.enter.native="submitForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="ruleForm.password"
                autocomplete="off"
                clearable
                placeholder="请输入您的密码"
                @keyup.enter.native="submitForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-form-item prop="company_code">
              <el-input
                v-model="ruleForm.company_code"
                clearable
                placeholder="请输入企业编码"
                @keyup.enter.native="submitForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                v-loading="loginLoading"
                type="primary"
                style="width:100%"
                @click="submitForm('ruleForm')"
                >登&nbsp;录</el-button
              >
            </el-form-item>
          </el-form>
          <div v-show="titleIndex === 0" class="wx-login" v-loading="loading">
            <img class="img-ewx" :src="url" alt />
            <div v-show="isLose" class="wx-lose">
              <span class="wx-lose-refresh">
                <span class="el-icon-refresh" @click="getQrcode"></span>
              </span>
            </div>
            <p>{{ desc }}</p>
          </div>
        </div>
        <el-divider></el-divider>
        <el-alert
          v-if="checked"
          :title="errorTip"
          type="error"
          show-icon
        ></el-alert>
      </div>
      <div class="container-footer text-center">
        <p>版本：V2.0</p>
        <p>Copyright ©2019 深圳市易仓科技有限公司</p>
      </div>
    </div>
  </div>
</template>

<script>
import { login, loginByWx, getQrcode } from '@/api/user'
import { encrypt } from '@/utils/crypto'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      loginLoading: false,
      errorTip: '', //错误信息提示
      checked: false,
      isLose: false, //失效
      desc: '请用微信扫描二维码登陆',
      titleIndex: 0,
      ruleForm: {
        username: '',
        password: '',
        company_code: '', //企业代码
        timestamp: '' //时间戳
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        company_code: [
          { required: true, message: '请输入企业编码', trigger: 'blur' }
        ]
      },
      scene_id: '',
      url: '',
      timer: null //计时器
    }
  },
  created() {
    this.getQrcode()
  },
  mounted() {
    // let loginParams = getLocalStorage('remember');
    // if (loginParams) {
    //   loginParams = JSON.parse(loginParams);
    //   this.ruleForm.username = loginParams.username;
    //   this.ruleForm.password = loginParams.password; //解密
    //   this.ruleForm.password = decrypt(loginParams.password); //解密
    //   this.checked = true;
    // }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.goLogin()
        } else {
          return false
        }
      })
    },
    ...mapActions(['setToken']),
    async goLogin() {
      this.checked = false
      this.errorTip = ''
      let loginParams = {
        username: this.ruleForm.username, //获取账号
        password: encrypt(this.ruleForm.password).encrypted, //获取密码 加密
        company_code: this.ruleForm.company_code, //企业编码
        timestamp: encrypt(this.ruleForm.password).nowTime //获取密码 加密
      }
      // 记住密码设置
      //   if (this.checked) {
      //     setLocalStorage('remember', JSON.stringify(loginParams));
      //   } else {
      //     removeLocalStorage('remember');
      //   }
      this.loginLoading = true
      try {
        let res = await login(loginParams)
        if (res.error == 0) {
          this._message('登录成功', 'success')
          this.setToken(res.data.access_token)
          clearInterval(this.timer)
          setTimeout(() => {
            this.$router.push('/')
          }, 300)
        } else if (res.error == 2000) {
          this.checked = true
          this.errorTip = res.message
        }
        this.loginLoading = false
      } catch (error) {
        this._message(error)
        this.loginLoading = false
      }
    },
    async wxLogin() {
      try {
        let res = await loginByWx({ scene_id: this.scene_id })
        if (res.error == 6666) {
          // 二维码失效
          this.isLose = true
          this._message(res.message)
          clearInterval(this.timer)
          this.desc = '请重新刷新二维码'
        } else if (res.error == 0) {
          this.setToken(res.data.access_token)
          clearInterval(this.timer)
          setTimeout(() => {
            this.$router.push('/')
          }, 100)
        }
      } catch (error) {
        console.log(error, 'error')
      }
    },
    // 获取微信登录二维码
    async getQrcode() {
      this.isLose = false
      this.loading = true
      this.desc = '请用微信扫描二维码登陆'
      try {
        let { data } = await getQrcode()
        this.url = data.url
        this.scene_id = data.scene_id
        this.loading = false
        this.timer = setInterval(() => {
          this.wxLogin()
        }, 2000)
      } catch (error) {
        this.loading = false
        this._message(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.account-login {
  background-color: #e8ecf2;
  color: #878d99;
  height: 100vh;
  overflow: hidden;
  position: relative;
  .login-container {
    height: 100%;
    overflow-y: auto;
    width: 50%;
    min-width: 470px;
    max-width: 500px;
    margin: 0 auto;
    box-sizing: border-box;
    .container-top {
      margin-top: 10%;
      margin-bottom: 30px;
      text-align: center;
      .flex {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #555;
        img {
          width: 40px;
          margin-right: 10px;
        }
      }
    }
    .container-section {
      background-color: #fff;
      // box-shadow: 0px 0px 5px #ccc ;
      padding-top: 20px;
      .title-box {
        width: 250px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        span {
          cursor: pointer;
          flex: 1;
          padding: 10px;
          font-weight: bold;
          font-size: 18px;
          text-align: center;
          border-bottom: 3px solid #eee;
          &.title-active {
            border-bottom: 3px solid #758bd6;
            color: #758bd6;
          }
        }
      }
      .login {
        padding: 20px 50px;
        .xx-img {
          text-align: center;
          img {
            width: 50px;
          }
        }
      }
      .des {
        padding: 0 20px 20px;
        line-height: 20px;
      }
    }
    .container-footer {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      p {
        line-height: 20px;
      }
    }
    p {
      font-size: 14px;
    }
  }
  ::v-deep .el-alert {
    border-radius: 0px;
  }
  .wx-login {
    text-align: center;
    position: relative;
    .wx-lose {
      width: 231px;
      height: 231px;
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(#ffffff, 0.9);
      .wx-lose-refresh {
        background-color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 20px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
  }
  .img-ewx {
    width: 231px;
    margin: 0 auto;
  }
}
</style>
