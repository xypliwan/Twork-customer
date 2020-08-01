<template>
  <div class="binding-wx">
    <div class="ewm" v-if="!nickname">
      <div>扫描二维码绑定微信</div>
      <div class="img-box" v-loading="loading">
        <img v-if="!nickname" :src="url" alt />
        <div v-if="disabled" class="model" @click="getQrcode">
          二维码失效
          <br />点击刷新
        </div>
      </div>
    </div>
    <div v-if="nickname">
      已绑定
      <span class="green">{{ nickname }}</span
      >&nbsp;
      <el-button type="text" @click="unBind">解绑</el-button>
    </div>
    <div class="advantage" v-viewer>
      <div class="htitle">绑定微信的好处</div>
      <div class="item">
        <p>1.web端登录，支持微信扫码登录</p>

        <img src="../../assets/images/pc_login.png" alt />
      </div>
      <div class="item">
        <p>2.小程序，支持微信授权登录</p>
        <img src="../../assets/images/wx_login.jpg" alt />
      </div>
    </div>
  </div>
</template>

<script>
import { infoDetail, getQrcode, bindUser, unBind } from '@/api/user'
export default {
  props: {
    flagIndex: Number
  },
  name: 'BindingWeChat',
  data() {
    return {
      timer: null,
      loading: false, //
      disabled: false, //失效
      url: '',
      scene_id: '',
      nickname: ''
    }
  },
  watch: {
    flagIndex(val) {
      if (val == 3) this.getUserInfo()
      else clearInterval(this.timer)
    }
  },
  methods: {
    async getUserInfo() {
      try {
        let { data } = await infoDetail()
        this.nickname = data.nickname

        if (!this.nickname) {
          this.getQrcode()
        }
      } catch (error) {
        this._message(error)
      }
    },
    async getQrcode() {
      this.loading = true
      try {
        let { data } = await getQrcode()
        this.url = data.url
        this.scene_id = data.scene_id
        this.disabled = false
        this.timer = setInterval(() => {
          this.bindUser()
        }, 2000)
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    async bindUser() {
      try {
        let res = await bindUser({ scene_id: this.scene_id })
        if (res.error == 6666) {
          this.disabled = true
          this._message(res.message)
          clearInterval(this.timer)
        } else if (res.error == 0) {
          this.nickname = res.data.nickname
          clearInterval(this.timer)
        }
      } catch (error) {
        console.log(error)
      }
    },

    async unBind() {
      this.$confirm('是否解除微信绑定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await unBind()
            this.getUserInfo()
            this.$message.success('已解绑')
          } catch (error) {
            this._message(error)
          }
        })
        .catch(() => {})
    }
  },
  deactivated() {
    clearInterval(this.timer)
  },
  activated() {
    if (this.scene_id && this.flagIndex == 3) {
      this.timer = setInterval(() => {
        this.bindUser()
      }, 2000)
    }
  }
}
</script>

<style scoped lang="scss">
.binding-wx {
  .img-box {
    position: relative;
    .model {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.9;
      background-color: #fafafa;
      width: 150px;
      height: 150px;
      line-height: 20px;
      padding-top: 60px;
      text-align: center;
      color: red;
      font-weight: bold;
    }
  }
  img {
    width: 150px;
  }
  .advantage {
    margin-top: 50px;
    .item {
      margin-bottom: 20px;
      img {
        margin-top: 10px;
        width: 200px;
      }
    }
  }
}
</style>
