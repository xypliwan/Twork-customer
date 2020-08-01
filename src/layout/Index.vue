<template>
  <div id="layout" v-cloak>
    <div class="top-nav">
      <top-navigation></top-navigation>
      <menu-label></menu-label>
    </div>
    <div class="container">
      <keep-alive :include="keepAliveArr">
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import TopNavigation from '_c/menu/TopNavigation'
import MenuLabel from '_c/menu/MenuLabel'
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/api/user'
import { getUserList, setUserFd } from '@/api/common'
import { getLocalStorage } from '@/utils/localStorage'

export default {
  components: { TopNavigation, MenuLabel },
  data() {
    return {
      websock: null,
      count: 1,
      timer: null,

      lockReconnect: false, //是否真正建立连接
      timeout: 28 * 1000, //30秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null //断开 重连倒计时
    }
  },
  computed: {
    ...mapGetters(['keepAliveArr', 'webSocketUrl'])
  },
  watch: {
    $route(newVal) {
      if (newVal.meta) {
        if (newVal.meta.name === 'Project') {
          //如果页面是项目列表的话把id也存进去
          newVal.meta.project_id = this.$route.query.id
        }
        this.addTablist(newVal.meta) //加入顶部标签数组中
      }
    }
  },
  async beforeCreate() {
    //页面刷新重新获取用户信息
    if (getLocalStorage('access_token')) {
      try {
        let { data } = await userInfo({ auth: 'frontendAuth' })
        this.setUserInfo(data) //用户信息保存到vuex
        let arr = data.button.map(el => el.code)
        this.getAuth(arr) //按钮权限保存到vuex
        this.getUserList()
        this.getDynamicNum()
        await this.setWebSocketUrl()
        this.initWebSocket()
      } catch (error) {
        this._message(error)
      }
    }
  },
  created() {
    if (this.$route.meta) {
      if (this.$route.meta.name === 'Project') {
        //如果页面是项目列表的话把id也存进去
        let newMeta = Object.assign(this.$route.meta, {
          project_id: this.$route.query.id
        })
        this.addTablist(newMeta)
      } else {
        this.addTablist(this.$route.meta)
      }
    } //页面刷新时添加当前页到顶部标签数组中
    if (this.$route.meta) this.addTablist(this.$route.meta) //页面刷新时添加当前页到顶部标签数组中
    this.getArchitectList()
  },
  methods: {
    ...mapActions([
      'setUserInfo',
      'addTablist',
      'getAuth',
      'setAtUserList',
      'setWebSocketUrl',
      'getDynamicNum',
      'setDynamicNum',
      'setDynamicInfo',
      'getArchitectList'
    ]),
    async getUserList() {
      try {
        let { data } = await getUserList()
        this.setAtUserList(data)
      } catch (error) {
        this._message(error)
      }
    },
    initWebSocket() {
      //初始化weosocket
      this.websock = new WebSocket(this.webSocketUrl)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() {
      // console.log('socket连接成功...');
      // if (this.timeoutnum) {
      //   this.$notify({
      //     title: '通信服务重新连接成功',
      //     message: `温馨提示：请刷新当前页面已保证数据正常~`,
      //     type: 'success',
      //     duration: 60 * 100 * 30
      //   });
      // }
      this.start()
    },
    reconnect() {
      //重新连接
      if (this.lockReconnect) {
        return
      }
      this.lockReconnect = true
      //没连接上会一直重连，设置延迟避免请求过多
      this.timeoutnum && clearTimeout(this.timeoutnum)
      this.timeoutnum = setTimeout(() => {
        //新连接
        this.initWebSocket()
        this.lockReconnect = false
      }, 5000)
    },
    reset() {
      //重置心跳
      //清除时间
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      //重启心跳
      this.start()
    },
    start() {
      //开启心跳
      this.timeoutObj && clearTimeout(this.timeoutObj)
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
      this.timeoutObj = setTimeout(() => {
        if (this.websock.readyState == 1) {
          let info = {
            msg: 'heart_connect',
            data: {},
            ws_type: 'heart_connect'
          }
          this.websock.send(JSON.stringify(info))
        } else {
          //重连
          this.reconnect()
        }
        this.serverTimeoutObj = setTimeout(() => {
          //超时关闭
          this.websock.close()
        }, this.timeout)
      }, this.timeout)
    },
    websocketonerror() {
      console.log('通信服务验证失败')
      this.reconnect()
    },
    websocketonmessage(e) {
      // console.log(e, 'e')
      this.reset()
      //数据接收
      const res = JSON.parse(e.data)
      /* eslint-disable */
      switch (res.ws_type) {
        /* eslint-disable */
        case 'connect_result': //设置用户的会话
          const {
            data: { fd, token }
          } = res // eslint-disable-line
          this.setUserFd(fd, token)
          break
        /* eslint-disable */
        case 'dynamic_num': //新动态消息数量
          this.setDynamicNum(res.num_arr)
          break
        case 'create_dynamic': //新动态创建
          this.setDynamicInfo(res.dynamic)
          break
      }
      /* eslint-disable */
    },
    async setUserFd(fd, token) {
      try {
        await setUserFd({ fd, token })
      } catch (error) {
        this._message(error)
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data)
    },
    websocketclose() {
      this.reconnect()
      // this.$notify({
      //   title: '通信服务连接失败',
      //   message: `请检查网络正常后重新刷新页面或联系相关人员！`,
      //   type: 'warning',
      //   duration: 4000
      // });
      //关闭
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';

#layout {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 800px;
  height: 100vh;
  overflow: hidden;
  .container {
    padding: 10px;
    height: calc(100% - 80px);
    overflow-y: auto;
    @include scrollBar();
  }
}
</style>
